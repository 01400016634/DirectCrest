'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const scrollState = { y: 0, max: 1, pr: 0 };
if (typeof window !== 'undefined') {
  const updateScroll = () => {
    scrollState.y = window.scrollY;
    scrollState.max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    scrollState.pr = scrollState.y / scrollState.max;
  };
  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', updateScroll, { passive: true });
  // Initial check
  setTimeout(updateScroll, 50);
}

// ----------------------------------------------------------------------
// 1. Math & Data Generation
// ----------------------------------------------------------------------
const R = 5;
const ll = (a: number, b: number, r = R) => {
  const p = a * Math.PI / 180, l = b * Math.PI / 180;
  return new THREE.Vector3(r * Math.cos(p) * Math.sin(l), r * Math.sin(p), r * Math.cos(p) * Math.cos(l));
};

const LAND = [
  [45, -100, 25, 35], [-15, -60, 28, 18], [50, 15, 12, 25],
  [5, 20, 30, 22], [45, 90, 22, 50], [22, 78, 10, 10],
  [5, 110, 8, 15], [-25, 135, 12, 20]
];
const inL = (a: number, b: number) => LAND.some(l => ((a - l[0]) / l[2]) ** 2 + ((b - l[1]) / l[3]) ** 2 < 1);
const inC = (a: number, b: number) => ((a - 33) / 13) ** 2 + ((b - 104) / 16) ** 2 < 1;

const A = ll(30, 35, 1).normalize();
const B = ll(23.1, 113.3, 1).normalize();
const Om = Math.acos(A.dot(B));

const getPos = (t: number) => {
  const v = A.clone().multiplyScalar(Math.sin((1 - t) * Om))
    .add(B.clone().multiplyScalar(Math.sin(t * Om)))
    .divideScalar(Math.sin(Om));
  return v.multiplyScalar(R + 0.25 + Math.sin(Math.PI * t) * 0.7);
};

const ease = (k: number) => k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;

// ----------------------------------------------------------------------
// 2. React Components for 3D Elements
// ----------------------------------------------------------------------

function Stars() {
  const [st] = useState(() => {
    const arr = new Float32Array(900); // 300 stars
    for (let i = 0; i < 900; i++) arr[i] = (Math.random() - 0.5) * 600;
    return arr;
  });

  const ref = useRef<THREE.Points>(null);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={300} array={st} itemSize={3} args={[st, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.8} color={0x9fd8ff} />
    </points>
  );
}

function Globe() {
  const { pp, pc } = useMemo(() => {
    const ppArr: number[] = [], pcArr: number[] = [];
    for (let a = -80; a <= 80; a += 2.5) {
      const s = Math.max(2.5, 2.5 / Math.cos(a * Math.PI / 180));
      for (let b = -180; b < 180; b += s) {
        if (!inL(a, b)) continue;
        const v = ll(a, b, R + 0.01);
        ppArr.push(v.x, v.y, v.z);
        if (inC(a, b)) pcArr.push(1, 0.35, 0.3);
        else pcArr.push(0.2, 0.9, 1);
      }
    }
    return { pp: new Float32Array(ppArr), pc: new Float32Array(pcArr) };
  }, []);

  const mkPos = useMemo(() => B.clone().multiplyScalar(R + 0.03), []);
  const mkLookAt = useMemo(() => B.clone().multiplyScalar(20), []);
  const mkRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (mkRef.current) {
      mkRef.current.scale.setScalar(1 + 0.5 * Math.sin(t * 5));
      if (!Array.isArray(mkRef.current.material)) {
        mkRef.current.material.opacity = 0.5 + 0.5 * Math.sin(t * 5);
      }
    }
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[R - 0.02, 32, 24]} />
        <meshBasicMaterial color={0x061a3a} />
      </mesh>
      <mesh>
        <sphereGeometry args={[R, 16, 12]} />
        <meshBasicMaterial color={0x1b4d8a} wireframe transparent opacity={0.25} />
      </mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={pp.length / 3} array={pp} itemSize={3} args={[pp, 3]} />
          <bufferAttribute attach="attributes-color" count={pc.length / 3} array={pc} itemSize={3} args={[pc, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.07} vertexColors />
      </points>
      <mesh ref={mkRef} position={mkPos} onUpdate={self => self.lookAt(mkLookAt)}>
        <ringGeometry args={[0.15, 0.22, 32]} />
        <meshBasicMaterial color={0xff3fa4} side={THREE.DoubleSide} transparent />
      </mesh>
    </group>
  );
}

function Airplane({ phase, t0 }: { phase: string, t0: number }) {
  const planeRef = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Line>(null);
  const trA = useMemo(() => new Float32Array(300 * 3), []);
  const trC = useRef(0);

  useFrame(({ clock }) => {
    if (!planeRef.current) return;
    const now = clock.getElapsedTime() * 1000;

    if (phase === 'intro') {
      const k = Math.min(1, (now - t0) / 9000);
      const e = ease(k);
      const p = getPos(e);

      planeRef.current.position.copy(p);
      planeRef.current.up.copy(p).normalize();
      planeRef.current.lookAt(getPos(Math.min(1, e + 0.01)));

      if (trailRef.current && trC.current < 300 && k < 1) {
        trA[trC.current * 3] = p.x;
        trA[trC.current * 3 + 1] = p.y;
        trA[trC.current * 3 + 2] = p.z;
        trC.current++;
        trailRef.current.geometry.setDrawRange(0, trC.current);
        trailRef.current.geometry.attributes.position.needsUpdate = true;
      }
    } else {
      const t = clock.getElapsedTime();
      const TL = 440;
      const camZ = -scrollState.pr * (TL - 30);

      planeRef.current.position.set(Math.sin(t) * 0.5, -1.6 + Math.sin(t * 2) * 0.1, camZ - 9);
      planeRef.current.lookAt(planeRef.current.position.x, planeRef.current.position.y, camZ - 100);
      planeRef.current.up.set(0, 1, 0);
      planeRef.current.scale.setScalar(0.9);
    }
  });

  return (
    <>
      {/* @ts-ignore */}
      <line ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={300} array={trA} itemSize={3} args={[trA, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={0xffb347} />
      </line>
      <group ref={planeRef} scale={1.3}>
        <mesh rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.06, 0.05, 0.5, 12]} />
          <meshBasicMaterial color={0xffffff} />
        </mesh>
        <mesh rotation-x={Math.PI / 2} position={[0, 0, 0.31]}>
          <coneGeometry args={[0.06, 0.14, 12]} />
          <meshBasicMaterial color={0xff3fa4} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.6, 0.01, 0.14]} />
          <meshBasicMaterial color={0xff3fa4} />
        </mesh>
        <mesh position={[0, 0, -0.22]}>
          <boxGeometry args={[0.24, 0.01, 0.08]} />
          <meshBasicMaterial color={0xff3fa4} />
        </mesh>
        <mesh position={[0, 0.06, -0.22]}>
          <boxGeometry args={[0.01, 0.12, 0.08]} />
          <meshBasicMaterial color={0xff3fa4} />
        </mesh>
      </group>
    </>
  );
}

function Tunnel() {
  const RN = 30, TL = 440;
  const ringsRef = useRef<THREE.Mesh[]>([]);

  // Pre-calculate line vertices to avoid recreation on re-render
  const lines = useMemo(() => {
    return Array.from({ length: 12 }).map((_, k) => {
      const a = (k / 12) * Math.PI * 2;
      return new Float32Array([
        Math.cos(a) * 7, Math.sin(a) * 7, 10,
        Math.cos(a) * 7, Math.sin(a) * 7, -TL - 10
      ]);
    });
  }, [TL]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ringsRef.current.forEach((r, i) => {
      if (!r) return;
      const w = 0.5 + 0.5 * Math.sin(t * 3 - i * 0.35);
      if (!Array.isArray(r.material)) {
        r.material.opacity = 0.25 + 0.75 * w;
        (r.material as THREE.MeshBasicMaterial).color.setHSL(0.5 + 0.28 * w + i * 0.002, 1, 0.5);
      }
      r.scale.setScalar(1 + 0.06 * w);
    });
  });

  return (
    <group>
      {/* Rings */}
      {Array.from({ length: RN }).map((_, i) => (
        <mesh key={i} position={[0, 0, -i * (TL / RN)]} ref={el => { if (el) ringsRef.current[i] = el; }}>
          <torusGeometry args={[7, 0.09, 4, 32]} />
          <meshBasicMaterial color={0x2de2ff} transparent />
        </mesh>
      ))}
      {/* Lines */}
      {lines.map((lineData, k) => (
        <line key={`l-${k}`}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={2} array={lineData} itemSize={3} args={[lineData, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color={0x2a6bff} transparent opacity={0.35} />
        </line>
      ))}
    </group>
  );
}

function SceneContent({ onIntroComplete, skipIntro = false }: { onIntroComplete: () => void, skipIntro?: boolean }) {
  const { camera } = useThree();
  const [phase, setPhase] = useState(skipIntro ? 'tunnel' : 'intro');
  const [t0] = useState(() => (typeof performance !== 'undefined' ? performance.now() : 0));
  const camZ = useRef(0);
  const ptr = useRef(0);

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      ptr.current = (e.clientX / window.innerWidth) - 0.5;
    };
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);

  useFrame(({ clock }) => {
    const now = clock.getElapsedTime() * 1000;
    const t = clock.getElapsedTime();

    if (phase === 'intro') {
      const k = Math.min(1, (now - t0) / 9000);
      const e = ease(k);
      const p = getPos(e);
      const n = p.clone().normalize();
      const d = R + 4.2 - e * 1.2;

      camera.position.lerp(n.clone().multiplyScalar(d).add(new THREE.Vector3(0, 1.2, 0)), 0.06);
      camera.lookAt(p);

      if (k >= 1) {
        setPhase('tunnel');
        onIntroComplete();
      }
    } else {
      const TL = 440;

      camZ.current += (-scrollState.pr * (TL - 30) - camZ.current) * 0.07;

      camera.position.set(
        Math.sin(t * 0.5) * 0.4 + ptr.current * 1.2,
        Math.cos(t * 0.4) * 0.3,
        camZ.current
      );
      camera.lookAt(ptr.current * 2, 0, camZ.current - 20);
    }
  });

  return (
    <>
      {phase === 'tunnel' && <fog attach="fog" args={[0x04060f, 0.03]} />}
      <Stars />
      {phase === 'intro' && <Globe />}
      <Airplane phase={phase} t0={t0} />
      {phase === 'tunnel' && <Tunnel />}
    </>
  );
}

export default function LogisticsBackground({ onIntroComplete, skipIntro = false }: { onIntroComplete: () => void, skipIntro?: boolean }) {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-[#04060f] pointer-events-none">
      <Canvas
        camera={{ position: [0, 3, 12], fov: 60 }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        dpr={1}
      >
        <color attach="background" args={['#04060f']} />
        <SceneContent onIntroComplete={onIntroComplete} skipIntro={skipIntro} />
      </Canvas>
    </div>
  );
}
