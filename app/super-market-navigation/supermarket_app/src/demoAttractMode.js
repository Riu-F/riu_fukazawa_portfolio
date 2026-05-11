/**
 * Attract-mode demo for FoodHub when embedded (e.g. home page deck iframe).
 * Controlled via postMessage from parent; ghost taps use real DOM clicks so
 * local component state (routing overlay, remove animations) stays correct.
 */

const sleep = (ms, signal) =>
  new Promise((resolve, reject) => {
    const t = setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(t)
        reject(new DOMException('aborted', 'AbortError'))
      },
      { once: true },
    )
  })

function getShell() {
  return document.querySelector('.app-shell')
}

function setRipple(shell, el) {
  if (!shell || !el) return
  const shellRect = shell.getBoundingClientRect()
  const r = el.getBoundingClientRect()
  const cx = r.left + r.width / 2 - shellRect.left
  const cy = r.top + r.height / 2 - shellRect.top
  shell.style.setProperty('--demo-ripple-x', `${cx}px`)
  shell.style.setProperty('--demo-ripple-y', `${cy}px`)
  shell.classList.add('foodhub-demo-ripple-on')
}

function clearRipple(shell) {
  if (!shell) return
  shell.classList.remove('foodhub-demo-ripple-on')
}

async function ghostTapClick(el, { signal } = {}) {
  const shell = getShell()
  if (!el || !shell) return
  await sleep(500, signal)
  setRipple(shell, el)
  await sleep(400, signal)
  el.click()
  await sleep(180, signal)
  clearRipple(shell)
}

export function createDemoAttractMode({ getState, dispatch }) {
  let userInterrupted = false
  let viewportVisible = false
  let runAbort = null
  let running = false

  const isCancelled = () => userInterrupted || !viewportVisible

  async function waitWhileVisible(ms, signal) {
    const end = Date.now() + ms
    while (Date.now() < end) {
      if (isCancelled() || signal?.aborted) throw new DOMException('aborted', 'AbortError')
      await sleep(120, signal)
    }
  }

  async function runSequence(signal) {
    const run = async () => {
      const sInit = getState()
      if (sInit.focusModeEnabled) dispatch({ type: 'TOGGLE_FOCUS_MODE' })
      if (sInit.mapOverviewMode) dispatch({ type: 'TOGGLE_MAP_OVERVIEW' })
      await sleep(80, signal)

      // Step 1 — idle on list
      await waitWhileVisible(3000, signal)

      // Step 2 — remove Baby Spinach
      const removeBtn = document.querySelector('[data-demo="remove-baby-spinach"]')
      await ghostTapClick(removeBtn, { signal })
      await sleep(1500, signal)

      // Step 3 — start shop (routing overlay ~1100ms inside ShoppingList)
      const startBtn = document.querySelector('[data-demo="start-shop"]')
      await ghostTapClick(startBtn, { signal })
      await sleep(2200, signal)

      // Step 4 — pause on map
      await waitWhileVisible(3000, signal)

      // Steps 5–8 — complete items + continue until summary
      let guard = 0
      while (getState().currentScreen === 'storeMap' && guard < 40) {
        guard += 1
        const incomplete = document.querySelector(
          '.sm-stop-card-active .sm-item-circle:not(.sm-item-circle-done)',
        )
        if (incomplete) {
          await ghostTapClick(incomplete, { signal })
          await sleep(1000, signal)
          continue
        }
        const cont = document.querySelector('.sm-stop-card-active .sm-continue-btn')
        if (cont) {
          await ghostTapClick(cont, { signal })
          await sleep(2000, signal)
        } else {
          break
        }
        if (getState().currentScreen === 'summary') break
      }

      if (getState().currentScreen !== 'summary') return

      // Step 9 — summary pause
      await waitWhileVisible(4000, signal)

      // Step 10 — start new shop then reset list to defaults
      const newShop = document.querySelector('[data-demo="start-new-shop"]')
      await ghostTapClick(newShop, { signal })
      await sleep(1200, signal)
      // Let FINISH_CLEARING run from ShoppingList timer, then restore defaults
      await sleep(900, signal)
      dispatch({ type: 'RESET' })
      await sleep(2000, signal)
    }

    // Loop until interrupted or viewport hidden
    while (!userInterrupted && viewportVisible) {
      try {
        await run()
      } catch {
        break
      }
      if (userInterrupted || !viewportVisible) break
    }
  }

  function stopRunner() {
    if (runAbort) {
      runAbort.abort()
      runAbort = null
    }
    running = false
    clearRipple(getShell())
  }

  function startRunnerIfEligible() {
    if (userInterrupted || !viewportVisible || running) return
    runAbort = new AbortController()
    const signal = runAbort.signal
    running = true
    runSequence(signal)
      .catch(() => {})
      .finally(() => {
        running = false
        clearRipple(getShell())
      })
  }

  return {
    setViewportVisible(v) {
      viewportVisible = Boolean(v)
      if (!viewportVisible) stopRunner()
      else startRunnerIfEligible()
    },
    interrupt() {
      userInterrupted = true
      stopRunner()
      try {
        if (window.parent !== window) {
          window.parent.postMessage({ type: 'foodhub-demo-interrupted' }, '*')
        }
      } catch {
        /* ignore */
      }
    },
    resetSession() {
      userInterrupted = false
      stopRunner()
    },
    isUserInterrupted() {
      return userInterrupted
    },
  }
}
