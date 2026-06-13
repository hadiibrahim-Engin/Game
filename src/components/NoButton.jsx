import { useEffect, useRef } from 'react'
import styles from './NoButton.module.css'

const PAD = 16
const MIN_FLEE_DIST = 240
const MAX_FLEE_DIST = 420
const FLEE_RATIO = 0.46

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export default function NoButton() {
  const btnRef = useRef(null)

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

    function fleeDistance() {
      return clamp(
        Math.min(window.innerWidth, window.innerHeight) * FLEE_RATIO,
        MIN_FLEE_DIST,
        MAX_FLEE_DIST
      )
    }

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

      return isNoHitZone(x, y) || Math.hypot(x - cx, y - cy) < fleeDistance()
    }

    function fleeFrom(cursorX, cursorY) {
      const r = btn.getBoundingClientRect()
      const bw = btn.offsetWidth
      const bh = btn.offsetHeight
      const maxX = Math.max(PAD, window.innerWidth - bw - PAD)
      const maxY = Math.max(PAD, window.innerHeight - bh - PAD)
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = cx - cursorX
      const dy = cy - cursorY
      const angle = Math.atan2(dy || 1, dx || 1)
      const leap = fleeDistance() * 1.35

      const xMid = window.innerWidth / 2 - bw / 2
      const yMid = window.innerHeight / 2 - bh / 2
      const candidates = [
        { x: PAD, y: PAD },
        { x: xMid, y: PAD },
        { x: maxX, y: PAD },
        { x: PAD, y: yMid },
        { x: maxX, y: yMid },
        { x: PAD, y: maxY },
        { x: xMid, y: maxY },
        { x: maxX, y: maxY },
        {
          x: r.left + Math.cos(angle) * leap,
          y: r.top + Math.sin(angle) * leap,
        },
        {
          x: r.left + Math.cos(angle + 0.55) * leap,
          y: r.top + Math.sin(angle + 0.55) * leap,
        },
        {
          x: r.left + Math.cos(angle - 0.55) * leap,
          y: r.top + Math.sin(angle - 0.55) * leap,
        },
      ]

      const pick = candidates.map(p => ({
        ...safePos(p.x, p.y),
      })).sort((a, b) => {
        const bCursorDist = Math.hypot(b.x + bw / 2 - cursorX, b.y + bh / 2 - cursorY)
        const aCursorDist = Math.hypot(a.x + bw / 2 - cursorX, a.y + bh / 2 - cursorY)
        const bJumpDist = Math.hypot(b.x - r.left, b.y - r.top)
        const aJumpDist = Math.hypot(a.x - r.left, a.y - r.top)
        return bCursorDist + bJumpDist * 0.18 - (aCursorDist + aJumpDist * 0.18)
      })[0]

      btn.style.left = pick.x + 'px'
      btn.style.top  = pick.y + 'px'
    }

    function onPointerMove(e) {
      if (isDangerClose(e.clientX, e.clientY)) fleeFrom(e.clientX, e.clientY)
    }

    function onTouch(e) {
      const t = e.touches[0]
      if (!t) return
      if (isDangerClose(t.clientX, t.clientY)) {
        e.preventDefault()
        fleeFrom(t.clientX, t.clientY)
      }
    }

    function onBlock(e) {
      const x = e.clientX ?? e.changedTouches?.[0]?.clientX
      const y = e.clientY ?? e.changedTouches?.[0]?.clientY
      if (x == null || y == null || !isNoHitZone(x, y)) return

      e.preventDefault()
      e.stopPropagation()
      fleeFrom(x, y)
    }

    function onResize() {
      const r = btn.getBoundingClientRect()
      const next = safePos(r.left, r.top)
      btn.style.left = next.x + 'px'
      btn.style.top = next.y + 'px'
    }

    document.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('mousemove', onPointerMove, { passive: true })
    document.addEventListener('touchstart', onTouch, { passive: false, capture: true })
    document.addEventListener('touchmove', onTouch, { passive: false, capture: true })
    document.addEventListener('pointerdown', onBlock, true)
    document.addEventListener('click', onBlock, true)
    window.addEventListener('resize', onResize)

    return () => {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('mousemove', onPointerMove)
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
