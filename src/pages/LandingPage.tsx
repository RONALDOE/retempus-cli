import Hero from '@components/Hero'
import Navbar from '@components/Navbar'
import React from 'react'

export default function LandingPage() {
  return (
    <div>
        <Navbar items={[{name: 'Signup', link: 'login'}, {name: 'Login', link: 'login'}]} />
        <Hero />
    </div>
  )
}
