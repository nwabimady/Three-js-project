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
  DirectionalLight
} from "three";

import CameraControls from 'camera-controls';

import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";



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
grid.material.depthTest = false;
grid.renderOrder = 1;
scene.add(grid);


//2 The Object

const geometry = new BoxGeometry( 1, 1, 1);
const material = new MeshPhongMaterial({ color:'pink' });
const cube = new Mesh(geometry, material);
scene.add(cube);


// Light

const color = 0xFFFFFF;
const intensity = 1;
const light = new DirectionalLight(color, intensity);
light.position.set(0.4,5,2);
scene.add(light);


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

function animate() {

  const delta = clock.getDelta();
	cameraControls.update( delta );
	renderer.render( scene, camera );
  requestAnimationFrame(animate);
}

animate();

// Debugging

const gui = new GUI();

const min = -3;
const max = 3;
const step = 0.01;

const transformationFolder = gui.addFolder('Transformation');

gui.add(cube.position, 'x').min(-3).max(3).step(0.01).name('X-axis');
gui.add(cube.position, 'z').min(-3).max(3).step(0.01).name('Z-axis');
gui.add(cube.position, 'y').min(-3).max(3).step(0.01).name('Y-axis');

gui.addFolder('Visibility').add(cube, 'visible');
gui.add(cube, 'visible').name('Cube visibility');
gui.addFolder('Light2').add(material, "wireframe").name("Wireframe");

const colorParam = {
	color: 0xff0000	
}

gui.addColor(colorParam, 'color').onChange(() => {
	cubeMesh.material.color.set(colorParam.color);
})

import gsap from "gsap";

const functionParam = {
	spin: () => {
		gsap.to(cube.rotation, { y: cube.rotation.y +10, duration: 1 });
	}
}

gui.add(functionParam, 'spin');