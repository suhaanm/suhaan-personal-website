import * as THREE from 'three';

const PARTICLE_COUNT = 700;
const CONNECTION_DISTANCE = 45;
const COLORS: [number, number, number][] = [
  [0.13, 0.59, 0.95],  // #2196F3 blue
  [0.0, 0.74, 0.83],   // #00BCD4 cyan
  [0.49, 0.23, 0.93],  // #7C3AED violet
  [0.83, 0.69, 0.22],  // #D4AF37 gold
  [0.0, 0.51, 0.78],   // darker blue
  [0.02, 0.65, 0.72],  // teal
];

interface ParticleData {
  velocity: THREE.Vector3;
  originalPos: THREE.Vector3;
  color: THREE.Color;
  size: number;
}

export class ParticleSphere {
  container: HTMLDivElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  particles: THREE.Points;
  lines: THREE.LineSegments;
  particleData: ParticleData[];
  time: number;
  mouseX: number;
  mouseY: number;
  targetMouseX: number;
  targetMouseY: number;
  private animationId: number | null = null;
  private _onMouseMove: ((e: MouseEvent) => void) | null = null;
  private _onResize: (() => void) | null = null;
  private positionsAttr: THREE.BufferAttribute;
  private linePositions: Float32Array;
  private lineColors: Float32Array;

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 2000);
    this.camera.position.z = 420;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);
    this.time = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.particleData = [];

    this.particles = this.initParticles();
    this.scene.add(this.particles);

    const lineResult = this.initLines();
    this.lines = lineResult.lines;
    this.scene.add(this.lines);
    this.linePositions = lineResult.positions;
    this.lineColors = lineResult.colors;
    this.positionsAttr = this.particles.geometry.attributes.position as THREE.BufferAttribute;

    this.addEvents();
    this.animate();
  }

  private initParticles(): THREE.Points {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);

    const colorObj = new THREE.Color();
    const radius = 130;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Fibonacci sphere for even distribution
      const phi = Math.acos(1 - 2 * (i + 0.5) / PARTICLE_COUNT);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const r = radius * (0.88 + Math.random() * 0.24);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const colorIndex = Math.floor(Math.random() * COLORS.length);
      colorObj.setRGB(...COLORS[colorIndex]);
      colors[i * 3] = colorObj.r;
      colors[i * 3 + 1] = colorObj.g;
      colors[i * 3 + 2] = colorObj.b;

      sizes[i] = 3 + Math.random() * 4;

      this.particleData.push({
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.06,
          (Math.random() - 0.5) * 0.06,
          (Math.random() - 0.5) * 0.06
        ),
        originalPos: new THREE.Vector3(x, y, z),
        color: colorObj.clone(),
        size: sizes[i],
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float uPixelRatio;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = 1.0 - smoothstep(0.15, 0.5, dist);
          alpha = 0.92 * alpha + 0.25;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    return new THREE.Points(geometry, material);
  }

  private initLines(): { lines: THREE.LineSegments; positions: Float32Array; colors: Float32Array } {
    const maxLines = PARTICLE_COUNT * 3;
    const positions = new Float32Array(maxLines * 6);
    const colors = new Float32Array(maxLines * 6);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    return { lines: new THREE.LineSegments(geometry, material), positions, colors };
  }

  private addEvents() {
    this._onResize = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      (this.particles.material as THREE.ShaderMaterial).uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    };
    window.addEventListener('resize', this._onResize);

    this._onMouseMove = (e: MouseEvent) => {
      this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    document.addEventListener('mousemove', this._onMouseMove);
  }

  private updateParticles() {
    const positions = this.positionsAttr.array as Float32Array;
    const time = this.time;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const data = this.particleData[i];
      const orig = data.originalPos;

      // Gentle breathing
      const breathe = Math.sin(time * 0.5 + i * 0.1) * 8;
      const wobbleX = Math.sin(time * 0.3 + i * 0.07) * 3;
      const wobbleY = Math.cos(time * 0.4 + i * 0.09) * 3;
      const wobbleZ = Math.sin(time * 0.35 + i * 0.11) * 3;

      const len = Math.sqrt(orig.x * orig.x + orig.y * orig.y + orig.z * orig.z) || 1;

      positions[i * 3] = orig.x + wobbleX + breathe * (orig.x / len);
      positions[i * 3 + 1] = orig.y + wobbleY + breathe * (orig.y / len);
      positions[i * 3 + 2] = orig.z + wobbleZ + breathe * (orig.z / len);
    }

    this.positionsAttr.needsUpdate = true;
  }

  private updateLines() {
    const positions = this.positionsAttr.array as Float32Array;
    const linePos = this.linePositions;
    const lineCol = this.lineColors;
    let lineIndex = 0;

    // Only process every 2nd particle for performance + cleaner look
    for (let i = 0; i < PARTICLE_COUNT; i += 2) {
      if (lineIndex >= linePos.length - 6) break;

      const x1 = positions[i * 3];
      const y1 = positions[i * 3 + 1];
      const z1 = positions[i * 3 + 2];

      // Check fewer neighbors = cleaner, sparser lines
      const checkLimit = Math.min(i + 8, PARTICLE_COUNT);
      for (let j = i + 1; j < checkLimit; j++) {
        const dx = x1 - positions[j * 3];
        const dy = y1 - positions[j * 3 + 1];
        const dz = z1 - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < CONNECTION_DISTANCE && lineIndex < linePos.length - 6) {
          const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.35;

          linePos[lineIndex] = x1;
          linePos[lineIndex + 1] = y1;
          linePos[lineIndex + 2] = z1;
          linePos[lineIndex + 3] = positions[j * 3];
          linePos[lineIndex + 4] = positions[j * 3 + 1];
          linePos[lineIndex + 5] = positions[j * 3 + 2];

          const ci = this.particleData[i].color;
          lineCol[lineIndex] = ci.r * alpha;
          lineCol[lineIndex + 1] = ci.g * alpha;
          lineCol[lineIndex + 2] = ci.b * alpha;
          lineCol[lineIndex + 3] = ci.r * alpha;
          lineCol[lineIndex + 4] = ci.g * alpha;
          lineCol[lineIndex + 5] = ci.b * alpha;

          lineIndex += 6;
        }
      }
    }

    // Clear remaining
    for (let k = lineIndex; k < linePos.length; k++) {
      linePos[k] = 0;
      lineCol[k] = 0;
    }

    (this.lines.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (this.lines.geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    this.time += 0.008;

    // Smooth mouse follow
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.04;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.04;

    // Gentle rotation
    this.particles.rotation.y += 0.001;
    this.particles.rotation.x = this.mouseY * 0.12;
    this.particles.rotation.z = this.mouseX * 0.06;
    this.lines.rotation.copy(this.particles.rotation);

    this.updateParticles();
    this.updateLines();
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
    this.particles.geometry.dispose();
    (this.particles.material as THREE.ShaderMaterial).dispose();
    this.lines.geometry.dispose();
    (this.lines.material as THREE.Material).dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
