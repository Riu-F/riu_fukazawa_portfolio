import React, { useState, useEffect } from 'react'
import TopBar from '../components/TopBar.jsx'
import Button from '../components/Button.jsx'
import { ZONE_CONFIG, ZONE_ORDER } from '../data/storeLayout.js'

export default function ShoppingList({ state, dispatch }) {
  const { shoppingList, clearingItemIds } = state
  const [removingIds, setRemovingIds] = useState(new Set())
  const [isRouting, setIsRouting] = useState(false)

  // Fire FINISH_CLEARING after the CSS animation completes
  const clearingSize = clearingItemIds ? clearingItemIds.size : 0
  useEffect(() => {
    if (clearingSize === 0) return
    const timer = setTimeout(() => {
      dispatch({ type: 'FINISH_CLEARING' })
    }, 750)
    return () => clearTimeout(timer)
  }, [clearingSize])

  function handleStartShop() {
    setIsRouting(true)
    setTimeout(() => {
      dispatch({ type: 'START_SHOPPING' })
    }, 1100)
  }

  function handleAddItem() {
    dispatch({ type: 'NAVIGATE', screen: 'addItem', source: 'preShopping' })
  }

  function handleRemoveItem(listId) {
    setRemovingIds((prev) => new Set([...prev, listId]))
    setTimeout(() => {
      dispatch({ type: 'REMOVE_FROM_LIST', listId })
      setRemovingIds((prev) => {
        const next = new Set(prev)
        next.delete(listId)
        return next
      })
    }, 240)
  }

  const estimatedTotal = shoppingList.reduce((sum, i) => sum + (i.price || 0), 0)

  // Zone groups used by the routing overlay
  const routingZoneGroups = ZONE_ORDER
    .filter(zone => shoppingList.some(i => i.zone === zone))
    .map(zone => ({
      zone,
      cfg: ZONE_CONFIG[zone],
      count: shoppingList.filter(i => i.zone === zone).length,
    }))

  return (
    <div className="screen screen-with-overlay">
      <TopBar title="My List" />

      <div className="sl-subheader">
        <div className="sl-store-row">
          <span className="sl-store-pin">📍</span>
          <span className="sl-store-name">Woolworths, Sydney</span>
          <button className="link-btn sl-change-store" onClick={() => {}}>
            Change
          </button>
        </div>
        {shoppingList.length > 0 && (
          <div className="sl-meta-row">
            <span className="sl-count-chip">
              {shoppingList.length} item{shoppingList.length !== 1 ? 's' : ''}
            </span>
            <span className="sl-estimate">est. ${estimatedTotal.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="screen-content">
        {shoppingList.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🛒</span>
            <p className="empty-state-title">Your list is empty</p>
            <p className="empty-state-body">Add some items to get started</p>
            <Button variant="primary" onClick={handleAddItem} style={{ marginTop: '16px' }}>
              + Add your first item
            </Button>
          </div>
        ) : (
          <div className="shopping-list">
            {shoppingList.map((item) => {
              const zoneCfg = ZONE_CONFIG[item.zone] || {}
              const isRemoving = removingIds.has(item.listId)
              const isClearing = clearingItemIds?.has(item.listId)
              return (
                <div
                  key={item.listId}
                  className={[
                    'list-item-row',
                    isRemoving ? 'list-item-removing' : '',
                    isClearing ? 'list-item-clearing' : '',
                  ].filter(Boolean).join(' ')}
                >
                  <div
                    className="list-item-icon-wrap"
                    style={{ backgroundColor: zoneCfg.lightColor || '#f0edf6' }}
                  >
                    <span className="list-item-emoji">{item.emoji}</span>
                  </div>
                  <div className="list-item-info">
                    <span className="list-item-name">{item.name}</span>
                    <span
                      className="list-item-category"
                      style={{ color: zoneCfg.color || '#9b8bb8' }}
                    >
                      {item.category}
                    </span>
                  </div>
                  <span className="list-item-price">${item.price?.toFixed(2)}</span>
                  <button
                    className="list-item-remove"
                    onClick={() => handleRemoveItem(item.listId)}
                    aria-label={`Remove ${item.name}`}
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {shoppingList.length > 0 && !clearingItemIds?.size && (
        <div className="screen-footer">
          <Button variant="primary" fullWidth onClick={handleStartShop}>
            Start my shop
          </Button>
          <Button variant="secondary" fullWidth onClick={handleAddItem}>
            + Add new item
          </Button>
        </div>
      )}

      {/* Route planning overlay */}
      {isRouting && (
        <div className="routing-overlay">
          <div className="routing-spinner" />
          <p className="routing-title">Planning your route…</p>
          <div className="routing-zones">
            {routingZoneGroups.map(({ zone, cfg, count }, i) => (
              <div
                key={zone}
                className="routing-zone-pill"
                style={{
                  backgroundColor: cfg.lightColor,
                  borderColor: cfg.color,
                  animationDelay: `${0.12 + i * 0.09}s`,
                }}
              >
                <span className="routing-zone-icon">{cfg.icon}</span>
                <span className="routing-zone-name">{zone}</span>
                <span className="routing-zone-count" style={{ color: cfg.color }}>
                  ×{count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
