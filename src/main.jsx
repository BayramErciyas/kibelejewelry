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

const navigateWithoutReload = (targetUrl) => {
  const currentUrl = `${window.location.pathname}${window.location.search}`
  if (currentUrl === targetUrl) return

  window.history.pushState({}, '', targetUrl)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

let mobileNavigationTimer = null

const navigateToMobileCategory = (event) => {
  const button = event.target.closest?.('.mobile-category-next')
  if (!button) return false

  const category = getMobileCategory(button)
  if (!category) return false

  event.preventDefault()
  event.stopPropagation()
  event.stopImmediatePropagation?.()

  button.blur()
  blurMobileFocus()

  const targetUrl = `/jewellery?category=${encodeURIComponent(category)}`
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

document.addEventListener('pointerup', navigateToMobileCategory, true)

document.addEventListener(
  'click',
  (event) => {
    if (navigateToMobileCategory(event)) return

    const button = event.target.closest?.('button')
    if (!button) return

    if (
      button.closest('.mobile-navigation-drawer, .mobile-search-panel') &&
      document.activeElement instanceof HTMLElement
    ) {
      document.activeElement.blur()
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
        if (panel.contains(document.activeElement)) blurMobileFocus()
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
