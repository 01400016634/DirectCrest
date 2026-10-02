'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, Html, ContactShadows, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Star } from 'lucide-react';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ----------------------------------------------------------------------
// 1. Mouse-Tracked Lighting Component
// ----------------------------------------------------------------------
function MouseLighting() {
  const lightRef = useRef<THREE.SpotLight>(null);
  const { viewport } = useThree();

  useFrame(({ pointer }) => {
    if (lightRef.current) {
      // Smoothly interpolate the light position towards the mouse pointer
      const targetX = (pointer.x * viewport.width) / 2;
      const targetY = (pointer.y * viewport.height) / 2;
      
      lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, targetX, 0.1);
      lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, targetY + 5, 0.1);
    }
  });

  return (
    <spotLight
      ref={lightRef}
      position={[0, 5, 10]}
      angle={0.4}
      penumbra={1}
      intensity={80}
      color="#ffffff"
      castShadow
      shadow-bias={-0.0001}
    />
  );
}

// ----------------------------------------------------------------------
// 2. 3D Hotspot with Glassmorphism Tooltip
// ----------------------------------------------------------------------
function Hotspot({ position, text, author }: { position: [number, number, number], text: string, author: string }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.scale.setScalar(1 + Math.sin(t * 4) * 0.1);
    }
  });

  return (
    <group position={position}>
      <mesh 
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshBasicMaterial color={hovered ? "#3b82f6" : "#ffffff"} />
      </mesh>
      
      {/* Glow Effect */}
      <mesh>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      <Html
        position={[0, 0.3, 0]}
        center
        zIndexRange={[100, 0]}
        style={{
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: hovered ? 1 : 0,
          transform: `scale(${hovered ? 1 : 0.8}) translateY(${hovered ? 0 : '10px'})`,
          pointerEvents: hovered ? 'auto' : 'none'
        }}
      >
        <div className="bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 w-64 shadow-2xl text-left">
          <div className="flex text-blue-500 mb-2">
            {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
          </div>
          <p className="text-gray-200 text-sm font-medium leading-relaxed italic">&quot;{text}&quot;</p>
          <p className="text-gray-400 text-xs font-bold mt-2 tracking-wider uppercase">— {author}</p>
        </div>
      </Html>
    </group>
  );
}

// ----------------------------------------------------------------------
// 3. The Explodable Product (Sleek Wireless Earbud)
// ----------------------------------------------------------------------
function ExplodableEarbud() {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const tipRef = useRef<THREE.Mesh>(null);
  const driverRef = useRef<THREE.Mesh>(null);

  // High-end premium materials
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: '#0f0f0f',
    metalness: 0.9,
    roughness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  });

  const tipMaterial = new THREE.MeshPhysicalMaterial({
    color: '#1a1a1a',
    metalness: 0.1,
    roughness: 0.6,
    transmission: 0.5,
    thickness: 0.5,
  });

  const goldMaterial = new THREE.MeshPhysicalMaterial({
    color: '#fbbf24',
    metalness: 1,
    roughness: 0.2,
  });

  useEffect(() => {
    if (!groupRef.current || !tipRef.current || !driverRef.current) return;

    // Scroll-Triggered Explosion and Guided Rotation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero-scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // Smooth scrubbing
      }
    });

    // 360 degree rotation on scroll
    tl.to(groupRef.current.rotation, {
      y: Math.PI * 2,
      ease: "none",
      duration: 1
    }, 0);

    // Explode outward (temporarily separate components)
    tl.to(tipRef.current.position, {
      x: -1.5,
      ease: "power2.inOut",
      duration: 0.4
    }, 0.2); // Starts a bit into the scroll

    tl.to(driverRef.current.position, {
      x: -0.8,
      ease: "power2.inOut",
      duration: 0.4
    }, 0.2);

    // Snap back together
    tl.to(tipRef.current.position, {
      x: -0.6, // Original position
      ease: "power2.inOut",
      duration: 0.4
    }, 0.6);

    tl.to(driverRef.current.position, {
      x: -0.4, // Original position
      ease: "power2.inOut",
      duration: 0.4
    }, 0.6);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <group ref={groupRef} scale={1.5}>
      {/* Main Body */}
      <mesh ref={bodyRef} material={bodyMaterial} castShadow receiveShadow>
        <capsuleGeometry args={[0.5, 1, 32, 32]} />
      </mesh>

      {/* Acoustic Driver / Golden Connector */}
      <mesh ref={driverRef} position={[-0.4, 0.4, 0]} rotation={[0, 0, Math.PI / 2]} material={goldMaterial} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
        <Hotspot 
          position={[-0.1, 0.3, 0]} 
          text="The custom acoustic driver delivers unbelievable bass response without distortion." 
          author="AudioPhile Mag" 
        />
      </mesh>

      {/* Silicone Tip */}
      <mesh ref={tipRef} position={[-0.6, 0.4, 0]} material={tipMaterial} castShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <Hotspot 
          position={[-0.4, 0.2, 0]} 
          text="Incredibly soft silicone seal. It feels like wearing nothing at all." 
          author="Sarah T." 
        />
      </mesh>

      <Hotspot 
        position={[0.2, -0.6, 0.4]} 
        text="The obsidian finish is flawless. Doesn't attract fingerprints at all." 
        author="TechReviewer" 
      />
    </group>
  );
}

// ----------------------------------------------------------------------
// 4. Main 3D Canvas App
// ----------------------------------------------------------------------
function Hero3DScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 8], fov: 40 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.2} />
      <MouseLighting />
      <Environment preset="studio" />

      {/* PresentationControls allows the user to drag-to-rotate the object within limits */}
      <PresentationControls 
        global={false} // Spin globally or by dragging model
        cursor={true}
        snap={true} // Snap-back to center (can be disabled)
        speed={1}
        zoom={1}
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 4, Math.PI / 4]} // Vertical limits
        azimuth={[-Infinity, Infinity]} // Horizontal limits
      >
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
          <ExplodableEarbud />
        </Float>
      </PresentationControls>

      <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2} far={4} color="#000000" />

      <EffectComposer disableNormalPass multisampling={4}>
        <Bloom luminanceThreshold={1} intensity={0.5} />
        <Noise opacity={0.02} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  );
}

// ----------------------------------------------------------------------
// 5. Next.js Page Wrapper with "Scrollytelling" Layout
// ----------------------------------------------------------------------
export default function PremiumProductHero() {
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    // Simulate live purchase notifications
    const interval = setInterval(() => {
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 5000);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white overflow-x-hidden selection:bg-blue-500/30">
      
      {/* Background Spatial Typography (fixed behind Canvas) */}
      <div className="fixed inset-0 flex items-center justify-center z-0 pointer-events-none opacity-20">
        <h1 className="text-[15vw] font-black tracking-tighter text-transparent uppercase bg-clip-text bg-gradient-to-b from-white to-[#0a0a0a]">
          OBSIDIAN
        </h1>
      </div>

      {/* Fixed 3D Canvas Layer */}
      <div className="fixed inset-0 z-10 pointer-events-auto">
        <Hero3DScene />
      </div>

      {/* Scrolling Content Container (Scrollytelling triggers) */}
      <div id="hero-scroll-container" className="relative z-20 pointer-events-none">
        
        {/* Section 1: Intro */}
        <section className="h-[100vh] flex flex-col justify-end p-8 md:p-24">
          <div className="max-w-2xl pointer-events-auto">
            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6 backdrop-blur-xl">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest">Next-Gen Audio</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
              Hear the unseen.
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-md">
              A meticulously engineered acoustic architecture. Hover over the nodes to see why critics are raving.
            </p>
          </div>
        </section>

        {/* Section 2: Exploded View Trigger Area */}
        <section className="h-[100vh] flex flex-col justify-center items-end p-8 md:p-24 text-right">
          <div className="max-w-xl pointer-events-auto">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Precision Inside.
            </h2>
            <p className="text-lg text-gray-400 font-light">
              Scroll down to reveal the custom gold-plated acoustic driver. Every component separated for your inspection.
            </p>
          </div>
        </section>

        {/* Section 3: Reassembly & Specs */}
        <section className="h-[100vh] flex flex-col justify-start p-8 md:p-24">
          <div className="max-w-xl pointer-events-auto">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 mt-32">
              Flawless Integration.
            </h2>
            <p className="text-lg text-gray-400 font-light mb-8">
              Snaps perfectly back into a seamless obsidian shell. Beautiful outside, powerful inside.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl p-6">
                <p className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-1">Battery</p>
                <p className="text-3xl font-black">48h</p>
              </div>
              <div className="border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl p-6">
                <p className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-1">Driver</p>
                <p className="text-3xl font-black">12mm</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Glassmorphism Navigation (Bottom) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto w-[90%] md:w-auto">
        <div className="flex items-center justify-between gap-8 bg-[#0a0a0a]/50 backdrop-blur-xl border border-white/10 rounded-full px-6 py-4 shadow-2xl">
          <div className="flex items-center gap-6 hidden md:flex">
            <a href="#features" className="text-sm font-bold tracking-wider text-gray-300 hover:text-white transition-colors uppercase">Features</a>
            <a href="#specs" className="text-sm font-bold tracking-wider text-gray-300 hover:text-white transition-colors uppercase">Specs</a>
          </div>
          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <span className="text-2xl font-black tracking-tight">$299</span>
            {/* Magnetic Button effect achieved via CSS transition on hover */}
            <button className="relative overflow-hidden group bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-wider text-sm transition-transform hover:scale-105 active:scale-95">
              <span className="relative z-10">Add to Cart</span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-400 to-blue-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Live Purchase Notification Toast */}
      <div 
        className={`fixed top-8 right-8 z-50 pointer-events-none transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${
          toastVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
        }`}
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">JD</span>
          </div>
          <div>
            <p className="text-sm text-gray-200 font-medium">John D. in London</p>
            <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">Purchased Obsidian Pro</p>
          </div>
        </div>
      </div>

    </div>
  );
}
