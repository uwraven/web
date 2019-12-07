import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './home.module.scss';
import * as THREE from 'three';
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import cadComponents from './cadComponents';
import { PerspectiveCamera } from 'three';
import { watch } from 'fs';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
        this.initializeScene = this.initializeScene.bind(this);
        this.resizeListener = this.resizeListener.bind(this);
        this.wheelListener = this.wheelListener.bind(this);
    }

    componentDidMount() {
        this.initializeScene();
        window.addEventListener('resize', this.resizeListener);
        window.addEventListener('wheel', this.wheelListener);
        this.y = 0;
    }

    render() {
        return (
            <div className={styles.home}>
                <div className={styles.threeContainer} ref={(ref) => {this.threeMount = ref} }></div>
            </div>
        );
    }

    resizeListener() {
        console.log("resize");
        this.camera.aspect = this.threeMount.clientWidth / this.threeMount.clientHeight;
        this.renderer.setSize(this.threeMount.clientWidth, this.threeMount.clientHeight );
        this.camera.updateProjectionMatrix();
    }

    wheelListener(e) {
        console.log(e.deltaY, this.y);
        this.y = Math.max(this.y + e.deltaY, 0);
    }

    initializeScene() {
        console.log(this.threeMount.clientWidth)
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 20, this.threeMount.clientWidth / this.threeMount.clientHeight, 0.1, 2000 );
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        this.renderer.setSize( this.threeMount.clientWidth, this.threeMount.clientHeight);
        this.renderer.setPixelRatio(2.0);
        this.threeMount.appendChild( this.renderer.domElement );

        this.scene.add( new THREE.AmbientLight( 0xffffff, 1.0, 200 ) );
        var light = new THREE.PointLight( 0xffffff, 1, 1000 );
        light.position.set( 200, 200, 100 );
        light.name = "bulb";
        this.scene.add( light );
        this.origins = {};

        // create geometry from stl
        this.loader = new STLLoader();

        cadComponents.map(obj => {
            this.loader.load(`./cad/${obj.src}.stl`, (geometry) => {
                // render object and center it
                geometry.center();
                geometry.computeVertexNormals(); // allows for smoothing of the surface
                geometry.computeBoundingBox();
                
                var pos = geometry.getAttribute('position');
                if (pos === undefined) throw new Error("position must be provided");
                var positions = pos.array;
                var vertices = [];
                for (let i = 0; i < positions.length; i+=3) {
                    vertices.push(new THREE.Vector3(
                        positions[i], positions[i + 1], positions[i + 2]
                    ))
                }
                var faces = [];
                for (let i = 0; i < vertices.length; i+=3) {
                    faces.push(new THREE.Face3(i, i+1, i+2));
                }

                var optimalgeometry = new THREE.Geometry();
                optimalgeometry.vertices = vertices;
                optimalgeometry.faces = faces;
                optimalgeometry.computeFaceNormals();
                optimalgeometry.mergeVertices();
                optimalgeometry.computeVertexNormals();

                var bufferGeometry = new THREE.BufferGeometry();
                bufferGeometry.fromGeometry(optimalgeometry);

                var material = new THREE.MeshPhysicalMaterial(
                    {
                        reflectivity: 0.5,
                        metalness: 1.0,
                        flatShading: false,
                    });

                var mesh = new THREE.Mesh(bufferGeometry, material);


                mesh.position.set(obj.origin.x, obj.origin.y, obj.origin.z);
                mesh.receiveShadow = true;

                mesh.name = obj.src;

                // console.log(this.origins);
                this.scene.add(mesh);
            })
        });

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableZoom = false;
        // this.controls.minPolarAngle = Math.PI / 2;
        // this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.enablePan = false;

        this.camera.position.z = 1000;
        
        var axes = new THREE.AxesHelper(1000);
        this.scene.add(axes);

        // this.scene.translateY(200);

        const scope = this;
        var animate = function () {
          requestAnimationFrame( animate );
          scope.controls.update();

          const scrollPosY = window.scrollY;

          cadComponents.map(obj => {
              let child = scope.scene.getObjectByName(obj.src);
              if (child) {
                child.position.y = obj.origin.y + scope.y / scope.threeMount.clientHeight * obj.separation * 100;
              }
            //   if (scope.origins[child.name]) {
            //       child.position.y = scope.origins[child.name].y - scrollPosY / scope.threeMount.clientHeight
            //   }
          });

          let light = scope.scene.getObjectByName("bulb")
          light.position.setY(-scrollPosY / 2 + 250);

        //   scope.camera.setFocalLength(scrollPosY / 10 + 10);

          scope.renderer.render( scope.scene, scope.camera );
        };
        animate();
    }
}

Home.propTypes = {

};

export default Home;