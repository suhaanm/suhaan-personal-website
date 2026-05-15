import * as THREE from 'three';

const STAR_COUNT = 4000;
const RADIUS_MIN = 1000;
const RADIUS_MAX = 2000;
const CAMERA_Z = 5000;
const RIBBON_COUNT = 10;

// Brighter accent colors for visibility on light backgrounds
const WARP_COLORS: [number, number, number][] = [
  [0.13, 0.59, 0.95],   // #2196F3 blue
  [0.0, 0.74, 0.83],    // #00BCD4 cyan
  [0.49, 0.23, 0.93],   // #7C3AED violet
  [0.83, 0.69, 0.22],   // #D4AF37 gold
  [0.02, 0.51, 0.78],   // darker blue
];

const BASE_SPEED = [0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50, 0.55, 0.60];

const ribbonVert = `
  attribute vec3 color;
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uTime;
  uniform float uSpeed;

  const float PI = 3.14159265359;

  mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    return mat4(
      oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s, 0.0,
      oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s, 0.0,
      oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,          0.0,
      0.0, 0.0, 0.0, 1.0
    );
  }

  vec3 rotate(vec3 v, vec3 axis, float angle) {
    return (rotationMatrix(axis, angle) * vec4(v, 1.0)).xyz;
  }

  void main() {
    vec3 pos = position;
    vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    float t = uTime;
    vec3 offsets = vec3(
      sin(worldPos.x * 0.5 + t) * 0.3,
      cos(worldPos.y * 0.5 + t) * 0.3,
      sin(worldPos.z * 0.5 + t) * 0.3
    );
    pos += offsets;
    float angle = t * 0.2 * uSpeed;
    vec3 nPos = rotate(pos, vec3(0.0, 0.0, 1.0), angle);
    vAlpha = 0.5 + 0.5 * sin(t);
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(nPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const ribbonFrag = `
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uOpacity;

  void main() {
    vec3 color = vColor * vAlpha * uOpacity;
    gl_FragColor = vec4(color, uOpacity);
  }
`;

export class WarpConstellation {
  container: HTMLDivElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  stars: THREE.Points[];
  ribbons: THREE.Line[];
  time: number;
  velocity: number;
  mouseX: number;
  mouseY: number;
  targetMouseX: number;
  targetMouseY: number;
  private animationId: number | null = null;
  private _onMouseMove: ((e: MouseEvent) => void) | null = null;
  private _onResize: (() => void) | null = null;

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000);
    this.camera.position.z = CAMERA_Z;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Light background
    this.renderer.setClearColor(0xF0F2F5, 1);
    this.container.appendChild(this.renderer.domElement);
    this.stars = [];
    this.ribbons = [];
    this.time = 0;
    this.velocity = 0.5;
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;

    this.initStars();
    this.initRibbons();
    this.addEvents();
    this.animate();
  }

  private initStars() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(STAR_COUNT * 3);
    const colors = new Float32Array(STAR_COUNT * 3);
    const colorObj = new THREE.Color();

    for (let i = 0; i < STAR_COUNT; i++) {
      const radius = RADIUS_MIN + Math.random() * (RADIUS_MAX - RADIUS_MIN);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      const colorIndex = Math.floor(Math.random() * WARP_COLORS.length);
      colorObj.setRGB(...WARP_COLORS[colorIndex]);
      colors[i * 3] = colorObj.r;
      colors[i * 3 + 1] = colorObj.g;
      colors[i * 3 + 2] = colorObj.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Normal blending for light backgrounds (not additive)
    const material = new THREE.PointsMaterial({
      size: 8,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.NormalBlending,
    });

    const starSystem = new THREE.Points(geometry, material);
    starSystem.userData = { velocities: [] };
    for (let i = 0; i < STAR_COUNT; i++) {
      (starSystem.userData.velocities as { x: number; y: number; z: number }[]).push({
        x: 0,
        y: 0,
        z: -Math.random() * 5 - 2,
      });
    }
    this.scene.add(starSystem);
    this.stars.push(starSystem);
  }

  private createRibbonGeometry() {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(3600 * 3);
    const colors = new Float32Array(3600 * 3);
    const colorObj = new THREE.Color();
    const colorIdx = Math.floor(Math.random() * WARP_COLORS.length);
    colorObj.setRGB(...WARP_COLORS[colorIdx]);
    const radius = RADIUS_MIN + Math.random() * (RADIUS_MAX - RADIUS_MIN);
    let index = 0;

    for (let theta = 0; theta < 360; theta++) {
      for (let phi = 0; phi < 180; phi += 10) {
        const x = radius * Math.sin(phi * Math.PI / 180) * Math.cos(theta * Math.PI / 180);
        const y = radius * Math.sin(phi * Math.PI / 180) * Math.sin(theta * Math.PI / 180);
        const z = radius * Math.cos(phi * Math.PI / 180);
        vertices[index] = x;
        vertices[index + 1] = y;
        vertices[index + 2] = z;
        colors[index] = colorObj.r;
        colors[index + 1] = colorObj.g;
        colors[index + 2] = colorObj.b;
        index += 3;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geometry;
  }

  private initRibbons() {
    for (let i = 0; i < RIBBON_COUNT; i++) {
      const geometry = this.createRibbonGeometry();
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uSpeed: { value: BASE_SPEED[i] },
          uOpacity: { value: 0.15 + Math.random() * 0.25 },
        },
        vertexShader: ribbonVert,
        fragmentShader: ribbonFrag,
        transparent: true,
        blending: THREE.NormalBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const ribbon = new THREE.Line(geometry, material);
      ribbon.userData.baseSpeed = BASE_SPEED[i];
      this.scene.add(ribbon);
      this.ribbons.push(ribbon);
    }
  }

  private addEvents() {
    this._onResize = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', this._onResize);

    this._onMouseMove = (e: MouseEvent) => {
      this.targetMouseX = (e.clientX - window.innerWidth / 2) * 0.001;
      this.targetMouseY = (e.clientY - window.innerHeight / 2) * 0.001;
    };
    document.addEventListener('mousemove', this._onMouseMove);
  }

  private updateStars() {
    for (const starSystem of this.stars) {
      const positions = starSystem.geometry.attributes.position.array as Float32Array;
      const vels = starSystem.userData.velocities as { x: number; y: number; z: number }[];
      for (let j = 0; j < STAR_COUNT; j++) {
        positions[j * 3] += vels[j].x;
        positions[j * 3 + 1] += vels[j].y;
        positions[j * 3 + 2] += vels[j].z;
        const z = positions[j * 3 + 2];
        if (z > CAMERA_Z || z < -CAMERA_Z) {
          positions[j * 3] = (Math.random() - 0.5) * RADIUS_MAX;
          positions[j * 3 + 1] = (Math.random() - 0.5) * RADIUS_MAX;
          positions[j * 3 + 2] = -RADIUS_MIN - Math.random() * (RADIUS_MAX - RADIUS_MIN);
          vels[j].x = 0;
          vels[j].y = 0;
          vels[j].z = -Math.random() * this.velocity - 0.5;
        }
      }
      starSystem.geometry.attributes.position.needsUpdate = true;
      starSystem.rotation.x += (this.mouseY - starSystem.rotation.x) * 0.05;
      starSystem.rotation.y += (this.mouseX - starSystem.rotation.y) * 0.05;
    }
  }

  private updateRibbons() {
    for (let i = 0; i < this.ribbons.length; i++) {
      const ribbon = this.ribbons[i];
      (ribbon.material as THREE.ShaderMaterial).uniforms.uTime.value = this.time;
      (ribbon.material as THREE.ShaderMaterial).uniforms.uSpeed.value = this.velocity * 2.0;
      ribbon.rotation.x += 0.002 * ribbon.userData.baseSpeed;
      ribbon.rotation.y += 0.003 * ribbon.userData.baseSpeed;
      ribbon.rotation.z += 0.001 * ribbon.userData.baseSpeed;
      const scale = 1.0 + Math.sin(this.time * ribbon.userData.baseSpeed) * 0.2;
      ribbon.scale.set(scale, scale, scale);
    }
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    this.time += 0.01;
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;
    this.updateStars();
    this.updateRibbons();
    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    if (this._onMouseMove) {
      document.removeEventListener('mousemove', this._onMouseMove);
    }
    if (this._onResize) {
      window.removeEventListener('resize', this._onResize);
    }
    this.renderer.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
