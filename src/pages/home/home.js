import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Home.module.scss';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader';
// import {RoughnessMipmapper} from 'three/examples/jsm/utils/RoughnessMipmapper'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import Models, {INTERPOLATIONS, defaultOffset, defaultRotation, defaultScale } from './CadComponents';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            y: 0,
            selectedComponent: "",
            innerWidth: window.innerWidth,
            enableOrbit: true
        }
        this.initializeScene = this.initializeScene.bind(this);
        this.resizeListener = this.resizeListener.bind(this);
        this.wheelListener = this.wheelListener.bind(this);
        this.animateFrame = this.animateFrame.bind(this);
        this.onTouch = this.onTouch.bind(this);
    }

    onTouch(e) {
        console.log("DISABLE ORBIT");
        this.setState({enableOrbit: false});
    }

    componentDidMount() {
        this.initializeScene();
        window.addEventListener('resize', this.resizeListener);
        if (this.contentMount) {
            console.log("mounted");
            this.contentMount.addEventListener('scroll', this.wheelListener);
        }
        // window.addEventListener('scroll', this.wheelListener)
        window.addEventListener('touchstart', this.onTouch);
        // this.y = 0;
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resizeListener);
        this.contentMount.removeEventListener("scroll", this.wheelListener);
        window.removeEventListener("touchstart", this.onTouch);
    }

    render() {
        if (this.controls) this.controls.enabled = this.state.enableOrbit;

        return (
            <div className={styles.home} ref={(ref) => {this.contentMount = ref}}>
                <div className={styles.threeContainer}>
                    {this.state.progress < 1.0 && <h1>{this.state.progress}</h1>}
                    <div className={styles.threeInnerContainer} ref={(ref) => {this.threeMount = ref} }></div>
                </div>           
                <div className={styles.bottom}>
                    h2
                </div> 
            </div>
        );
    }

    resizeListener() {
        this.camera.aspect = this.threeMount.clientWidth / this.threeMount.clientHeight;
        this.renderer.setSize(this.threeMount.clientWidth, this.threeMount.clientHeight );
        this.camera.updateProjectionMatrix();
    }

    wheelListener() {
        // this.setState({
        //     y: Math.max(window.scrollY / INTERVAL, 0)
        // })
        // console.log(e.target.scrollTop)
        this.setState({
            y: Math.max(this.contentMount.scrollTop / window.innerHeight * 2, 0)
        })
    }

    initializeScene() {
        this.clock = new THREE.Clock();
        this.loadingManager = new THREE.LoadingManager();
        this.scene = new THREE.Scene();
        this.scene.name = "scene";
        this.camera = new THREE.PerspectiveCamera( 20, this.threeMount.clientWidth / this.threeMount.clientHeight, 0.1, 1000 );
        this.renderer = new THREE.WebGLRenderer({
            alpha: false,
            antialias: true
        });
        this.renderer.setSize( this.threeMount.clientWidth, this.threeMount.clientHeight);
        this.renderer.setPixelRatio(2.0);
        this.renderer.gammaOutput = true;
        this.renderer.gammaFactor = 2.2;
        this.renderer.shadowMap.enabled = true;
        // this.renderer.setClearColor(0xffffff);
        this.threeMount.appendChild(this.renderer.domElement);

        this.scene.fog = new THREE.Fog(0x000000, 20, 150);

        var light = new THREE.DirectionalLight(0xffeecc);
        light.position.set(20, 200, 50);
        light.castShadow = true;
        light.shadow.camera.top = 180;
        light.shadow.camera.bottom = -10;
        light.shadow.camera.left = - 60;
        light.shadow.camera.right = 60;        
        light.lookAt(0, 5, 0);
        light.name = "spotlight";
        // light.intensity = 20;
        light.shadow.mapSize.set(1024, 1024);
        this.scene.add(light);

        // this.scene.add(new THREE.CameraHelper(light.shadow.camera));

        light = new THREE.HemisphereLight( 0xffffff, 0x151515 );
        light.position.set( 0, 200, 0 );
        this.scene.add( light );

        var ambientLight = new THREE.AmbientLight( 0xe4f0ff, 0);
        ambientLight.name = "scenelight";
        this.scene.add( ambientLight );

        // create geometry from stl files
        this.loader = new GLTFLoader(this.loadingManager);
        console.log(this.loadingManager);
        // this.loadManager.itemEnd(`cad/saw.gltf`)
        this.loadingManager.onStart = (url, items, total) => {
            console.log(`started: ${url} with items ${items} for total: ${total}`);
        }
        this.loadingManager.onProgress = (url, items, total) => {
            console.log(`progress on ${url} for items ${items} at total: ${total}`);
        }
        this.loadingManager.onLoad = () => {
            console.log("finished loading");
            // ambientLight.intensity = 1.5;
            // light.intensity = 1.0;
            this.loaded = true;
        }
        this.loadingManager.onError = (url) => {
            console.log(url);
        }

        let pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.textureLoader = new RGBELoader(this.loadingManager);
        this.textureLoader
            .load(`textures/quarry_02_2k.hdr`, (texture, data) => {         
                console.log(texture);   
                let envMap = pmremGenerator.fromEquirectangular(texture);
                this.scene.environment = envMap.texture;
                // this.scene.background  = envMap.texture;
                this.renderer.toneMappingExposure = 0.8;
                texture.dispose();
                pmremGenerator.dispose();
        });


        // this.loadManager.onProgress(); 
        // Models.map(obj => {
        this.loader.load(`cad/test_raven_v15.glb`, (model) => {
            // render object and center it

            // replace this material with properties from json
            // var material = new THREE.MeshPhysicalMaterial({
            //     color: 0xfefeff,
            //     emissive: 0x000003,
            //     reflectivity: 0.5,
            //     metalness: 0.95,
            // });

            console.log(model);

            // var bufferGeometry = this.bufferGeometryFromSTL(geometry);
            // var mesh = new THREE.Mesh(geometry, material);
            // mesh.position.set(obj.origin.x, obj.origin.y, obj.origin.z);
            // mesh.receiveShadow = true;
            model.scene.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });

            // Add A floor
            // let plane = new THREE.PlaneHelper(new THREE.Plane(new THREE.Vector3(0, 1, 0)), 1000, 0x000000)
            // plane.receiveShadow = true; 
            // this.scene.add(plane);

            let mesh = new THREE.Mesh( 
                new THREE.PlaneBufferGeometry( 500, 500 ), 
                new THREE.MeshPhongMaterial( 
                    { color: 0x010101, depthWrite: false } ) );
            mesh.rotation.x = - Math.PI / 2;
            mesh.receiveShadow = true;
            this.scene.add( mesh );

            let grid = new THREE.GridHelper( 500, 50, 0x444444, 0x444444 );
            grid.material.opacity = 0.3;
            grid.material.transparent = true;
            this.scene.add( grid );

            // [5, 10, 15].map((radius) => {
            //     let color = 0.05 - Math.pow(radius, 2) / Math.pow(16, 2) / 24;
            //     let circBuffer = new THREE.LineLoop(
            //         new THREE.EdgesGeometry(new THREE.CircleGeometry(radius, 128)), 
            //         new THREE.LineBasicMaterial({color: new THREE.Color(color, color, color) }));
            //     circBuffer.rotateX(Math.PI / 2);
            //     circBuffer.receiveShadow = true;
            //     this.scene.add(circBuffer);
            // })            
            // this.mixer = new THREE.AnimationMixer(model.scene);
            // model.animations.map((clip) => this.mixer.clipAction(clip).play());
            

            // geometry.scene.scale.set(10);
            // mesh.name = obj.src;
            this.scene.add(model.scene);
            this.scene.getObjectByName("RAVEN_v17").setRotationFromEuler(new THREE.Euler(0, -Math.PI / 4, 0));
        });
        // });

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableZoom = false;
        // this.controls.enablePan = false;
        this.controls.minPolarAngle = Math.PI / 4;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.camera.position.z = 45;
        this.camera.position.x = -8
        this.camera.position.y = 18;
        this.camera.lookAt(0, 6.5, 0);
        this.controls.target = new THREE.Vector3(0, 6.5, 0);
        // this.scene.translateX(-120);
        // this.camera.translateX(120);
        
        // var axes = new THREE.AxesHelper(1000);
        // this.scene.add(axes);

        const scope = this;
        var animate = function () {
          requestAnimationFrame( animate );
          scope.animateFrame(scope);
        };

        animate();
    }

    animateFrame(scope) {
        // scope.controls.update();
        scope.renderer.render(scope.scene, scope.camera);

        // Animate lights in
        // if (scope.loaded) {
            // let spotlight = scope.scene.getObjectByName('spotlight');
            // let scenelight = scope.scene.getObjectByName('scenelight')
            // if (spotlight.intensity < 1) spotlight.intensity += 1 / 20;
            // if (scenelight.intensity < 0) scenelight.intensity += 0.2 / 60;
        // }  

    }

    bufferGeometryFromSTL(geometry) {
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

        return bufferGeometry;
    }
}

Home.propTypes = {

};

export default Home;