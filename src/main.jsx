import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Analytics } from '@vercel/analytics/react'

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

  // Tam sayfa yenilemeden React Router icinde kategoriye gec.
  // Boylece mobildeki sert beyaz ekran / yeniden yukleme hissi kalkar.
  navigateWithoutReload(targetUrl)
  return true
}

// Mobil cihazlarda pointerup, React onClick'ten once calisir ve kategoriye
// kesin navigasyon saglar.
document.addEventListener('pointerup', navigateToMobileCategory, true)

// Klavye / click erisilebilirligi icin ayni davranisin yedegi.
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

// Kapali mobil panelleri klavye/focus akimindan da cikart.
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
