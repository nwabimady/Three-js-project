import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  GridHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { projects } from "./projects.js";

// Get the current project ID from the URL parameter
const currentUrl = window.location.href;
const url = new URL(currentUrl);
const currentProjectID = url.searchParams.get("id");

// Get the current project
const currentProject = projects.find(
  (project) => project.id === currentProjectID
);

// Add the project URL to the iframe
// const iframe = document.getElementById('model-iframe');
// iframe.src = currentProject.url;

// Scene, renderer
const scene = new Scene();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(15, 14, 8);
camera.lookAt(0, 0, 0);

const canvas = document.getElementById("three-canvas");
const renderer = new WebGLRenderer({ canvas, alpha: true });
renderer.setSize(sizes.width, sizes.height);

const pixelRatio = Math.min(window.devicePixelRatio, 2);
renderer.setPixelRatio(pixelRatio);

// Lights, Objects
const lightColor = 0xffffff;
const ambientLight = new AmbientLight(lightColor, 1);
scene.add(ambientLight);

const dirLight1 = new DirectionalLight(lightColor, 1);
dirLight1.position.set(0.75, 1, 0.5);
scene.add(dirLight1);

const grid = new GridHelper(50, 50);
scene.add(grid);

const axes = new AxesHelper();
axes.material.depthTest = false;
axes.rendererOrder = 1;
scene.add(axes);

// Camera controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Animate
const animate = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

// Configure browser sizing
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});
