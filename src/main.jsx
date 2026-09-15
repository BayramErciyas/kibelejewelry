import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './performanceOptimizer.js'
import App from './App.jsx'
import { Analytics } from '@vercel/analytics/react'

const SWAROVSKI_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
const MOBILE_TRANSITION_MS = 560
const MOBILE_ROUTE_DELAY_MS = 500

const transitionStyle = document.createElement('style')
transitionStyle.textContent = `
@media (max-width: 768px) {
  .mobile-navigation-drawer {
    transform: translate3d(-100%, 0, 0) !important;
    opacity: 1;
    transition:
      transform ${MOBILE_TRANSITION_MS}ms ${SWAROVSKI_EASE},
      opacity 320ms ease !important;
    will-change: transform, opacity;
  }

  .mobile-navigation-drawer.open {
    transform: translate3d(0, 0, 0) !important;
    opacity: 1;
  }

  .mobile-drawer-overlay {
    opacity: 0 !important;
    visibility: hidden;
    transition:
      opacity 420ms ease,
      visibility 0s linear 420ms !important;
  }

  .mobile-drawer-overlay.open {
    opacity: 1 !important;
    visibility: visible;
    transition:
      opacity 420ms ease,
      visibility 0s linear 0s !important;
  }

  .mobile-drawer-submenu {
    transform: translate3d(92%, 0, 0) !important;
    opacity: 0.72;
    transition:
      transform ${MOBILE_TRANSITION_MS}ms ${SWAROVSKI_EASE},
      opacity 420ms ease !important;
    will-change: transform, opacity;
    backface-visibility: hidden;
  }

  .mobile-drawer-group.open > .mobile-drawer-submenu {
    transform: translate3d(0, 0, 0) !important;
    opacity: 1;
  }

  .mobile-category-page {
    transform: translate3d(92%, 0, 0) !important;
    opacity: 0.72 !important;
    transition:
      transform ${MOBILE_TRANSITION_MS}ms ${SWAROVSKI_EASE},
      opacity 420ms ease !important;
    will-change: transform, opacity;
    backface-visibility: hidden;
  }

  .mobile-category-page.open {
    transform: translate3d(0, 0, 0) !important;
    opacity: 1 !important;
  }

  .mobile-search-panel {
    transform: translate3d(0, -16px, 0);
    opacity: 0;
    transition:
      transform 420ms ${SWAROVSKI_EASE},
      opacity 320ms ease !important;
    will-change: transform, opacity;
  }

  .mobile-search-panel.open {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }

  .mobile-drawer-link,
  .mobile-drawer-trigger,
  .mobile-category-next,
  .mobile-submenu-link {
    transition:
      opacity 260ms ease,
      transform 300ms ${SWAROVSKI_EASE} !important;
  }

  .mobile-drawer-link:active,
  .mobile-drawer-trigger:active,
  .mobile-category-next:active,
  .mobile-submenu-link:active {
    opacity: .68;
    transform: translate3d(1px, 0, 0) scale(.995);
  }

  @media (prefers-reduced-motion: reduce) {
    .mobile-navigation-drawer,
    .mobile-drawer-overlay,
    .mobile-drawer-submenu,
    .mobile-category-page,
    .mobile-search-panel,
    .mobile-drawer-link,
    .mobile-drawer-trigger,
    .mobile-category-next,
    .mobile-submenu-link {
      transition-duration: 0.01ms !important;
    }
  }
}
`
document.head.appendChild(transitionStyle)

const mobileCategoryRoutes = ['rings', 'necklaces', 'earrings', 'bracelets', 'charms']

const directMobileRoutes = new Map([
  ['zultanite', '/jewellery?stone=zultanite'],
  ['altın', '/gold'],
  ['gold', '/gold'],
  ['黄金', '/gold'],
  ['oro', '/gold'],
  ['saatler', '/watches'],
  ['watches', '/watches'],
  ['腕表', '/watches'],
  ['relojes', '/watches'],
  ['çantalar & aksesuarlar', '/bags'],
  ['bags & accessories', '/bags'],
  ['皮具与配件', '/bags'],
  ['bolsos y accesorios', '/bags'],
  ['anasayfa', '/'],
  ['home', '/'],
  ['首页', '/'],
  ['inicio', '/'],
])

const getMobileCategory = (button) => {
  const categoryButtons = Array.from(
    document.querySelectorAll('.mobile-category-next')
  )

  const categoryIndex = categoryButtons.indexOf(button)
  return mobileCategoryRoutes[categoryIndex] || null
}

const blurMobileFocus = () => {
  const activeElement = document.activeElement

  if (
    activeElement instanceof HTMLElement &&
    activeElement.closest('.mobile-navigation-drawer, .mobile-search-panel')
  ) {
    activeElement.blur()
  }
}

const blurPanelFocus = (panel) => {
  if (!(panel instanceof HTMLElement)) return

  const activeElement = document.activeElement
  if (activeElement instanceof HTMLElement && panel.contains(activeElement)) {
    activeElement.blur()
  }
}

const blurFocusBeforeMobileInteraction = (event) => {
  const target = event.target instanceof Element ? event.target : null
  if (!target) return

  const drawer = document.querySelector('.mobile-navigation-drawer')
  const searchPanel = document.querySelector('.mobile-search-panel')
  const overlay = target.closest('.mobile-drawer-overlay')

  const drawerAction = target.closest(
    '.mobile-navigation-drawer a, .mobile-navigation-drawer button, .mobile-submenu-link, .mobile-category-next'
  )
  const searchAction = target.closest(
    '.mobile-search-panel a, .mobile-search-panel button'
  )

  if (overlay || drawerAction) blurPanelFocus(drawer)
  if (searchAction) blurPanelFocus(searchPanel)
}

document.addEventListener('pointerdown', blurFocusBeforeMobileInteraction, true)

const navigateWithoutReload = (targetUrl) => {
  const currentUrl = `${window.location.pathname}${window.location.search}`
  if (currentUrl === targetUrl) return

  window.history.pushState({}, '', targetUrl)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

let mobileNavigationTimer = null

const closeMobileDrawerThenNavigate = (button, targetUrl) => {
  if (!(button instanceof HTMLElement)) return false

  button.blur()
  blurMobileFocus()

  const drawer = button.closest('.mobile-navigation-drawer')
  const overlay = document.querySelector('.mobile-drawer-overlay')

  drawer?.classList.remove('open')
  overlay?.classList.remove('open')

  if (mobileNavigationTimer) window.clearTimeout(mobileNavigationTimer)

  mobileNavigationTimer = window.setTimeout(() => {
    navigateWithoutReload(targetUrl)
    mobileNavigationTimer = null
  }, MOBILE_ROUTE_DELAY_MS)

  return true
}

const navigateToMobileCategory = (event) => {
  const button = event.target.closest?.('.mobile-category-next')
  if (!button) return false

  const category = getMobileCategory(button)
  if (!category) return false

  event.preventDefault()
  event.stopPropagation()
  event.stopImmediatePropagation?.()

  return closeMobileDrawerThenNavigate(
    button,
    `/jewellery?category=${encodeURIComponent(category)}`
  )
}

const navigateToDirectMobileSection = (event) => {
  const button = event.target.closest?.('.mobile-drawer-link')
  if (!button) return false

  const label = button.querySelector('span')?.textContent?.trim().toLowerCase()
  const targetUrl = directMobileRoutes.get(label)
  if (!targetUrl) return false

  event.preventDefault()
  event.stopPropagation()
  event.stopImmediatePropagation?.()

  return closeMobileDrawerThenNavigate(button, targetUrl)
}

document.addEventListener('pointerup', navigateToMobileCategory, true)
document.addEventListener('pointerup', navigateToDirectMobileSection, true)

document.addEventListener(
  'click',
  (event) => {
    if (navigateToMobileCategory(event)) return
    if (navigateToDirectMobileSection(event)) return

    const target = event.target instanceof Element ? event.target : null
    if (!target) return

    if (
      target.closest('.mobile-navigation-drawer, .mobile-search-panel, .mobile-drawer-overlay')
    ) {
      blurMobileFocus()
    }
  },
  true
)

const syncMobilePanelAccessibility = () => {
  document
    .querySelectorAll('.mobile-navigation-drawer, .mobile-search-panel')
    .forEach((panel) => {
      const isHidden = panel.getAttribute('aria-hidden') === 'true'

      if (isHidden) {
        blurPanelFocus(panel)
        panel.setAttribute('inert', '')
      } else {
        panel.removeAttribute('inert')
      }
    })
}

const mobilePanelObserver = new MutationObserver(syncMobilePanelAccessibility)

mobilePanelObserver.observe(document.documentElement, {
  subtree: true,
  childList: true,
  attributes: true,
  attributeFilter: ['aria-hidden', 'class'],
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
)

queueMicrotask(syncMobilePanelAccessibility)
