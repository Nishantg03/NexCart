import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
// Title component not used in redesigned orders page
import axios from 'axios'

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);  
  const [orderData, setOrderData] = useState([]);
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [fetchError, setFetchError] = useState('')

  // Log when this component renders
  React.useEffect(() => {
    console.log('🎫 === Orders Component Rendered ===');
    console.log('Token available:', !!token);
    console.log('BackendUrl:', backendUrl);
    return () => {
      console.log('Orders component unmounting');
    };
  }, [token, backendUrl]);

  const loadOrders = async () => {
    try {
      if (!token) {
        console.log('No token available, cannot load orders');
        return;
      }

      console.log('Loading orders with token:', token.substring(0, 20) + '...');
      const response = await axios.post(
        `${backendUrl}/api/orders/myorders`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Orders response:', response.data);

      if (response.data.success && response.data.orders) {
        // Keep orders grouped (array of order objects) for the UI
        setOrderData(response.data.orders.reverse())
        console.log('Orders loaded successfully. Total orders:', response.data.orders.length);
      } else {
        console.error('Failed to fetch orders:', response.data.message);
        setFetchError(response.data.message || 'Failed to load orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setFetchError(error.message || 'Network error')
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    }
  };

  useEffect(() => {
    if (token) loadOrders()
  }, [token, backendUrl])

  const trackerSteps = [
    { icon: 'ti-check', label: 'Ordered' },
    { icon: 'ti-package', label: 'Packing' },
    { icon: 'ti-truck', label: 'Shipped' },
    { icon: 'ti-map-pin', label: 'Out for delivery' },
    { icon: 'ti-circle-check', label: 'Delivery' },
  ]

  // map display filter keys to backend status values
  const statusMap = {
    all: 'all',
    packing: 'processing', // display 'Packing' but backend value is 'processing'
    shipped: 'shipped',
    delivered: 'delivered',
    cancelled: 'cancelled',
    returned: 'returned'
  }

  const normalizeStatus = (s) => String(s || '').toLowerCase().trim()

  const matchStatusKey = (orderStatus, backendKey) => {
    const st = normalizeStatus(orderStatus)
    if (!backendKey || backendKey === 'all') return true
    const bk = String(backendKey).toLowerCase()
    if (bk === 'processing' || bk === 'packing') {
      // match various possible server values for packing/processing
      return st.includes('process') || st.includes('pack') || st.includes('packing') || st.includes('processing')
    }
    // default exact match
    return st === bk
  }

  const fmt = (n) => `${currency}${Number(n || 0).toLocaleString('en-IN')}`

  const formatAddress = (addr) => {
    if (!addr) return ''
    if (typeof addr === 'string') return addr
    // addr may be an object with fields: addr1, addr2, city, state, zip, country
    try {
      const parts = []
      if (addr.addr1) parts.push(addr.addr1)
      if (addr.addr2) parts.push(addr.addr2)
      const cityState = [addr.city, addr.state].filter(Boolean).join(', ')
      if (cityState) parts.push(cityState)
      if (addr.zip) parts.push(addr.zip)
      if (addr.country) parts.push(addr.country)
      return parts.join(', ')
    } catch (e) {
      return ''
    }
  }

  const renderTracker = (currentStep) => {
    return (
      <div className="tracker-steps">
        {trackerSteps.map((step, i) => {
          const isDone = i < currentStep
          const isActive = i === currentStep
          const cls = isDone ? 'done' : isActive ? 'active' : 'pending'
          return (
            <React.Fragment key={i}>
              <div className={`tracker-step ${cls}`}>
                <div className="tracker-step-icon"><i className={`ti ${step.icon}`}></i></div>
                <div className="tracker-step-lbl">{step.label}</div>
              </div>
              {i < trackerSteps.length - 1 && <div className={`tracker-line ${isDone ? 'done' : 'pending'}`} />}
            </React.Fragment>
          )
        })}
      </div>
    )
  }

  const setFilterLocal = (f) => { setFilter(String(f || 'all').toLowerCase()) }
  const filtered = orderData.filter(o => {
    const backendKey = statusMap[filter] || filter
    const matchStatus = matchStatusKey(o.status, backendKey)
    const q = (query || '').trim().toLowerCase()
    const matchSearch = !q || (o._id && String(o._id).toLowerCase().includes(q)) || (o.id && String(o.id).toLowerCase().includes(q)) || (o.items && o.items.some(i => String(i.name || '').toLowerCase().includes(q)))
    return matchStatus && matchSearch
  })

  return (
    <div>
  
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div className="breadcrumb">
              <a href="#">Home</a>
              <i className="ti ti-chevron-right"></i>
              <a href="#">Account</a>
              <i className="ti ti-chevron-right"></i>
              <span>My Orders</span>
            </div>
            <h1 className="page-title">My Orders <span className="page-title-count">({filtered.length} orders)</span></h1>
          </div>
        </div>
      </div>

      <div className="orders-toolbar">
        <div className="search-wrap">
          <i className="ti ti-search"></i>
          <input className="search-input" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search by product or order ID…" />
        </div>
        <div className="filter-tabs">
          {['all','packing','shipped','delivered','cancelled','returned'].map(f=> (
            <button key={f} className={`filter-tab ${filter===f?'active':''}`} onClick={()=>setFilterLocal(f)}>{f[0].toUpperCase()+f.slice(1)}</button>
          ))}
        </div>
      </div>

      <div className="orders-layout">
        <div className="orders-list">
          {filtered.length === 0 ? (
            <div className="empty-orders">
              <div className="empty-icon"><i className="ti ti-package-off"></i></div>
              <div className="empty-title">No orders found</div>
              <p className="empty-sub">We couldn't find any orders matching your search. Try a different filter.</p>
            </div>
          ) : filtered.map((order, idx) => {
            const sm = {
              delivered: { label: 'Delivery', icon: 'ti-circle-check', cls: 'delivered' },
              shipped: { label: 'Shipped', icon: 'ti-truck', cls: 'shipped' },
              processing: { label: 'Packing', icon: 'ti-package', cls: 'processing' },
              cancelled: { label: 'Cancelled', icon: 'ti-x', cls: 'cancelled' },
              returned: { label: 'Returned', icon: 'ti-refresh', cls: 'returned' }
            }[order.status] || { label: order.status, icon: 'ti-package', cls: '' }

            const visibleItems = (order.items || []).slice(0,2)
            const hiddenCount = Math.max(0, (order.items || []).length - 2)

            return (
              <div key={order._id || order.id || idx} className="order-card" style={{animationDelay:`${idx*0.07}s`}} data-status={order.status}>
                <div className="order-header">
                  <div className="order-header-left">
                    <div className="order-icon"><i className="ti ti-package"></i></div>
                    <div className="order-meta">
                      <div className="order-id">{order.id || order._id}</div>
                      <div className="order-date"><i className="ti ti-calendar" style={{fontSize:10}}></i> Placed on {new Date(order.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="order-header-right">
                    <div className="order-total-badge">{currency}{order.total}</div>
                    <div className={`status-pill ${sm.cls}`}><i className={`ti ${sm.icon}`}></i>{sm.label}</div>
                  </div>
                </div>

                <div className="order-items">
                  {visibleItems.map((item,i)=> (
                    <div key={i} className="order-item">
                      <div className="order-item-thumb" style={{background: item.bg || 'var(--clr-bg-muted)'}}>
                        {item.image?.[0] ? <img src={item.image[0]} alt={item.name} style={{width:60,height:60,objectFit:'cover',borderRadius:8}} /> : <i className={`ti ${item.icon || 'ti-package'}`}></i>}
                      </div>
                      <div className="order-item-info">
                        <div className="order-item-cat">{item.cat}</div>
                        <div className="order-item-name">{item.name}</div>
                        <div className="order-item-meta">
                          <span className="order-item-tag"><i className="ti ti-palette"></i>{item.color}</span>
                          <span className="order-item-tag"><i className="ti ti-ruler"></i>{item.size}</span>
                        </div>
                      </div>
                      <div className="order-item-price">
                        <div className="order-item-price-val">{fmt(item.price * (item.qty|| item.quantity || 1))}</div>
                        <div className="order-item-qty">Qty: {item.qty|| item.quantity || 1}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {hiddenCount > 0 && <div className="order-more"><i className="ti ti-dots"></i> +{hiddenCount} more item{hiddenCount>1?'s':''} in this order</div>}

                {(order.tracker !== null && order.tracker !== undefined && order.status !== 'cancelled' && order.status !== 'returned') && (
                  <div className="order-tracker">
                    <div className="tracker-label">Order Progress</div>
                    {renderTracker(order.tracker)}
                  </div>
                )}

                <div className="order-footer">
                  <div className="order-address"><i className="ti ti-map-pin"></i><span style={{marginLeft:6}}>{formatAddress(order.address)}</span></div>
                  <div className="order-actions">
                    {order.status === 'delivered' ? (
                      <>
                        <button className="btn-outline"><i className="ti ti-refresh"></i> Buy Again</button>
                        <button className="btn-outline"><i className="ti ti-star"></i> Rate</button>
                        <button className="btn-accent"><i className="ti ti-receipt"></i> Invoice</button>
                      </>
                    ) : order.status === 'shipped' ? (
                      <>
                        <button className="btn-outline"><i className="ti ti-map-pin"></i> Track</button>
                        <button className="btn-accent"><i className="ti ti-phone"></i> Contact Delivery</button>
                      </>
                    ) : order.status === 'processing' ? (
                      <>
                        <button className="btn-outline"><i className="ti ti-map-pin"></i> Track</button>
                        <button className="btn-ghost"><i className="ti ti-x"></i> Cancel</button>
                      </>
                    ) : order.status === 'cancelled' ? (
                      <>
                        <button className="btn-outline"><i className="ti ti-shopping-bag"></i> Reorder</button>
                        <button className="btn-outline"><i className="ti ti-help"></i> See Reason</button>
                      </>
                    ) : (
                      <button className="btn-outline"><i className="ti ti-refresh"></i> Help</button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <aside className="sidebar">
          <div className="sidebar-card">
            <div className="sidebar-header"><div className="sidebar-header-title">Order Overview</div></div>
            <div className="sidebar-body">
              <div className="stats-grid">
                <div className="stat-tile"><div className="stat-tile-icon"><i className="ti ti-package"></i></div><div className="stat-tile-val">{orderData.length}</div><div className="stat-tile-lbl">Total Orders</div></div>
                <div className="stat-tile"><div className="stat-tile-icon"><i className="ti ti-circle-check"></i></div><div className="stat-tile-val">{orderData.filter(o=>o.status==='delivered').length}</div><div className="stat-tile-lbl">Delivered</div></div>
                <div className="stat-tile"><div className="stat-tile-icon"><i className="ti ti-truck"></i></div><div className="stat-tile-val">{orderData.filter(o=>o.status==='shipped').length}</div><div className="stat-tile-lbl">In Transit</div></div>
                <div className="stat-tile"><div className="stat-tile-icon"><i className="ti ti-clock"></i></div><div className="stat-tile-val">{orderData.filter(o=>matchStatusKey(o.status,'processing')).length}</div><div className="stat-tile-lbl">Processing</div></div>
                <div className="stat-tile wide"><div className="stat-tile-icon"><i className="ti ti-currency-rupee"></i></div><div className="stat-tile-val">₹{orderData.reduce((a,o)=>a+(o.total||0),0)}</div><div className="stat-tile-lbl">Total Amount Spent</div></div>
              </div>
              <div className="reward-strip"><div className="reward-icon"><i className="ti ti-star"></i></div><div className="reward-text"><div className="reward-title">2,840 Reward Points</div><div className="reward-sub">Worth ₹284 on next order</div></div></div>
              <div className="divider" />
              <div style={{fontSize:11,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:'var(--clr-text-hint)',marginBottom:8}}>By Status</div>
              <div className="quick-nav">
                <a href="#" className="quick-nav-item" onClick={(e)=>{e.preventDefault(); setFilterLocal('all');}}><span className="quick-nav-dot" style={{background:'#A39E99'}}></span><span className="quick-nav-label">All Orders</span><span className="quick-nav-count">{orderData.length}</span></a>
                <a href="#" className="quick-nav-item" onClick={(e)=>{e.preventDefault(); setFilterLocal('packing');}}><span className="quick-nav-dot" style={{background:'#E8622A'}}></span><span className="quick-nav-label">Packing</span><span className="quick-nav-count">{orderData.filter(o=>matchStatusKey(o.status,'processing')).length}</span></a>
                <a href="#" className="quick-nav-item" onClick={(e)=>{e.preventDefault(); setFilterLocal('shipped');}}><span className="quick-nav-dot" style={{background:'#2C5FCC'}}></span><span className="quick-nav-label">Shipped</span><span className="quick-nav-count">{orderData.filter(o=>String(o.status||'').toLowerCase()==='shipped').length}</span></a>
                <a href="#" className="quick-nav-item" onClick={(e)=>{e.preventDefault(); setFilterLocal('delivered');}}><span className="quick-nav-dot" style={{background:'#2A7A4F'}}></span><span className="quick-nav-label">Delivered</span><span className="quick-nav-count">{orderData.filter(o=>String(o.status||'').toLowerCase()==='delivered').length}</span></a>
                <a href="#" className="quick-nav-item" onClick={(e)=>{e.preventDefault(); setFilterLocal('cancelled');}}><span className="quick-nav-dot" style={{background:'#C0392B'}}></span><span className="quick-nav-label">Cancelled</span><span className="quick-nav-count">{orderData.filter(o=>String(o.status||'').toLowerCase()==='cancelled').length}</span></a>
              </div>
            </div>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-body">
              <div style={{fontSize:13,fontWeight:700,color:'var(--clr-text-primary)',marginBottom:4}}>Need Help?</div>
              <div style={{fontSize:12,color:'var(--clr-text-secondary)',marginBottom:12}}>Our support team is available 9 AM – 9 PM, 7 days a week.</div>
              <button className="btn-accent" style={{width:'100%',justifyContent:'center'}}><i className="ti ti-headset"></i> Contact Support</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Orders
