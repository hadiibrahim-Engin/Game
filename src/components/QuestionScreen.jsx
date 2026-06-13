import NoButton from './NoButton'
import styles from './QuestionScreen.module.css'

export default function QuestionScreen({ onYes, onNo }) {
  return (
    <div>
      <span className={styles.lotus} role="img" aria-label="Blue lotus flower">
        <svg viewBox="0 0 120 92" aria-hidden="true" focusable="false">
          <path className={styles.lotusOuter} d="M52 72C29 70 11 56 8 35C35 35 53 50 52 72Z" />
          <path className={styles.lotusOuter} d="M68 72C91 70 109 56 112 35C85 35 67 50 68 72Z" />
          <path className={styles.lotusBase} d="M60 76C46 84 29 82 16 72C32 63 48 63 60 76Z" />
          <path className={styles.lotusBase} d="M60 76C74 84 91 82 104 72C88 63 72 63 60 76Z" />
          <path className={styles.lotusInner} d="M56 66C36 56 25 37 29 18C48 27 60 45 56 66Z" />
          <path className={styles.lotusInner} d="M64 66C84 56 95 37 91 18C72 27 60 45 64 66Z" />
          <path className={styles.lotusCore} d="M60 64C48 48 48 25 60 10C72 25 72 48 60 64Z" />
          <ellipse className={styles.lotusGlow} cx="60" cy="74" rx="19" ry="6" />
        </svg>
      </span>
      <h1 className={styles.title}>
        Hey, can i steal you today<br />for just 30 minutes? 💕
      </h1>
      <p className={styles.sub}>No pressure — it would just make my day ✨</p>
      <div className={styles.btnRow}>
        <button className={styles.btnYes} onClick={onYes}>
          Yes! 🥰
        </button>
        <NoButton onNo={onNo} />
      </div>
    </div>
  )
}
