import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * WebGL plasma background — reagisce al mouse e al tempo.
 * Distorsione fluida con shader custom (cheap su GPU).
 */
export default function ThermalBackground({ intensity = 1 }: { intensity?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight, false);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uIntensity: { value: intensity },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `void main(){ gl_Position = vec4(position,1.0); }`,
      fragmentShader: `
        precision highp float;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec2 uRes;
        uniform float uIntensity;

        // simplex-ish noise (cheap)
        vec3 hash3(vec2 p){
          vec3 q = vec3(dot(p,vec2(127.1,311.7)),
                        dot(p,vec2(269.5,183.3)),
                        dot(p,vec2(419.2,371.9)));
          return fract(sin(q)*43758.5453);
        }
        float noise(vec2 p){
          vec2 i = floor(p), f = fract(p);
          vec2 u = f*f*(3.0-2.0*f);
          float a = hash3(i).x;
          float b = hash3(i+vec2(1.,0.)).x;
          float c = hash3(i+vec2(0.,1.)).x;
          float d = hash3(i+vec2(1.,1.)).x;
          return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
        }

        void main(){
          vec2 uv = gl_FragCoord.xy / uRes.xy;
          vec2 p = uv - 0.5;
          p.x *= uRes.x / uRes.y;

          float t = uTime * 0.07;
          vec2 m = (uMouse - 0.5) * 1.2;
          float d = length(p - m * 0.6);

          float n = noise(p * 2.5 + t);
          n += 0.5 * noise(p * 5.0 - t * 1.3);
          n += 0.25 * noise(p * 11.0 + t * 0.7);
          n /= 1.75;

          float pulse = smoothstep(0.9, 0.0, d) * (0.6 + 0.4 * sin(uTime * 0.6));
          float energy = pow(n, 1.8) + pulse * 0.35;

          // Thermal palette: deep navy -> teal -> violet -> magenta hot
          vec3 c1 = vec3(0.012, 0.012, 0.035);     // near-black
          vec3 c2 = vec3(0.055, 0.21, 0.27);       // teal #0e3543-ish
          vec3 c3 = vec3(0.42, 0.27, 0.92);        // violet
          vec3 c4 = vec3(0.95, 0.30, 0.55);        // hot pink
          vec3 col = mix(c1, c2, smoothstep(0.0, 0.45, energy));
          col = mix(col, c3, smoothstep(0.4, 0.75, energy));
          col = mix(col, c4, smoothstep(0.78, 1.0, energy));

          // vignette
          float v = smoothstep(1.1, 0.25, length(p));
          col *= v;

          gl_FragColor = vec4(col * uIntensity, 0.95);
        }
      `,
      transparent: true,
    });

    const geom = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geom, material);
    scene.add(mesh);

    let raf = 0;
    const start = performance.now();
    let mx = 0.5, my = 0.5;
    let cx = 0.5, cy = 0.5;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth;
      my = 1 - e.clientY / window.innerHeight;
    };
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      uniforms.uRes.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", onResize);

    const tick = () => {
      cx += (mx - cx) * 0.05;
      cy += (my - cy) * 0.05;
      uniforms.uMouse.value.set(cx, cy);
      uniforms.uTime.value = (performance.now() - start) / 1000;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      geom.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [intensity]);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}
