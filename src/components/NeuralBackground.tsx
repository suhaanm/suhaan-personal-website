import { useEffect, useRef } from 'react';

interface Neuron {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  layer: number;
  activation: number;
}

interface Connection {
  from: number;
  to: number;
  weight: number;
  signalProgress: number;
  hasSignal: boolean;
}

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    // Create layered neural network
    const layers = [4, 7, 7, 5, 3];
    const neurons: Neuron[] = [];
    const connections: Connection[] = [];

    layers.forEach((count, layerIdx) => {
      const layerX = ((layerIdx + 0.5) / layers.length) * w * 0.7 + w * 0.12;
      for (let i = 0; i < count; i++) {
        const yOffset = (i - (count - 1) / 2) * (h * 0.7 / Math.max(count, 4));
        neurons.push({
          x: layerX + (Math.random() - 0.5) * 30,
          y: h / 2 + yOffset + (Math.random() - 0.5) * 20,
          vx: 0,
          vy: 0,
          radius: 2.5 + Math.random() * 2,
          layer: layerIdx,
          activation: Math.random(),
        });
      }
    });

    // Create connections
    const layerOffsets: number[] = [0];
    layers.forEach((c, i) => layerOffsets.push(layerOffsets[i] + c));

    for (let l = 0; l < layers.length - 1; l++) {
      for (let i = layerOffsets[l]; i < layerOffsets[l + 1]; i++) {
        for (let j = layerOffsets[l + 1]; j < layerOffsets[l + 2]; j++) {
          if (Math.random() < 0.6) {
            connections.push({
              from: i,
              to: j,
              weight: Math.random() * 0.5 + 0.1,
              signalProgress: 0,
              hasSignal: Math.random() < 0.15,
            });
          }
        }
      }
    }

    const animate = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      ctx.clearRect(0, 0, width, height);

      // Subtle pulse for neurons
      const time = Date.now() * 0.001;
      for (let i = 0; i < neurons.length; i++) {
        const n = neurons[i];
        n.activation = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * 2 + i * 0.5));
      }

      // Draw connections
      for (const conn of connections) {
        const from = neurons[conn.from];
        const to = neurons[conn.to];
        const alpha = conn.weight * 0.4;

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = `rgba(33, 150, 243, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Signal animation
        if (conn.hasSignal) {
          conn.signalProgress += 0.008;
          if (conn.signalProgress > 1) {
            conn.signalProgress = 0;
            conn.hasSignal = Math.random() < 0.3;
          }
          const sx = from.x + (to.x - from.x) * conn.signalProgress;
          const sy = from.y + (to.y - from.y) * conn.signalProgress;
          ctx.beginPath();
          ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 188, 212, ${0.8 * (1 - conn.signalProgress)})`;
          ctx.fill();
        }
      }

      // Draw neurons
      for (let i = 0; i < neurons.length; i++) {
        const n = neurons[i];
        const colors = ['#2196F3', '#00BCD4', '#7C3AED', '#D4AF37', '#F07178'];
        const color = colors[n.layer % colors.length];
        const alpha = n.activation;

        // Glow — higher alpha for light backgrounds
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.floor(alpha * 40).toString(16).padStart(2, '0');
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.floor(alpha * 220).toString(16).padStart(2, '0');
        ctx.fill();
      }

      animId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => resize();
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.5,
      }}
    />
  );
}
