import {
  Scene,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  PerspectiveCamera,
  WebGLRenderer,
  Vector2,
  Vector3,
  Vector4,
  Quaternion,
  Matrix4,
  Spherical,
  Box3,
  Sphere,
  Color,
  Raycaster,
  MathUtils,
  MOUSE,
  Clock,
  SphereGeometry,
  Object3D,
  MeshLambertMaterial,
  AmbientLight,
  MeshPhongMaterial,
  AxesHelper,
  GridHelper,
  DirectionalLight,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments
} from "three";

import CameraControls from 'camera-controls';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


const subsetOfTHREE = {
  MOUSE,
  Vector2,
  Vector3,
  Vector4,
  Quaternion,
  Matrix4,
  Spherical,
  Box3,
  Sphere,
  Raycaster,
  MathUtils: {
    DEG2RAD: MathUtils.DEG2RAD,
    clamp: MathUtils.clamp
  }
};


//1 The scene

const scene = new Scene();
const canvas = document.getElementById("three-canvas");

const axes = new AxesHelper();
axes.material.depthTest = false;
axes.renderOrder = 2;
scene.add(axes);

const grid = new GridHelper();
grid.renderOrder = 1;
scene.add(grid);


//2 The Object
const loader = new GLTFLoader();

const loadingElem = document.querySelector('#loader-container');
const loadingText = loadingElem.querySelector('p');

loader.load('./police_station.glb',

	( gltf ) => {
    loadingElem.style.display = 'none';
		scene.add( gltf.scene );
	},

	( progress ) => {
    const current = (progress.loaded /  progress.total) * 100;
    const formatted = Math.trunc(current * 100) / 100; 
    loadingText.textContent = `Loading: ${formatted}%`;
	},

	( error ) => {

		console.log( 'An error happened: ', error );

	}
);


// Light

const light = new DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 0.5);
const baseLight = new AmbientLight(0xffffff, 1);
scene.add(light, baseLight);



//3 The Camera
const camera = new PerspectiveCamera(
  75,
  canvas.clientWidth / canvas.clientHeight
);
camera.position.z = 5;
camera.position.y = 6;
camera.position.x = 4;

camera.lookAt(axes.position);
scene.add(camera);



//4 The Renderer
const renderer = new WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

window.addEventListener("resize", () => {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
});
renderer.setClearColor(0xEEF2F8,1);


// Controls
CameraControls.install( { THREE: subsetOfTHREE } ); 
const clock = new Clock();
const cameraControls = new CameraControls(camera, canvas);
cameraControls.dollyToCursor = true;

cameraControls.setLookAt(18, 20, 18, 0, 10, 0);


function animate() {

  const delta = clock.getDelta();
	cameraControls.update( delta );
	renderer.render( scene, camera );
  requestAnimationFrame(animate);
}

animate();

// Debugging
