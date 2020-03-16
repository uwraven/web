import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass';

import styles from './ThreeRenderer.module.scss';
// import Models, {INTERPOLATIONS, defaultOffset, defaultRotation, defaultScale } from './CadComponents';

class ThreeRenderer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedComponent: "",
            innerWidth: window.innerWidth,
            enableOrbit: true
        }
        this.initializeScene = this.initializeScene.bind(this);
        this.resizeListener = this.resizeListener.bind(this);
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
    
        // window.addEventListener('scroll', this.wheelListener)
        // window.addEventListener('touchstart', this.onTouch);
        // this.y = 0;
    }

    // componentWillMount() {
    //     // window.addEventListener('resize', this.resizeListener);
    // }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resizeListener);
        window.removeEventListener("touchstart", this.onTouch);
    }

    render() {
        if (this.controls) this.controls.enabled = this.state.enableOrbit;

        return (
            <div className={[styles.threeContainer, this.props.className].join(" ")}>
                {this.state.progress < 1.0 && <h1>{this.state.progress}</h1>}
                <div className={styles.threeInnerContainer} ref={(ref) => {this.threeMount = ref} }></div>
            </div>           
        );
    }

    resizeListener() {
        const w = this.threeMount.clientWidth;
        const h = this.threeMount.clientHeight * 0.9;
        this.camera.aspect = w / h;
        if (window.innerWidth > 812) {
            this.camera.setViewOffset(w, h, w * 1 / 6, 0, w, h);
        } else {
            this.camera.setViewOffset(w, h, 0, 0, w, h);
        }
        this.renderer.setSize(w, h);
        this.camera.updateProjectionMatrix();
    }

    initializeScene() {
        this.clock = new THREE.Clock();
        this.loadingManager = new THREE.LoadingManager();
        this.scene = new THREE.Scene();
        this.scene.name = "scene";
        
        const w = this.threeMount.clientWidth;
        const h = this.threeMount.clientHeight * 0.9;
        this.camera = new THREE.PerspectiveCamera( 25, w / h, 0.1, 1000 )

        if (window.innerWidth > 812) {
            this.camera.setViewOffset(w, h, w * 1 / 6, 0, w, h);
        }
        this.renderer = new THREE.WebGLRenderer({
            alpha: false,
            antialias: true
        });

        this.renderer.setSize(w, h);
        this.renderer.setPixelRatio(1.0);
        this.renderer.gammaOutput = true;
        this.renderer.gammaFactor = 2.2;
        // this.renderer.toneMappingExposure = 0.0;
        this.renderer.shadowMap.enabled = true;

        // let bloomRenderPass = new UnrealBloomPass( new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        // let sceneRenderPass = new RenderPass(this.scene, this.camera);
        // this.composer = new EffectComposer(this.renderer);
        // this.composer.addPass(sceneRenderPass);
        // this.composer.addPass(bloomRenderPass);

        // this.renderer.setClearColor(0xffffff);
        this.threeMount.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableZoom = false;
        this.controls.enablePan = false;
        if (window.innerWidth < 812) {
            this.controls.enabled = false;
        }
        this.controls.minPolarAngle = Math.PI / 4;
        this.controls.maxPolarAngle = Math.PI / 2;
        

        this.camera.position.z = -38;
        this.camera.position.x = -5;
        this.camera.position.y = 20;
        this.camera.lookAt(0, 6.5, 0);
        this.controls.target = new THREE.Vector3(0, 7.5, 0);
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.8;

        this.scene.fog = new THREE.Fog(0x000000, 20, 150);

        var light = new THREE.DirectionalLight(0xffeecc);
        light.position.set(20, 200, 50);
        light.castShadow = true;
        light.shadow.camera.top = 180;
        light.shadow.camera.bottom = -5;
        light.shadow.camera.left = - 60;
        light.shadow.camera.right = 60;        
        light.lookAt(0, 5, 0);
        light.name = "spotlight";
        light.intensity = 1;
        light.shadow.mapSize.set(512, 512);
        this.scene.add(light);

        // this.scene.add(new THREE.CameraHelper(light.shadow.camera));

        light = new THREE.HemisphereLight( 0xffffff, 0x151515 );
        light.position.set( 0, 200, 0 );
        this.scene.add( light );

        var ambientLight = new THREE.AmbientLight( 0xe4f0ff, 0);
        ambientLight.name = "scenelight";
        ambientLight.intensity = 1;
        this.scene.add( ambientLight );

        // create geometry from stl files
        this.loader = new GLTFLoader(this.loadingManager);

        // Loading callbacks, unused for now
        // this.loadingManager.onStart = (url, items, total) => {
        //     this.props.updateLoadProgress({
        //         items: items,
        //         total: total
        //     });
        // }
        // this.loadingManager.onProgress = (url, items, total) => {
        //     this.props.updateLoadProgress({
        //         items: items,
        //         total: total
        //     });
        // }
        this.loadingManager.onLoad = () => {
            this.loaded = true;
            this.props.onLoad();
        }
        // this.loadingManager.onError = (url) => {
        //     console.log(url);
        // }

        let pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.textureLoader = new RGBELoader(this.loadingManager);
        this.textureLoader
            .load(`textures/quarry_02_2k.hdr`, (texture, data) => {         
                console.log(texture);   
                let envMap = pmremGenerator.fromEquirectangular(texture);
                this.scene.environment = envMap.texture;
                // this.scene.background  = envMap.texture;
                this.renderer.toneMappingExposure = 0.0;
                texture.dispose();
                pmremGenerator.dispose();
        });

        this.loader.load(`cad/raven_v12.glb`, (model) => {
            model.scene.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });

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
            
            this.scene.add(model.scene);
            // this.scene.getObjectByName("RAVEN_v27").setRotationFromEuler(new THREE.Euler(0, -Math.PI / 4, 0))


            // let red_light = this.scene.getObjectByName("light_red");
            // if (red_light) {
            //     console.log(red_light);
            //     let point_light = new THREE.PointLight("#ff0000");
            //     point_light.intensity = 1.0;
            //     point_light.castShadow = true;
            //     red_light.add(point_light);
            // }

            let green_light = this.scene.getObjectByName("light_green");
            if (green_light) {
                console.log(green_light);
                let point_light = new THREE.PointLight("#00ff00");
                point_light.intensity = 0.2;
                point_light.castShadow = true;
                green_light.add(point_light);
            }

            let white_light = this.scene.getObjectByName("light_white");
            if (white_light) {
                console.log(white_light);
                let point_light = new THREE.PointLight("0000ff");
                point_light.intensity = 0.2;
                point_light.castShadow = true;
                white_light.add(point_light);
            }

        });
        // });

        const scope = this;
        var animate = function () {
            requestAnimationFrame( animate );
            scope.controls.update();
            // scope.composer.render();
            scope.animateFrame(scope);
        };

        animate();
    }

    animateFrame(scope) {
        scope.renderer.render(scope.scene, scope.camera);
        if (scope.loaded) {
            if (this.renderer.toneMappingExposure < 0.8) this.renderer.toneMappingExposure += 0.01;
            let spotlight = this.scene.getObjectByName("spotlight");
            let scenelight = this.scene.getObjectByName("scenelight");
            if (spotlight) { if (spotlight.intensity < 1.0) {
                spotlight.intensity += 0.04;
            }}
            if (scenelight) { if (scenelight.intensity < 1.0) {
                scenelight.intensity += 0.04;
            }}
        }
    }

}

ThreeRenderer.propTypes = {

};

export default ThreeRenderer;