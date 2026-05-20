import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import partnersImg from '../assets/partners.jpg'
import weaversImg from '../assets/weavers.jpg'
import designersImg from '../assets/designers.jpg'
import communityImg from '../assets/community.jpg'
import artImg from '../assets/art.jpg'
import craftsmenImg from '../assets/carftmens.jpg'
import makersImg from '../assets/makers.webp'

const portraits = [
  { label: 'Makers', className: 'about-portrait-1', image: makersImg },
  { label: 'Partners', className: 'about-portrait-6', image: partnersImg },
  { label: 'Weavers', className: 'about-portrait-5', image: weaversImg },
  { label: 'Designers', className: 'about-portrait-4', image: designersImg },
  { label: 'Community', className: 'about-portrait-3', image: communityImg },
  { label: 'Art Makers', className: 'about-portrait-2', image: artImg },
  { label: 'Craftsmen', className: 'about-portrait-7', image: craftsmenImg },
]

const features = [
  { title: 'Sustainable Materials', description: 'Every fabric is ethically sourced, certified organic, and traceable from field to finished product.' },
  { title: 'Artisan Partnership', description: 'We partner directly with craftspeople across 12 countries, ensuring fair wages and safe conditions.' },
  { title: 'Carbon Commitment', description: 'Every order is carbon-neutral — we offset emissions through verified reforestation projects.' },
]

const stats = [
  { value: '12+', label: 'Years of Craft' },
  { value: '200K', label: 'Happy Customers' },
  { value: '94%', label: 'Satisfaction Rate' },
  { value: '48', label: 'Artisan Partners' },
]

const team = [
  { initials: 'S', name: 'Sophia Renaud', role: 'Founder & Creative Director', className: 'about-team-1' },
  { initials: 'M', name: 'Marcus Osei', role: 'Head of Sourcing', className: 'about-team-2' },
  { initials: 'L', name: 'Laila Haddad', role: 'Lead Designer', className: 'about-team-3' },
  { initials: 'J', name: 'James Thornton', role: 'Sustainability Lead', className: 'about-team-4' },
]

const values = [
  {
    className: 'about-value-icon about-value-terracotta',
    title: 'Radical Transparency',
    description: 'Every product page shows exactly where it was made, by whom, and at what cost.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  },
  {
    className: 'about-value-icon about-value-sage',
    title: 'Timeless Design',
    description: 'We design pieces to last a decade, not a season. Quality over quantity — always.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>,
  },
  {
    className: 'about-value-icon about-value-gold',
    title: 'Community First',
    description: 'A share of every sale funds education and healthcare programs in artisan communities.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  },
]

const About = () => {
  return (
    <div className="about-page">
      <section className="section about-hero-section">
        <div className="section-inner about-hero-grid">
          <div className="about-hero-copy">
            <p className="section-eyebrow">Our Story</p>
            <h1 className="about-hero-title">Crafted with <em>Intention,</em><br />Worn with Purpose</h1>
            <p className="about-hero-sub">We believe every piece you wear should mean something. NexCart was born from a passion for timeless design and responsible craftsmanship.</p>
            <div className="about-hero-actions">
              <Link to="/collection" className="about-btn about-btn-primary">Explore the Collection</Link>
              <Link to="/contact" className="about-btn about-btn-secondary">Talk to Our Team</Link>
            </div>
            <div className="about-hero-metrics">
              <div><strong>12+</strong><span>Years of Craft</span></div>
              <div><strong>200K</strong><span>Happy Customers</span></div>
              <div><strong>48</strong><span>Artisan Partners</span></div>
            </div>
          </div>
          <div className="about-hero-visual">
            <img src={assets.about_img} alt="NexCart story" className="about-hero-image" />
            <div className="about-hero-float about-hero-float-top">Sustainably made</div>
            <div className="about-hero-float about-hero-float-bottom">200+ artisan partners</div>
          </div>
        </div>
      </section>

      <section className="section about-strip-section">
        <div className="section-inner">
          <div className="about-portrait-strip">
            {portraits.map((item) => (
              <div key={item.label} className={`about-portrait-card ${item.className}`}>
                <div
                  className="about-portrait-inner"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.42)), url(${item.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  <span className="about-portrait-label">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-header about-center-header">
            <div><p className="section-eyebrow">Why We Stand Out</p><h2 className="section-title">Thoughtful Details, Built for Real Life</h2></div>
            <p className="section-sub">Every decision is made to balance beauty, durability, and a lower impact on the planet.</p>
          </div>
          <div className="about-feature-grid">
            {features.map((item) => (
              <article key={item.title} className="about-feature-card">
                <h3 className="about-feature-title">{item.title}</h3>
                <p className="about-feature-desc">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-header about-center-header">
            <div><p className="section-eyebrow">Built for Shoppers</p><h2 className="section-title">Everything You Need to Shop Smarter</h2></div>
            <p className="section-sub">From curated collections to real-time guidance, our platform is built to make conscious shopping effortless.</p>
          </div>
          <div className="about-bento-top">
            <article className="about-bento-card about-bento-tall about-bento-accent">
              <div>
                <p className="about-kicker">Our Workshop</p>
                <div className="about-bento-stage"><span className="about-bento-star">✦</span></div>
              </div>
              <div>
                <h3 className="about-bento-title">Built-In Style Advisor</h3>
                <p className="about-bento-desc">Get personalized outfit recommendations based on your wardrobe and lifestyle — no stylist required.</p>
              </div>
            </article>
            <div className="about-bento-stack">
              <article className="about-bento-card about-bento-sage">
                <h3 className="about-bento-title">Size Confidence</h3>
                <p className="about-bento-desc">Our fit guidance helps you get the right size every time — no more guesswork.</p>
              </article>
              <article className="about-bento-card about-bento-gold">
                <h3 className="about-bento-title about-bento-title-dark">Wishlist & Drops</h3>
                <p className="about-bento-desc about-bento-desc-dark">Save favourites and get notified the moment limited-edition pieces drop.</p>
              </article>
            </div>
          </div>
          <div className="about-bento-bottom">
            <article className="about-bento-card about-bento-light">
              <h3 className="about-bento-title about-bento-title-dark">Easy Returns</h3>
              <p className="about-bento-desc about-bento-desc-dark">Free 60-day returns, no questions asked. Shopping should be risk-free.</p>
            </article>
            <article className="about-bento-card about-bento-dark">
              <h3 className="about-bento-title">Impact Tracking</h3>
              <p className="about-bento-desc">See the real-world impact of every purchase — trees planted, water saved, artisan hours supported.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="about-stats-grid">
            {stats.map((item) => (
              <article key={item.label} className="about-stat-card"><strong>{item.value}</strong><span>{item.label}</span></article>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-team-section">
        <div className="section-inner">
          <div className="section-header about-center-header">
            <div><p className="section-eyebrow">The Faces Behind NexCart</p><h2 className="section-title">A Small Team with a Big Vision</h2></div>
            <p className="section-sub">We’re designers, planners, and problem solvers united by a belief that fashion can be both beautiful and responsible.</p>
          </div>
          <div className="about-team-grid">
            {team.map((member) => (
              <article key={member.name} className="about-team-card">
                <div className={`about-team-avatar ${member.className}`}>{member.initials}</div>
                <div className="about-team-info"><h3 className="about-team-name">{member.name}</h3><p className="about-team-role">{member.role}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-values-section">
        <div className="section-inner">
          <div className="section-header about-center-header">
            <div><p className="section-eyebrow">What We Stand For</p><h2 className="section-title">Three Principles Guide Every Decision</h2></div>
            <p className="section-sub">From material selection to packaging, our team keeps these values at the center of the experience.</p>
          </div>
          <div className="about-values-grid">
            {values.map((value) => (
              <article key={value.title} className="about-value-card">
                <div className={value.className}>{value.icon}</div>
                <h3 className="about-value-title">{value.title}</h3>
                <p className="about-value-desc">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="about-cta-card">
            <h2 className="about-cta-title">Ready to Join the Movement?</h2>
            <p className="about-cta-sub">Discover pieces that feel as good as they look — and do good while you're at it.</p>
            <div className="about-cta-actions">
              <Link to="/collection" className="about-btn about-btn-primary">Explore the Collection</Link>
              <Link to="/contact" className="about-btn about-btn-secondary">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
