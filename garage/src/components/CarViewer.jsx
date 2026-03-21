import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Center } from '@react-three/drei'
import * as THREE from 'three'

function easeOutElastic(t) {
  const c4 = (2 * Math.PI) / 3
  return t === 0 ? 0 : t === 1 ? 1 :
    Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function Model({ modelPath, modelScale, meshCount, onAssembled }) {
  const { scene } = useGLTF(modelPath)
  const meshRefs = useRef([])
  const originalPositions = useRef([])
  const explodeDirections = useRef([])
  const clock = useRef(0)
  const assembled = useRef(false)
  const [ready, setReady] = useState(false)

  const isComplex = meshCount > 20
  const EXPLODE_DURATION = isComplex ? 1.0 : 0.8
  const PAUSE_DURATION = isComplex ? 0.4 : 0.3
  const ASSEMBLE_DURATION = isComplex ? 1.8 : 1.4
  const TOTAL = EXPLODE_DURATION + PAUSE_DURATION + ASSEMBLE_DURATION
  const MAX_DISPLACEMENT = isComplex ? 2.5 : 1.8

  useEffect(() => {
    const meshes = []
    scene.traverse((child) => {
      if (child.isMesh) {
        meshes.push(child)
      }
    })

    meshRefs.current = meshes
    originalPositions.current = meshes.map(m => m.position.clone())
    explodeDirections.current = meshes.map((_, i) => {
      const angle = (i / meshes.length) * Math.PI * 2
      const elevation = (Math.random() - 0.5) * Math.PI * 0.6
      return new THREE.Vector3(
        Math.cos(angle) * Math.cos(elevation),
        Math.sin(elevation),
        Math.sin(angle) * Math.cos(elevation)
      ).multiplyScalar(MAX_DISPLACEMENT)
    })

    setReady(true)
  }, [scene])

  useFrame((_, delta) => {
    if (!ready || assembled.current) return
    clock.current += delta

    const t = clock.current
    const meshes = meshRefs.current
    const originals = originalPositions.current
    const directions = explodeDirections.current

    meshes.forEach((mesh, i) => {
      const orig = originals[i]
      const dir = directions[i]

      if (t < EXPLODE_DURATION) {
        const progress = easeInOutCubic(t / EXPLODE_DURATION)
        mesh.position.set(
          orig.x + dir.x * progress,
          orig.y + dir.y * progress,
          orig.z + dir.z * progress
        )
      } else if (t < EXPLODE_DURATION + PAUSE_DURATION) {
        mesh.position.set(
          orig.x + dir.x,
          orig.y + dir.y,
          orig.z + dir.z
        )
      } else if (t < TOTAL) {
        const assembleT = (t - EXPLODE_DURATION - PAUSE_DURATION) / ASSEMBLE_DURATION
        const progress = easeOutElastic(assembleT)
        const remaining = 1 - progress
        mesh.position.set(
          orig.x + dir.x * remaining,
          orig.y + dir.y * remaining,
          orig.z + dir.z * remaining
        )
      } else {
        mesh.position.copy(orig)
        assembled.current = true
        onAssembled?.()
      }
    })
  })

  return (
    <Center>
      <primitive object={scene} scale={modelScale || 1} />
    </Center>
  )
}

function Loader({ teamColor }) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: `2px solid rgba(255,255,255,0.1)`,
        borderTop: `2px solid ${teamColor}`,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{
        fontFamily: 'Orbitron',
        fontSize: '0.6rem',
        color: teamColor,
        letterSpacing: '0.2em',
      }}>
        LOADING MODEL
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

export default function CarViewer({ modelPath, teamColor, modelScale, meshCount }) {
  const controlsRef = useRef()
  const [autoRotate, setAutoRotate] = useState(false)
  const [glowIntensity, setGlowIntensity] = useState(0)

  useEffect(() => {
    const isComplex = meshCount > 20
    const total = isComplex ? 3.2 : 2.5
    let elapsed = 0

    const interval = setInterval(() => {
      elapsed += 0.05

      if (elapsed < total * 0.35) {
        setGlowIntensity(elapsed / (total * 0.35))
      } else if (elapsed < total * 0.55) {
        setGlowIntensity(1)
      } else if (elapsed < total) {
        setGlowIntensity(1 - (elapsed - total * 0.55) / (total * 0.45))
      } else {
        setGlowIntensity(0)
        clearInterval(interval)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [modelPath, meshCount])

  const glowHex = Math.round(glowIntensity * 180).toString(16).padStart(2, '0')
  const glowHexSoft = Math.round(glowIntensity * 80).toString(16).padStart(2, '0')

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: glowIntensity > 0
    ? `inset 0 0 ${60 * glowIntensity}px ${teamColor}${Math.round(glowIntensity * 200).toString(16).padStart(2, '0')},
       inset 0 0 ${120 * glowIntensity}px ${teamColor}${Math.round(glowIntensity * 100).toString(16).padStart(2, '0')}`
    : 'none',
      transition: 'box-shadow 0.1s ease',
    }}>
      <Suspense fallback={<Loader teamColor={teamColor} />}>
        <Canvas
          camera={{ position: [0, 1, 6], fov: 45 }}
          style={{ width: '100%', height: '100%' , background: `radial-gradient(ellipse at center, ${teamColor}25 0%, #262626 100%)`}}
          gl = {{ alpha: true}}                 
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <directionalLight position={[-5, 3, -5]} intensity={0.4} />
          <pointLight position={[0, 4, 0]} intensity={0.6} color={teamColor} />
          <hemisphereLight skyColor="#ffffff" groundColor="#333333" intensity={0.8} />
          <pointLight position={[3, 2, 3]} intensity={0.4} color={teamColor} />
          <pointLight position={[-3, 2, -3]} intensity={0.4} color={teamColor} />

          <Model
            modelPath={modelPath}
            modelScale={modelScale}
            meshCount={meshCount}
            onAssembled={() => setAutoRotate(true)}
          />

          <OrbitControls
            ref={controlsRef}
            autoRotate={autoRotate}
            autoRotateSpeed={1.2}
            enablePan={false}
            enableZoom={true}
            minDistance={2}
            maxDistance={10}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 1.8}
          />
        </Canvas>
      </Suspense>
    </div>
  )
}