import React, { useEffect, useReducer, useRef } from 'react'
import { createInitialState, deriveRoute } from './state/appState.js'
import { createDemoAttractMode } from './demoAttractMode.js'
import ShoppingList from './screens/ShoppingList.jsx'
import AddItem from './screens/AddItem.jsx'
import StoreMap from './screens/StoreMap.jsx'
import Summary from './screens/Summary.jsx'

function reducer(state, action) {
  switch (action.type) {
    case 'NAVIGATE':
      return {
        ...state,
        currentScreen: action.screen,
        previousScreen: state.currentScreen,
        addItemSource: action.source || state.addItemSource,
      }

    case 'ADD_TO_LIST': {
      const newItem = {
        ...action.item,
        listId: `${action.item.id}-${Date.now()}-${Math.random()}`,
      }
      const newList = [...state.shoppingList, newItem]
      const newRoute = state.sessionActive ? deriveRoute(newList.filter(i => !state.completedItemIds.has(i.listId))) : state.routeStops
      return {
        ...state,
        shoppingList: newList,
        routeStops: newRoute,
        currentScreen: state.addItemSource === 'midShopping' ? 'storeMap' : state.currentScreen,
      }
    }

    case 'REMOVE_FROM_LIST': {
      const newList = state.shoppingList.filter((i) => i.listId !== action.listId)
      const newRoute = state.sessionActive ? deriveRoute(newList.filter(i => !state.completedItemIds.has(i.listId))) : state.routeStops
      return {
        ...state,
        shoppingList: newList,
        routeStops: newRoute,
      }
    }

    case 'START_SHOPPING': {
      const route = deriveRoute(state.shoppingList)
      return {
        ...state,
        sessionActive: true,
        sessionStartTime: Date.now(),
        sessionEndTime: null,
        routeStops: route,
        currentStopIndex: 0,
        completedItemIds: new Set(),
        skippedItemIds: new Set(),
        currentScreen: 'storeMap',
      }
    }

    case 'COMPLETE_ITEM': {
      const next = new Set(state.completedItemIds)
      next.add(action.listId)
      return { ...state, completedItemIds: next }
    }

    case 'UNCOMPLETE_ITEM': {
      const next = new Set(state.completedItemIds)
      next.delete(action.listId)
      return { ...state, completedItemIds: next }
    }

    case 'ADVANCE_STOP': {
      const nextIndex = state.currentStopIndex + 1
      if (nextIndex >= state.routeStops.length) {
        return {
          ...state,
          sessionActive: false,
          sessionEndTime: Date.now(),
          currentScreen: 'summary',
        }
      }
      return { ...state, currentStopIndex: nextIndex }
    }

    case 'GO_TO_STOP':
      return { ...state, currentStopIndex: action.index }

    case 'TOGGLE_FOCUS_MODE':
      return { ...state, focusModeEnabled: !state.focusModeEnabled, currentFocusItemIndex: 0 }

    case 'TOGGLE_MAP_OVERVIEW':
      return { ...state, mapOverviewMode: !state.mapOverviewMode }

    case 'OPEN_HELP':
      return { ...state, helpOpen: true, helpLevel: 1, helpItemId: action.listId }

    case 'HELP_NEXT_LEVEL':
      return { ...state, helpLevel: Math.min(state.helpLevel + 1, 3) }

    case 'CLOSE_HELP':
      return { ...state, helpOpen: false, helpLevel: 1, helpItemId: null }

    case 'EXIT_SHOPPING_CONFIRM':
      return { ...state, currentScreen: 'exitConfirm' }

    case 'EXIT_SHOPPING': {
      return {
        ...state,
        sessionActive: false,
        sessionEndTime: Date.now(),
        currentScreen: 'shoppingList',
      }
    }

    case 'FINISH_SHOP':
      return {
        ...state,
        sessionActive: false,
        sessionEndTime: Date.now(),
        currentScreen: 'summary',
      }

    case 'BACK_TO_LIST': {
      // Keep shoppingList intact so ShoppingList can animate completed items out
      const clearing = new Set([...state.completedItemIds])
      return {
        ...state,
        currentScreen: 'shoppingList',
        sessionActive: false,
        sessionStartTime: null,
        sessionEndTime: null,
        routeStops: [],
        currentStopIndex: 0,
        completedItemIds: new Set(),
        skippedItemIds: new Set(),
        focusModeEnabled: false,
        mapOverviewMode: false,
        addItemSource: 'preShopping',
        clearingItemIds: clearing,
      }
    }

    case 'START_NEW_SHOP': {
      // Mark every current item for the clearing animation; list empties after
      const clearing = new Set(state.shoppingList.map(i => i.listId))
      return {
        ...state,
        currentScreen: 'shoppingList',
        sessionActive: false,
        sessionStartTime: null,
        sessionEndTime: null,
        routeStops: [],
        currentStopIndex: 0,
        completedItemIds: new Set(),
        skippedItemIds: new Set(),
        focusModeEnabled: false,
        mapOverviewMode: false,
        addItemSource: 'preShopping',
        clearingItemIds: clearing,
      }
    }

    case 'FINISH_CLEARING': {
      const newList = state.shoppingList.filter(i => !state.clearingItemIds.has(i.listId))
      return { ...state, shoppingList: newList, clearingItemIds: new Set() }
    }

    case 'RESET':
      return createInitialState()

    default:
      return state
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, null, createInitialState)
  const stateRef = useRef(state)
  stateRef.current = state
  const interactionSent = useRef(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('embed') !== 'deck') return undefined

    const demo = createDemoAttractMode({
      getState: () => stateRef.current,
      dispatch,
    })

    const onMessage = (e) => {
      if (e.data?.type === 'foodhub-demo-visible') {
        demo.setViewportVisible(Boolean(e.data.visible))
      }
      if (e.data?.type === 'foodhub-demo-interrupt') {
        demo.interrupt()
      }
    }

    const onTrustedPointer = (ev) => {
      if (!ev.isTrusted) return
      demo.interrupt()
    }

    window.addEventListener('message', onMessage)
    window.addEventListener('pointerdown', onTrustedPointer, true)
    return () => {
      window.removeEventListener('message', onMessage)
      window.removeEventListener('pointerdown', onTrustedPointer, true)
      demo.setViewportVisible(false)
    }
  }, [dispatch])

  useEffect(() => {
    const onPointerDown = () => {
      if (interactionSent.current) return
      interactionSent.current = true
      try {
        if (window.parent !== window) {
          window.parent.postMessage({ type: 'foodhub-interaction' }, '*')
        }
      } catch {
        /* ignore */
      }
    }
    window.addEventListener('pointerdown', onPointerDown, true)
    return () => window.removeEventListener('pointerdown', onPointerDown, true)
  }, [])

  const screenProps = { state, dispatch }

  function renderScreen() {
    switch (state.currentScreen) {
      case 'shoppingList':
        return <ShoppingList {...screenProps} />
      case 'addItem':
        return <AddItem {...screenProps} />
      case 'storeMap':
        return <StoreMap {...screenProps} />
      case 'summary':
        return <Summary {...screenProps} />
      default:
        return <ShoppingList {...screenProps} />
    }
  }

  return (
    <div className="app-shell">
      <div className="app-viewport">{renderScreen()}</div>
    </div>
  )
}
