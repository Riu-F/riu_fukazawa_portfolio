import React, { useState, useRef, useEffect } from 'react'
import TopBar from '../components/TopBar.jsx'
import { ITEMS } from '../data/items.js'
import { ZONE_CONFIG } from '../data/storeLayout.js'

const CATEGORIES = ['Produce', 'Bakery', 'Dairy', 'Frozen', 'Snacks', 'Beverages', 'Household']

export default function AddItem({ state, dispatch }) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [recentlyAdded, setRecentlyAdded] = useState(new Set())
  const searchRef = useRef(null)

  const { addItemSource, shoppingList } = state
  const isMidShop = addItemSource === 'midShopping'

  // Count how many times each item id is already in the list
  const listCountById = shoppingList.reduce((acc, li) => {
    acc[li.id] = (acc[li.id] || 0) + 1
    return acc
  }, {})

  useEffect(() => {
    // Auto-focus search on mount
    setTimeout(() => searchRef.current?.focus(), 120)
  }, [])

  function handleBack() {
    const target = isMidShop ? 'storeMap' : 'shoppingList'
    dispatch({ type: 'NAVIGATE', screen: target })
  }

  function handleAdd(item) {
    dispatch({ type: 'ADD_TO_LIST', item })
    // Track brief ✓ feedback per item slot (keyed by id for simplicity)
    setRecentlyAdded((prev) => new Set([...prev, item.id]))
    setTimeout(() => {
      setRecentlyAdded((prev) => {
        const next = new Set(prev)
        next.delete(item.id)
        return next
      })
    }, 1200)
  }

  const isSearching = search.trim().length > 0

  const visibleItems = ITEMS.filter((item) => {
    const matchesSearch = isSearching
      ? item.name.toLowerCase().includes(search.toLowerCase())
      : true
    const matchesCategory = activeCategory ? item.category === activeCategory : true
    return matchesSearch && matchesCategory
  })

  // Popular picks: first 8 items when no search or category active
  const displayItems = isSearching || activeCategory ? visibleItems : ITEMS.slice(0, 8)

  const sectionTitle = isSearching
    ? `"${search}"`
    : activeCategory
    ? activeCategory
    : 'Popular picks'

  return (
    <div className="screen">
      <TopBar title="Add Item" onBack={handleBack} />

      {isMidShop && (
        <div className="ai-mid-banner">
          <span className="ai-mid-banner-dot" />
          Shopping in progress — items added will update your route
        </div>
      )}

      <div className="screen-content ai-content">
        {/* Search bar */}
        <div className="search-bar-wrap">
          <span className="search-icon">🔍</span>
          <input
            ref={searchRef}
            className="search-input"
            type="text"
            placeholder="Search for an item…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear search">
              ×
            </button>
          )}
        </div>

        {/* Category grid — always visible */}
        <div className="category-section">
          <h2 className="section-title">Browse categories</h2>
          <div className="category-grid">
            {CATEGORIES.map((cat) => {
              const cfg = ZONE_CONFIG[cat]
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  className={`category-card ${isActive ? 'category-card-active' : ''}`}
                  style={{
                    backgroundColor: isActive ? cfg.color : cfg.lightColor,
                    borderColor: isActive ? cfg.color : 'transparent',
                  }}
                  onClick={() => setActiveCategory(isActive ? null : cat)}
                >
                  <span className="category-card-icon">{cfg.icon}</span>
                  <span className="category-card-label">{cat}</span>
                </button>
              )
            })}
          </div>
          {activeCategory && (
            <button
              className="ai-clear-filter"
              onClick={() => setActiveCategory(null)}
            >
              × Clear filter
            </button>
          )}
        </div>

        {/* Items list */}
        <div className="items-section">
          <div className="ai-section-header">
            <h2 className="section-title">{sectionTitle}</h2>
            {(isSearching || activeCategory) && displayItems.length > 0 && (
              <span className="ai-result-count">{displayItems.length} item{displayItems.length !== 1 ? 's' : ''}</span>
            )}
          </div>

          {displayItems.length === 0 ? (
            <div className="empty-state ai-empty">
              <span className="empty-state-icon">🔍</span>
              <p className="empty-state-title">No results</p>
              <p className="empty-state-body">
                {isSearching
                  ? `Nothing found for "${search}"`
                  : 'No items in this category'}
              </p>
            </div>
          ) : (
            <div className="add-item-list">
              {displayItems.map((item) => {
                const inList = listCountById[item.id] || 0
                const justAdded = recentlyAdded.has(item.id)
                return (
                  <div key={item.id} className={`add-item-row ${justAdded ? 'add-item-row-flash' : ''}`}>
                    <div
                      className="add-item-icon-wrap"
                      style={{ backgroundColor: ZONE_CONFIG[item.zone]?.lightColor || '#f0edf6' }}
                    >
                      <span className="add-item-emoji">{item.emoji}</span>
                    </div>
                    <div className="add-item-info">
                      <span className="add-item-name">{item.name}</span>
                      <span className="add-item-category">{item.category}</span>
                    </div>
                    <span className="add-item-price">${item.price?.toFixed(2)}</span>
                    <button
                      className={`add-item-btn ${justAdded ? 'add-item-btn-added' : ''}`}
                      onClick={() => handleAdd(item)}
                      aria-label={`Add ${item.name}`}
                    >
                      {justAdded ? '✓' : inList > 0 ? `+${inList}` : '+'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
