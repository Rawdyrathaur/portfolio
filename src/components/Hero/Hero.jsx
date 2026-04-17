/* ========================
   HERO COMPONENT
======================== */

import './Hero.css'
import profile from '../../assets/mypic.png'

function Hero() {
  return (
    <section className="hero">
      <div className="hero__image-wrapper">
        <img src={profile} alt="Manish" className="hero__image" />
      </div>
      <h1 className="hero__name">Manish Rathaur</h1>
    </section>
  )
}

export default Hero