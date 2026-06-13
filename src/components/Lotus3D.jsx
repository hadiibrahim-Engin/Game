import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import styles from './Lotus3D.module.css'

function makePetal(geometry, material, { angle, radius, y, scale, tilt }) {
  const petal = new THREE.Mesh(geometry, material)
  petal.position.set(Math.sin(angle) * radius, y + Math.cos(angle) * radius, -Math.cos(angle) * 0.18)
  petal.rotation.set(tilt, 0, -angle)
  petal.scale.set(scale.x, scale.y, scale.z)
  return petal
}

export default function Lotus3D() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
    camera.position.set(0, 0.25, 6)

    const lotus = new THREE.Group()
    lotus.rotation.x = -0.35
    scene.add(lotus)

    scene.add(new THREE.AmbientLight(0xeaf8ff, 1.8))

    const keyLight = new THREE.DirectionalLight(0xffffff, 3)
    keyLight.position.set(2.6, 3.2, 4)
    scene.add(keyLight)

    const blueLight = new THREE.PointLight(0x69d8ff, 2.4, 9)
    blueLight.position.set(-2.8, -0.4, 3.4)
    scene.add(blueLight)

    const petalGeometry = new THREE.SphereGeometry(1, 36, 18)
    const baseGeometry = new THREE.SphereGeometry(1, 28, 14)
    const materials = [
      new THREE.MeshPhysicalMaterial({
        color: 0x8feaff,
        roughness: 0.36,
        metalness: 0.04,
        clearcoat: 0.45,
        clearcoatRoughness: 0.28,
      }),
      new THREE.MeshPhysicalMaterial({
        color: 0x3aa0ff,
        roughness: 0.34,
        metalness: 0.05,
        clearcoat: 0.55,
        clearcoatRoughness: 0.22,
      }),
      new THREE.MeshPhysicalMaterial({
        color: 0x1f6dff,
        roughness: 0.3,
        metalness: 0.06,
        clearcoat: 0.7,
        clearcoatRoughness: 0.18,
      }),
      new THREE.MeshPhysicalMaterial({
        color: 0xb7f3ff,
        roughness: 0.4,
        metalness: 0.03,
        clearcoat: 0.35,
      }),
    ]

    const outerAngles = [-1.15, -0.62, 0, 0.62, 1.15]
    outerAngles.forEach(angle => {
      lotus.add(makePetal(petalGeometry, materials[0], {
        angle,
        radius: 0.46,
        y: -0.2,
        scale: { x: 0.18, y: 0.86, z: 0.075 },
        tilt: 0.42,
      }))
    })

    const innerAngles = [-0.76, -0.32, 0.32, 0.76]
    innerAngles.forEach(angle => {
      lotus.add(makePetal(petalGeometry, materials[1], {
        angle,
        radius: 0.25,
        y: 0.08,
        scale: { x: 0.16, y: 0.74, z: 0.07 },
        tilt: 0.18,
      }))
    })

    lotus.add(makePetal(petalGeometry, materials[2], {
      angle: 0,
      radius: 0.02,
      y: 0.32,
      scale: { x: 0.17, y: 0.86, z: 0.08 },
      tilt: -0.04,
    }))

    const leftPad = new THREE.Mesh(baseGeometry, materials[3])
    leftPad.position.set(-0.36, -0.83, 0.03)
    leftPad.rotation.set(0.1, 0.08, -1.1)
    leftPad.scale.set(0.52, 0.13, 0.035)
    lotus.add(leftPad)

    const rightPad = leftPad.clone()
    rightPad.position.x = 0.36
    rightPad.rotation.z = 1.1
    lotus.add(rightPad)

    const centerPad = new THREE.Mesh(baseGeometry, materials[0])
    centerPad.position.set(0, -0.82, 0.04)
    centerPad.scale.set(0.44, 0.12, 0.035)
    lotus.add(centerPad)

    const pointer = { x: 0, y: 0 }
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function resize() {
      const { width, height } = canvas.getBoundingClientRect()
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    function onPointerMove(event) {
      const rect = canvas.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 0.35
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * -0.25
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    canvas.addEventListener('pointermove', onPointerMove)
    resize()

    let frameId
    function render(time = 0) {
      const idle = prefersReducedMotion ? 0 : time * 0.001
      lotus.rotation.y = pointer.x + Math.sin(idle * 1.2) * 0.2
      lotus.rotation.x = -0.35 + pointer.y + Math.sin(idle * 0.8) * 0.06
      lotus.position.y = Math.sin(idle * 1.6) * 0.04
      renderer.render(scene, camera)
      frameId = window.requestAnimationFrame(render)
    }
    render()

    return () => {
      window.cancelAnimationFrame(frameId)
      canvas.removeEventListener('pointermove', onPointerMove)
      resizeObserver.disconnect()
      petalGeometry.dispose()
      baseGeometry.dispose()
      materials.forEach(material => material.dispose())
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={styles.lotus3d}
      role="img"
      aria-label="Blue 3D lotus flower"
      data-lotus-3d
    />
  )
}
