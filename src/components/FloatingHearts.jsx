import { useEffect, useRef } from 'react'
import styles from './FloatingHearts.module.css'

const EMOJIS = ['💕', '🌸', '✨', '💖', '🌷', '💗', '🌟', '💝']

function createHeart(container) {
  const el = document.createElement('span')
  el.className = styles.heart
  el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
  el.style.left = Math.random() * 100 + 'vw'
  const dur = 6 + Math.random() * 8
  el.style.animationDuration = dur + 's'
  el.style.fontSize = (0.9 + Math.random() * 1.2) + 'rem'
  el.style.animationDelay = Math.random() * 4 + 's'
  container.appendChild(el)
  setTimeout(() => el.remove(), (dur + 4) * 1000)
}

export default function FloatingHearts() {
  const ref = useRef(null)

  useEffect(() => {
    const container = ref.current
    for (let i = 0; i < 6; i++) createHeart(container)
    const id = setInterval(() => createHeart(container), 900)
    return () => clearInterval(id)
  }, [])

  return <div ref={ref} className={styles.bg} />
}
