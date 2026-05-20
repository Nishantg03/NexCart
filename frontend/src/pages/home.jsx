import React from 'react'
import Hero from '../components/Hero.jsx'
import LatestCollection from '../components/LatestCollection.jsx'
import NewsletterBox from '../components/NewsletterBox.jsx'
import OurPolicy from '../components/OurPolicy.jsx'
import BestSeller from '../components/BestSeller.jsx'
export default function Home() {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      <NewsletterBox />
    </div>
  )
}