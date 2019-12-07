// import * as THREE from 'three';
// import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
// import {STLLoader} from 'three/examples/jsm/loaders/STLLoader';

// const sourceUrls = [
//     'Mounts',
//     'Payload_Fairing_rev1',
//     'Payload_Platform_Black',
//     'Stage_1_Cover',
//     'Stage_1_Engines_rev1',
//     'Stage_1_Tank_rev1',
//     'Stage_1_Top_Ring_Grey',
//     'Stage_2_Cover',
//     'Stage_2_Engine_Nozzle_Black',
//     'Stage_2_Tank_rev1'
// ]

// var initialized = false;

// export function initializeScene(scope, ref, { width, height } ) {
//     initialized = true;
//     if (!initialized) {
//         scope.scene = new THREE.Scene();
//         scope.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
//         scope.renderer = new THREE.WebGLRenderer({
//             alpha: true,
//             antialias: true
//         });

//         scope.renderer.setSize(width, height);
//         scope.renderer.setPixelRatio(2);

//         ref.appendChild(scope.renderer.domElement);

//         scope.scene.add( new THREE.AmbientLight( 0xffdddf, 0.3, 100 ) );
//         var light = new THREE.PointLight( 0xffffff, 1, 1000 );
//         light.position.set( 200, 200, 100 );
//         scope.scene.add( light );

//         scope.loader = new STLLoader();

//         sourceUrls.map(url => {
//             scope.loader.load(`./cad/${url}.stl`, (geometry) => {
//                 var material = new THREE.MeshPhysicalMaterial(
//                     {
//                         clearcoat: 0.0,
//                         clearcoatRoughness: 0.2,
//                         reflectivity: 1.0
//                     });
//                 var mesh = new THREE.Mesh(geometry, material);
//                 // mesh.position = mesh.position - THREE.Vector3(0,1,0);
//                 // mesh.position = THREE.Vector3(1, 1, 0);
//                 scope.scene.add(mesh);
//             })
//         });

//         var animate = function () {
//             requestAnimationFrame( animate );
//             // scopecontrols.update();
  
//             const scrollPosY = window.scrollY;
  
//             scope.camera.setFocalLength(scrollPosY / 10 + 10);
  
//             scope.renderer.render( scope.scene, scope.camera );
//           };
//           animate();


//     } else {
//         console.warn("Initialization repeated, aborting...");
//     }
// }
