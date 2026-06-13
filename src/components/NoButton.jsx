import { useEffect, useRef } from 'react'
import styles from './NoButton.module.css'

const PAD = 16
const DANGER_DIST = 260
const SPOTS = [
  { x: 0.05, y: 0.08 },
  { x: 0.82, y: 0.10 },
  { x: 0.08, y: 0.38 },
  { x: 0.84, y: 0.38 },
  { x: 0.45, y: 0.05 },
  { x: 0.08, y: 0.78 },
  { x: 0.68, y: 0.78 },
  { x: 0.36, y: 0.84 },
  { x: 0.84, y: 0.64 },
  { x: 0.46, y: 0.56 },
]

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export default function NoButton() {
  const btnRef = useRef(null)
  const spotRef = useRef(0)

  useEffect(() => {
    const btn = btnRef.current
    if (!btn) return

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
      const maxX = Math.max(PAD, window.innerWidth - bw - PAD)
      const maxY = Math.max(PAD, window.innerHeight - bh - PAD)

      return {
        x: clamp(x, PAD, maxX),
        y: clamp(y, PAD, maxY),
      }
    }

    function spotPos(index) {
      const bw = btn.offsetWidth
      const bh = btn.offsetHeight
      const spot = SPOTS[index % SPOTS.length]
      const usableW = Math.max(0, window.innerWidth - bw - PAD * 2)
      const usableH = Math.max(0, window.innerHeight - bh - PAD * 2)

      return safePos(PAD + usableW * spot.x, PAD + usableH * spot.y)
    }

    function spotCenter(index) {
      const pos = spotPos(index)
      return {
        x: pos.x + btn.offsetWidth / 2,
        y: pos.y + btn.offsetHeight / 2,
      }
    }

    function moveToSpot(index) {
      const pos = spotPos(index)
      btn.style.left = pos.x + 'px'
      btn.style.top = pos.y + 'px'
      window.setTimeout(clampIntoWindow, 90)
    }

    function clampIntoWindow() {
      const r = btn.getBoundingClientRect()
      const pos = safePos(r.left, r.top)
      btn.style.left = pos.x + 'px'
      btn.style.top = pos.y + 'px'
    }

    function moveToNextSpot(cursorX, cursorY) {
      let next = (spotRef.current + 1) % SPOTS.length

      for (let i = 0; i < SPOTS.length; i += 1) {
        const center = spotCenter(next)
        if (Math.hypot(center.x - cursorX, center.y - cursorY) > DANGER_DIST) break
        next = (next + 1) % SPOTS.length
      }

      spotRef.current = next
      moveToSpot(next)
    }

    function isNoHitZone(x, y) {
      const r = btn.getBoundingClientRect()
      return (
        x >= r.left - PAD &&
        x <= r.right + PAD &&
        y >= r.top - PAD &&
        y <= r.bottom + PAD
      )
    }

    function isDangerClose(x, y) {
      const r = btn.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2

      return isNoHitZone(x, y) || Math.hypot(x - cx, y - cy) < DANGER_DIST
    }

    function onPointerMove(e) {
      if (isDangerClose(e.clientX, e.clientY)) moveToNextSpot(e.clientX, e.clientY)
    }

    function onTouch(e) {
      const t = e.touches[0]
      if (!t) return
      if (isDangerClose(t.clientX, t.clientY)) {
        e.preventDefault()
        moveToNextSpot(t.clientX, t.clientY)
      }
    }

    function onBlock(e) {
      const x = e.clientX ?? e.changedTouches?.[0]?.clientX
      const y = e.clientY ?? e.changedTouches?.[0]?.clientY
      if (x == null || y == null || !isNoHitZone(x, y)) return

      e.preventDefault()
      e.stopPropagation()
      moveToNextSpot(x, y)
    }

    function onResize() {
      moveToSpot(spotRef.current)
    }

    moveToSpot(spotRef.current)
    document.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('touchstart', onTouch, { passive: false, capture: true })
    document.addEventListener('touchmove', onTouch, { passive: false, capture: true })
    document.addEventListener('pointerdown', onBlock, true)
    document.addEventListener('click', onBlock, true)
    window.addEventListener('resize', onResize)

    return () => {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('touchstart', onTouch, true)
      document.removeEventListener('touchmove', onTouch, true)
      document.removeEventListener('pointerdown', onBlock, true)
      document.removeEventListener('click', onBlock, true)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <button
      ref={btnRef}
      type="button"
      className={styles.btn}
      disabled
      tabIndex={-1}
      aria-disabled="true"
    >
      No 😔
    </button>
  )
}
