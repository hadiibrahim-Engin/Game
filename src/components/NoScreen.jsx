import styles from './NoScreen.module.css'

export default function NoScreen() {
  return (
    <div>
      <span className={styles.emoji}>🌷</span>
      <h2 className={styles.title}>Totally okay!</h2>
      <p className={styles.msg}>
        No worries at all 💛<br />Another time then — take care of yourself! 🤗
      </p>
    </div>
  )
}
