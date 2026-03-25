// Lívia Stefanni Luiz Santos
// Ana Roberta Fornari 

// Importando as coisas principais do Three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

//Cena
const scene = new THREE.Scene();

//Céu com degradê de entardecer
const canvas = document.createElement('canvas');
canvas.width = 512;
canvas.height = 512;
const context = canvas.getContext('2d');
const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
gradient.addColorStop(0, '#1a237e');   // azul escuro topo
gradient.addColorStop(0.5, '#ff6f00'); // laranja meio
gradient.addColorStop(1, '#000000');   // preto horizonte
context.fillStyle = gradient;
context.fillRect(0, 0, canvas.width, canvas.height);
const texture = new THREE.CanvasTexture(canvas);
scene.background = texture;

//Câmera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 15, 25);
camera.lookAt(0, 3, 0);

//Renderizador
const renderizador = new THREE.WebGLRenderer({ antialias: true });
renderizador.setPixelRatio(window.devicePixelRatio);
renderizador.setSize(window.innerWidth, window.innerHeight);
renderizador.shadowMap.enabled = true;
document.body.appendChild(renderizador.domElement);

//Luzes
const ambientLight = new THREE.AmbientLight(0x333355, 0.3);
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0xfff4d6, 0.5);
scene.add(hemiLight);

const sunLight = new THREE.DirectionalLight(0xffaa33, 2);
sunLight.position.set(50, 10, -30);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
scene.add(sunLight);

//Sol visível
const sunGeo = new THREE.SphereGeometry(8, 32, 32);
const sunMat = new THREE.MeshStandardMaterial({
  emissive: 0xfff4d6,
  emissiveIntensity: 5,
  color: 0xffffcc,
});
const sunMesh = new THREE.Mesh(sunGeo, sunMat);
sunMesh.position.copy(sunLight.position);
scene.add(sunMesh);

//Controles
const controls = new OrbitControls(camera, renderizador.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0);

const pointerControls = new PointerLockControls(camera, document.body);

//Animações
const mixers = [];
const clock = new THREE.Clock();

//Função para adicionar personagens
function Personagens(path, scale, position, rotation = { x: 0, y: 0, z: 0 }) {
  const loader = new GLTFLoader();
  loader.load(
    path,
    (gltf) => {
      const objeto = gltf.scene;
      objeto.scale.set(scale.x, scale.y, scale.z);
      objeto.position.set(position.x, position.y, position.z);
      objeto.rotation.set(rotation.x, rotation.y, rotation.z);

      objeto.traverse((c) => {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
        }
      });

      scene.add(objeto);

      if (gltf.animations && gltf.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(objeto);
        gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
        mixers.push(mixer);
      }
    },
    undefined,
    (err) => console.error('Erro ao carregar modelo GLB:', err)
  );
}

//Personagens
Personagens('assets/models/ironman.glb', 
  { x: 0.8, y: 0.8, z: 0.8 }, 
  { x: -12, y: 9, z: 2 }, 
  { x: Math.PI / -10, y: Math.PI, z: 0 });

Personagens('assets/models/captain_america.glb', 
  { x: 0.1, y: 0.1, z: 0.1 }, 
  { x: -25, y: 3.2, z: 1 });

Personagens('assets/models/natasha_romanoff_black_widow.glb', 
  { x: 0.7, y: 0.7, z: 0.7 }, 
  { x: 2, y: 3, z: 2 }, 
  { x: 0, y: Math.PI + Math.PI / 6, z: 0 }); 

Personagens('assets/models/clint_barton_hawkeye.glb', 
  { x: 0.7, y: 0.7, z: 0.7 }, 
  { x: 0, y: 3, z: 2 }, 
  { x: 0, y: Math.PI - Math.PI / 6, z: 0 }); 

Personagens('assets/models/samuel_jackson_nick_fury_avengers.glb', 
  { x: 0.7, y: 0.7, z: 0.7 }, 
  { x: 1, y: 3, z: 1 });

Personagens('assets/models/hulk.glb', 
  { x: 0.7, y: 0.7, z: 0.7 }, 
  { x: -7, y: 2.8, z: -2}, 
  { x: 0, y: Math.PI - Math.PI / -2, z: 0 });

Personagens('assets/models/thor_textured_no_rig.glb', 
  { x: 0.02, y: 0.02, z: 0.02 }, 
  { x: -26, y: 4, z: 2 });

  Personagens('assets/models/spiderman.glb', 
  { x: 0.7, y: 0.7, z: 0.7 }, 
  { x: -23, y: 3.2, z: -5 },
  { x: 0, y: Math.PI / 2, z: 0 });

  Personagens('assets/models/outrider_-_avengers_endgame.glb', 
  { x: 1, y: 1, z: 1 }, 
  { x: -22, y: 3, z: -5 },
  { x: 0, y: Math.PI /-2, z: 0 });

  Personagens('assets/models/thanos_textured_rigged.glb', 
  { x: 3, y: 3, z: 3 }, 
  { x: -25, y: 3.2, z: 4 },
  { x: 0, y: Math.PI, z: 0 });

Personagens('assets/models/wanda_textured_rigged.glb', 
  { x: 0.7, y: 0.7, z: 0.7 }, 
  { x: -26, y: 4, z: -2 },
  { x: 0, y: Math.PI / -2, z: 0 });

  Personagens('assets/models/black_panther.glb', 
  { x: 0.7, y: 0.7, z: 0.7 }, 
  { x: -25, y: 4, z: -3 });

  Personagens('assets/models/guardians_of_the_galaxy_avengers_benatar_ship.glb', 
  { x: 0.002, y: 0.002, z: 0.002 }, 
  { x: -21, y: 9, z: -2 },
  { x: 0, y: Math.PI, z: 0 });
  
  Personagens('assets/models/outrider_-_avengers_endgame.glb', 
  { x: 1, y: 1, z: 1 }, 
  { x: -25, y: 3, z: 6 },
  { x: 0, y: Math.PI, z: 0 });

Personagens('assets/models/outrider_-_avengers_endgame.glb', 
  { x: 1, y: 1, z: 1 }, 
  { x: -23, y: 3, z: 6 },
  { x: 0, y: Math.PI, z: 0 });

  Personagens('assets/models/outrider_-_avengers_endgame.glb', 
  { x: 1, y: 1, z: 1 }, 
  { x: -27, y: 3, z: 7 },
  { x: 0, y: Math.PI, z: 0 });

  Personagens('assets/models/outrider_-_avengers_endgame.glb', 
  { x: 1, y: 1, z: 1 }, 
  { x: -24, y: 3, z: 9 },
  { x: 0, y: Math.PI, z: 0 });

  Personagens('assets/models/outrider_-_avengers_endgame.glb', 
  { x: 1, y: 1, z: 1 }, 
  { x: -21, y: 3, z: 8 },
  { x: 0, y: Math.PI, z: 0 });

//Função para adicionar o ambiente
function Ambiente(path, scale, position) {
  const loader = new GLTFLoader();
  loader.load(
    path,
    (gltf) => {
      const ambiente = gltf.scene;
      ambiente.scale.set(scale.x, scale.y, scale.z);
      ambiente.position.set(position.x, position.y, position.z);

      ambiente.traverse((obj) => {
        if (obj.isMesh) {
          obj.castShadow = true;
          obj.receiveShadow = true;
        }
      });

      scene.add(ambiente);
    },
    undefined,
    (err) => console.error('Erro ao carregar ambiente:', err)
  );
}

//Ambiente
Ambiente('assets/headquarters_avengers_hq_central_vengadores/scene.gltf', { x: 3, y: 3, z: 3 }, { x: 0, y: 3, z: 0 });

//Botão para trocar o tipo do controle
const button = document.createElement('button');
button.id = 'toggleButton';
button.textContent = 'Modo: OrbitControls';
document.body.appendChild(button);
Object.assign(button.style, {
  position: 'absolute',
  top: '15px',
  right: '15px',
  padding: '10px 20px',
  backgroundColor: '#222',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontFamily: 'sans-serif',
  fontSize: '14px',
  zIndex: '10'
});

let useOrbit = true;
const move = { forward: false, backward: false, left: false, right: false, up: false, down: false };
let velocity = new THREE.Vector3();

button.onclick = () => {
  useOrbit = !useOrbit;
  if (useOrbit) {
    button.textContent = 'Modo: OrbitControls';
    pointerControls.unlock();
  } else {
    button.textContent = 'Modo: WASD + EQ';
    pointerControls.lock();
  }
};

//Movimentação pelo teclado
document.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'KeyS': move.forward = true; break;
    case 'KeyW': move.backward = true; break;
    case 'KeyA': move.left = true; break;
    case 'KeyD': move.right = true; break;
    case 'KeyE': move.up = true; break;
    case 'KeyQ': move.down = true; break;
  }
});
document.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'KeyS': move.forward = false; break;
    case 'KeyW': move.backward = false; break;
    case 'KeyA': move.left = false; break;
    case 'KeyD': move.right = false; break;
    case 'KeyE': move.up = false; break;
    case 'KeyQ': move.down = false; break;
  }
});

//Loop de renderização
function renderizar() {
  requestAnimationFrame(renderizar);
  const delta = clock.getDelta();
  mixers.forEach((mixer) => mixer.update(delta));

  //Movimentação (WASD + QE)
  if (!useOrbit && pointerControls.isLocked) {
    const speed = 10.0 * delta; //velocidade
    const direction = new THREE.Vector3();

    if (move.forward) direction.z -= 1;
    if (move.backward) direction.z += 1;
    if (move.left) direction.x -= 1;
    if (move.right) direction.x += 1;
    if (move.up) direction.y += 1;
    if (move.down) direction.y -= 1;

    direction.normalize();
    velocity.lerp(direction.multiplyScalar(speed), 0.1);

    pointerControls.moveRight(velocity.x);
    pointerControls.moveForward(velocity.z);
    camera.position.y += velocity.y;
  }

  controls.enabled = useOrbit;
  if (useOrbit) controls.update();

  renderizador.render(scene, camera);
}
renderizar();

//Ajuste ao redimensionar
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderizador.setSize(window.innerWidth, window.innerHeight);
});
