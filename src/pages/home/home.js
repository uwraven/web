import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './home.module.scss';
import * as THREE from 'three';
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
// import {GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// var STLLoader = require( 'three-stl-loader')(THREE);

const urls = [
    'Mounts',
    'Payload_Fairing_rev1',
    'Payload_Platform_Black',
    'Stage_1_Cover',
    'Stage_1_Engines_rev1',
    'Stage_1_Tank_rev1',
    'Stage_1_Top_Ring_Grey',
    'Stage_2_Cover',
    'Stage_2_Engine_Nozzle_Black',
    'Stage_2_Tank_rev1'
]

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    componentDidMount() {
        // create scene and mount it to dom element
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        var renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        renderer.setSize( window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(2.0);
        // use ref as a mount point of the Three.js scene instead of the document.body
        this.threeMount.appendChild( renderer.domElement );

        scene.add( new THREE.AmbientLight( 0xffdddf, 0.3, 100 ) );
        var light = new THREE.PointLight( 0xffffff, 1, 1000 );
        light.position.set( 200, 200, 100 );
        scene.add( light );

        // create geometry from stl
        var loader = new STLLoader();

        urls.map(url => {
            loader.load(`./cad/${url}.stl`, (geometry) => {
                var material = new THREE.MeshPhysicalMaterial(
                    {
                        clearcoat: 0.0,
                        clearcoatRoughness: 0.2,
                        reflectivity: 1.0
                    });
                var mesh = new THREE.Mesh(geometry, material);
                // mesh.position = mesh.position - THREE.Vector3(0,1,0);
                // mesh.position = THREE.Vector3(1, 1, 0);
                scene.add(mesh);
            })
        });

        // loader.load('./cad/Payload_Fairing_rev1.stl', (geometry) => {
        //     var material = new THREE.MeshPhongMaterial({color: 0x000000});
        //     var mesh = new THREE.Mesh(geometry, material);
        //     scene.add(mesh);
        // })

        var controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;
        // controls.center = THREE.Vector3(50, 50, 50);
        // controls.minAzimuthAngle = 0;
        // controls.maxAzimuthAngle = 0;
        controls.minPolarAngle = Math.PI / 2;
        controls.maxPolarAngle = Math.PI / 2;

        camera.position.z = 400;
        camera.position.y = 200;

        var animate = function () {
          requestAnimationFrame( animate );
          controls.update();
          renderer.render( scene, camera );
        };
        animate();
      }

    render() {
        return (
            <div className={styles.home}>
                <div className={styles.threeContainer} ref={(ref) => {this.threeMount = ref} }></div>
            </div>
        );
    }
}

Home.propTypes = {

};

export default Home;