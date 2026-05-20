import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext.jsx'
import s1 from '../assets/s1.jpg'
import s2 from '../assets/s2.jpg'
import s3 from '../assets/s3.jpg'
import shoes1 from '../assets/shoes1.jpg'

export default function Home() {
  const { fetchProducts, products, addtocart } = useContext(ShopContext);
  const navigate = useNavigate();

  // saved for later (wish) state persisted to localStorage
  const [saved, setSaved] = useState(() => {
    try {
      const raw = localStorage.getItem('savedItems')
      return new Set(raw ? JSON.parse(raw) : [])
    } catch (e) {
      return new Set()
    }
  })
  const [notif, setNotif] = useState('')

  const [slideIndex, setSlideIndex] = useState(0)
  const slides = [s1, s2, s3]

  useEffect(() => {
    fetchProducts?.()
  }, [])

  useEffect(() => {
    const t = setInterval(() => setSlideIndex((i) => (i + 1) % slides.length), 3000)
    return () => clearInterval(t)
  }, [])

  const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN')

  const featured = (products || []).slice(0, 4)
  const newArrivals = (products || []).slice(4, 8)

  // newsletter subscription
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(() => !!localStorage.getItem('subscribedEmail'))

  const showNotif = (msg) => {
    setNotif(msg)
    setTimeout(() => setNotif(''), 2200)
  }

  const toggleSave = (id, e) => {
    if (e && e.stopPropagation) e.stopPropagation()
    setSaved(prev => {
      const next = new Set(prev)
      let action = ''
      if (next.has(id)) {
        next.delete(id)
        action = 'Removed from saved'
      } else {
        next.add(id)
        action = 'Saved for later'
      }
      try { localStorage.setItem('savedItems', JSON.stringify([...next])) } catch (err) {}
      showNotif(action)
      return next
    })
  }

  const handleSubscribe = () => {
    const v = (email || '').trim()
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
    if (!valid) { showNotif('Enter a valid email'); return }
    try { localStorage.setItem('subscribedEmail', v) } catch (err) {}
    setSubscribed(true)
    showNotif('Subscribed — thanks!')
    setEmail('')
  }

  return (
    <main>
      <section className="hero">
        <div className="hero-left">
          <div className="hero-badge"><span className="hero-badge-dot"/> <i className="ti ti-sparkles"></i> Summer Collection</div>
          <h1 className="hero-title">Dress Your <em>Story</em><span className="hero-title-line2">Own the Moment</span></h1>
          <p className="hero-sub">Curated fashion that moves with you. Discover pieces crafted for confidence, comfort, and effortless style — delivered to your door.</p>
          <div className="hero-cta-row">
            <Link to="/collection" className="btn-hero-primary"><i className="ti ti-sparkles"></i> Shop the Collection</Link>
            <Link to="/about" className="btn-hero-ghost"><i className="ti ti-player-play"></i> Watch Lookbook</Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><div className="hero-stat-val">50K<span>+</span></div><div className="hero-stat-lbl">Happy Customers</div></div>
            <div className="hero-stat"><div className="hero-stat-val">3.2K<span>+</span></div><div className="hero-stat-lbl">Styles Available</div></div>
            <div className="hero-stat"><div className="hero-stat-val">4.9<span>★</span></div><div className="hero-stat-lbl">Average Rating</div></div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-visual">
            <div className="hero-card-main">
              <div className="hero-card-main-bg" style={{minHeight:360, position:'relative', overflow:'hidden', padding:0}}>
                <img src={slides[slideIndex]} alt="Linen Co-ord Set" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}} />
              </div>
              <div className="hero-card-label" style={{marginTop:12, alignSelf:'flex-end'}}>
                <div className="hero-card-label-cat">New Arrival</div>
                <div className="hero-card-label-name">Linen Co-ord Set</div>
                <div className="hero-card-label-price">₹2,499</div>
              </div>
              {/* sneakers card moved inside main card to appear just below the label */}
              <div className="hero-card-sec" style={{marginTop:12}}>
                <div className="hero-card-sec-bg" style={{position:'relative', overflow:'hidden', padding:0}}>
                  <img src={shoes1} alt="Air Cushion Sneakers" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center'}} />
                  <div className="hero-card-sec-label" style={{position:'relative',zIndex:1,padding:'1.25rem',marginLeft:'auto'}}>
                    <div className="hero-card-sec-name">Air Cushion Sneakers</div>
                    <div className="hero-card-sec-price">₹2,199</div>
                  </div>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </section>

      {/* Category strip */}
      <section className="section-cats">
        <div className="cat-grid" style={{maxWidth:1160, margin:'0 auto'}}>
          <Link to="/collection" className="cat-tile"><div className="cat-icon"><i className="ti ti-shirt"></i></div><div className="cat-name">Men's Wear</div><div className="cat-count">840 styles</div></Link>
          <Link to="/collection" className="cat-tile"><div className="cat-icon"><i className="ti ti-dress"></i></div><div className="cat-name">Women's Wear</div><div className="cat-count">1,200 styles</div></Link>
          <Link to="/collection" className="cat-tile"><div className="cat-icon"><i className="ti ti-shoe"></i></div><div className="cat-name">Footwear</div><div className="cat-count">560 pairs</div></Link>
          <Link to="/collection" className="cat-tile"><div className="cat-icon"><i className="ti ti-backpack"></i></div><div className="cat-name">Bags & Packs</div><div className="cat-count">320 pieces</div></Link>
          <Link to="/collection" className="cat-tile"><div className="cat-icon"><i className="ti ti-sunglasses"></i></div><div className="cat-name">Accessories</div><div className="cat-count">480 items</div></Link>
          <Link to="/collection" className="cat-tile"><div className="cat-icon"><i className="ti ti-hoodie"></i></div><div className="cat-name">Activewear</div><div className="cat-count">290 styles</div></Link>
        </div>
      </section>

      {/* Featured products */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">Trending Now</div>
              <h2 className="section-title">This Week's <em>Favourites</em></h2>
              <p className="section-sub">Hand-picked styles flying off our shelves — don't miss out.</p>
            </div>
            <Link to="/collection" className="btn-link"><i className="ti ti-arrow-right"></i> View All</Link>
          </div>

          <div className="product-grid">
            {featured.map((p,i)=> (
              <div
                key={p._id || i}
                className="product-card"
                style={{animationDelay:`${i*0.06}s`, cursor: 'pointer'}}
                onClick={() => p?._id && navigate(`/product/${p._id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if ((event.key === 'Enter' || event.key === ' ') && p?._id) {
                    event.preventDefault()
                    navigate(`/product/${p._id}`)
                  }
                }}
              >
                <div className="product-img" style={{background: p.bg || 'var(--clr-bg-muted)'}}>
                  {p.image?.[0] ? <img src={p.image[0]} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}} /> : <i className={`ti ${p.icon || 'ti-shirt'}`} />}
                  <div className="product-badges">
                    {p.badge === 'new' && <span className="product-badge new">New</span>}
                    {p.badge === 'sale' && <span className="product-badge sale">-{p.off}%</span>}
                    {p.badge === 'popular' && <span className="product-badge popular">🔥 Hot</span>}
                  </div>
                  <button
                    className="product-wish"
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      const id = p._id || p.id || i
                      toggleSave(id, event)
                    }}
                    aria-pressed={saved.has(p._id || p.id || i)}
                    title="Save for later"
                  >
                    <i className="ti ti-heart" style={{color: saved.has(p._id || p.id || i) ? 'var(--clr-accent)' : 'inherit'}} />
                  </button>
                </div>
                <div className="product-body">
                  <div className="product-cat">{p.category || p.cat || 'Apparel'}</div>
                  <div className="product-name">{p.name}</div>
                  <div className="product-rating"><span className="product-stars">{'★'.repeat(Math.round(p.rating || 4))}</span><span className="product-review-count">({p.reviews||0})</span></div>
                  <div className="product-footer">
                    <div>
                      <span className="product-price-current">{fmt(p.price)}</span>
                      {p.orig && <span className="product-price-original">{fmt(p.orig)}</span>}
                    </div>
                    <button
                      type="button"
                      className="product-add-btn"
                      onClick={(event) => {
                        event.stopPropagation()
                        addtocart?.(p._id, 'M')
                      }}
                      aria-label={`Add ${p.name} to cart`}
                    >
                      <i className="ti ti-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo banners */}
      <section className="section" style={{background:'var(--clr-bg-card)', borderTop:'1px solid var(--clr-border-default)', borderBottom:'1px solid var(--clr-border-default)', padding:'3rem 0'}}>
        <div className="section-inner">
          <div className="banner-split">
            <div className="banner-tile banner-tile-1">
              <div className="banner-tile-bg"><i className="ti ti-shirt"></i></div>
              <div className="banner-tile-content">
                <div className="banner-tile-cat">New Collection</div>
                <div className="banner-tile-title">Summer Linen<br/>Essentials</div>
                <a href="#" className="banner-tile-cta"><i className="ti ti-arrow-right"></i> Shop Men</a>
              </div>
            </div>
            <div className="banner-tile banner-tile-2">
              <div className="banner-tile-bg"><i className="ti ti-dress"></i></div>
              <div className="banner-tile-content">
                <div className="banner-tile-cat">Women's Edit</div>
                <div className="banner-tile-title">Effortless<br/>Weekend Style</div>
                <a href="#" className="banner-tile-cta"><i className="ti ti-arrow-right"></i> Shop Women</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">Just Landed</div>
              <h2 className="section-title">New <em>Arrivals</em></h2>
              <p className="section-sub">Fresh drops added every week — be the first to style them.</p>
            </div>
            <a href="#" className="btn-link"><i className="ti ti-arrow-right"></i> See All New</a>
          </div>
          <div className="product-grid">
            {newArrivals.map((p,i)=> (
              <div
                key={p._id||i}
                className="product-card"
                style={{cursor: 'pointer'}}
                onClick={() => p?._id && navigate(`/product/${p._id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if ((event.key === 'Enter' || event.key === ' ') && p?._id) {
                    event.preventDefault()
                    navigate(`/product/${p._id}`)
                  }
                }}
              >
                <div className="product-img" style={{background:p.bg||'var(--clr-bg-muted)'}}>
                  {p.image?.[0] ? <img src={p.image[0]} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}} /> : <i className={`ti ${p.icon||'ti-shirt'}`}></i>}
                </div>
                <div className="product-body">
                  <div className="product-cat">{p.category||p.cat}</div>
                  <div className="product-name">{p.name}</div>
                  <div className="product-footer">
                    <div><span className="product-price-current">{fmt(p.price)}</span></div>
                    <button
                      type="button"
                      className="product-add-btn"
                      onClick={(event) => {
                        event.stopPropagation()
                        addtocart?.(p._id, 'M')
                      }}
                      aria-label={`Add ${p.name} to cart`}
                    >
                      <i className="ti ti-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust + Newsletter */}
      <div className="trust-bar">
        <div className="trust-bar-inner">
          <div className="trust-item"><div className="trust-icon"><i className="ti ti-truck"></i></div><div className="trust-text"><div className="trust-title">Free Delivery</div><div className="trust-sub">On all orders above ₹499</div></div></div>
          <div className="trust-item"><div className="trust-icon"><i className="ti ti-refresh"></i></div><div className="trust-text"><div className="trust-title">Easy Returns</div><div className="trust-sub">30-day hassle-free returns</div></div></div>
          <div className="trust-item"><div className="trust-icon"><i className="ti ti-shield-check"></i></div><div className="trust-text"><div className="trust-title">Secure Payments</div><div className="trust-sub">100% encrypted & safe</div></div></div>
          <div className="trust-item"><div className="trust-icon"><i className="ti ti-headset"></i></div><div className="trust-text"><div className="trust-title">24/7 Support</div><div className="trust-sub">We're always here for you</div></div></div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="newsletter-section">
        <div className="section-inner">
          <div className="newsletter-card">
            <div className="newsletter-eyebrow"><i className="ti ti-mail"></i> Stay in the Loop</div>
            <h2 className="newsletter-title">First to Know,<br/>First to Style</h2>
            <p className="newsletter-sub">Get exclusive drops, style guides, and subscriber-only deals straight to your inbox.</p>
            <div className="newsletter-form">
              <input className="newsletter-input" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button className="newsletter-btn" type="button" onClick={handleSubscribe}>{subscribed ? 'Subscribed' : 'Subscribe'}</button>
            </div>
            <p className="newsletter-note">No spam, unsubscribe anytime. 18,000+ subscribers.</p>
          </div>
        </div>
      </div>
    </main>
  )
}