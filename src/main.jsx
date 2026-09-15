import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Analytics } from '@vercel/analytics/react'

const SWAROVSKI_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const MOBILE_TRANSITION_MS = 380

const transitionStyle = document.createElement('style')
transitionStyle.textContent = `
@media (max-width: 768px) {
  .mobile-navigation-drawer {
    transform: translate3d(-100%, 0, 0) !important;
    opacity: 1;
    transition: transform ${MOBILE_TRANSITION_MS}ms ${SWAROVSKI_EASE} !important;
    will-change: transform;
  }

  .mobile-navigation-drawer.open {
    transform: translate3d(0, 0, 0) !important;
  }

  .mobile-drawer-overlay {
    opacity: 0 !important;
    visibility: hidden;
    transition:
      opacity 300ms ease,
      visibility 0s linear 300ms !important;
  }

  .mobile-drawer-overlay.open {
    opacity: 1 !important;
    visibility: visible;
    transition:
      opacity 300ms ease,
      visibility 0s linear 0s !important;
  }

  .mobile-drawer-submenu {
    transform: translate3d(100%, 0, 0) !important;
    opacity: 1;
    transition: transform ${MOBILE_TRANSITION_MS}ms ${SWAROVSKI_EASE} !important;
    will-change: transform;
  }

  .mobile-drawer-group.open > .mobile-drawer-submenu {
    transform: translate3d(0, 0, 0) !important;
  }

  .mobile-category-page {
    transform: translate3d(100%, 0, 0) !important;
    opacity: 1 !important;
    transition: transform ${MOBILE_TRANSITION_MS}ms ${SWAROVSKI_EASE} !important;
    will-change: transform;
  }

  .mobile-category-page.open {
    transform: translate3d(0, 0, 0) !important;
  }

  .mobile-search-panel {
    transform: translate3d(0, -16px, 0);
    opacity: 0;
    transition:
      transform 320ms ${SWAROVSKI_EASE},
      opacity 240ms ease !important;
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
      opacity 180ms ease,
      transform 180ms ease !important;
  }

  .mobile-drawer-link:active,
  .mobile-drawer-trigger:active,
  .mobile-category-next:active,
  .mobile-submenu-link:active {
    opacity: .58;
    transform: translate3d(2px, 0, 0);
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

  // Swarovski benzeri his: once drawer yumusakca kapanir,
  // sonra React Router icinde sayfa yenilenmeden kategori degisir.
  drawer?.classList.remove('open')
  overlay?.classList.remove('open')

  if (mobileNavigationTimer) window.clearTimeout(mobileNavigationTimer)

  mobileNavigationTimer = window.setTimeout(() => {
    navigateWithoutReload(targetUrl)
    mobileNavigationTimer = null
  }, 300)

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
