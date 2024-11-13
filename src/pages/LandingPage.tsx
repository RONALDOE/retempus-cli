import Hero from '@components/Hero'
import Navbar from '@components/Navbar'

export default function LandingPage() {
  return (
    <div>
        <Navbar items={[{name: 'About Us', link: '#AboutUs'}, {name: 'Pricing', link: '#Pricing'}]} />
        <Hero />
    </div>
  )
}
