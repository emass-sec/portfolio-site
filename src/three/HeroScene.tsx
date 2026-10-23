import { Float, Icosahedron, Points, PointMaterial } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'

const ACCENT = '#38bdf8'

// Generated once per page load: an even spread of nodes on a thick spherical shell.
const positions = (() => {
  const count = 1200
  const data = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const r = 2.2 + Math.random() * 1.6
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    data[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    data[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    data[i * 3 + 2] = r * Math.cos(phi)
  }
  return data
})()

/** A slowly turning cloud of nodes, a loose nod to a network graph. */
function NodeField({ animate }: { animate: boolean }) {
  const group = useRef<Group>(null)

  useFrame((_, delta) => {
    if (!animate || !group.current) return
    group.current.rotation.y += delta * 0.05
    group.current.rotation.x += delta * 0.015
  })

  return (
    <group ref={group}>
      <Points positions={positions} stride={3}>
        <PointMaterial transparent color={ACCENT} size={0.025} sizeAttenuation depthWrite={false} opacity={0.8} />
      </Points>
    </group>
  )
}

function Core({ animate }: { animate: boolean }) {
  return (
    <Float speed={animate ? 1.5 : 0} rotationIntensity={animate ? 0.6 : 0} floatIntensity={animate ? 0.8 : 0}>
      <Icosahedron args={[1.2, 1]}>
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.35} />
      </Icosahedron>
    </Float>
  )
}

export default function HeroScene({ animate }: { animate: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 2]}
      frameloop={animate ? 'always' : 'demand'}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      aria-hidden="true"
    >
      <NodeField animate={animate} />
      <Core animate={animate} />
    </Canvas>
  )
}
