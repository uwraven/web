import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './home.module.scss';
import * as THREE from 'three';
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import cadComponents, {INTERPOLATIONS, defaultOffset, defaultRotation} from './cadComponents';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
        this.initializeScene = this.initializeScene.bind(this);
        this.resizeListener = this.resizeListener.bind(this);
        this.wheelListener = this.wheelListener.bind(this);
        this.animateFrame = this.animateFrame.bind(this);
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
        this.camera.aspect = this.threeMount.clientWidth / this.threeMount.clientHeight;
        this.renderer.setSize(this.threeMount.clientWidth, this.threeMount.clientHeight );
        this.camera.updateProjectionMatrix();
    }

    wheelListener(e) {
        // console.log(e.deltaY, this.y);
        this.y = Math.max(this.y + e.deltaY, 0);
    }

    initializeScene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 20, this.threeMount.clientWidth / this.threeMount.clientHeight, 0.1, 2000 );
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        this.renderer.setSize( this.threeMount.clientWidth, this.threeMount.clientHeight);
        this.renderer.setPixelRatio(2.0);
        this.threeMount.appendChild(this.renderer.domElement);

        this.scene.add( new THREE.AmbientLight( 0xffffff, 1.0, 200 ) );
        var light = new THREE.PointLight( 0xffffff, 1, 1000 );
        light.position.set( 200, 200, 100 );
        light.name = "bulb";
        this.scene.add( light );

        // create geometry from stl files
        this.loader = new STLLoader();
        cadComponents.map(obj => {
            this.loader.load(`./cad/${obj.src}.stl`, (geometry) => {
                // render object and center it
                var material = new THREE.MeshPhysicalMaterial(obj.materialProperties);
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
        // this.controls.minPolarAngle = Math.PI / 2;
        // this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.enablePan = false;
        this.camera.position.z = 1000;
        
        var axes = new THREE.AxesHelper(1000);
        this.scene.add(axes);

        const scope = this;
        var animate = function () {
          requestAnimationFrame( animate );
          scope.animateFrame(scope);
        };

        animate();
    }

    animateFrame(scope) {
        scope.controls.update();
        scope.renderer.render(scope.scene, scope.camera);
        cadComponents.map(obj => {
            let child = scope.scene.getObjectByName(obj.src);
            if (child) {
                const INTERVAL = 1000; // 500 px
                let t = scope.y / INTERVAL;

                // if between first and last frames, then perform interpolation between two bounding frames
                // get first frame starting time

                // make sure the frames are in the correct order;
                // var orderedFrames = obj.keyframes.sort((a, b) => (a.time !== b.time) ? (a.time > b.time) ? 1 : 0 : 0);

                if (obj.keyframes.length > 1) {

                    const timestamps = obj.keyframes.map(frame => frame.time);
                    const endTime = Math.max(...timestamps);
                    const startTime = Math.min(...timestamps);

                    function setProperties(offset, rotation) {
                        child.position.x = obj.origin.x + offset.x;
                        child.position.y = obj.origin.y + offset.y;
                        child.position.z = obj.origin.z + offset.z;
                        child.rotation.x = obj.rotation.x + rotation.x;
                        child.rotation.y = obj.rotation.y + rotation.y;
                        child.rotation.z = obj.rotation.z + rotation.z;
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
                                obj.keyframes[lastFrameIndex].rotation || defaultRotation)
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
                            obj.keyframes[firstFrameIndex].rotation || defaultRotation)
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

                        setProperties(offset, rotation);
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