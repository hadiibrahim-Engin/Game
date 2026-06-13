import { useState } from 'react'
import FloatingHearts from './components/FloatingHearts'
import QuestionScreen from './components/QuestionScreen'
import YesScreen from './components/YesScreen'
import NoScreen from './components/NoScreen'
import styles from './App.module.css'

export default function App() {
  const [screen, setScreen] = useState('question') // 'question' | 'yes' | 'no'

  return (
    <div className={`${styles.page} ${screen === 'yes' ? styles.celebrate : ''}`}>
      <FloatingHearts />

      <div className={styles.card}>
        {screen === 'question' && (
          <QuestionScreen onYes={() => setScreen('yes')} onNo={() => setScreen('no')} />
        )}
        {screen === 'yes' && <YesScreen />}
        {screen === 'no' && <NoScreen />}
      </div>
    </div>
  )
}
