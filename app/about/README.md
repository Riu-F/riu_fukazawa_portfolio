# About board — content, layout, and behaviour

**Server-side** `app/about/lib/loadBoardItems.ts` reads `public/about/board-layout.json` plus each item’s `meta.json` and image folders, producing one **`BoardItem[]`** for the whole page.

## Responsive layout (dual renderers)

| Viewport | UI | Component chain |
|----------|----|-----------------|
| **`(min-width: 900px)`** | Freeform board (pan, zoom, focus, stacks) | `AboutBoard` → `DesktopAboutBoard` → `BoardViewport` |
| **Below 900px** | Static scroll page (grid background, no board canvas) | `AboutBoard` → `MobileAboutBoard` |

- **One content source:** both branches receive the **same** `initialItems` from `loadAboutBoardItems()` — no duplicated copy or media paths.
- **Breakpoint:** `ABOUT_DESKTOP_LAYOUT_MIN_PX` in `components/AboutBoard.tsx` (default **900**). Change there to retune tablet vs board.
- **Intro copy** for both surfaces lives in `content/aboutIntroContent.tsx` (desktop intro **card** and mobile **page header** stay aligned).
- **Mobile:** same **category** grouping and order as before (`life` / `craft`→Skills / `work` / **More**). **No accordion:** everything is visible while scrolling — **no tap to expand**, no selection state, no revealed-image galleries on mobile.
- **Mobile per item:** **first visible asset only** (see `lib/mobileAboutHero.ts`), then **title**, then **`description` + `detailBody`** via `aboutSharedContent.tsx`. **`revealed/` images** stay in the data model for desktop focus; mobile **does not** render them (can be revisited later).
- **Mobile chrome:** `main.about--layout-mobile` uses a **board-aligned grid** (20px cell, subtle lines on a cool neutral base), **centred hero media** in a capped column, **Instrument Serif** (page + item titles) + **Inter** (body) + **DM Mono** (section labels), and **tokenised spacing** for vertical rhythm — still **static scroll** only.
- **Shared text parsing:** `components/aboutSharedContent.tsx` (`AboutDetailBody`, linkify) is used by `FocusAnnotation` (desktop) and `MobileAboutItem` (mobile).

Hydration note: the layout branch is chosen with `matchMedia` after mount, so the first paint may briefly show the mobile shell on a wide monitor before the board appears — same class of issue as typical responsive client checks.

## Slugs vs display titles

- **`id` in `meta.json`**: lowercase, URL- and folder-safe slug (e.g. `js`, `suede`, `cooking`). Must match the `id` in `board-layout.json`.
- **`title` in `meta.json`**: display string shown in the annotation (e.g. `JS`, `SUEDE`, `Scuba Diving`).
- **Folders**: organise as `public/about/items/<category>/<slug>/` (e.g. `items/skills/js`, `items/work/suede`, `items/life/cooking`). The slug is the directory name; it should match `meta.id`.

## Photo styling (board images)

- **No white border, no faux polaroid mat, no printed-edge frame** in CSS — images sit directly on the board.
- **Subtle depth** (where used) comes from **drop-shadow on the image or stack**, not from boxes or outlines around the bitmap.
- **`stackPresentation: "polaroid"`** only affects **layout dimensions** in `photoStackLayout.ts` (taller/wider slot for that item), not a visible polaroid chrome in the UI.

## Files you’ll edit most

| File | Role |
|------|------|
| `public/about/board-layout.json` | Board `x` / `y` for every `id` |
| `public/about/items/**/meta.json` | Copy, category, `kind`, optional `stackPresentation` |
| `public/about/items/**/visible/` | Images on the board (see patterns below) |
| `public/about/items/**/revealed/` | Extra images that appear when the item is **focused** |
| `public/about/placeholder.svg` | Fallback asset when a folder has no images yet |

Optional `focusZoom` in JSON may remain for future use; **focus does not move or zoom the camera**.

## Item `kind` → board behaviour

Set `"kind"` in `meta.json`:

| `kind` | Runtime type | Board behaviour |
|--------|----------------|-----------------|
| `emoji` | `placeholderObject` | Emoji tile; optional `description` / `detailBody` on focus |
| `stickerReveal` | `photoStackObject` | Smaller print size; `visible/` + optional `revealed/` |
| `polaroidReveal` | `photoStackObject` | Larger print size; `visible/` + optional `revealed/` |
| `stackReveal` | `photoStackObject` | Default print stack; `visible/` + optional `revealed/` |
| `polaroidStackReveal` | `photoStackObject` | Multiple larger prints at rest; `revealed/` on focus |

**`stackPresentation`** is derived from `kind` (layout sizing). You can override with `"stackPresentation": "stack" \| "sticker" \| "polaroid"` if needed.

### Folder patterns

**Sticker + reveal**

- `visible/`: one hero image (PNG/SVG/JPEG/WebP).
- `revealed/`: zero or more images shown only after focus (spread with the stack).

**Polaroid + reveal / polaroid stack + reveal**

- Same folder rules; **polaroid** = different resting **geometry** only, not a UI frame.

**Intro card**

- Declared only in `board-layout.json` with `"type": "instructionCard"`. No `meta.json`. Non-interactive on the **desktop board**.
- Wording is shared with the mobile page header via `content/aboutIntroContent.tsx`.

## Stack focus (no camera automation)

- Clicking a stack **expands or collapses it in place** on the board.
- **The camera does not** auto-pan, auto-zoom, or reframe when you open or close focus.
- Closing focus **does not** restore a previous zoom or position — because nothing was changed automatically.

## Camera behaviour

The board view **only** changes when the **user**:

- **pans** (drag on empty space, or trackpad scroll), or  
- **zooms** (⌘/Ctrl + wheel / pinch toward cursor, or the viewport **+/−/%** controls — toolbar zoom uses the last pointer position inside the viewport).

### Zoom limits

- **Maximum zoom = 100%** (`1.0`): you cannot zoom in past the default 1:1 view. Only zoom **out** (e.g. to ~35%) is allowed.
- Constants: `BOARD_MAX_ZOOM`, `BOARD_MIN_ZOOM`, `BOARD_DEFAULT_ZOOM` in `hooks/useBoardCamera.ts`.
- Toolbar **+** is disabled at max zoom; **−** is disabled at min zoom.

### Zoom sensitivity

- **Toolbar ±** uses `BOARD_ZOOM_STEP` (~**3.6%** per click — about **70% gentler** than the older ~12% step).
- **⌘/Ctrl + wheel / pinch** uses `exp(-deltaY * BOARD_ZOOM_WHEEL_SENSITIVITY)` per event; tune `BOARD_ZOOM_WHEEL_SENSITIVITY` in `hooks/useBoardCamera.ts`.

Implementation: `hooks/useBoardCamera.ts` — pointer-anchored zoom, clamped camera.

## Board zoom vs browser page zoom

- The board attaches a **native** `wheel` listener on **`.about-viewport`** with **`{ passive: false }`** (`useBoardCamera.ts`). That allows **`preventDefault()`** to run so **⌘/Ctrl + scroll / trackpad pinch** is handled as **board zoom** instead of **browser page zoom** while the cursor is over the canvas.
- React’s **`onWheel` is not used** for pan/zoom (many browsers treat delegated wheel listeners as **passive**, so `preventDefault()` does nothing and page zoom wins).
- **`touch-action: none`** on the viewport signals that gestures on that surface are app-controlled (with the JS listener doing the real work on desktop).
- Scope is **only the board viewport** (not the whole site).

**`/about` viewport metadata** (`app/about/page.tsx`): **`maximumScale: 1`** and **`userScalable: false`** so **mobile/tablet browser pinch zoom** is discouraged on this route and doesn’t fight the canvas metaphor.

**Accessibility tradeoff:** Narrow viewports use the **structured mobile About** (not the board). **`userScalable: false`** on `/about` still blocks browser pinch zoom on that route — users who need page zoom should use OS text sizing or relax `viewport` in `app/about/page.tsx`.

**Still not fully controllable:** **Keyboard** browser zoom (e.g. **Cmd/Ctrl +/−**); zoom when **focus is outside** the board; some **OS** gestures; edge cases where a browser ignores `preventDefault`.

## Browser gestures (back swipe / overscroll)

- `.about` and `.about-viewport` use **`overscroll-behavior-x: none`** (and **`contain`** on the viewport) so horizontal overscroll is less likely to **chain** to the browser and trigger **history navigation** (e.g. trackpad “back”) while panning the board.
- **Non-passive wheel** + **`preventDefault`** on the viewport (see above) and pointer handlers during drag consume gestures on the canvas.

**Limitations:** OS-level edge swipes, some Safari/Chrome builds, or focus outside the board may still trigger back/forward in edge cases. This is the usual web platform constraint; the CSS + non-passive wheel on the canvas surface is the practical mitigation without breaking the rest of the site.

## Hover

- Only **interactive** items (`.about-item--interactive`) get a stronger hover: extra lift, slight rotation, and stronger drop shadow. The intro card is non-interactive and does not use this.
- Focused items keep a stronger elevated state.

## Annotation copy

- **`description`:** short line under the title.
- **`detailBody`:** Split on blank lines (`\n\n`) into blocks. Each block is either a paragraph or, if it contains internal newlines, a bullet list (one `<li>` per line). URLs starting with `http`/`https` become links.
- Implemented once in **`components/aboutSharedContent.tsx`** for desktop annotations and mobile panels.

## Implementation map

| Concern | Location |
|--------|----------|
| Load JSON + folders | `lib/loadBoardItems.ts` |
| Group items for mobile sections | `lib/groupAboutItemsForMobile.ts` |
| First visible image for mobile hero | `lib/mobileAboutHero.ts` |
| Intro copy (desktop + mobile) | `content/aboutIntroContent.tsx` |
| Shared body / links | `components/aboutSharedContent.tsx` |
| Breakpoint + branch | `components/AboutBoard.tsx` |
| Desktop canvas | `components/DesktopAboutBoard.tsx`, `BoardViewport.tsx` |
| Mobile list UI | `components/MobileAboutBoard.tsx`, `MobileAboutSection.tsx`, `MobileAboutItem.tsx` |
| Pan / zoom / clamp | `hooks/useBoardCamera.ts` (also exported as `useBoardPan`) |
| Item markup (board) | `components/BoardItemRenderer.tsx`, `PhotoStackBoardItem.tsx` |
| Stack geometry | `components/photoStackLayout.ts` |
| Annotation UI (desktop) | `components/FocusAnnotation.tsx` |
| Styles | `about.css` |

## Current layout ids (`board-layout.json`)

`intro`, `cooking`, `running`, `hiking`, `scuba`, `beach`, `plants`, `travel`, `photography`, `js`, `suede`.
