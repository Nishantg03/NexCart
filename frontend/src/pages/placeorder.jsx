import React, { useEffect, useState, useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const Placeorder = () => {
  // Constants (fallbacks)
  const FALLBACK_BASE = 7296;

  // Context & State
  const navigate = useNavigate();
  const { backendUrl, token, cartItems, setCartItems, getCartAmount, getCartCount, delivery_fee, products, getusercart } = useContext(ShopContext);

  // payment method: 'cod' | 'stripe' | 'razorpay'
  const [method, setMethod] = useState('cod');

  // State
  const [shipCost, setShipCost] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [activePay, setActivePay] = useState('card');
  const [promoMsg, setPromoMsg] = useState({ type: '', text: '' });
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');

  // Inject fonts & icon stylesheet into head (cleanup on unmount)
  useEffect(() => {
    const g = document.createElement('link');
    g.rel = 'preconnect';
    g.href = 'https://fonts.googleapis.com';
    const f = document.createElement('link');
    f.rel = 'stylesheet';
    f.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap";
    const t = document.createElement('link');
    t.rel = 'stylesheet';
    t.href = 'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.44.0/tabler-icons.min.css';
    document.head.appendChild(g);
    document.head.appendChild(f);
    document.head.appendChild(t);
    return () => {
      document.head.removeChild(g);
      document.head.removeChild(f);
      document.head.removeChild(t);
    };
  }, []);

  // Debug logs to help diagnose empty cart / product mismatches
  useEffect(() => {
    console.log('Placeorder mounted — cartItems:', cartItems);
    console.log('Products count:', products ? products.length : 0);
    console.log('getCartAmount:', typeof getCartAmount === 'function' ? getCartAmount() : 'no fn');
  }, [cartItems, products]);

  // If cart is empty but user is logged in, fetch saved cart from backend
  useEffect(() => {
    if (token && Object.keys(cartItems || {}).length === 0 && typeof getusercart === 'function') {
      getusercart(token).then(remoteCart => {
        if (remoteCart && Object.keys(remoteCart).length > 0) {
          console.log('Loaded remote cart for user:', remoteCart);
          setCartItems(remoteCart);
        }
      }).catch(err => console.warn('Failed to load remote cart', err));
    }
  }, [token, cartItems, getusercart, setCartItems]);

  const fmt = n => '₹' + Number(n || 0).toLocaleString('en-IN');

  const computePricing = () => {
    const subtotal = getCartAmount ? getCartAmount() : FALLBACK_BASE;
    const discount = promoApplied ? Math.round(subtotal * 0.10) : 0; // 10%
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + gst + shipCost - discount;
    return { subtotal, discount, gst, total };
  };

  const selectShip = (key, cost) => {
    setShipCost(cost);
    // update selection UI handled by className on render
  };

  const switchPay = (tab) => {
    setActivePay(tab);
  };

  const applyPromo = () => {
    const code = (document.getElementById('promoInput')?.value || '').trim().toUpperCase();
    if (code === 'SAVE10') {
      setPromoApplied(true);
      setPromoMsg({ type: 'success', text: 'Promo applied — 10% off!' });
      document.getElementById('discountRow').style.display = '';
    } else if (code === '') {
      setPromoApplied(false);
      setPromoMsg({ type: '', text: '' });
      document.getElementById('discountRow').style.display = 'none';
    } else {
      setPromoApplied(false);
      setPromoMsg({ type: 'error', text: 'Invalid code. Try SAVE10 for 10% off.' });
      document.getElementById('discountRow').style.display = 'none';
    }
  };

  const handleOrder = () => {
    // fallback quick handler — real flow uses onsubmitHandler
    alert('Order placed successfully! 🎉\nThank you for shopping with ShopNest.');
  };

  /* ---------- payment & order logic (connects to backend) ---------- */
  const handleOrderSuccess = (orderId) => {
    toast.success('Order placed successfully!');
    setCartItems({});
    // navigate to orders
    navigate('/orders');
  };

  const initpay = (orderData) => {
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
    if (!razorpayKey) {
      toast.error('Razorpay not configured');
      return;
    }
    const options = {
      key: razorpayKey,
      amount: orderData.amount,
      currency: 'INR',
      name: 'ShopNest',
      description: 'Order payment',
      order_id: orderData.razorpayOrderId,
      handler: async (response) => {
        try {
          const data = await axios.post(`${backendUrl}/api/orders/verifyRazorpay`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          }, { headers: { Authorization: `Bearer ${token}` } });
          if (data.data.success) handleOrderSuccess(orderData.orderId);
          else toast.error('Payment verification failed');
        } catch (err) {
          toast.error('Error verifying payment');
        }
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onsubmitHandler = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(p => p._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      const orderData = {
        address: {
          // minimal address (you can expand to collect real fields)
          firstName: document.getElementById('fname')?.value || '',
          lastName: document.getElementById('lname')?.value || '',
          email: document.getElementById('email')?.value || '',
          contactNumber: document.getElementById('phone')?.value || '',
          addr1: document.getElementById('addr1')?.value || '',
          addr2: document.getElementById('addr2')?.value || '',
          city: document.getElementById('city')?.value || '',
          state: document.getElementById('state')?.value || '',
          zip: document.getElementById('pin')?.value || '',
          country: document.getElementById('country')?.value || ''
        },
        items: orderItems,
        amount: getCartAmount() + (delivery_fee || 0)
      };

      const headers = { Authorization: `Bearer ${token}` };

      if (method === 'cod') {
        const res = await axios.post(`${backendUrl}/api/orders/placeorder`, orderData, { headers });
        if (res.data.success) handleOrderSuccess(res.data.orderId);
        else toast.error(res.data.message || 'Order failed');
      } else if (method === 'stripe') {
        const res = await axios.post(`${backendUrl}/api/orders/stripe`, orderData, { headers });
        if (res.data.success && res.data.url) window.location.href = res.data.url;
        else toast.error(res.data.message || 'Stripe flow failed');
      } else if (method === 'razorpay') {
        const res = await axios.post(`${backendUrl}/api/orders/razorpay`, orderData, { headers });
        if (res.data.success) initpay(res.data);
        else toast.error(res.data.message || 'Razorpay flow failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Order error');
    }
  };

  // Card formatting
  const onCardInput = (v) => {
    let raw = v.replace(/\D/g, '').substring(0, 16);
    const spaced = raw.replace(/(.{4})/g, '$1 ').trim();
    setCardNum(spaced);
  };

  const onExpiryInput = (v) => {
    let raw = v.replace(/\D/g, '').substring(0,4);
    if (raw.length >= 3) raw = raw.substring(0,2) + ' / ' + raw.substring(2);
    setExpiry(raw);
  };

  // Wallet click handled via event delegation onClick

  return (
    <div>
      <style>{`
        :root{--clr-accent:#E8622A;--clr-accent-hover:#C9511E;--clr-accent-light:#FBF0EB;--clr-accent-border:#F3C4AC;--clr-bg-page:#F6F4F1;--clr-bg-card:#FFFFFF;--clr-bg-input:#F9F8F6;--clr-bg-muted:#F0EDE8;--clr-text-primary:#1C1A18;--clr-text-secondary:#6B6660;--clr-text-hint:#A39E99;--clr-text-accent:#C9511E;--clr-text-success:#2A7A4F;--clr-text-error:#C0392B;--clr-border-default:#E4DED7;--clr-border-focus:#E8622A;--clr-border-accent:#F3C4AC;--clr-border-success:#86C4A0;--clr-success-bg:#EAF5EE;--clr-error-bg:#FDECEA;--clr-selected-bg:#FBF0EB;--font-body:'DM Sans',sans-serif;--font-display:'DM Serif Display',serif;--radius-sm:6px;--radius-md:10px;--radius-lg:14px;--radius-xl:20px;--shadow-card:0 1px 3px rgba(0,0,0,0.07),0 4px 12px rgba(0,0,0,0.05);--shadow-focus:0 0 0 3px rgba(232,98,42,0.22)}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{font-size:16px;scroll-behavior:smooth}
        body{font-family:var(--font-body);background-color:var(--clr-bg-page);color:var(--clr-text-primary);min-height:100vh;line-height:1.6}
        .navbar{background:var(--clr-bg-card);border-bottom:1px solid var(--clr-border-default);padding:0 2rem;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10}
        .navbar-brand{font-family:var(--font-display);font-size:22px;color:var(--clr-text-primary);text-decoration:none;letter-spacing:-0.3px}
        .navbar-brand span{color:var(--clr-accent)}
        .navbar-steps{display:flex;align-items:center;gap:0}
        .nav-step{display:flex;align-items:center;gap:7px;font-size:13px;color:var(--clr-text-hint)}
        .nav-step.done{color:var(--clr-text-success)}
        .nav-step.active{color:var(--clr-text-primary);font-weight:600}
        .nav-step-num{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;background:var(--clr-bg-muted);color:var(--clr-text-hint)}
        .nav-step.done .nav-step-num{background:var(--clr-success-bg);color:var(--clr-text-success)}
        .nav-step.active .nav-step-num{background:var(--clr-accent);color:#fff}
        .nav-sep{width:28px;height:1px;background:var(--clr-border-default);margin:0 6px}
        .navbar-secure{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--clr-text-secondary)}
        .navbar-secure i{color:var(--clr-text-success);font-size:15px}
        .page-wrapper{max-width:1100px;margin:0 auto;padding:2rem 1.5rem 4rem;display:grid;grid-template-columns:1fr 380px;gap:24px;align-items:start}
        .page-title{font-family:var(--font-display);font-size:28px;color:var(--clr-text-primary);margin-bottom:1.5rem;letter-spacing:-0.3px}
        .card{background:var(--clr-bg-card);border:1px solid var(--clr-border-default);border-radius:var(--radius-lg);padding:1.5rem;margin-bottom:16px;box-shadow:var(--shadow-card)}
        .card:last-child{margin-bottom:0}
        .card-header{display:flex;align-items:center;gap:9px;margin-bottom:1.25rem}
        .card-header-icon{width:32px;height:32px;border-radius:var(--radius-sm);background:var(--clr-accent-light);display:flex;align-items:center;justify-content:center;color:var(--clr-accent);font-size:17px;flex-shrink:0}
        .card-title{font-size:14px;font-weight:600;color:var(--clr-text-primary);letter-spacing:0.02em}
        .field-group{display:flex;flex-direction:column;gap:12px}
        .field{display:flex;flex-direction:column;gap:5px}
        .field label{font-size:12px;font-weight:500;color:var(--clr-text-secondary);letter-spacing:0.04em;text-transform:uppercase}
        .field input,.field select,.field textarea{font-family:var(--font-body);font-size:14px;color:var(--clr-text-primary);background:var(--clr-bg-input);border:1.5px solid var(--clr-border-default);border-radius:var(--radius-md);padding:10px 13px;outline:none;transition:border-color .18s,box-shadow .18s,background .18s;width:100%;appearance:none}
        .field input::placeholder,.field textarea::placeholder{color:var(--clr-text-hint)}
        .field input:hover,.field select:hover{border-color:#C8BFB7}
        .field input:focus,.field select:focus,.field textarea:focus{border-color:var(--clr-border-focus);background:#fff;box-shadow:var(--shadow-focus)}
        .field select{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B6660' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:36px;cursor:pointer}
        .row-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .row-3{display:grid;grid-template-columns:2fr 1fr 1fr;gap:12px}
        .input-prefix-wrap{position:relative}
        .input-prefix-wrap i{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--clr-text-hint);font-size:16px;pointer-events:none}
        .input-prefix-wrap input{padding-left:38px}
        .ship-options{display:flex;flex-direction:column;gap:8px}
        .ship-option{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1.5px solid var(--clr-border-default);border-radius:var(--radius-md);cursor:pointer;transition:border-color .18s,background .18s;user-select:none}
        .ship-option.selected{border-color:var(--clr-accent);background:var(--clr-selected-bg)}
        .ship-option input[type="radio"]{width:16px;height:16px;accent-color:var(--clr-accent);cursor:pointer;flex-shrink:0}
        .ship-icon{width:34px;height:34px;border-radius:var(--radius-sm);background:var(--clr-bg-muted);display:flex;align-items:center;justify-content:center;color:var(--clr-text-secondary);font-size:17px;flex-shrink:0}
        .ship-option.selected .ship-icon{background:var(--clr-accent-light);color:var(--clr-accent)}
        .ship-info{flex:1;min-width:0}
        .ship-name{font-size:14px;font-weight:600;color:var(--clr-text-primary)}
        .ship-desc{font-size:12px;color:var(--clr-text-secondary);margin-top:1px}
        .ship-price{font-size:14px;font-weight:600;color:var(--clr-text-primary);flex-shrink:0}
        .ship-option.selected .ship-name,.ship-option.selected .ship-price{color:var(--clr-accent)}
        .ship-badge{font-size:10px;font-weight:600;color:var(--clr-text-success);background:var(--clr-success-bg);border-radius:20px;padding:2px 8px;margin-left:6px;letter-spacing:0.04em;text-transform:uppercase}
        .pay-tabs{display:flex;gap:6px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--clr-border-default)}
        .pay-tab{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:9px 6px;border:1.5px solid var(--clr-border-default);border-radius:var(--radius-md);font-family:var(--font-body);font-size:12px;font-weight:500;color:var(--clr-text-secondary);background:var(--clr-bg-input);cursor:pointer;transition:all .18s}
        .pay-tab.active{border-color:var(--clr-accent);background:var(--clr-accent-light);color:var(--clr-accent)}
        .card-brands{display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap}
        .card-brand{padding:4px 10px;font-size:11px;font-weight:700;border-radius:var(--radius-sm);background:var(--clr-bg-muted);color:var(--clr-text-hint);border:1px solid var(--clr-border-default);letter-spacing:0.05em}
        .card-brand.active{background:var(--clr-accent-light);border-color:var(--clr-accent-border);color:var(--clr-accent)}
        .card-input-wrap{position:relative}
        .card-input-wrap .card-type-icon{position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:18px;color:var(--clr-text-hint)}
        .promo-row{display:flex;gap:8px;margin-top:14px}
        .promo-row input{flex:1;font-family:var(--font-body);font-size:13px;color:var(--clr-text-primary);background:var(--clr-bg-input);border:1.5px solid var(--clr-border-default);border-radius:var(--radius-md);padding:9px 12px;outline:none;transition:border-color .18s,box-shadow .18s;letter-spacing:0.06em;text-transform:uppercase}
        .promo-row input::placeholder{text-transform:none;letter-spacing:0}
        .promo-apply-btn{padding:9px 16px;font-family:var(--font-body);font-size:13px;font-weight:600;color:var(--clr-accent);background:var(--clr-accent-light);border:1.5px solid var(--clr-accent-border);border-radius:var(--radius-md);cursor:pointer;transition:background .18s,border-color .18s;white-space:nowrap}
        .promo-apply-btn:hover{background:#f7ddd0;border-color:var(--clr-accent)}
        .promo-msg{font-size:12px;margin-top:7px;display:none;padding:7px 10px;border-radius:var(--radius-sm)}
        .promo-msg.success{display:flex;align-items:center;gap:6px;background:var(--clr-success-bg);color:var(--clr-text-success);border:1px solid var(--clr-border-success)}
        .promo-msg.error{display:flex;align-items:center;gap:6px;background:var(--clr-error-bg);color:var(--clr-text-error)}
        .summary-card{background:var(--clr-bg-card);border:1px solid var(--clr-border-default);border-radius:var(--radius-lg);box-shadow:var(--shadow-card);overflow:hidden;position:sticky;top:76px}
        .summary-header{padding:1.25rem 1.5rem;border-bottom:1px solid var(--clr-border-default);background:var(--clr-bg-muted)}
        .summary-header h2{font-size:14px;font-weight:600;color:var(--clr-text-primary);display:flex;align-items:center;gap:7px}
        .item-count-badge{margin-left:auto;font-size:11px;font-weight:600;background:var(--clr-accent);color:#fff;border-radius:20px;padding:2px 9px}
        .cart-items{padding:1rem 1.5rem}
        .cart-item{display:flex;align-items:flex-start;gap:12px;padding:10px 0;border-bottom:1px solid var(--clr-border-default)}
        .cart-item-img{width:52px;height:52px;border-radius:var(--radius-sm);background:var(--clr-bg-muted);border:1px solid var(--clr-border-default);display:flex;align-items:center;justify-content:center;color:var(--clr-text-secondary);font-size:22px;flex-shrink:0;position:relative}
        .cart-item-qty-badge{position:absolute;top:-6px;right:-6px;width:18px;height:18px;border-radius:50%;background:var(--clr-accent);color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;border:2px solid var(--clr-bg-card)}
        .cart-item-info{flex:1;min-width:0}
        .cart-item-name{font-size:13px;font-weight:600;color:var(--clr-text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .cart-item-variant{font-size:11px;color:var(--clr-text-secondary);margin-top:2px}
        .cart-item-price{font-size:13px;font-weight:600;color:var(--clr-text-primary);flex-shrink:0}
        .pricing-block{padding:1rem 1.5rem;border-top:1px solid var(--clr-border-default);display:flex;flex-direction:column;gap:9px}
        .price-row{display:flex;justify-content:space-between;align-items:center;font-size:13px}
        .price-row .label{color:var(--clr-text-secondary)}
        .price-row .val{color:var(--clr-text-primary);font-weight:500}
        .price-row.discount .val{color:var(--clr-text-success)}
        .price-divider{height:1px;background:var(--clr-border-default);margin:4px 0}
        .price-total{display:flex;justify-content:space-between;align-items:baseline}
        .price-total .label{font-size:15px;font-weight:600;color:var(--clr-text-primary)}
        .price-total .val{font-family:var(--font-display);font-size:22px;color:var(--clr-text-primary)}
        .cta-block{padding:1rem 1.5rem 1.25rem;border-top:1px solid var(--clr-border-default)}
        .cta-btn{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;padding:15px;font-family:var(--font-body);font-size:15px;font-weight:600;color:#fff;background:var(--clr-accent);border:none;border-radius:var(--radius-md);cursor:pointer;letter-spacing:0.02em;transition:background .18s,transform .1s,box-shadow .18s;box-shadow:0 4px 14px rgba(232,98,42,0.35)}
        .cta-btn:hover{background:var(--clr-accent-hover);box-shadow:0 6px 18px rgba(232,98,42,0.42)}
        .cta-btn:active{transform:scale(0.98)}
        .cta-sub{display:flex;align-items:center;justify-content:center;gap:5px;font-size:11px;color:var(--clr-text-hint);margin-top:10px}
        .trust-badges{display:flex;gap:8px;padding:0 1.5rem 1.25rem;flex-wrap:wrap}
        .trust-badge{flex:1;min-width:70px;display:flex;flex-direction:column;align-items:center;gap:4px;font-size:10px;color:var(--clr-text-secondary);text-align:center;padding:8px 6px;border:1px solid var(--clr-border-default);border-radius:var(--radius-sm);background:var(--clr-bg-muted)}
        .trust-badge i{font-size:18px;color:var(--clr-text-secondary)}
        .pay-panel{display:none}.pay-panel.active{display:block}
        .wallet-opts{display:flex;flex-direction:column;gap:8px}
        .wallet-opt{display:flex;align-items:center;gap:10px;padding:10px 13px;border:1.5px solid var(--clr-border-default);border-radius:var(--radius-md);cursor:pointer;transition:all .15s}
        .wallet-opt.selected{border-color:var(--clr-accent);background:var(--clr-selected-bg)}
        .wallet-logo{width:32px;height:32px;border-radius:var(--radius-sm);background:var(--clr-bg-muted);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:var(--clr-text-secondary);flex-shrink:0}
        .wallet-info{flex:1}.wallet-name{font-size:13px;font-weight:600;color:var(--clr-text-primary)}.wallet-bal{font-size:11px;color:var(--clr-text-secondary)}.wallet-opt.selected .wallet-name{color:var(--clr-accent)}
        .upi-note{font-size:12px;color:var(--clr-text-secondary);background:var(--clr-bg-muted);border-radius:var(--radius-sm);padding:9px 12px;margin-top:12px;display:flex;align-items:flex-start;gap:7px}
        .page-footer{text-align:center;padding:2rem;font-size:12px;color:var(--clr-text-hint);border-top:1px solid var(--clr-border-default);margin-top:2rem}
        @media (max-width:820px){.page-wrapper{grid-template-columns:1fr}.summary-card{position:static}.navbar-steps{display:none}.row-3{grid-template-columns:1fr 1fr}.row-3 .field:first-child{grid-column:1/-1}}
        @media (max-width:560px){.navbar{padding:0 1rem}.page-wrapper{padding:1rem 1rem 3rem}.card{padding:1.25rem 1rem}.row-2{grid-template-columns:1fr}}
      `}</style>

      <header className="navbar">
        <a href="#" className="navbar-brand">Shop<span>Nest</span></a>
        <nav className="navbar-steps" aria-label="Checkout progress">
          <div className="nav-step done">
            <div className="nav-step-num"><i className="ti ti-check" style={{fontSize:11}}></i></div>
            <span>Cart</span>
          </div>
          <div className="nav-sep"></div>
          <div className="nav-step active">
            <div className="nav-step-num">2</div>
            <span>Details</span>
          </div>
          <div className="nav-sep"></div>
          <div className="nav-step pending">
            <div className="nav-step-num">3</div>
            <span>Payment</span>
          </div>
          <div className="nav-sep"></div>
          <div className="nav-step pending">
            <div className="nav-step-num">4</div>
            <span>Confirm</span>
          </div>
        </nav>

        <div className="navbar-secure">
          <i className="ti ti-lock"></i>
          Secure checkout
        </div>
      </header>

      <main className="page-wrapper">
        <div>
          <h1 className="page-title">Checkout</h1>

          <div className="card">
            <div className="card-header">
              <div className="card-header-icon"><i className="ti ti-user" aria-hidden="true"></i></div>
              <span className="card-title">Contact information</span>
            </div>
            <div className="field-group">
              <div className="row-2">
                <div className="field">
                  <label htmlFor="fname">First name</label>
                  <input id="fname" type="text" autoComplete="given-name" />
                </div>
                <div className="field">
                  <label htmlFor="lname">Last name</label>
                  <input id="lname" type="text" autoComplete="family-name" />
                </div>
              </div>
              <div className="field">
                <label htmlFor="email">Email address</label>
                <div className="input-prefix-wrap">
                  <i className="ti ti-mail" aria-hidden="true"></i>
                  <input id="email" type="email" autoComplete="email" />
                </div>
              </div>
              <div className="field">
                <label htmlFor="phone">Phone number</label>
                <div className="input-prefix-wrap">
                  <i className="ti ti-phone" aria-hidden="true"></i>
                  <input id="phone" type="tel" autoComplete="tel" />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-header-icon"><i className="ti ti-map-pin" aria-hidden="true"></i></div>
              <span className="card-title">Shipping address</span>
            </div>
            <div className="field-group">
              <div className="field">
                <label htmlFor="addr1">Address line 1</label>
                <input id="addr1" type="text" autoComplete="address-line1" />
              </div>
              <div className="field">
                <label htmlFor="addr2">Address line 2 <span style={{color:'var(--clr-text-hint)', fontWeight:400}}>(optional)</span></label>
                <input id="addr2" type="text" autoComplete="address-line2" />
              </div>
              <div className="row-3">
                <div className="field">
                  <label htmlFor="city">City</label>
                  <input id="city" type="text" autoComplete="address-level2" />
                </div>
                <div className="field">
                  <label htmlFor="state">State</label>
                  <input id="state" type="text" autoComplete="address-level1" />
                </div>
                <div className="field">
                  <label htmlFor="pin">PIN code</label>
                  <input id="pin" type="text" maxLength={6} autoComplete="postal-code" />
                </div>
              </div>
              <div className="field">
                <label htmlFor="country">Country</label>
                <select id="country" autoComplete="country" defaultValue="IN">
                  <option value="IN">India</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AE">United Arab Emirates</option>
                  <option value="SG">Singapore</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-header-icon"><i className="ti ti-truck" aria-hidden="true"></i></div>
              <span className="card-title">Shipping method</span>
            </div>
            <div className="ship-options" id="shipOptions">
              <label className={`ship-option ${shipCost===0? 'selected':''}`} onClick={() => selectShip('free',0)}>
                <input type="radio" name="ship" defaultChecked />
                <div className="ship-icon"><i className="ti ti-package" aria-hidden="true"></i></div>
                <div className="ship-info">
                  <div className="ship-name">Standard delivery <span className="ship-badge">Most popular</span></div>
                  <div className="ship-desc">5–7 business days</div>
                </div>
                <span className="ship-price">Free</span>
              </label>

              <label className={`ship-option ${shipCost===199? 'selected':''}`} onClick={() => selectShip('express',199)}>
                <input type="radio" name="ship" />
                <div className="ship-icon"><i className="ti ti-bolt" aria-hidden="true"></i></div>
                <div className="ship-info">
                  <div className="ship-name">Express delivery</div>
                  <div className="ship-desc">2–3 business days</div>
                </div>
                <span className="ship-price">₹199</span>
              </label>

              <label className={`ship-option ${shipCost===499? 'selected':''}`} onClick={() => selectShip('overnight',499)}>
                <input type="radio" name="ship" />
                <div className="ship-icon"><i className="ti ti-rocket" aria-hidden="true"></i></div>
                <div className="ship-info">
                  <div className="ship-name">Overnight delivery</div>
                  <div className="ship-desc">Next business day by 10 AM</div>
                </div>
                <span className="ship-price">₹499</span>
              </label>
            </div>
          </div>

          {method !== 'cod' && (
            <div className="card">
              <div className="card-header">
                <div className="card-header-icon"><i className="ti ti-credit-card" aria-hidden="true"></i></div>
                <span className="card-title">Payment method</span>
              </div>

              <div className="pay-tabs" role="tablist">
                <button className={`pay-tab ${activePay==='card'?'active':''}`} onClick={() => switchPay('card')} role="tab" aria-selected={activePay==='card'}>
                  <i className="ti ti-credit-card" aria-hidden="true"></i> Card
                </button>
                <button className={`pay-tab ${activePay==='upi'?'active':''}`} onClick={() => switchPay('upi')} role="tab" aria-selected={activePay==='upi'}>
                  <i className="ti ti-qrcode" aria-hidden="true"></i> UPI
                </button>
                <button className={`pay-tab ${activePay==='netbank'?'active':''}`} onClick={() => switchPay('netbank')} role="tab" aria-selected={activePay==='netbank'}>
                  <i className="ti ti-building-bank" aria-hidden="true"></i> Net banking
                </button>
                <button className={`pay-tab ${activePay==='wallet'?'active':''}`} onClick={() => switchPay('wallet')} role="tab" aria-selected={activePay==='wallet'}>
                  <i className="ti ti-wallet" aria-hidden="true"></i> Wallet
                </button>
              </div>

              <div className={`pay-panel ${activePay==='card'?'active':''}`} id="pay-card">
                <div className="card-brands">
                  <span className="card-brand active">VISA</span>
                  <span className="card-brand active">Mastercard</span>
                  <span className="card-brand active">RuPay</span>
                  <span className="card-brand">Amex</span>
                  <span className="card-brand">Diners</span>
                </div>
                <div className="field-group">
                  <div className="field">
                    <label htmlFor="cardnum">Card number</label>
                    <div className="card-input-wrap">
                      <input id="cardnum" type="text" maxLength={19} value={cardNum} onChange={e => onCardInput(e.target.value)} />
                      <i className="ti ti-credit-card card-type-icon" aria-hidden="true"></i>
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="cardholder">Cardholder name</label>
                    <input id="cardholder" type="text" autoComplete="cc-name" />
                  </div>
                  <div className="row-2">
                    <div className="field">
                      <label htmlFor="expiry">Expiry date</label>
                      <input id="expiry" type="text" maxLength={7} value={expiry} onChange={e => onExpiryInput(e.target.value)} autoComplete="cc-exp" />
                    </div>
                    <div className="field">
                      <label htmlFor="cvv">CVV / CVC</label>
                      <div className="card-input-wrap">
                        <input id="cvv" type="password" maxLength={4} autoComplete="cc-csc" />
                        <i className="ti ti-info-circle card-type-icon" aria-hidden="true"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`pay-panel ${activePay==='upi'?'active':''}`} id="pay-upi">
                <div className="field">
                  <label htmlFor="upiid">UPI ID</label>
                  <div className="input-prefix-wrap">
                    <i className="ti ti-at" aria-hidden="true"></i>
                    <input id="upiid" type="text" />
                  </div>
                </div>
                <div className="upi-note">
                  <i className="ti ti-info-circle" aria-hidden="true"></i>
                  <span>We support all BHIM-UPI apps including PhonePe, Google Pay, Paytm, and Amazon Pay.</span>
                </div>
              </div>

              <div className={`pay-panel ${activePay==='netbank'?'active':''}`} id="pay-netbank">
                <div className="field">
                  <label htmlFor="banksel">Select your bank</label>
                  <select id="banksel">
                    <option value="">— Select a bank —</option>
                    <option>State Bank of India (SBI)</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                    <option>Punjab National Bank</option>
                    <option>Bank of Baroda</option>
                    <option>Union Bank of India</option>
                    <option>Yes Bank</option>
                    <option>IndusInd Bank</option>
                  </select>
                </div>
                <div className="upi-note" style={{marginTop:12}}>
                  <i className="ti ti-shield-check" aria-hidden="true"></i>
                  <span>You'll be redirected to your bank's secure portal to complete the payment.</span>
                </div>
              </div>

              <div className={`pay-panel ${activePay==='wallet'?'active':''}`} id="pay-wallet">
                <div className="wallet-opts">
                  <label className={`wallet-opt selected`}>
                    <input type="radio" name="wallet" defaultChecked />
                    <div className="wallet-logo" style={{background:'#e8f4fd', color:'#0070ba'}}>P</div>
                    <div className="wallet-info">
                      <div className="wallet-name">Paytm</div>
                      <div className="wallet-bal">Balance: ₹1,240.00</div>
                    </div>
                  </label>
                  <label className="wallet-opt">
                    <input type="radio" name="wallet" />
                    <div className="wallet-logo" style={{background:'#fff3e0', color:'#ff9900'}}>A</div>
                    <div className="wallet-info">
                      <div className="wallet-name">Amazon Pay</div>
                      <div className="wallet-bal">Balance: ₹350.00</div>
                    </div>
                  </label>
                  <label className="wallet-opt">
                    <input type="radio" name="wallet" />
                    <div className="wallet-logo" style={{background:'#eaf5ea', color:'#3c763d'}}>M</div>
                    <div className="wallet-info">
                      <div className="wallet-name">Mobikwik</div>
                      <div className="wallet-bal">Balance: ₹80.00</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        <aside>
          <div style={{marginBottom:12}}>
            <div className='card'>
              <div className='card-header'>
                <div className='card-header-icon'><i className='ti ti-wallet' aria-hidden='true'></i></div>
                <span className='card-title'>Payment selection</span>
              </div>
              <div style={{display:'flex', gap:8}}>
                <div onClick={() => setMethod('stripe')} className={`card-brand ${method==='stripe'?'active':''}`} style={{cursor:'pointer'}}>Stripe</div>
                <div onClick={() => setMethod('razorpay')} className={`card-brand ${method==='razorpay'?'active':''}`} style={{cursor:'pointer'}}>Razorpay</div>
                <div onClick={() => setMethod('cod')} className={`card-brand ${method==='cod'?'active':''}`} style={{cursor:'pointer'}}>Cash on Delivery</div>
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-header">
              <h2>
                <i className="ti ti-shopping-cart" aria-hidden="true"></i>
                Order summary
                <span className="item-count-badge">{getCartCount ? getCartCount() : 0} items</span>
              </h2>
            </div>

            <div className="cart-items">
              {Object.keys(cartItems || {}).length === 0 ? (
                <div style={{padding: '1rem', color: 'var(--clr-text-secondary)'}}>Your cart is empty.</div>
              ) : (
                Object.entries(cartItems).map(([productId, sizesMap]) => {
                  const product = products && products.find(p => p._id === productId);
                  if (!product) return null;
                  // sum quantities across sizes for this product
                  let qty = 0;
                  for (const s in sizesMap) {
                    qty += Number(sizesMap[s] || 0);
                  }
                  if (qty <= 0) return null;
                  return (
                    <div key={productId} className="cart-item">
                      <div className="cart-item-img">
                        {product.image && product.image[0] ? (
                          <img src={product.image[0]} alt={product.name} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'var(--radius-sm)'}} />
                        ) : (
                          <i className="ti ti-box" aria-hidden="true"></i>
                        )}
                        <div className="cart-item-qty-badge">{qty}</div>
                      </div>
                      <div className="cart-item-info">
                        <div className="cart-item-name">{product.name}</div>
                        <div className="cart-item-variant">{Object.keys(sizesMap).map(s => `${s} × ${sizesMap[s]}`).join(' · ')}</div>
                      </div>
                      <div className="cart-item-price">{fmt(product.price * qty)}</div>
                    </div>
                  )
                })
              )}
            </div>

            <div style={{padding:'0 1.5rem 1rem'}}>
              <div className="promo-row">
                <input type="text" id="promoInput" aria-label="Promo code" />
                <button className="promo-apply-btn" onClick={applyPromo}>Apply</button>
              </div>
              <div className={`promo-msg ${promoMsg.type==='success'?'success':promoMsg.type==='error'?'error':''}`} id="promoMsg" style={{display: promoMsg.type? 'flex':'none'}}>
                {promoMsg.type === 'success' && <i className="ti ti-circle-check"></i>}
                {promoMsg.type === 'error' && <i className="ti ti-alert-circle"></i>}
                <span style={{marginLeft:6}}>{promoMsg.text}</span>
              </div>
            </div>

            <div className="pricing-block">
              {(() => {
                const { subtotal, discount, gst, total } = computePricing();
                return (
                  <>
                    <div className="price-row">
                      <span className="label">Subtotal ({getCartCount ? getCartCount() : 0} items)</span>
                      <span className="val">{fmt(subtotal)}</span>
                    </div>
                    <div className="price-row">
                      <span className="label">Shipping</span>
                      <span className="val" id="shipCostDisplay">{shipCost===0? 'Free': fmt(shipCost)}</span>
                    </div>
                    <div className="price-row discount" id="discountRow" style={{display: discount? 'flex':'none'}}>
                      <span className="label">Promo (SAVE10)</span>
                      <span className="val">−{fmt(discount)}</span>
                    </div>
                    <div className="price-row">
                      <span className="label">GST (18%)</span>
                      <span className="val">{fmt(gst)}</span>
                    </div>
                    <div className="price-divider"></div>
                    <div className="price-total">
                      <span className="label">Total</span>
                      <span className="val" id="totalDisplay">{fmt(total)}</span>
                    </div>
                  </>
                )
              })()}
            </div>

            <div className="cta-block">
              <button className="cta-btn" onClick={onsubmitHandler}>
                <i className="ti ti-lock" aria-hidden={true}></i>
                Place order · <span id="ctaTotal">{fmt(computePricing().total)}</span>
              </button>
              <div className="cta-sub">
                <i className="ti ti-shield-check"></i>
                Protected by 256-bit SSL encryption
              </div>
            </div>

            <div className="trust-badges">
              <div className="trust-badge">
                <i className="ti ti-refresh-dot" aria-hidden="true"></i>
                Easy returns
              </div>
              <div className="trust-badge">
                <i className="ti ti-headset" aria-hidden="true"></i>
                24/7 support
              </div>
              <div className="trust-badge">
                <i className="ti ti-certificate" aria-hidden="true"></i>
                Authentic goods
              </div>
            </div>
          </div>

          <p style={{fontSize:11, color:'var(--clr-text-hint)', marginTop:12, textAlign:'center', padding:'0 0.5rem', lineHeight:1.6}}>
            By placing your order you agree to ShopNest's
            <a href="#" style={{color:'var(--clr-text-secondary)'}}> Terms of Service</a> and
            <a href="#" style={{color:'var(--clr-text-secondary)'}}> Privacy Policy</a>.
          </p>
        </aside>
      </main>

      <footer className="page-footer">
        &copy; 2026 ShopNest · <a href="#">Privacy</a> · <a href="#">Terms</a> · <a href="#">Help</a>
      </footer>
    </div>
  )
}

export default Placeorder
