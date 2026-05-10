import React, { useState, useEffect, useRef } from 'react'
import { ZONE_CONFIG } from '../data/storeLayout.js'

const MAP_ZONES = [
  'Entrance', 'Produce', 'Bakery', 'Dairy',
  'Frozen', 'Snacks', 'Beverages', 'Household', 'Checkout',
]

// Reversed for rendering: upcoming zones appear above, completed below
const MAP_ZONES_REVERSED = [...MAP_ZONES].reverse()

// ─── Location language helpers ────────────────────────────────────────────────

function shelfSideLabel(side) {
  return { left: 'Left shelf', right: 'Right shelf', centre: 'Centre', center: 'Centre' }[side] || ''
}

function shelfRowLabel(row) {
  return { 1: 'Top shelf', 2: 'Middle shelf', 3: 'Lower shelf', 4: 'Bottom shelf' }[row]
    || (row ? `Shelf ${row}` : '')
}

function buildLocationHint(item) {
  if (!item) return 'Check the shelves in this zone.'
  const side = {
    left: 'on the left side', right: 'on the right side',
    centre: 'in the middle', center: 'in the middle',
  }[item.shelfSide] || ''
  const level = { 1: 'at the top', 2: 'in the middle', 3: 'lower down', 4: 'at the bottom' }[item.shelfRow] || ''
  const mark = item.landmark || ''
  if (side && level && mark) return `Look ${side}, ${level} of the shelf. ${mark}.`
  if (side && level) return `Look ${side}, ${level} of the shelf.`
  if (side && mark) return `Look ${side}. ${mark}.`
  if (mark) return mark + '.'
  if (side) return `Look ${side} of the aisle.`
  return 'Check the shelves in this zone.'
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function StoreMap({ state, dispatch }) {
  const {
    routeStops, currentStopIndex, completedItemIds,
    mapOverviewMode, focusModeEnabled, shoppingList,
  } = state

  const [inspectedIndex, setInspectedIndex]   = useState(currentStopIndex)
  const [focusItemIdx, setFocusItemIdx]        = useState(0)
  const [showExitModal, setShowExitModal]      = useState(false)
  const [helpState, setHelpState]              = useState({ open: false, level: 1, item: null })
  const [showRouteToast, setShowRouteToast]    = useState(false)
  const [movingToZone, setMovingToZone]        = useState(null)

  const mapRef       = useRef(null)
  const isMounted    = useRef(false)
  const prevRouteLen = useRef(routeStops.length)

  // Derive next stop
  const nextStopIndex = currentStopIndex + 1
  const nextStop      = routeStops[nextStopIndex] ?? null

  // Reset inspected stop & focus item when route advances; show moving-to toast
  useEffect(() => {
    setInspectedIndex(currentStopIndex)
    setFocusItemIdx(0)
    if (isMounted.current && routeStops[currentStopIndex]) {
      const zone = routeStops[currentStopIndex].zone
      setMovingToZone(zone)
      const t = setTimeout(() => setMovingToZone(null), 1800)
      return () => clearTimeout(t)
    }
  }, [currentStopIndex])

  // Route-change toast (skip initial mount)
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      prevRouteLen.current = routeStops.length
      return
    }
    if (routeStops.length !== prevRouteLen.current) {
      prevRouteLen.current = routeStops.length
      setShowRouteToast(true)
      const t = setTimeout(() => setShowRouteToast(false), 2500)
      return () => clearTimeout(t)
    }
  }, [routeStops.length])

  // Scroll current zone to the bottom of the visible map — creates the
  // anchored-position feel. In the reversed layout upcoming zones are above,
  // completed zones sink below.
  useEffect(() => {
    if (mapRef.current) {
      const el = mapRef.current.querySelector('.zone-row-current')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [mapOverviewMode, focusModeEnabled, currentStopIndex])

  // Build zone → stop lookup
  const stopByZone = {}
  routeStops.forEach((stop, idx) => {
    stopByZone[stop.zone] = { ...stop, routeIndex: idx }
  })

  // Original MAP_ZONES index of the current stop's zone
  const currentZoneMapIdx = routeStops[currentStopIndex]
    ? MAP_ZONES.indexOf(routeStops[currentStopIndex].zone) : 0

  const totalItems     = shoppingList.length
  const completedCount = completedItemIds.size

  function getStatus(routeIndex) {
    if (routeIndex < currentStopIndex) return 'completed'
    if (routeIndex === currentStopIndex) return 'current'
    return 'upcoming'
  }

  function groupItems(stop) {
    if (!stop) return []
    const groups = {}
    stop.items.forEach((li) => {
      if (!groups[li.id]) groups[li.id] = { ...li, count: 0, listIds: [] }
      groups[li.id].count++
      groups[li.id].listIds.push(li.listId)
    })
    return Object.values(groups)
  }

  function handleToggleGroup(group) {
    const allDone = group.listIds.every(id => completedItemIds.has(id))
    group.listIds.forEach(id =>
      dispatch({ type: allDone ? 'UNCOMPLETE_ITEM' : 'COMPLETE_ITEM', listId: id })
    )
  }

  function openHelp(item) {
    setHelpState({ open: true, level: 1, item })
  }

  function closeHelp() {
    setHelpState({ open: false, level: 1, item: null })
  }

  const inspectedStop  = routeStops[inspectedIndex] ?? routeStops[currentStopIndex]
  const currentStop    = routeStops[currentStopIndex]
  const currentGrouped = groupItems(currentStop)
  const isLastStop     = currentStopIndex >= routeStops.length - 1

  return (
    <div className={[
      'screen screen-map',
      mapOverviewMode  ? 'map-overview'  : 'map-current',
      focusModeEnabled ? 'focus-mode-on' : '',
    ].filter(Boolean).join(' ')}>

      {/* ── Top bar ── */}
      <div className="sm-topbar">
        <button className="topbar-back" onClick={() => setShowExitModal(true)} aria-label="Exit shop">
          ←
        </button>
        <div className="sm-topbar-center">
          <span className="sm-topbar-title">Store Map</span>
          <span className="sm-topbar-subtitle">Woolworths, Sydney</span>
        </div>
        <div className="sm-topbar-actions">
          <button
            className={`sm-focus-pill ${focusModeEnabled ? 'sm-focus-on' : ''}`}
            onClick={() => dispatch({ type: 'TOGGLE_FOCUS_MODE' })}
            aria-label={`Focus mode ${focusModeEnabled ? 'on' : 'off'}`}
          >
            {focusModeEnabled ? '🎯 Focus' : 'Focus'}
          </button>
          <button
            className={`sm-overview-btn ${mapOverviewMode ? 'sm-overview-active' : ''}`}
            onClick={() => dispatch({ type: 'TOGGLE_MAP_OVERVIEW' })}
          >
            {mapOverviewMode ? 'Close' : 'Map'}
          </button>
        </div>
      </div>

      {/* ── Scrollable map — rendered bottom→top (Checkout at top, Entrance at bottom) ── */}
      <div className="sm-map-area" ref={mapRef}>
        <div className="store-diagram">
          {MAP_ZONES_REVERSED.map((zone, i) => {
            const cfg     = ZONE_CONFIG[zone]
            const stopData = stopByZone[zone]
            const status   = stopData ? getStatus(stopData.routeIndex) : null

            // origIdx: position in the original Entrance→Checkout order
            // In the reversed display: origIdx increases going DOWN the screen (toward Entrance)
            const origIdx = MAP_ZONES.length - 1 - i

            // Terminal edges in reversed rendering
            const isFirstRendered = i === 0                       // Checkout — no segment above
            const isLastRendered  = i === MAP_ZONES.length - 1   // Entrance — no segment below

            const isInspected   = stopData != null && stopData.routeIndex === inspectedIndex
            const isCurrentZone = status === 'current'
            const isNextZone    = stopData != null && stopData.routeIndex === nextStopIndex

            // Route line: path walks from low origIdx (Entrance, bottom of screen)
            // upward toward high origIdx (Checkout, top of screen).
            //
            // Top segment — connects upward to origIdx+1 (upcoming direction):
            //   filled if we've already walked past origIdx+1 → origIdx < currentZoneMapIdx
            // Bottom segment — connects downward to origIdx-1 (completed direction):
            //   filled if this zone and below are all walked → origIdx <= currentZoneMapIdx
            const topFilled    = !isFirstRendered && origIdx < currentZoneMapIdx
            const bottomFilled = !isLastRendered  && origIdx <= currentZoneMapIdx

            // Animated segment sits between current and next stop only
            const topActiveFlow    = isCurrentZone && !isFirstRendered && nextStop != null
            const bottomActiveFlow = isNextZone    && !isLastRendered

            // Distance class drives opacity — shows only current + near neighbours
            const routeDist = stopData ? stopData.routeIndex - currentStopIndex : null
            const relClass  =
              routeDist === null ? '' :
              routeDist ===  0  ? 'zone-rel-current' :
              routeDist ===  1  ? 'zone-rel-next' :
              routeDist ===  2  ? 'zone-rel-near-future' :
              routeDist  >   2  ? 'zone-rel-far-future' :
              routeDist === -1  ? 'zone-rel-recent-past' :
              'zone-rel-far-past'

            const aisle    = stopData?.items[0]?.aisle
            const sublabel = aisle || null   // aisle only — no item counts on the map

            return (
              <div
                key={zone}
                className={[
                  'zone-row',
                  status ? `zone-row-${status}` : 'zone-row-pass',
                  relClass,
                  isInspected ? 'zone-row-inspected' : '',
                ].filter(Boolean).join(' ')}
              >
                <div className="zone-route-col">
                  {/* Top segment — points toward upcoming (upward on screen) */}
                  <div className={[
                    'route-seg',
                    isFirstRendered ? 'route-seg-hide' : '',
                    topFilled       ? 'route-seg-filled' : '',
                    topActiveFlow   ? 'route-seg-active-flow' : '',
                  ].filter(Boolean).join(' ')} />

                  <div className="zone-marker-slot">
                    {stopData ? (
                      <button
                        className={[
                          'stop-mrk', `stop-mrk-${status}`,
                          isNextZone ? 'stop-mrk-next' : '',
                          isInspected ? 'stop-mrk-inspected' : '',
                        ].filter(Boolean).join(' ')}
                        style={status === 'upcoming' ? { borderColor: cfg.color } : undefined}
                        onClick={() => setInspectedIndex(stopData.routeIndex)}
                        aria-label={zone}
                      >
                        {status === 'completed' ? '✓' : status === 'current' ? '↑' : ''}
                      </button>
                    ) : (
                      <div className={`zone-node-dot ${zone === 'Entrance' || zone === 'Checkout' ? 'zone-node-terminal' : ''}`} />
                    )}
                  </div>

                  {/* Bottom segment — points toward completed (downward on screen) */}
                  <div className={[
                    'route-seg',
                    isLastRendered    ? 'route-seg-hide' : '',
                    bottomFilled      ? 'route-seg-filled' : '',
                    bottomActiveFlow  ? 'route-seg-active-flow' : '',
                  ].filter(Boolean).join(' ')} />
                </div>

                {isCurrentZone && currentStop ? (
                  <AisleModule
                    zone={zone}
                    cfg={cfg}
                    stop={currentStop}
                    grouped={currentGrouped}
                    completedItemIds={completedItemIds}
                    onToggle={handleToggleGroup}
                    onClick={() => setInspectedIndex(stopData.routeIndex)}
                  />
                ) : (
                  <div
                    className={[
                      'zone-block',
                      status ? `zone-block-${status}` : 'zone-block-pass',
                      isInspected ? 'zone-block-inspected' : '',
                    ].filter(Boolean).join(' ')}
                    style={status === 'current' ? { borderLeftColor: cfg.color } : undefined}
                    onClick={stopData ? () => setInspectedIndex(stopData.routeIndex) : undefined}
                    role={stopData ? 'button' : undefined}
                  >
                    <div className="zone-block-text">
                      <span className="zone-block-name">{zone}</span>
                      {sublabel && <span className="zone-block-sub">{sublabel}</span>}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Bottom panel ── */}
      <div className="sm-bottom">
        {/* Progress */}
        <div className="sm-progress-row">
          <div className="sm-progress-track">
            <div className="sm-progress-fill" style={{ width: totalItems > 0 ? `${Math.round((completedCount / totalItems) * 100)}%` : '0%' }} />
          </div>
          <span className="sm-progress-label">{completedCount} of {totalItems}</span>
        </div>

        {/* Focus Mode card OR default stop card */}
        {focusModeEnabled && currentStop ? (
          <FocusCard
            stop={currentStop}
            grouped={currentGrouped}
            focusItemIdx={focusItemIdx}
            setFocusItemIdx={setFocusItemIdx}
            completedItemIds={completedItemIds}
            onToggleGroup={handleToggleGroup}
            onContinue={() => dispatch({ type: 'ADVANCE_STOP' })}
            onHelp={openHelp}
            isLastStop={isLastStop}
            nextStop={nextStop}
          />
        ) : inspectedStop ? (
          <StopCard
            stop={inspectedStop}
            status={getStatus(inspectedIndex)}
            isCurrentStop={inspectedIndex === currentStopIndex}
            isLastStop={isLastStop}
            grouped={groupItems(inspectedStop)}
            completedItemIds={completedItemIds}
            onToggleGroup={handleToggleGroup}
            onContinue={() => dispatch({ type: 'ADVANCE_STOP' })}
            onHelp={openHelp}
          />
        ) : null}
      </div>

      {/* ── Transition toast ── */}
      {movingToZone && (
        <div className="sm-moving-toast">Moving to {movingToZone}…</div>
      )}

      {/* ── Route updated toast ── */}
      {showRouteToast && <div className="sm-route-toast">✓ Route updated</div>}

      {/* ── Help sheet ── */}
      {helpState.open && (
        <HelpSheet
          item={helpState.item}
          level={helpState.level}
          onLevelUp={() => setHelpState(s => ({ ...s, level: Math.min(s.level + 1, 3) }))}
          onClose={closeHelp}
        />
      )}

      {/* ── Exit modal ── */}
      {showExitModal && (
        <div className="sm-modal-wrap" onClick={() => setShowExitModal(false)}>
          <div className="sm-modal" onClick={e => e.stopPropagation()}>
            <span className="sm-modal-icon">🛒</span>
            <p className="sm-modal-title">Leave the shop?</p>
            <p className="sm-modal-body">Your remaining items will be saved to your list.</p>
            <div className="sm-modal-actions">
              <button className="sm-modal-btn sm-modal-keep" onClick={() => setShowExitModal(false)}>Keep shopping</button>
              <button className="sm-modal-btn sm-modal-leave" onClick={() => dispatch({ type: 'EXIT_SHOPPING' })}>Leave for now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Aisle Module (active zone — expanded in-aisle view) ─────────────────────

function AisleModule({ zone, cfg, stop, grouped, completedItemIds, onToggle, onClick }) {
  const aisle = stop.items[0]?.aisle

  return (
    <div className="aisle-module" style={{ borderTopColor: cfg?.color }} onClick={onClick}>
      <div className="aisle-header">
        <span className="aisle-header-name" style={{ color: cfg?.color }}>{zone}</span>
        {aisle && <span className="aisle-header-label">{aisle}</span>}
      </div>
      <div className="aisle-body">
        <div className="aisle-shelf aisle-shelf-l" style={{ backgroundColor: cfg?.lightColor }} />
        <div className="aisle-walkpath" />
        <div className="aisle-shelf aisle-shelf-r" style={{ backgroundColor: cfg?.lightColor }} />
        {grouped.map(g => {
          const done     = g.listIds.every(id => completedItemIds.has(id))
          const progress = g.aisleProgress ?? 0.5
          const side     = g.shelfSide === 'right' ? 'right' : g.shelfSide === 'centre' ? 'centre' : 'left'
          return (
            <div
              key={g.id}
              className={`aisle-stop aisle-stop-${side} ${done ? 'aisle-stop-done' : ''}`}
              style={{ left: `${Math.min(Math.max(progress, 0.05), 0.95) * 100}%` }}
              onClick={e => { e.stopPropagation(); onToggle(g) }}
            >
              <span className="aisle-stop-dot" />
              <span className="aisle-stop-label">
                {g.emoji} {g.count > 1 ? `${g.name} ×${g.count}` : g.name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Default stop card ────────────────────────────────────────────────────────

function StopCard({ stop, status, isCurrentStop, isLastStop, grouped, completedItemIds, onToggleGroup, onContinue, onHelp }) {
  const cfg             = ZONE_CONFIG[stop.zone]
  const locationHintTxt = stop.items[0]?.landmark || stop.items[0]?.aisle || null
  const allDone         = stop.items.every(li => completedItemIds.has(li.listId))

  return (
    <div className={`sm-stop-card ${isCurrentStop ? 'sm-stop-card-active' : 'sm-stop-card-peek'}`}>
      <div className="sm-card-header" style={{ borderLeftColor: cfg?.color }}>
        <div className="sm-card-icon-wrap" style={{ backgroundColor: cfg?.lightColor }}>
          <span className="sm-card-zone-icon">{cfg?.icon}</span>
        </div>
        <div className="sm-card-title">
          <span className="sm-card-zone">{stop.zone}</span>
          {locationHintTxt && <span className="sm-card-location">{locationHintTxt}</span>}
        </div>
        {!isCurrentStop && (
          <span className={`sm-card-badge sm-badge-${status}`}>
            {status === 'completed' ? 'Done' : 'Upcoming'}
          </span>
        )}
      </div>

      <div className="sm-card-items">
        {grouped.map(g => {
          const done  = g.listIds.every(id => completedItemIds.has(id))
          const side  = shelfSideLabel(g.shelfSide)
          const level = shelfRowLabel(g.shelfRow)
          const loc   = [side, level].filter(Boolean).join(' · ')
          return (
            <div key={g.id} className={`sm-item-row ${done ? 'sm-item-row-done' : ''}`}>
              <button
                className={`sm-item-circle ${done ? 'sm-item-circle-done' : ''}`}
                onClick={() => onToggleGroup(g)}
                aria-label={done ? `Unmark ${g.name}` : `Mark ${g.name} as collected`}
              >
                {done ? '✓' : ''}
              </button>
              <div className="sm-item-text-block" onClick={() => onToggleGroup(g)}>
                <span className="sm-item-label">
                  {g.name}{g.count > 1 && <span className="sm-item-qty"> ×{g.count}</span>}
                </span>
                {loc && <span className="sm-item-loc">{loc}</span>}
              </div>
              <div className="sm-item-right">
                <img
                  className="sm-item-product-img"
                  src={`https://placehold.co/36x36/${(ZONE_CONFIG[g.zone]?.lightColor || '#ede8f7').slice(1)}/${(ZONE_CONFIG[g.zone]?.color || '#7c4dbd').slice(1)}?text=${encodeURIComponent(g.name.substring(0, 4))}`}
                  alt={g.name}
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
                <button
                  className="sm-item-help-btn"
                  onClick={() => onHelp(g)}
                  aria-label={`Help finding ${g.name}`}
                >
                  ?
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {isCurrentStop && (
        <button className="sm-continue-btn" onClick={onContinue}>
          {isLastStop ? '🎉 Finish shop' : allDone ? 'Continue →' : 'Skip stop →'}
        </button>
      )}
    </div>
  )
}

// ─── Focus Mode card ──────────────────────────────────────────────────────────

function FocusCard({ stop, grouped, focusItemIdx, setFocusItemIdx, completedItemIds, onToggleGroup, onContinue, onHelp, isLastStop, nextStop }) {
  const cfg     = ZONE_CONFIG[stop.zone]
  const safeIdx = Math.min(focusItemIdx, Math.max(0, grouped.length - 1))
  const item    = grouped[safeIdx]

  if (!item) return null

  const done      = item.listIds.every(id => completedItemIds.has(id))
  const allDone   = stop.items.every(li => completedItemIds.has(li.listId))
  const side      = shelfSideLabel(item.shelfSide)
  const level     = shelfRowLabel(item.shelfRow)
  const nextAisle = nextStop?.items[0]?.aisle

  return (
    <div className="focus-card">
      {/* Zone + aisle header strip */}
      <div className="focus-zone-row" style={{ backgroundColor: cfg?.lightColor, borderLeftColor: cfg?.color }}>
        <span className="focus-zone-icon">{cfg?.icon}</span>
        <span className="focus-zone-name">{stop.zone}</span>
        {item.aisle && <span className="focus-aisle">{item.aisle}</span>}
        {grouped.length > 1 && (
          <span className="focus-item-count">{safeIdx + 1} / {grouped.length}</span>
        )}
      </div>

      {/* Directive walk-to instruction */}
      {nextStop && (
        <div className="focus-walk-hint">
          ↑ Go to {nextStop.zone}{nextAisle ? ` · ${nextAisle}` : ''}
        </div>
      )}

      {/* Main item display */}
      <div className="focus-item-display">
        <span className="focus-emoji">{item.emoji}</span>
        <span className="focus-item-name">
          {item.name}
          {item.count > 1 && <span className="focus-qty"> ×{item.count}</span>}
        </span>
        {item.landmark && <span className="focus-landmark">{item.landmark}</span>}
        {(side || level) && (
          <div className="focus-shelf">
            {side  && <span className="focus-shelf-pill">{side}</span>}
            {level && <span className="focus-shelf-pill">{level}</span>}
          </div>
        )}
      </div>

      {/* Collect button */}
      <button
        className={`focus-collect-btn ${done ? 'focus-collect-done' : ''}`}
        onClick={() => onToggleGroup(item)}
      >
        {done ? '✓ Collected' : 'Tap when you have it'}
      </button>

      {/* Help link */}
      <button className="focus-help-link" onClick={() => onHelp(item)}>
        Can't find it?
      </button>

      {/* Item navigation — only if multiple items at this stop */}
      {grouped.length > 1 && (
        <div className="focus-nav">
          <button
            className="focus-nav-btn"
            onClick={() => setFocusItemIdx(i => Math.max(0, i - 1))}
            disabled={safeIdx === 0}
          >
            ← Prev
          </button>
          <span className="focus-nav-dots">
            {grouped.map((g, i) => {
              const isDone = g.listIds.every(id => completedItemIds.has(id))
              return (
                <span
                  key={g.id}
                  className={['focus-dot', i === safeIdx ? 'focus-dot-active' : '', isDone ? 'focus-dot-done' : ''].filter(Boolean).join(' ')}
                />
              )
            })}
          </span>
          <button
            className="focus-nav-btn"
            onClick={() => setFocusItemIdx(i => Math.min(grouped.length - 1, i + 1))}
            disabled={safeIdx >= grouped.length - 1}
          >
            Next →
          </button>
        </div>
      )}

      {/* Continue when all items at stop are done */}
      {allDone && (
        <button className="sm-continue-btn focus-continue-btn" onClick={onContinue}>
          {isLastStop ? '🎉 Finish shop' : 'Continue →'}
        </button>
      )}
    </div>
  )
}

// ─── Help sheet ───────────────────────────────────────────────────────────────

function HelpSheet({ item, level, onLevelUp, onClose }) {
  const [showStaffCard, setShowStaffCard] = useState(false)
  const hint  = buildLocationHint(item)
  const side  = shelfSideLabel(item?.shelfSide)
  const lvl   = shelfRowLabel(item?.shelfRow)

  const levelLabel = ['Can\'t find it?', 'What to look for', 'Ask for help'][level - 1]

  return (
    <div className="sm-modal-wrap help-sheet-wrap" onClick={onClose}>
      <div className="help-sheet" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="help-sheet-header">
          <button className="help-close-btn" onClick={onClose} aria-label="Close help">×</button>
          <span className="help-sheet-title">{levelLabel}</span>
          <div className="help-level-dots">
            {[1, 2, 3].map(l => (
              <span key={l} className={`help-level-dot ${l <= level ? 'help-level-dot-active' : ''}`} />
            ))}
          </div>
        </div>

        {/* ── Level 1: Directions ── */}
        {level === 1 && (
          <div className="help-body">
            <div className="help-item-row">
              <span className="help-item-emoji">{item.emoji}</span>
              <span className="help-item-name">{item.name}</span>
            </div>

            <div className="help-loc-grid">
              {(item.zone || item.aisle) && (
                <div className="help-loc-row">
                  <span className="help-loc-icon">📍</span>
                  <span className="help-loc-label">Location</span>
                  <span className="help-loc-value">{[item.zone, item.aisle].filter(Boolean).join(' · ')}</span>
                </div>
              )}
              {side && (
                <div className="help-loc-row">
                  <span className="help-loc-icon">↔️</span>
                  <span className="help-loc-label">Side</span>
                  <span className="help-loc-value">{side}</span>
                </div>
              )}
              {lvl && (
                <div className="help-loc-row">
                  <span className="help-loc-icon">📦</span>
                  <span className="help-loc-label">Height</span>
                  <span className="help-loc-value">{lvl}</span>
                </div>
              )}
              {item.landmark && (
                <div className="help-loc-row">
                  <span className="help-loc-icon">🏷️</span>
                  <span className="help-loc-label">Near</span>
                  <span className="help-loc-value">{item.landmark}</span>
                </div>
              )}
            </div>

            <div className="help-hint-box">
              <span className="help-hint-icon">💡</span>
              <p className="help-hint-text">{hint}</p>
            </div>

            <button className="help-next-btn" onClick={onLevelUp}>
              Still can't find it? →
            </button>
          </div>
        )}

        {/* ── Level 2: Visual / packaging ── */}
        {level === 2 && (
          <div className="help-body help-body-center">
            <span className="help-visual-emoji">{item.emoji}</span>
            <p className="help-visual-label">It may look like one of these:</p>

            {item.packagingVariants?.length > 0 ? (
              <div className="help-variants">
                {item.packagingVariants.map((v, i) => (
                  <div key={i} className="help-variant-row">
                    <span className="help-variant-dot" />
                    <span className="help-variant-text">{v}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="help-no-variants">Check for the standard packaging in this aisle.</p>
            )}

            <button className="help-next-btn" onClick={onLevelUp}>
              Ask staff for help →
            </button>
          </div>
        )}

        {/* ── Level 3: Staff escalation ── */}
        {level === 3 && !showStaffCard && (
          <div className="help-body help-body-center">
            <span className="help-staff-emoji">🙋</span>
            <p className="help-staff-title">Ask a member of staff</p>
            <p className="help-staff-body">
              A staff member can check where it is, or look in the stockroom for you.
            </p>
            <button className="help-staff-show-btn" onClick={() => setShowStaffCard(true)}>
              Show staff this →
            </button>
            <button className="help-skip-btn" onClick={onClose}>
              Skip this item for now
            </button>
          </div>
        )}

        {level === 3 && showStaffCard && (
          <div className="help-body">
            <p className="help-staff-card-label">Show this to a staff member:</p>
            <div className="help-staff-card">
              <span className="help-staff-card-emoji">{item.emoji}</span>
              <div>
                <p className="help-staff-card-item">{item.name}</p>
                <p className="help-staff-card-loc">
                  {[item.zone, item.aisle, item.landmark].filter(Boolean).join(' · ')}
                </p>
              </div>
            </div>
            <button className="help-done-btn" onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  )
}
