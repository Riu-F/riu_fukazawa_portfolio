import React from 'react'

export default function ItemCard({
  item,
  onAdd,
  onRemove,
  onComplete,
  completed = false,
  showAdd = false,
  showRemove = false,
  showComplete = false,
  quantity = 1,
}) {
  return (
    <div className={`item-card ${completed ? 'item-card-completed' : ''}`}>
      <div className="item-card-icon">
        <span className="item-emoji">{item.emoji}</span>
      </div>
      <div className="item-card-info">
        <span className="item-name">{item.name}{quantity > 1 ? ` ×${quantity}` : ''}</span>
        <span className="item-category">{item.category}</span>
      </div>
      <div className="item-card-actions">
        {showAdd && (
          <button
            className="item-action-btn item-action-add"
            onClick={() => onAdd(item)}
            aria-label={`Add ${item.name}`}
          >
            +
          </button>
        )}
        {showRemove && (
          <button
            className="item-action-btn item-action-remove"
            onClick={() => onRemove(item)}
            aria-label={`Remove ${item.name}`}
          >
            ×
          </button>
        )}
        {showComplete && (
          <button
            className={`item-complete-btn ${completed ? 'item-complete-done' : ''}`}
            onClick={() => onComplete(item)}
            aria-label={completed ? `${item.name} collected` : `Mark ${item.name} as collected`}
          >
            {completed ? '✓' : ''}
          </button>
        )}
      </div>
    </div>
  )
}
