/* eslint-disable */
'use client'
/**
 * LogisticsTunnel.tsx
 * ---------------------------------------------------------------------------
 * Act 3: a photoreal logistics pipeline seen from inside.
 *   - Frosted glass shell (MeshPhysicalMaterial transmission, roughness for frost)
 *   - Brushed-steel structural ribs (anisotropy) + floor plate that receives shadows
 *   - Three data conduits with restrained cool-white emissive cores
 *   - Metal data nodes with ring collars, and parcels streaming along the conduits
 * Built far from the globe (TUNNEL_ORIGIN) so it can stay mounted; shaders are
 * pre-compiled on mount to avoid a hitch at the hidden cut.
 * ---------------------------------------------------------------------------
 */
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { NAVY, TUNNEL_LENGTH as L, TUNNEL_ORIGIN, TUNNEL_RADIUS as R, useSequence } from '@/lib/sequence'

const RIB_SPACING = 8
const RIB_COUNT = Math.floor(L / RIB_SPACING)
const LANE_ANGLES = [-50, 50, 180].map((d) => THREE.MathUtils.degToRad(d)) // measured from the tunnel bottom
const LANE_RADIUS = R - 0.65
const laneXY = (a: number): [number, number] => [Math.sin(a) * LANE_RADIUS, -Math.cos(a) * LANE_RADIUS]
const NODE_SPACING = 30
const NODES = Math.floor(L / NODE_SPACING) * LANE_ANGLES.length
const PARCELS = 54
const PARCEL_SPEED = 6 // units / second, flowing toward the camera

/** Shared brushed-steel material (anisotropy needs three >= r153). */
const Steel = (p: JSX.IntrinsicElements['meshPhysicalMaterial']) => (
  <meshPhysicalMaterial color="#9aa3ad" metalness={1} roughness={0.38} anisotropy={0.7} clearcoat={0.15} {...p} />
)

export function LogisticsTunnel() {
  const { gl, scene, camera } = useThree()
  const phase = useSequence((s) => s.phase)
  const ribs = useRef<THREE.InstancedMesh>(null)
  const nodes = useRef<THREE.InstancedMesh>(null)
  const collars = useRef<THREE.InstancedMesh>(null)
  const parcels = useRef<THREE.InstancedMesh>(null)
  const sun = useRef<THREE.DirectionalLight>(null)
  const sunTarget = useMemo(() => new THREE.Object3D(), [])
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Static instance placement (ribs, nodes, collars)
  useLayoutEffect(() => {
    for (let i = 0; i < RIB_COUNT; i++) {
      dummy.position.set(0, 0, -i * RIB_SPACING - 4)
      dummy.updateMatrix()
      ribs.current!.setMatrixAt(i, dummy.matrix)
    }
    for (let i = 0; i < NODES; i++) {
      const lane = i % LANE_ANGLES.length
      const [x, y] = laneXY(LANE_ANGLES[lane])
      const z = -(Math.floor(i / LANE_ANGLES.length) * NODE_SPACING + 12 + lane * 9)
      dummy.position.set(x, y, z)
      dummy.updateMatrix()
      nodes.current!.setMatrixAt(i, dummy.matrix)
      collars.current!.setMatrixAt(i, dummy.matrix)
    }
    ;[ribs, nodes, collars].forEach((r) => (r.current!.instanceMatrix.needsUpdate = true))
  }, [dummy])

  // Fog only while inside the tunnel (adds atmospheric depth, matches the navy background)
  useEffect(() => {
    scene.fog = phase === 'tunnel' ? new THREE.Fog(NAVY, 14, 150) : null
    return () => { scene.fog = null }
  }, [phase, scene])

  // Pre-warm shaders (incl. the transmission pass) so the cut doesn't stutter
  useEffect(() => { gl.compile(scene, camera) }, [gl, scene, camera])

  useFrame(({ clock, camera: cam }) => {
    // Parcels stream along the conduits and wrap around
    const pm = parcels.current
    if (pm) {
      const t = clock.elapsedTime
      for (let i = 0; i < PARCELS; i++) {
        const d = ((((i / PARCELS) * L - t * PARCEL_SPEED) % L) + L) % L
        const lane = i % LANE_ANGLES.length
        const [x, y] = laneXY(LANE_ANGLES[lane])
        dummy.position.set(x, y + (lane === 2 ? -0.34 : 0.34), -d)
        dummy.updateMatrix()
        pm.setMatrixAt(i, dummy.matrix)
      }
      pm.instanceMatrix.needsUpdate = true
    }
    // Shadow-casting key light travels with the camera
    const s = sun.current
    if (s && phase === 'tunnel') {
      s.position.set(TUNNEL_ORIGIN.x + 3, TUNNEL_ORIGIN.y + 12, cam.position.z + 6)
      sunTarget.position.set(TUNNEL_ORIGIN.x, TUNNEL_ORIGIN.y - 4, cam.position.z - 6)
    }
  })

  return (
    <>
      <primitive object={sunTarget} />
      <directionalLight
        ref={sun} target={sunTarget} color="#dfe9f7" intensity={2.2} castShadow
        shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} shadow-normalBias={0.04}
        shadow-camera-near={1} shadow-camera-far={60}
        shadow-camera-left={-16} shadow-camera-right={16} shadow-camera-top={16} shadow-camera-bottom={-16}
      />

      <group position={TUNNEL_ORIGIN}>
        {/* Frosted glass shell: transmission + roughness = frosted look */}
        <mesh position={[0, 0, -L / 2]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[R, R, L, 96, 1, true]} />
          <meshPhysicalMaterial
            transmission={1} thickness={0.8} ior={1.45} roughness={0.28} metalness={0}
            clearcoat={1} clearcoatRoughness={0.05}
            attenuationColor="#7fa6d6" attenuationDistance={12}
            side={THREE.DoubleSide} envMapIntensity={1.2}
          />
        </mesh>

        {/* Structural ribs */}
        <instancedMesh ref={ribs} args={[undefined, undefined, RIB_COUNT]} castShadow receiveShadow frustumCulled={false}>
          <torusGeometry args={[R, 0.16, 24, 96]} />
          <Steel />
        </instancedMesh>

        {/* Floor plate (grounds the scene, receives rib shadows, reflects the HDRI) */}
        <mesh position={[0, -R * 0.66, -L / 2]} receiveShadow>
          <boxGeometry args={[R * 1.5, 0.12, L]} />
          <Steel color="#6c747e" roughness={0.5} metalness={0.9} />
        </mesh>

        {/* Data conduits: brushed sleeve + restrained emissive core (only thing Bloom picks up) */}
        {LANE_ANGLES.map((a, i) => {
          const [x, y] = laneXY(a)
          return (
            <group key={i} position={[x, y, -L / 2]} rotation-x={Math.PI / 2}>
              <mesh castShadow>
                <cylinderGeometry args={[0.16, 0.16, L, 32, 1, true]} />
                <Steel roughness={0.25} side={THREE.DoubleSide} />
              </mesh>
              <mesh>
                <cylinderGeometry args={[0.07, 0.07, L, 16]} />
                <meshPhysicalMaterial color="#cfe3fa" emissive="#a9cdf5" emissiveIntensity={1.7} roughness={0.4} />
              </mesh>
            </group>
          )
        })}

        {/* Data nodes: chrome spheres with machined ring collars */}
        <instancedMesh ref={nodes} args={[undefined, undefined, NODES]} castShadow receiveShadow frustumCulled={false}>
          <sphereGeometry args={[0.5, 48, 32]} />
          <meshPhysicalMaterial color="#d8dee6" metalness={1} roughness={0.18} clearcoat={1} clearcoatRoughness={0.05} />
        </instancedMesh>
        <instancedMesh ref={collars} args={[undefined, undefined, NODES]} castShadow frustumCulled={false}>
          <torusGeometry args={[0.72, 0.045, 16, 64]} />
          <Steel color="#b7c0ca" roughness={0.3} />
        </instancedMesh>

        {/* Parcels streaming through the pipeline */}
        <instancedMesh ref={parcels} args={[undefined, undefined, PARCELS]} castShadow frustumCulled={false}>
          <boxGeometry args={[0.7, 0.4, 0.55]} />
          <meshPhysicalMaterial color="#c9ced6" metalness={0.9} roughness={0.3} clearcoat={0.5} clearcoatRoughness={0.2} />
        </instancedMesh>
      </group>
    </>
  )
}
