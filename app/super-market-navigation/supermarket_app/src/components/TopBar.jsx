import React from 'react'

export default function TopBar({ title, subtitle, onBack, rightAction }) {
  return (
    <div className="topbar">
      <div className="topbar-left">
        {onBack && (
          <button className="topbar-back" onClick={onBack} aria-label="Go back">
            <span className="topbar-back-icon">←</span>
          </button>
        )}
      </div>
      <div className="topbar-center">
        <h1 className="topbar-title">{title}</h1>
        {subtitle && <p className="topbar-subtitle">{subtitle}</p>}
      </div>
      <div className="topbar-right">
        {rightAction && rightAction}
      </div>
    </div>
  )
}
