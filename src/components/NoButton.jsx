import { useEffect, useRef } from 'react'
import styles from './NoButton.module.css'

const PAD = 16
const SAFE_DIST = 140

export default function NoButton({ onNo }) {
  const btnRef = useRef(null)

  useEffect(() => {
    const btn = btnRef.current

    // Anchor the button as fixed at its natural position right away
    // so it never starts un-positioned when the first flee fires.
    const init = btn.getBoundingClientRect()
    btn.style.width    = init.width + 'px'
    btn.style.position = 'fixed'
    btn.style.left     = init.left + 'px'
    btn.style.top      = init.top  + 'px'
    btn.style.zIndex   = '5'

    function safePos(x, y) {
      const bw = btn.offsetWidth
      const bh = btn.offsetHeight
      return {
        x: Math.max(PAD, Math.min(x, window.innerWidth  - bw - PAD)),
        y: Math.max(PAD, Math.min(y, window.innerHeight - bh - PAD)),
      }
    }

    function fleeFrom(cursorX, cursorY) {
      const bw = btn.offsetWidth
      const bh = btn.offsetHeight

      // Pick the corner farthest from the cursor.
      const corners = [
        { x: PAD,                           y: PAD },
        { x: window.innerWidth  - bw - PAD, y: PAD },
        { x: PAD,                           y: window.innerHeight - bh - PAD },
        { x: window.innerWidth  - bw - PAD, y: window.innerHeight - bh - PAD },
      ]

      // Also add mid-edge candidates for more variety.
      const midEdges = [
        { x: window.innerWidth / 2 - bw / 2, y: PAD },
        { x: window.innerWidth / 2 - bw / 2, y: window.innerHeight - bh - PAD },
        { x: PAD,                             y: window.innerHeight / 2 - bh / 2 },
        { x: window.innerWidth  - bw - PAD,   y: window.innerHeight / 2 - bh / 2 },
      ]

      const candidates = [...corners, ...midEdges].map(p => ({
        ...safePos(p.x, p.y),
        dist: Math.hypot(p.x + bw / 2 - cursorX, p.y + bh / 2 - cursorY),
      }))

      // Sort by distance descending, pick one of the top 3 randomly for variety.
      candidates.sort((a, b) => b.dist - a.dist)
      const pick = candidates[Math.floor(Math.random() * 3)]

      btn.style.left = pick.x + 'px'
      btn.style.top  = pick.y + 'px'
    }

    function onMouseMove(e) {
      const r    = btn.getBoundingClientRect()
      const cx   = r.left + r.width  / 2
      const cy   = r.top  + r.height / 2
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy)
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
      fleeFrom(r.left + r.width / 2, r.top + r.height / 2)
    }

    document.addEventListener('mousemove', onMouseMove)
    btn.addEventListener('touchstart',  onTouch,  { passive: false })
    btn.addEventListener('mousedown',   onBlock,  { passive: false })
    btn.addEventListener('pointerdown', onBlock,  { passive: false })
    btn.addEventListener('focus',       onBlock,  { passive: false })
    btn.addEventListener('click',       onBlock,  { passive: false })

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      btn.removeEventListener('touchstart',  onTouch)
      btn.removeEventListener('mousedown',   onBlock)
      btn.removeEventListener('pointerdown', onBlock)
      btn.removeEventListener('focus',       onBlock)
      btn.removeEventListener('click',       onBlock)
    }
  }, [])

  return (
    <button ref={btnRef} className={styles.btn}>
      No 😔
    </button>
  )
}
