import { useEffect, useRef } from 'react'
import styles from './NoButton.module.css'

const PAD = 12
const SAFE_DIST = 130

export default function NoButton({ onNo }) {
  const btnRef = useRef(null)

  useEffect(() => {
    const btn = btnRef.current

    function clamp(x, y) {
      const bw = btn.offsetWidth
      const bh = btn.offsetHeight
      return {
        x: Math.max(PAD, Math.min(x, window.innerWidth  - bw - PAD)),
        y: Math.max(PAD, Math.min(y, window.innerHeight - bh - PAD)),
      }
    }

    function moveTo(x, y) {
      const p = clamp(x, y)
      btn.style.position = 'fixed'
      btn.style.left = p.x + 'px'
      btn.style.top  = p.y + 'px'
      btn.style.zIndex = '5'
    }

    function fleeFrom(px, py) {
      const r  = btn.getBoundingClientRect()
      const cx = r.left + r.width  / 2
      const cy = r.top  + r.height / 2
      let dx = cx - px
      let dy = cy - py
      const len = Math.hypot(dx, dy) || 1
      dx /= len; dy /= len

      const jump = 160 + Math.random() * 80
      let nx = cx + dx * jump - r.width  / 2
      let ny = cy + dy * jump - r.height / 2

      const p = clamp(nx, ny)
      const bw = btn.offsetWidth
      const bh = btn.offsetHeight
      const distAfter = Math.hypot(p.x + bw / 2 - px, p.y + bh / 2 - py)
      if (distAfter < 120) {
        p.x = px < window.innerWidth  / 2 ? window.innerWidth  - bw - PAD : PAD
        p.y = py < window.innerHeight / 2 ? window.innerHeight - bh - PAD : PAD
      }
      moveTo(p.x, p.y)
    }

    function onMouseMove(e) {
      const r = btn.getBoundingClientRect()
      const dist = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2))
      if (dist < SAFE_DIST) fleeFrom(e.clientX, e.clientY)
    }

    function onTouch(e) {
      e.preventDefault()
      const t = e.touches[0]
      fleeFrom(t.clientX, t.clientY)
    }

    function onBlock(e) {
      e.preventDefault()
      const r = btn.getBoundingClientRect()
      fleeFrom(r.left + r.width / 2, r.top + r.height / 2 + 40)
    }

    document.addEventListener('mousemove', onMouseMove)
    btn.addEventListener('touchstart', onTouch,  { passive: false })
    btn.addEventListener('mousedown',  onBlock,   { passive: false })
    btn.addEventListener('pointerdown', onBlock,  { passive: false })
    btn.addEventListener('focus',      onBlock,   { passive: false })
    btn.addEventListener('click',      onBlock,   { passive: false })

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      btn.removeEventListener('touchstart', onTouch)
      btn.removeEventListener('mousedown',  onBlock)
      btn.removeEventListener('pointerdown', onBlock)
      btn.removeEventListener('focus',      onBlock)
      btn.removeEventListener('click',      onBlock)
    }
  }, [])

  return (
    <button ref={btnRef} className={styles.btn}>
      No 😔
    </button>
  )
}
