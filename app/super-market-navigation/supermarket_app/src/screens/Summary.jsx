import React from 'react'
import Button from '../components/Button.jsx'

function formatDuration(ms) {
  if (!ms || ms < 1000) return '—'
  const totalSec = Math.floor(ms / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  if (min === 0) return `${sec}s`
  if (sec === 0) return `${min} min`
  return `${min}:${sec.toString().padStart(2, '0')}`
}

function getSubtitle(completed, total) {
  if (total === 0) return 'Your list is ready for next time.'
  const ratio = completed / total
  if (ratio === 1) return 'You got everything on your list.'
  if (ratio >= 0.75) return 'Nearly everything collected — great effort.'
  if (ratio >= 0.5) return 'Good progress today. Remaining items are saved.'
  if (ratio > 0) return 'A start is a start. The rest is saved on your list.'
  return 'Your remaining items are saved on your list.'
}

export default function Summary({ state, dispatch }) {
  const { completedItemIds, shoppingList, sessionStartTime, sessionEndTime } = state

  const completedItems = shoppingList.filter(i => completedItemIds.has(i.listId))
  const totalItems     = shoppingList.length
  const totalValue     = completedItems.reduce((sum, i) => sum + (i.price || 0), 0)
  const durationMs     = sessionStartTime && sessionEndTime ? sessionEndTime - sessionStartTime : 0

  const pct    = totalItems > 0 ? Math.round((completedItems.length / totalItems) * 100) : 0
  const allDone = completedItems.length === totalItems && totalItems > 0

  return (
    <div className="screen screen-summary">
      <div className="screen-content summary-content">

        {/* Animated check icon */}
        <div className="summary-check-icon">✓</div>

        <h1 className="summary-title">Shop complete</h1>
        <p className="summary-subtitle">{getSubtitle(completedItems.length, totalItems)}</p>

        {/* Items collected card */}
        <div className="summary-items-card">
          <div className="summary-items-header">
            <span className="summary-items-caption">Items collected</span>
            <span className="summary-items-fraction">
              {completedItems.length}<span className="summary-items-of"> of {totalItems}</span>
            </span>
          </div>
          <div className="summary-items-bar">
            <div className="summary-items-fill" style={{ width: `${pct}%` }} />
          </div>
          {allDone && <span className="summary-all-done-tag">All done ✓</span>}
        </div>

        {/* Time + total side by side */}
        <div className="summary-metrics-row">
          <div className="summary-metric-card">
            <span className="summary-metric-value">{formatDuration(durationMs)}</span>
            <span className="summary-metric-label">Time in store</span>
          </div>
          <div className="summary-metric-card">
            <span className="summary-metric-value">${totalValue.toFixed(2)}</span>
            <span className="summary-metric-label">Est. total</span>
          </div>
        </div>

      </div>

      <div className="screen-footer">
        <Button variant="primary" fullWidth onClick={() => dispatch({ type: 'BACK_TO_LIST' })}>
          Back to list
        </Button>
        <Button
          variant="secondary"
          fullWidth
          data-demo="start-new-shop"
          onClick={() => dispatch({ type: 'START_NEW_SHOP' })}
        >
          Start a new shop
        </Button>
      </div>
    </div>
  )
}
