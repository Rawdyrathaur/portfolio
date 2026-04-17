import './styles/index.css'
import Hero from './components/Hero/Hero'
import Navbar from './components/Navbar/Navbar'
import ThemeToggle from './components/ThemeToggle/ThemeToggle'

function App() {
  return (
    <main>
      <Hero />
      <Navbar />
      <ThemeToggle />
    </main>
  )
}

export default App