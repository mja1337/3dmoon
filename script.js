const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

const geometry = new THREE.SphereGeometry(10, 32, 32);
const textureLoader = new THREE.TextureLoader();
const moonTexture = textureLoader.load('https://threejs.org/examples/textures/planets/moon_1024.jpg');
const material = new THREE.MeshStandardMaterial({
    map: moonTexture,
    emissive: 0x072534,
    roughness: 0.1,
    metalness: 0.1,
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

document.addEventListener('mousemove', onDocumentMouseMove);
document.addEventListener('wheel', onDocumentMouseWheel);

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
}

function onDocumentMouseWheel(event) {
    camera.position.z += event.deltaY * 0.01;
}

const clock = new THREE.Clock();

const animate = () => {
    targetX = mouseX * .001;
    targetY = mouseY * .001;

    const elapsedTime = clock.getElapsedTime();

    // Update objects
    sphere.rotation.y = .5 * elapsedTime;

    // Animate Stars
    scene.children.forEach(child => {
        if (child instanceof THREE.Mesh && child.geometry.type === 'SphereGeometry' && child.material.color.getHexString() === 'ffffff') {
            child.position.x += (targetX * 0.1);
            child.position.y += (targetY * 0.1);
        }
    });

    sphere.rotation.y += .5 * (targetX - sphere.rotation.y);
    sphere.rotation.x += .05 * (targetY - sphere.rotation.x);
    sphere.position.z += -.25 * (targetY - sphere.rotation.x);


    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(animate);
}

animate();