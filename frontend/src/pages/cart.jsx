import { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'

const Cart = () => {
  const { products, cartItems, updateQuantity, removeFromCart, getCartAmount, addtocart } = useContext(ShopContext)
  const navigate = useNavigate()

  // Promo logic (SAVE10)
  const [promo, setPromo] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const PROMO_DISCOUNT = 0.10
  const GST_RATE = 0.18
  const FREE_DELIVERY_THRESHOLD = 499

  const applyPromo = () => {
    if ((promo || '').trim().toUpperCase() === 'SAVE10') setPromoApplied(true)
    else setPromoApplied(false)
  }

  const subtotal = getCartAmount() || 0
  const discount = promoApplied ? Math.round(subtotal * PROMO_DISCOUNT) : 0
  const afterDisc = subtotal - discount
  const delivery = afterDisc >= FREE_DELIVERY_THRESHOLD ? 0 : 49
  const gst = Math.round(afterDisc * GST_RATE)
  const total = afterDisc + delivery + gst

  const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN')

  // suggestions: use a few products as suggestions
  const suggestions = products.slice(0, 3)

  const [savedItems, setSavedItems] = useState([])

  const handleAddSuggestion = (product) => {
    const size = product.sizes?.[0] || 'M'
    addtocart?.(product._id, size)
  }

  const handleSaveForLater = (productId, size) => {
    // remove from cart and add to savedItems list
    removeFromCart(productId, size)
    setSavedItems(prev => [...prev, { productId, size }])
  }

  const cartCount = Object.entries(cartItems).reduce((acc, [pid, sizes]) => {
    return acc + Object.values(sizes).reduce((a,b) => a + b, 0)
  }, 0)

  // compute original total (when originalPrice exists) and savings
  const origTotal = Object.entries(cartItems).reduce((acc, [pid, sizes]) => {
    const product = products.find(p => p._id === pid)
    if (!product) return acc
    const qty = Object.values(sizes).reduce((a,b) => a + b, 0)
    const unitOrig = product.originalPrice || product.price || 0
    return acc + unitOrig * qty
  }, 0)

  const itemSavings = Math.max(0, origTotal - subtotal)
  const totalSavings = itemSavings + discount

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div className="page-header-inner">
          <div className="page-title-row">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <a href="#">Home</a>
              <i className="ti ti-chevron-right"></i>
              <a href="#">Shop</a>
              <i className="ti ti-chevron-right"></i>
              <span style={{color:'var(--clr-text-primary)'}}>Cart</span>
            </nav>
            <h1 className="page-title">Your Cart <span className="page-title-count">({cartCount} items)</span></h1>
          </div>
          <button className="header-continue" onClick={() => navigate('/collection')}>
            <i className="ti ti-arrow-left"></i> Continue Shopping
          </button>
        </div>
      </div>

      <div className="cart-layout">
        <div className="cart-left">
          <div className="section-heading">
            <span className="section-title">Items in your bag</span>
            <button className="select-all-btn" onClick={() => { const checks = document.querySelectorAll('.item-check'); const allChecked = [...checks].every(c => c.checked); checks.forEach(c => c.checked = !allChecked); }}>Select all</button>
          </div>

          {/* Cart items */}
          <div>
            {cartCount === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon"><i className="ti ti-shopping-bag"></i></div>
                <h2 className="empty-cart-title">Your cart is empty</h2>
                <p className="empty-cart-sub">Looks like you haven't added anything yet. Start exploring our collection.</p>
                <button className="btn-shop-now" onClick={() => navigate('/collection')}><i className="ti ti-sparkles"></i> Browse Collection</button>
              </div>
            ) : (
              Object.entries(cartItems).map(([productId, sizes]) => {
                const product = products.find(p => p._id === productId)
                if (!product) return null
                return Object.entries(sizes).map(([size, qty]) => (
                  qty > 0 && (
                    <div key={`${productId}-${size}`} className="cart-item">
                      <input className="item-check" type="checkbox" defaultChecked aria-label={`Select ${product.name}`} />

                      <div className="item-thumb" style={{background: 'var(--clr-bg-muted)'}}>
                        {product.image?.[0] ? <img src={product.image[0]} alt={product.name} style={{width:'100%',height:'100%',objectFit:'cover'}} /> : <i className="ti ti-package" />}
                        {product.badge && <span className="item-thumb-badge">{product.badge}</span>}
                      </div>

                      <div className="item-info">
                        <div className="item-category">{product.category || 'Apparel'}</div>
                        <div className="item-name">{product.name}</div>
                        <div className="item-variants">
                          <span className="item-variant-tag"><i className="ti ti-palette"></i>{product.color || size}</span>
                          <span className="item-variant-tag"><i className="ti ti-ruler"></i>{size}</span>
                        </div>
                        <div className="item-actions">
                          <button className="item-action-btn" onClick={() => handleSaveForLater(productId, size)}><i className="ti ti-bookmark"></i> Save for later</button>
                          <span className="action-sep" />
                          <button className="item-action-btn remove" onClick={() => removeFromCart(productId, size)}><i className="ti ti-trash"></i> Remove</button>
                        </div>
                      </div>

                      <div className="item-right">
                        <div className="item-price-block">
                          <div className="item-price-current">{fmt(product.price * qty)}</div>
                          {product.originalPrice && <div className="item-price-original">{fmt(product.originalPrice * qty)}</div>}
                          {product.originalPrice && product.originalPrice * qty - product.price * qty > 0 && <div className="item-price-saving">Save {fmt(product.originalPrice * qty - product.price * qty)}</div>}
                        </div>
                        <div className="qty-stepper" role="group" aria-label="Quantity">
                          <button className="qty-btn" onClick={() => updateQuantity(productId, size, Math.max(1, qty - 1))} aria-label="Decrease"> <i className="ti ti-minus"></i></button>
                          <span className="qty-val" aria-live="polite">{qty}</span>
                          <button className="qty-btn" onClick={() => updateQuantity(productId, size, qty + 1)} aria-label="Increase"> <i className="ti ti-plus"></i></button>
                        </div>
                      </div>
                    </div>
                  )
                ))
              })
            )}
          </div>

          {/* Saved strip */}
          <div className="saved-strip" style={{marginTop:20}}>
            <div className="saved-strip-left">
              <div className="saved-icon"><i className="ti ti-bookmark"></i></div>
              <div>
                <div className="saved-text">Saved for Later</div>
                <div className="saved-sub">{savedItems.length} item{savedItems.length !== 1 ? 's' : ''} waiting for you</div>
              </div>
            </div>
            <button className="saved-view-btn" onClick={() => {}}>View saved <i className="ti ti-arrow-right"></i></button>
          </div>

          {/* Also like */}
          <div className="also-like">
            <h2 className="also-like-title">You may also like</h2>
            <div className="also-like-grid" id="alsoLike">
              {suggestions.map((p, i) => (
                <div key={p._id || i} className="mini-card">
                  <div className="mini-card-img">{p.image?.[0] ? <img src={p.image[0]} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}} /> : <i className="ti ti-shopping-bag" />}</div>
                  <div className="mini-card-info">
                    <div className="mini-card-name">{p.name}</div>
                    <div className="mini-card-price">{fmt(p.price)}</div>
                  </div>
                  <button className="mini-card-add" onClick={() => handleAddSuggestion(p)}> <i className="ti ti-plus"></i> Add to bag</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <aside>
          <div className="summary-card">
            <div className="summary-header">
              <span className="summary-header-title">Order Summary</span>
              <span className="summary-header-count">{cartCount} items</span>
            </div>
            <div className="summary-body">
              <div className="promo-row">
                <input className="promo-input" id="promoInput" type="text" placeholder="Promo code (try SAVE10)" aria-label="Promo code" value={promo} onChange={(e)=>setPromo(e.target.value)} />
                <button className="promo-btn" onClick={applyPromo}>Apply</button>
              </div>
              <div className={`promo-msg ${promoApplied ? 'success' : ''}`} id="promoMsg">{promoApplied ? 'Promo applied — 10% off!' : ''}</div>

              <div className="divider" />

              <div className="price-row">
                <span className="label">Subtotal</span>
                <span className="val" id="subtotalDisplay">{fmt(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="price-row" id="discountRow">
                  <span className="label">Promo (SAVE10)</span>
                  <span className="val discount">−{fmt(discount)}</span>
                </div>
              )}
              <div className="price-row">
                <span className="label">Delivery</span>
                <span className="val" id="deliveryDisplay">{delivery === 0 ? 'Free' : fmt(delivery)}</span>
              </div>
              <div className="price-row">
                <span className="label">GST (18%)</span>
                <span className="val" id="gstDisplay">{fmt(gst)}</span>
              </div>

              { totalSavings > 0 && (
                <div className="savings-banner" id="savingsBanner">
                  <i className="ti ti-pig-money"></i>
                  <span id="savingsText">You're saving {fmt(totalSavings)} on this order!</span>
                </div>
              )}

              <div className="divider" />

              <div className="price-total">
                <span className="label">Total</span>
                <span className="val" id="totalDisplay">{fmt(total)}</span>
              </div>

              <div style={{marginTop:16}}>
                <button className="checkout-btn" onClick={() => navigate('/place-order')}>
                  <i className="ti ti-lock"></i> Proceed to Checkout
                </button>
                <div className="security-note"><i className="ti ti-shield-check"></i> 256-bit SSL · Secure Payment</div>

                <div className="divider-label">pay with</div>
                <div className="payment-icons">
                  <span className="pay-icon">VISA</span>
                  <span className="pay-icon">MC</span>
                  <span className="pay-icon">AMEX</span>
                  <span className="pay-icon">UPI</span>
                  <span className="pay-icon">PAYTM</span>
                  <span className="pay-icon">COD</span>
                </div>
              </div>
            </div>

            <div className="trust-row">
              <div className="trust-item"><i className="ti ti-refresh-dot"></i><span className="trust-item-label">Easy Returns</span></div>
              <div className="trust-item"><i className="ti ti-truck-delivery"></i><span className="trust-item-label">Free Delivery ₹499+</span></div>
              <div className="trust-item"><i className="ti ti-certificate"></i><span className="trust-item-label">100% Authentic</span></div>
            </div>
          </div>
        </aside>
      </div>

      <footer className="page-footer">&copy; 2026 ShopNest · <a href="#">Privacy</a> · <a href="#">Terms</a> · <a href="#">Help</a></footer>
    </div>
  )
}

export default Cart
