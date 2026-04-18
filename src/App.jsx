import './styles/index.css'
import Hero from './components/Hero/Hero'
import Navbar from './components/Navbar/Navbar'
import ThemeToggle from './components/ThemeToggle/ThemeToggle'

import ReadMode from './components/ReadMode/ReadMode'
function App() {
  return (
    <main>
      <Hero />
      <Navbar />
      <ThemeToggle />
      <ReadMode />
    </main>
  )
}

export default App