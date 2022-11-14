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

import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

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

let policeStation;

 loader.load(	'./police_station.glb',

 
 ( gltf ) => {
  policeStation = gltf.scene
    loadingElem.style.display = 'none';
    scene.add( policeStation );
 
  },


 ( progress ) => {
   const current = (progress.loaded /  progress.total) * 100;
   const result = Math.min(current, 100); 
   const formatted = Math.trunc(result * 100) / 100;
  loadingText.textContent = `Loading: ${formatted}%`;
 },

 ( error ) => {

   console.log( 'An error happened: ', error );

 }
 );


// const geometry = new BoxGeometry(0.5, 0.5, 0.5);

// const blue = 0x000099;
// const green = 0x009900;
// const red = 0x990000;

// const blueMaterial = new MeshLambertMaterial({ color: blue });
// const greenMaterial = new MeshLambertMaterial({ color: green });
// const redMaterial = new MeshLambertMaterial({ color: red });

// const cube = new Mesh(geometry, blueMaterial);

// const cube2 = new Mesh(geometry, greenMaterial);
// cube2.position.x += 1;

// const cube3 = new Mesh(geometry, redMaterial);
// cube3.position.x -= 1;

// scene.add(cube, cube2, cube3);

// UUID helper objects

// const objectsToTest = { 
  //   [cube.uuid]: {object: cube, color: blue},
  //   [cube2.uuid]: {object: cube2, color: green},
  //   [cube3.uuid]: {object: cube3, color: red}
// };

	// const objectsArray = Object.values(loader).map(item => item.object);


// Light

const light = new DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 0.5);
const baseLight = new AmbientLight(0xffffff, 1);
scene.add(light, baseLight);



//3 The Camera
const camera = new PerspectiveCamera( 75, canvas.clientWidth / canvas.clientHeight);
camera.position.z = 5;
camera.position.y = 6;
camera.position.x = 4;

camera.lookAt(axes.position);
scene.add(camera);



//4 The Renderer
const renderer = new WebGLRenderer({ canvas });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
renderer.setClearColor(0xEEF2F8,1);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.pointerEvents = 'none';
labelRenderer.domElement.style.top = '0';
document.body.appendChild(labelRenderer.domElement);


// Responsivity
window.addEventListener("resize", () => {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
});
labelRenderer.setSize(canvas.clientWidth, canvas.clientHeight);



// Controls
CameraControls.install( { THREE: subsetOfTHREE } ); 
const clock = new Clock();
const cameraControls = new CameraControls(camera, canvas);
cameraControls.dollyToCursor = true;

cameraControls.setLookAt(18, 20, 18, 0, 10, 0);

// Raycaster : Picking

const raycaster = new Raycaster();
const mouse = new Vector2();

window.addEventListener('dblclick', (event) => {
	mouse.x = event.clientX / canvas.clientWidth * 2 - 1;
	mouse.y = - (event.clientY / canvas.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(policeStation);

  if(!intersects.length) return;

  const collisionLocation = intersects[0].point;

  const message = window.prompt('Describe issue:');

  const container = document.createElement('div');
  container.className = 'label-container';

  const label = document.createElement('p');
  label.textContent = message ;
  label.classList.add('label');
  container.appendChild(label);

  const deleteButton =  document.createElement('button');
  deleteButton.textContent = 'X';
  deleteButton.className = 'delete-button hidden';
  container.appendChild(deleteButton);

  const labelObject = new CSS2DObject(container);
  labelObject.position.copy(collisionLocation);
  scene.add(labelObject);

  deleteButton.onclick = () => {
    labelObject.removeFromParent();
    labelObject.element = null;
    container.remove();
  }

  container.onmouseenter = () => deleteButton.classList.remove('hidden');
  container.onmmouseleave = () => deleteButton.classList.add('hidden');

});

	

	// let previousSelectedUuid;







	//   const firstIntersection = intersects[0];
	//   firstIntersection.object.material.color.set('orange')

	//   const isNotPrevious = previousSelectedUuid !== firstIntersection.object.uuid;
	// 	if(previousSelectedUuid !== undefined && isNotPrevious) {
	//     resetPreviousSelection();
	//   }

	//   previousSelectedUuid = firstIntersection.object.uuid;
	// });

	// function resetPreviousSelection() {
	//   if(previousSelectedUuid === undefined) return;
	//   const previousSelected = objectsToTest[previousSelectedUuid];
	//   previousSelected.object.material.color.set(previousSelected.color);
	// }

// Animation
function animate() {

  const delta = clock.getDelta();
	cameraControls.update( delta );
  labelRenderer.render( scene, camera );
	renderer.render( scene, camera );
  requestAnimationFrame(animate);
}

animate();

// Debugging
