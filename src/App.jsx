/* ========================
   APP COMPONENT
======================== */

import './styles/index.css'
import { ReadModeProvider } from './context/ReadModeContext'
import Hero from './components/Hero/Hero'
import Navbar from './components/Navbar/Navbar'
import ThemeToggle from './components/ThemeToggle/ThemeToggle'
import ReadMode from './components/ReadMode/ReadMode'
import Experience from './components/Experience/Experience'

function App() {
  return (
    <ReadModeProvider>
      <main>
        <Hero />
        <Navbar />
        <ThemeToggle />
        <ReadMode />
        <Experience />
      </main>
    </ReadModeProvider>
  )
}

export default App