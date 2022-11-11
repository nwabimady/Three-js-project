import {
  Scene,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  Color,
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
  Raycaster,
  MathUtils,
  MOUSE,
  Clock,
  SphereGeometry,
  Object3D,
  MeshLambertMaterial,
  MeshPhongMaterial,
  AxesHelper,
  GridHelper
} from "three";

import CameraControls from 'camera-controls';

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

const geometry = new BoxGeometry(2,1,3);
const material = new MeshPhongMaterial({ 	
  color: 'pink',
  specular: 'white',
  shininess: 100,
  flatShading: true, 
});
const mesh = new Mesh(geometry, material);
scene.add(mesh)

// const sunMaterial = new MeshLambertMaterial({color: 'yellow' });
// const sunMesh= new Mesh(sphereGeometry, sunMaterial);
// solarSystem.add(sunMesh);

// const earthMaterial = new MeshLambertMaterial({color: 'blue' });
// const earthMesh = new Mesh(sphereGeometry, earthMaterial);
// earthMesh.position.set(5, 0, 0);
// sunMesh.add(earthMesh);

// const moonMaterial = new MeshLambertMaterial({color: 'white' });
// const moonMesh = new Mesh(sphereGeometry, moonMaterial);
// moonMesh.scale.set(0.5, 0.5, 0.5);
// moonMesh.position.set(1, 0, 0);
// earthMesh.add(moonMesh);


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