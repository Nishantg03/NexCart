import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import heroBanner1 from '../assets/download (1).jpeg'
import heroBanner2 from '../assets/download (2).jpeg'
import heroBanner3 from '../assets/download (3).jpeg'
import heroBanner4 from '../assets/download (4).jpeg'

const Collection = () => {
  const context = useContext(ShopContext)
  const products = context?.products || []
  const { fetchProducts, addtocart } = context || {}

  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [filterProducts, setFilterProducts] = useState([])
  const [sortBy, setSortBy] = useState('relevant')
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredProduct, setHoveredProduct] = useState(null)
  const productsPerPage = 12

  const heroImages = [
    { src: heroBanner1, alt: 'Fashion campaign in a blue sky setting' },
    { src: heroBanner2, alt: 'Fashion campaign in a sculptural green landscape' },
    { src: heroBanner3, alt: 'Fashion campaign on sunlit rocks' },
    { src: heroBanner4, alt: 'Fashion campaign with cloud-inspired styling' },
  ]

  useEffect(() => {
    fetchProducts?.()
  }, [fetchProducts])

  useEffect(() => {
    // derive filtered products from products + filters
    let res = Array.isArray(products) ? [...products] : []
    if (category.length) {
      res = res.filter((p) => category.includes(String(p.category || '').toLowerCase()))
    }
    if (subCategory.length) {
      res = res.filter((p) => subCategory.includes(String(p.subCategory || p.subcategory || '').toLowerCase()))
    }
    // sorting
    if (sortBy === 'price-low') res.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-desc' || sortBy === 'price-high') res.sort((a, b) => b.price - a.price)
    else if (sortBy === 'newest') res.sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0))

    setFilterProducts(res)
    setCurrentPage(1)
  }, [products, category, subCategory, sortBy])

  const toggleCategory = (value) => {
    const key = String(value).toLowerCase()
    setCategory((prev) => (prev.includes(key) ? prev.filter((v) => v !== key) : [...prev, key]))
  }
  const toggleSubCategory = (value) => {
    const key = String(value).toLowerCase()
    setSubCategory((prev) => (prev.includes(key) ? prev.filter((v) => v !== key) : [...prev, key]))
  }

  const totalPages = Math.max(1, Math.ceil(filterProducts.length / productsPerPage))
  const start = (currentPage - 1) * productsPerPage
  const paginatedProducts = filterProducts.slice(start, start + productsPerPage)

  return (
    <div className="collection-page">
      <section className="collection-hero">
        <div className="collection-hero-inner">
          <div className="collection-hero-copy">
            <div className="collection-hero-badge">New Season</div>
            <h1 className="collection-hero-title">Style for Every Story</h1>
            <p className="collection-hero-subtitle">From everyday staples to statement pieces — explore our curated collection for men, women, and children.</p>
          </div>
          <div className="collection-hero-gallery">
            {heroImages.slice(0,4).map((h,i)=>(
              <div key={i} className="collection-hero-tile">
                <img src={h.src} alt={h.alt} className="collection-hero-image"/>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{maxWidth:1200,margin:'24px auto',padding:'0 16px'}}>
        <div className="collection-toolbar">
          <div className="collection-filters">
            <button onClick={()=>toggleCategory('men')} className={`filter-pill ${category.includes('men')? 'active':''}`}>Men</button>
            <button onClick={()=>toggleCategory('women')} className={`filter-pill ${category.includes('women')? 'active':''}`}>Women</button>
            <button onClick={()=>toggleCategory('kids')} className={`filter-pill ${category.includes('kids')? 'active':''}`}>Kids</button>
          </div>
          <div className="collection-sorter">
            <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)} className="collection-sort-select">
              <option value="relevant">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <main>
          <div className="product-grid">
            {paginatedProducts.length === 0 ? (
              <div style={{gridColumn:'1/-1',textAlign:'center',padding:48}}>No products found</div>
            ) : paginatedProducts.map((item) => (
              <article key={item._id} className="product-card" onMouseEnter={()=>setHoveredProduct(item._id)} onMouseLeave={()=>setHoveredProduct(null)}>
                <div style={{position:'relative',background:'var(--clr-bg-muted)'}}>
                  <Link to={`/product/${item._id}`}>
                    <img src={item.image?.[0]} alt={item.name} style={{width:'100%',height:260,objectFit:'cover',display:'block'}} />
                  </Link>
                </div>
                <div style={{padding:12}}>
                  <div style={{fontSize:12,color:'var(--clr-text-secondary)'}}>{item.category}</div>
                  <Link to={`/product/${item._id}`}><div style={{fontSize:14,fontWeight:600,margin:'6px 0'}}>{item.name}</div></Link>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{fontWeight:700}}>₹{item.price}</div>
                    <button onClick={()=>addtocart?.(item._id, 'M')} style={{background:'#111',color:'#fff',padding:'8px 12px',borderRadius:8}}>Add</button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:28}}>
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>‹</button>
              {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                let pageNum
                if (totalPages <= 5) pageNum = i + 1
                else if (currentPage <= 3) pageNum = i + 1
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i
                else pageNum = currentPage - 2 + i
                return (
                  <button key={pageNum} onClick={() => setCurrentPage(pageNum)} style={{padding:8,borderRadius:6,background: currentPage===pageNum ? '#111' : 'transparent',color: currentPage===pageNum ? '#fff' : '#111'}}>{pageNum}</button>
                )
              })}
              <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>›</button>
            </div>
          )}
        </main>
      </div>

      <footer className="collection-footer">© 2026 · ShopNest</footer>
    </div>
  )
}

export default Collection
