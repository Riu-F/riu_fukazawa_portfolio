import { ITEMS, DEFAULT_LIST_ITEMS } from '../data/items.js'
import { ZONE_ORDER } from '../data/storeLayout.js'

// Build initial shopping list from default item names
function buildDefaultList() {
  return DEFAULT_LIST_ITEMS.map((name) => {
    const item = ITEMS.find((i) => i.name === name)
    return item
      ? { ...item, listId: `${item.id}-${Date.now()}-${Math.random()}` }
      : null
  }).filter(Boolean)
}

// Group shopping list items into route stops based on store zone order
export function deriveRoute(shoppingList) {
  const grouped = {}

  for (const item of shoppingList) {
    const zone = item.zone
    if (!grouped[zone]) {
      grouped[zone] = []
    }
    grouped[zone].push(item)
  }

  // Sort by fixed store zone order, excluding Entrance and Checkout
  const stops = ZONE_ORDER
    .filter((zone) => zone !== 'Entrance' && zone !== 'Checkout')
    .filter((zone) => grouped[zone] && grouped[zone].length > 0)
    .map((zone, idx) => ({
      id: `stop-${zone}`,
      zone,
      items: grouped[zone],
      stopNumber: idx + 1,
    }))

  return stops
}

// Create the initial application state object
export function createInitialState() {
  const shoppingList = buildDefaultList()

  return {
    // Navigation
    currentScreen: 'shoppingList', // 'shoppingList' | 'addItem' | 'storeMap' | 'summary'
    previousScreen: null,

    // Shopping list
    shoppingList,

    // Session state
    sessionActive: false,
    sessionStartTime: null,
    sessionEndTime: null,

    // Route (derived from shoppingList when session starts)
    routeStops: [],
    currentStopIndex: 0,

    // Completed / skipped tracking
    completedItemIds: new Set(),
    skippedItemIds: new Set(),
    clearingItemIds: new Set(), // items being animated out of the list

    // Focus mode
    focusModeEnabled: false,
    currentFocusItemIndex: 0,

    // Map state
    mapOverviewMode: false,

    // Help flow state
    helpOpen: false,
    helpLevel: 1, // 1 | 2 | 3
    helpItemId: null,

    // Add item context
    addItemSource: 'preShopping', // 'preShopping' | 'midShopping'
  }
}
