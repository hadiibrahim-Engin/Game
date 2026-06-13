import Lotus3D from './Lotus3D'
import NoButton from './NoButton'
import styles from './QuestionScreen.module.css'

export default function QuestionScreen({ onYes, onNo }) {
  return (
    <div>
      <Lotus3D />
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
