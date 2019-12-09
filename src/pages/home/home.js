import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './home.module.scss';
import * as THREE from 'three';
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import Models, {INTERPOLATIONS, defaultOffset, defaultRotation, defaultScale} from './cadComponents';
import Descriptions from './descriptions';

const INTERVAL = 600;

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            y: 0,
            selectedComponent: ""
        }
        this.initializeScene = this.initializeScene.bind(this);
        this.resizeListener = this.resizeListener.bind(this);
        this.wheelListener = this.wheelListener.bind(this);
        this.animateFrame = this.animateFrame.bind(this);
        // this.finalTime = Models.map(model => model.keyframes.map(frame => frame.time).reduce((t,tn) => t = (tn > t) ? tn : t)).reduce()
    }

    componentDidMount() {
        this.initializeScene();
        window.addEventListener('resize', this.resizeListener);
        window.addEventListener('wheel', this.wheelListener);
        // this.y = 0;
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resizeListener);
        window.removeEventListener("wheel", this.wheelListener);
    }

    render() {
        const target = 300;
        const displacement = Math.max(Math.min(-this.state.y * target, 0), -target);
        console.log(displacement);
        const containerStyle = {
            transform: `translateX(${displacement}px)`
        }
        return (
            <div className={styles.home}>
                <div style={containerStyle} className={styles.threeContainer} ref={(ref) => {this.threeMount = ref} }></div>
                {/* <div className={styles.footerCover}></div> */}
                <div className={styles.descriptionContainer}>
                    {
                        Descriptions.map((model, i) => {
                            const t = this.state.y;
                            if (this.state.selectedComponent !== model.objectId) {
                                // set selected component for model editing if necessary
                                this.setState({selectedComponent: model.objectId});
                            }
                            // console.log(t);
                            if (model.timing.start <= t && t < model.timing.end) {
                                // console.log("should display: ", i)
                            return(
                                <div className={styles.modelTile}>
                                    <h2>{model.title}</h2>
                                    <div className={styles.separator}></div>
                                    <p>{model.description}</p>
                                </div>
                            )
                            }
                        })
                    }
                </div>
            </div>
        );
    }

    resizeListener() {
        if (this.threeMount) {
            this.camera.aspect = this.threeMount.clientWidth / this.threeMount.clientHeight;
            this.renderer.setSize(this.threeMount.clientWidth, this.threeMount.clientHeight );
            this.camera.updateProjectionMatrix();
        }
    }

    wheelListener(e) {
        // console.log(e.deltaY, this.y);
        this.setState({
            y: Math.max(this.state.y + e.deltaY / INTERVAL, 0)
        })
        // this.y = Math.max(this.y + e.deltaY / INTERVAL, 0);
    }

    initializeScene() {
        this.scene = new THREE.Scene();
        this.scene.name = "scene";
        this.camera = new THREE.PerspectiveCamera( 20, this.threeMount.clientWidth / this.threeMount.clientHeight, 0.1, 10000 );
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        this.renderer.setSize( this.threeMount.clientWidth, this.threeMount.clientHeight);
        this.renderer.setPixelRatio(2.0);
        // this.renderer.setClearColor(0xffffff);
        this.threeMount.appendChild(this.renderer.domElement);

        var light = new THREE.SpotLight(0xffffff, 1.0);
        light.position.set(200, 250, 200);
        light.castShadow = true;
        light.shadow.camera.far = 1000;
        light.penumbra = 0.5;
        light.lookAt(0, 0, 0);
        this.scene.add(light);

        this.scene.add( new THREE.AmbientLight( 0xe4f0ff, 2.5 ) );

        // create geometry from stl files
        this.loader = new STLLoader();
        Models.map(obj => {
            this.loader.load(`./cad/${obj.src}.stl`, (geometry) => {
                // render object and center it

                // replace this material with properties from json
                var material = new THREE.MeshPhysicalMaterial({
                    color: 0xfefeff,
                    emissive: 0x000003,
                    reflectivity: 0.5,
                    metalness: 0.95,
                });

                var bufferGeometry = this.bufferGeometryFromSTL(geometry);
                var mesh = new THREE.Mesh(bufferGeometry, material);
                mesh.position.set(obj.origin.x, obj.origin.y, obj.origin.z);
                mesh.receiveShadow = true;
                mesh.name = obj.src;
                this.scene.add(mesh);
            })
        });

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableZoom = false;
        this.controls.minPolarAngle = Math.PI / 2;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.enablePan = false;
        this.camera.position.z = 900;
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
        Models.map(obj => {
            let child = scope.scene.getObjectByName(obj.src);
            if (child) {
                let t = scope.state.y;

                // if between first and last frames, then perform interpolation between two bounding frames
                // get first frame starting time

                // make sure the frames are in the correct order;
                // var orderedFrames = obj.keyframes.sort((a, b) => (a.time !== b.time) ? (a.time > b.time) ? 1 : 0 : 0);

                if (obj.keyframes.length > 1) {

                    const timestamps = obj.keyframes.map(frame => frame.time);
                    const endTime = Math.max(...timestamps);
                    const startTime = Math.min(...timestamps);

                    function setProperties(offset, rotation, scale) {
                        child.position.x = obj.origin.x + offset.x;
                        child.position.y = obj.origin.y + offset.y;
                        child.position.z = obj.origin.z + offset.z;
                        child.rotation.x = obj.rotation.x + rotation.x;
                        child.rotation.y = obj.rotation.y + rotation.y;
                        child.rotation.z = obj.rotation.z + rotation.z;
                        if (scale !== 1){
                            child.scale.set(scale, scale, scale);
                        }
                    }

                    // TODO:: Consolidate this logic
                    if (t >= endTime) {
                        // outside of keyframes, clamp to last frame 
                        // assumes that the frames are not strictly sorted
                        var lastFrameTime = 0;
                        var lastFrameIndex = 0;
                        obj.keyframes.map((frame, i) => {
                            if (frame.time > lastFrameTime) {
                                lastFrameTime = frame.time;
                                lastFrameIndex = i;
                            }
                        })
                        if (obj.keyframes[lastFrameIndex]) setProperties(
                                obj.keyframes[lastFrameIndex].offset || defaultOffset,
                                obj.keyframes[lastFrameIndex].rotation || defaultRotation,
                                obj.keyframes[lastFrameIndex].scale || defaultScale)
                    } else if (t <= startTime) {
                        var firstFrameIndex = 0;
                        var firstFrameTime = 0;
                        obj.keyframes.map((frame, i) => {
                            if (frame.time < lastFrameTime) {
                                firstFrameTime = frame.time;
                                firstFrameIndex = i;
                            }
                        })
                        if (obj.keyframes[firstFrameIndex]) setProperties(
                            obj.keyframes[firstFrameIndex].offset || defaultOffset,
                            obj.keyframes[firstFrameIndex].rotation || defaultRotation,
                            obj.keyframes[firstFrameIndex].scale || defaultScale)
                    } else {
                        // console.log("between frames");
                        // is between frames
                        // need to get two bounding frames
                        var preframeIndex = 0;
                        var preframeTime = 0;
                        var postframeIndex = obj.keyframes.length - 1;
                        var postframeTime = endTime;

                        obj.keyframes.map((frame, i) => {
                            if (t > frame.time && preframeTime < frame.time) {
                                preframeIndex = i; preframeTime = frame.time;
                            }
                            if (t < frame.time && frame.time < postframeTime) {
                                postframeIndex = i; postframeTime = frame.time;
                            }
                        })

                        // get % progress
                        const x = (t - preframeTime) / (postframeTime - preframeTime);

                        var ts;
                        switch(obj.easing) {
                            case INTERPOLATIONS.SIN: ts = Math.sin(Math.PI * x - Math.PI / 2) / 2 + 1 / 2; break;
                            default: ts = x;
                        }

                        const preframe = obj.keyframes[preframeIndex];
                        const postframe = obj.keyframes[postframeIndex];

                        if (!preframe.offset) preframe.offset = defaultOffset;
                        if (!postframe.offset) postframe.offset = defaultOffset;
                        if (!preframe.rotation) preframe.rotation = defaultRotation;
                        if (!postframe.rotation) postframe.rotation = defaultRotation;
                        if (!preframe.scale) preframe.scale = defaultScale;
                        if (!postframe.scale) postframe.scale = defaultScale;

                        const offset = {
                            x: (postframe.offset.x - preframe.offset.x) * ts + preframe.offset.x,
                            y: (postframe.offset.y - preframe.offset.y) * ts + preframe.offset.y,
                            z: (postframe.offset.z - preframe.offset.z) * ts + preframe.offset.z
                        }

                        const rotation = {
                            x: (postframe.rotation.x - preframe.rotation.x) * ts + preframe.rotation.x,
                            y: (postframe.rotation.y - preframe.rotation.y) * ts + preframe.rotation.y,
                            z: (postframe.rotation.z - preframe.rotation.z) * ts + preframe.rotation.z,
                        }

                        const scale = (postframe.scale - preframe.scale) * ts + preframe.scale;

                        setProperties(offset, rotation, scale);
                    }
                }

                // let indices = obj.keyframes.map(frame => frame.index);
                // let startTime = Math.min(indices)
                // let endTime = Math.max(indices)
                

                // if (t > startTime && t < endTime) {
                    // is a valid frame and should animate
                    // get sinusoidal time
                    // const ts = Math.sin((t - startTime) / (endTime - startTime) * Math.Pi / 2);

                    // get frames
                    // const keyframe = obj.keyframes.filter(keyframe => keyframe.index)
                    // child.position.x = obj.src.origin.x
                // }
                
                // if before any animated frames, then clamp to first animated frame

                // if after all frames, then clamp to last frame

            }
        });
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