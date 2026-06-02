import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

gsap.registerPlugin(ScrollTrigger);

/**
 * CosmicHero - Three.js cinematic hero with starfield, nebula, mountain parallax.
 * Noir & Gold palette: gold accents over deep cosmic black.
 */
export default function CosmicHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const smoothCameraPos = useRef({ x: 0, y: 30, z: 100 });

  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const totalSections = 2;

  const threeRefs = useRef<any>({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    stars: [],
    nebula: null,
    mountains: [],
    animationId: null,
  });

  useEffect(() => {
    const refs = threeRefs.current;

    const createStarField = () => {
      const starCount = 5000;
      for (let i = 0; i < 3; i++) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);
        for (let j = 0; j < starCount; j++) {
          const radius = 200 + Math.random() * 800;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);
          positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[j * 3 + 2] = radius * Math.cos(phi);
          const color = new THREE.Color();
          const c = Math.random();
          if (c < 0.7) color.setHSL(0, 0, 0.8 + Math.random() * 0.2);
          else if (c < 0.95) color.setHSL(0.12, 0.7, 0.7); // gold tint
          else color.setHSL(0.6, 0.5, 0.8);
          colors[j * 3] = color.r;
          colors[j * 3 + 1] = color.g;
          colors[j * 3 + 2] = color.b;
          sizes[j] = Math.random() * 2 + 0.5;
        }
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
          uniforms: { time: { value: 0 }, depth: { value: i } },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform float depth;
            void main() {
              vColor = color;
              vec3 pos = position;
              float angle = time * 0.05 * (1.0 - depth * 0.3);
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              pos.xy = rot * pos.xy;
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
              gl_FragColor = vec4(vColor, opacity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        const stars = new THREE.Points(geometry, material);
        refs.scene.add(stars);
        refs.stars.push(stars);
      }
    };

    const createNebula = () => {
      const geometry = new THREE.PlaneGeometry(8000, 4000, 100, 100);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0xc9a84c) }, // gold
          color2: { value: new THREE.Color(0x6b3a8c) }, // royal purple
          opacity: { value: 0.35 },
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;
          void main() {
            vUv = uv;
            vec3 pos = position;
            float elevation = sin(pos.x * 0.01 + time) * cos(pos.y * 0.01 + time) * 20.0;
            pos.z += elevation;
            vElevation = elevation;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float opacity;
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;
          void main() {
            float mixFactor = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time);
            vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);
            float alpha = opacity * (1.0 - length(vUv - 0.5) * 2.0);
            alpha *= 1.0 + vElevation * 0.01;
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const nebula = new THREE.Mesh(geometry, material);
      nebula.position.z = -1050;
      refs.scene.add(nebula);
      refs.nebula = nebula;
    };

    const createMountains = () => {
      const layers = [
        { distance: -50, height: 60, color: 0x0a0a0a, opacity: 1 },
        { distance: -100, height: 80, color: 0x1a1410, opacity: 0.85 },
        { distance: -150, height: 100, color: 0x2a1f12, opacity: 0.65 },
        { distance: -200, height: 120, color: 0x3d2a18, opacity: 0.45 },
      ];
      layers.forEach((layer, index) => {
        const points: THREE.Vector2[] = [];
        const segments = 50;
        for (let i = 0; i <= segments; i++) {
          const x = (i / segments - 0.5) * 1000;
          const y =
            Math.sin(i * 0.1) * layer.height +
            Math.sin(i * 0.05) * layer.height * 0.5 +
            Math.random() * layer.height * 0.2 -
            100;
          points.push(new THREE.Vector2(x, y));
        }
        points.push(new THREE.Vector2(5000, -300));
        points.push(new THREE.Vector2(-5000, -300));

        const shape = new THREE.Shape(points);
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          side: THREE.DoubleSide,
        });
        const mountain = new THREE.Mesh(geometry, material);
        mountain.position.z = layer.distance;
        mountain.position.y = layer.distance;
        mountain.userData = { baseZ: layer.distance, index };
        refs.scene.add(mountain);
        refs.mountains.push(mountain);
      });
      refs.locations = refs.mountains.map((m: any) => m.position.z);
    };

    const createAtmosphere = () => {
      const geometry = new THREE.SphereGeometry(600, 32, 32);
      const material = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          uniform float time;
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 atmosphere = vec3(0.79, 0.66, 0.30) * intensity;
            float pulse = sin(time * 2.0) * 0.1 + 0.9;
            atmosphere *= pulse;
            gl_FragColor = vec4(atmosphere, intensity * 0.25);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
      });
      refs.scene.add(new THREE.Mesh(geometry, material));
    };

    const animate = () => {
      refs.animationId = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;
      refs.stars.forEach((s: any) => {
        if (s.material.uniforms) s.material.uniforms.time.value = time;
      });
      if (refs.nebula?.material.uniforms) {
        refs.nebula.material.uniforms.time.value = time * 0.5;
      }
      if (refs.camera && refs.targetCameraX !== undefined) {
        const k = 0.05;
        smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * k;
        smoothCameraPos.current.y += (refs.targetCameraY - smoothCameraPos.current.y) * k;
        smoothCameraPos.current.z += (refs.targetCameraZ - smoothCameraPos.current.z) * k;
        const floatX = Math.sin(time * 0.1) * 2;
        const floatY = Math.cos(time * 0.15) * 1;
        refs.camera.position.x = smoothCameraPos.current.x + floatX;
        refs.camera.position.y = smoothCameraPos.current.y + floatY;
        refs.camera.position.z = smoothCameraPos.current.z;
        refs.camera.lookAt(0, 10, -600);
      }
      refs.mountains.forEach((m: any, i: number) => {
        const f = 1 + i * 0.5;
        m.position.x = Math.sin(time * 0.1) * 2 * f;
        m.position.y = 50 + Math.cos(time * 0.15) * 1 * f;
      });
      if (refs.composer) refs.composer.render();
    };

    // Init
    refs.scene = new THREE.Scene();
    refs.scene.fog = new THREE.FogExp2(0x000000, 0.00025);
    refs.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    refs.camera.position.z = 100;
    refs.camera.position.y = 20;

    refs.renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current!,
      antialias: true,
      alpha: true,
    });
    refs.renderer.setSize(window.innerWidth, window.innerHeight);
    refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    refs.renderer.toneMappingExposure = 0.5;

    refs.composer = new EffectComposer(refs.renderer);
    refs.composer.addPass(new RenderPass(refs.scene, refs.camera));
    refs.composer.addPass(
      new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.8, 0.4, 0.85)
    );

    createStarField();
    createNebula();
    createMountains();
    createAtmosphere();
    animate();
    setIsReady(true);

    const handleResize = () => {
      if (refs.camera && refs.renderer && refs.composer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight;
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
        refs.composer.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      window.removeEventListener("resize", handleResize);
      refs.stars.forEach((s: any) => {
        s.geometry.dispose();
        s.material.dispose();
      });
      refs.mountains.forEach((m: any) => {
        m.geometry.dispose();
        m.material.dispose();
      });
      if (refs.nebula) {
        refs.nebula.geometry.dispose();
        refs.nebula.material.dispose();
      }
      if (refs.renderer) refs.renderer.dispose();
    };
  }, []);

  // GSAP intro
  useEffect(() => {
    if (!isReady) return;
    gsap.set([menuRef.current, titleRef.current, subtitleRef.current, scrollProgressRef.current], {
      visibility: "visible",
    });
    const tl = gsap.timeline();
    if (menuRef.current) tl.from(menuRef.current, { x: -100, opacity: 0, duration: 1, ease: "power3.out" });
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll(".title-char");
      tl.from(chars, { y: 200, opacity: 0, duration: 1.5, stagger: 0.05, ease: "power4.out" }, "-=0.5");
    }
    if (subtitleRef.current) {
      const lines = subtitleRef.current.querySelectorAll(".subtitle-line");
      tl.from(lines, { y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out" }, "-=0.8");
    }
    if (scrollProgressRef.current) {
      tl.from(scrollProgressRef.current, { opacity: 0, y: 50, duration: 1, ease: "power2.out" }, "-=0.5");
    }
    return () => {
      tl.kill();
    };
  }, [isReady]);

  // Scroll camera control - only while hero is in view
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const heroHeight = container.offsetHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(scrolled / heroHeight, 1);
      setScrollProgress(progress);
      const newSection = Math.floor(progress * totalSections);
      setCurrentSection(newSection);

      const refs = threeRefs.current;
      if (!refs.camera) return;
      const totalProgress = progress * totalSections;
      const sectionProgress = totalProgress % 1;

      const cameraPositions = [
        { x: 0, y: 30, z: 300 },
        { x: 0, y: 40, z: -50 },
        { x: 0, y: 50, z: -700 },
      ];
      const currentPos = cameraPositions[newSection] || cameraPositions[0];
      const nextPos = cameraPositions[newSection + 1] || currentPos;
      refs.targetCameraX = currentPos.x + (nextPos.x - currentPos.x) * sectionProgress;
      refs.targetCameraY = currentPos.y + (nextPos.y - currentPos.y) * sectionProgress;
      refs.targetCameraZ = currentPos.z + (nextPos.z - currentPos.z) * sectionProgress;

      refs.mountains.forEach((mountain: any, i: number) => {
        if (progress > 0.7) mountain.position.z = 600000;
        else mountain.position.z = refs.locations[i];
      });
      if (refs.nebula && refs.mountains[3]) {
        refs.nebula.position.z = refs.mountains[3].position.z;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const splitTitle = (text: string) =>
    text.split("").map((ch, i) => (
      <span key={i} className="title-char inline-block">
        {ch === " " ? "\u00A0" : ch}
      </span>
    ));

  return (
    <div
      ref={containerRef}
      className="cosmic-hero relative w-full"
      style={{ height: "200vh", background: "#000" }}
    >
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />

      {/* Sticky content layer */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center" style={{ zIndex: 2 }}>
        <div
          ref={menuRef}
          className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6"
          style={{ visibility: "hidden" }}
        >
          <div className="flex flex-col gap-1.5">
            <span className="block w-6 h-px bg-[#c9a84c]" />
            <span className="block w-6 h-px bg-[#c9a84c]" />
            <span className="block w-6 h-px bg-[#c9a84c]" />
          </div>
          <div
            className="text-xs tracking-[0.4em] text-[#c9a84c]/70"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            EMPIRE
          </div>
        </div>

        <div className="text-center px-6 max-w-5xl">
          <h1
            ref={titleRef}
            className="font-display font-bold tracking-tight text-white"
            style={{
              fontSize: "clamp(3.5rem, 12vw, 10rem)",
              lineHeight: 0.9,
              textShadow: "0 0 60px rgba(201,168,76,0.4)",
            }}
          >
            {currentSection === 0 && splitTitle("EMPIRE")}
            {currentSection === 1 && splitTitle("COSMOS")}
            {currentSection >= 2 && splitTitle("INFINITY")}
          </h1>
          <div ref={subtitleRef} className="mt-8 space-y-1" style={{ visibility: "hidden" }}>
            <p className="subtitle-line text-base md:text-xl text-white/70 font-light tracking-wide">
              Dove la visione incontra la realtà,
            </p>
            <p className="subtitle-line text-base md:text-xl text-[#c9a84c] font-light tracking-wide">
              costruiamo l'impero del tuo business.
            </p>
          </div>
        </div>

        <div
          ref={scrollProgressRef}
          className="absolute bottom-8 right-8 flex items-center gap-4"
          style={{ visibility: "hidden" }}
        >
          <div className="text-[10px] tracking-[0.4em] text-[#c9a84c]/70">SCROLL</div>
          <div className="w-24 h-px bg-white/20 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-[#c9a84c]"
              style={{ width: `${scrollProgress * 100}%`, transition: "width .15s linear" }}
            />
          </div>
          <div className="text-[10px] tracking-[0.3em] text-white/60 tabular-nums">
            {String(currentSection).padStart(2, "0")} / {String(totalSections).padStart(2, "0")}
          </div>
        </div>
      </div>
    </div>
  );
}
