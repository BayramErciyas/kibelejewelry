# Card-free order requests

Reviewed main commit: `db8646009e270f3803c2935c27e0d84045f85f14` (16 October 2026).

The former cart collected card details and displayed payment success after a timer without contacting a payment provider. Both `src/App.jsx` and the legacy `src/card.jsx` now render one shared `src/Cart.jsx` component.

## Current customer flow

Bag → prepare order request → review products and unpaid/unconfirmed request text → open WhatsApp → customer sends the message themselves. The phone number and email are the existing store contacts from the footer/custom-design page. There are no customer/card input fields, payment callbacks, order writes, stock reservations or paid status transitions. Opening, closing, blocking or cancelling the external link never clears the bag or navigates the store tab away. This does not add persistent cart storage: the existing in-memory cart lifetime is unchanged.

The full request is available in a read-only, selectable text area. If WhatsApp fails, customers can copy the text into an email to the displayed store address. Large requests use manual copying rather than an oversized URL. Invalid product IDs, names or prices prevent preparing a request. Duplicate bag entries remain separate units. Existing price formatting and exchange-rate display are preserved; raw TRY amounts are included for the shop's reference. These client-side amounts are estimates, not trusted charge amounts. The shop must verify availability, current prices and shipping separately.

All customer instructions are available in Turkish, English, Chinese and Spanish. Supabase product data, authentication, storage, admin and catalog files are unchanged. No migration or live database mutation is required.

## Payment integration assessment

The reviewed repository contains no provider checkout endpoint, webhook handler, provider dependency or documented merchant setup. Credentials and merchant authorization outside the repository were not verified. No provider was activated or selected on the merchant's behalf. The request-only flow therefore remains the appropriate default.

Before a future payment integration is enabled:

- Use an authorized merchant account with provider-hosted checkout; keep secret credentials on the server.
- Resolve product IDs, quantities, price, stock and shipping on the server from trusted data; create a pending order with a server-computed amount and currency.
- Verify provider webhook signatures and independently verify payment status, order reference, amount and currency. Only then mark the order paid. Browser return URLs are not proof of payment.
- Handle duplicate events idempotently and leave failed, cancelled, timed-out or unverified payments unpaid. Test those states in the provider sandbox before enabling live payments.

## Verification

```sh
npm ci
npm test
npx playwright install chromium
npm run test:checkout
npm run build
npx eslint src/Cart.jsx src/orderRequest.js src/card.jsx tests/fixtures/cart.jsx
```

Browser tests mount the real cart component in an isolated React Router fixture with synthetic products. They do not use production Supabase or send messages. WhatsApp navigation is intercepted and aborted in the handoff tests. Scenarios cover all four languages, absence of card inputs/forms and success dialogs, retaining the bag after more than the former two-second timer, removing products and updating the request/total, empty bag, invalid prices, oversized requests, and mobile layout/read-only fallback text. No real charge, provider webhook, production database round trip or WhatsApp delivery is claimed as tested.

Validation result: 8/8 unit tests and 8/8 browser tests passed. Browser execution used a locally extracted Chromium binary via `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` because the standard browser download was unavailable in this environment. The production build succeeds with a bundle-size warning. The new cart/helper/legacy wrapper and fixture pass targeted ESLint. `App.jsx` has 19 pre-existing lint errors; the original main file has the same 19 errors (unused imports and existing hook/component patterns).

Do not merge or promote to production before the owner's approval. This change is prepared on a separate branch for review.
