import { useEffect, useRef } from 'react'
import styles from './YesScreen.module.css'

export default function YesScreen() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    const COLORS = ['#ff6b9d', '#ffb347', '#a8edea', '#fed6e3', '#fff176', '#b39ddb']
    const pieces = Array.from({ length: 160 }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height - canvas.height,
      w:     6  + Math.random() * 8,
      h:     4  + Math.random() * 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot:   Math.random() * Math.PI * 2,
      vx:    (Math.random() - 0.5) * 2.5,
      vy:    2  + Math.random() * 3,
      vr:    (Math.random() - 0.5) * 0.15,
      alpha: 1,
    }))

    let frame
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let alive = false
      pieces.forEach(p => {
        p.x   += p.vx
        p.y   += p.vy
        p.rot += p.vr
        if (p.y > canvas.height * 0.8) p.alpha -= 0.012
        if (p.alpha <= 0) return
        alive = true
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      })
      if (alive) frame = requestAnimationFrame(draw)
    }
    draw()

    const onResize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className={styles.canvas} />
      <span className={styles.emoji}>🎉</span>
      <h2 className={styles.title}>Yay!! This made my day!!</h2>
      <p className={styles.msg}>I'm so happy 💖<br />I'll see you soon — can't wait! 🌟</p>
    </>
  )
}
