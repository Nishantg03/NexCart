import React, { useMemo, useState } from 'react'

const topics = [
  'General Enquiry',
  'Order Support',
  'Returns & Refunds',
  'Wholesale',
  'Press & Media',
  'Feedback',
]

const faqs = [
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery takes 3–5 business days across India. Express delivery (1–2 days) is available at checkout. International orders ship in 7–14 business days.',
  },
  {
    q: 'What is your return policy?',
    a: 'We offer free 60-day returns on all orders. Refunds are processed within 5–7 business days after pickup.',
  },
  {
    q: 'Do you offer international shipping?',
    a: 'Yes. We ship to 40+ countries worldwide. Duties and taxes may apply depending on your location.',
  },
  {
    q: 'What warranty do your bags come with?',
    a: 'Every NexCart comes with a 2-year craftsmanship warranty for manufacturing defects.',
  },
  {
    q: 'Can I track my order?',
    a: 'Absolutely. Once your order ships, you’ll receive a tracking link via email and SMS.',
  },
  {
    q: 'Do you do custom or wholesale orders?',
    a: 'Yes. Contact us with the Wholesale topic and our B2B team will reach out within 24 hours.',
  },
]

const socialLinks = [
  { label: 'Instagram', icon: 'instagram' },
  { label: 'Facebook', icon: 'facebook' },
  { label: 'TikTok', icon: 'tiktok' },
]

const Contact = () => {
  const [topic, setTopic] = useState(topics[0])
  const [openFaq, setOpenFaq] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const contactStats = useMemo(() => ([
    { title: 'Email Us', value: ['hello@nexcart.in', 'support@nexcart.in'] },
    { title: 'Call Us', value: ['+91 1800 123 456', 'Mon – Sat, 10:00 AM – 7:00 PM IST'] },
    { title: 'Business Hours', value: ['Monday – Friday: 10:00 AM – 7:00 PM', 'Saturday: 10:00 AM – 5:00 PM'] },
  ]), [])

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-left">
          <p className="contact-eyebrow contact-fade contact-delay-1">Get in Touch</p>
          <h1 className="contact-title contact-fade contact-delay-2">We&apos;d Love to<br /><em>Hear</em> From You</h1>
        </div>
        <div className="contact-hero-right contact-fade contact-delay-3">
          <p>
            Whether you have a question about your order, need sizing advice, or simply want to say hello — our team is here and ready to help. No bots, no automated runarounds. Just real people who care.
          </p>
          <div className="contact-response-badge">
            <span className="contact-response-dot" />
            <span>We typically respond within 4 hours</span>
          </div>
        </div>
      </section>

      <section className="contact-grid">
        <div className="contact-form-panel">
          <h2 className="contact-panel-title">Send Us a Message</h2>
          <p className="contact-panel-subtitle">Fill in the form below and we&apos;ll get back to you as soon as possible.</p>

          <div className="contact-topic-pills">
            {topics.map((item) => (
              <button
                key={item}
                type="button"
                className={`contact-topic-pill ${topic === item ? 'active' : ''}`}
                onClick={() => setTopic(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <form className="contact-form" onSubmit={handleSubmit} autoComplete="off">
            <div className="contact-form-row">
              <div className="contact-field">
                <label>First Name</label>
                <input type="text" autoComplete="off" />
              </div>
              <div className="contact-field">
                <label>Last Name</label>
                <input type="text" autoComplete="off" />
              </div>
            </div>

            <div className="contact-field">
              <label>Address</label>
              <input type="text" autoComplete="off" />
            </div>

            <div className="contact-form-row">
              <div className="contact-field">
                <label>City</label>
                <input type="text" autoComplete="off" />
              </div>
              <div className="contact-field">
                <label>State</label>
                <input type="text" autoComplete="off" />
              </div>
            </div>

            <div className="contact-form-row">
              <div className="contact-field">
                <label>Postal Code</label>
                <input type="text" autoComplete="off" />
              </div>
              <div className="contact-field">
                <label>Country</label>
                <input type="text" autoComplete="off" />
              </div>
            </div>

            <div className="contact-field">
              <label>Email Address</label>
              <input type="email" autoComplete="off" />
            </div>

            <div className="contact-field">
              <label>Phone Number (Optional)</label>
              <input type="tel" autoComplete="off" />
            </div>

            <div className="contact-field">
              <label>Order Number (if applicable)</label>
              <input type="text" autoComplete="off" />
            </div>

            <div className="contact-field">
              <label>How can we help?</label>
              <textarea autoComplete="off" />
            </div>

            <label className="contact-file-upload">
              <input type="file" hidden multiple />
              <div className="contact-file-icon">📎</div>
              <p><span>Click to attach files</span> or drag and drop here<br />JPG, PNG, PDF up to 10MB</p>
            </label>

            <label className="contact-check-row">
              <input type="checkbox" />
              <span>
                I&apos;d like to receive updates, new arrivals, and exclusive offers from NexCart. Unsubscribe anytime. See our <a href="#">Privacy Policy</a>.
              </span>
            </label>

            <button className="contact-submit" type="submit">
              Send Message
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>

          {submitted && (
            <div className="contact-success">
              <div className="contact-success-icon">✉️</div>
              <h3>Message Sent!</h3>
              <p>Thank you for reaching out. Our team will get back to you within 4 hours during business hours.</p>
            </div>
          )}
        </div>

        <div className="contact-info-panel">
          {contactStats.map((card) => (
            <div className="contact-info-card" key={card.title}>
              <div className="contact-info-head">
                <div className="contact-info-icon">✦</div>
                <div className="contact-info-title">{card.title}</div>
              </div>
              <div className="contact-info-value">
                {card.value.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          ))}

          <div className="contact-map-card">
            <div className="contact-map-visual">
              <div className="contact-map-grid" />
              <div className="contact-map-pin">
                <div className="contact-map-pin-dot" />
                <span className="contact-map-pin-label">NexCart HQ</span>
              </div>
            </div>
            <div className="contact-map-address">
              <div>
                42, Craft Quarter, Hazratganj<br />
                Lucknow, Uttar Pradesh — 226001
              </div>
              <a href="#">Get Directions →</a>
            </div>
          </div>

          <div>
            <div className="contact-social-label">Find Us Online</div>
            <div className="contact-social-row">
              {socialLinks.map((item) => (
                <a href="#" key={item.label} className="contact-social-btn">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="contact-faq">
        <div className="contact-section-head">
          <p>Quick Answers</p>
          <h2>Frequently Asked Questions</h2>
          <span>Can&apos;t find what you&apos;re looking for? Send us a message above.</span>
        </div>

        <div className="contact-faq-grid">
          {faqs.map((item, index) => (
            <div className="contact-faq-item" key={item.q}>
              <button
                type="button"
                className={`contact-faq-question ${openFaq === index ? 'open' : ''}`}
                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
              >
                {item.q}
                <span className="contact-faq-chevron">⌄</span>
              </button>
              <div className={`contact-faq-answer ${openFaq === index ? 'open' : ''}`}>
                {item.a}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="contact-marquee">
        <div className="contact-marquee-track">
          <span>Free Shipping Above ₹999</span>
          <span>✦</span>
          <span>60-Day Free Returns</span>
          <span>✦</span>
          <span>2-Year Warranty</span>
          <span>✦</span>
          <span>Carbon-Neutral Delivery</span>
          <span>✦</span>
          <span>Response Within 4 Hours</span>
          <span>✦</span>
          <span>Real People, No Bots</span>
          <span>✦</span>
        </div>
      </section>
    </div>
  )
}

export default Contact
