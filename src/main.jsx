import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Analytics } from '@vercel/analytics/react'

const mobileCategoryRoutes = ['rings', 'necklaces', 'earrings', 'bracelets', 'charms']

document.addEventListener(
  'click',
  (event) => {
    const button = event.target.closest?.('button')
    if (!button) return

    const mobileLayer = button.closest(
      '.mobile-navigation-drawer, .mobile-search-panel'
    )

    if (mobileLayer && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    if (!button.classList.contains('mobile-category-next')) return

    const categoryButtons = Array.from(
      document.querySelectorAll('.mobile-category-next')
    )
    const categoryIndex = categoryButtons.indexOf(button)
    const category = mobileCategoryRoutes[categoryIndex]

    if (!category) return

    event.preventDefault()
    event.stopImmediatePropagation()
    button.blur()

    window.location.assign(`/jewellery?category=${category}`)
  },
  true
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
)
