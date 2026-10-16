import test from 'node:test';
import assert from 'node:assert/strict';
import { buildOrderRequest, orderRequestCopy, STORE_WHATSAPP } from '../src/orderRequest.js';

const price = value => `${Number(value)} TL`;
const product = { id: 'stone-1', name: 'Zultanite', price: '1200.50' };

for (const lang of ['TR', 'EN', 'ZH', 'ES']) {
  test(`${lang}: request is explicitly unpaid, localized, encoded and uses the existing store contact`, () => {
    const cart = [product, { ...product, name: 'Nazar & 蓝色 + # / ?' }];
    const snapshot = JSON.stringify(cart);
    const result = buildOrderRequest(cart, lang, price);
    assert.equal(result.error, null);
    assert.equal(result.total, 2401);
    const url = new URL(result.href);
    assert.equal(url.origin + url.pathname, STORE_WHATSAPP);
    assert.equal(url.searchParams.get('text'), result.text);
    assert.ok(result.text.includes(orderRequestCopy[lang].intro));
    assert.ok(result.text.includes(orderRequestCopy[lang].confirm));
    assert.ok(result.text.includes('Nazar & 蓝色 + # / ?'));
    assert.ok(result.text.includes('TRY 2401'));
    assert.equal(result.text.split('[ID: stone-1]').length - 1, 2);
    assert.equal(JSON.stringify(cart), snapshot);
    assert.equal(result.paid, undefined);
  });
}

test('empty and invalid carts fail closed without a request link', () => {
  for (const cart of [[], null, [null], [{}], [{ ...product, id: null }], [{ ...product, name: '' }]]) {
    assert.equal(buildOrderRequest(cart, 'TR', price).error, 'invalid');
    assert.equal(buildOrderRequest(cart, 'TR', price).href, null);
  }
  for (const amount of ['', ' ', null, undefined, false, {}, [], -1, '-5', '1200 TL', 'NaN', NaN, Infinity]) {
    assert.equal(buildOrderRequest([{ ...product, price: amount }], 'EN', price).href, null);
  }
});

test('overflow totals are rejected', () => {
  assert.equal(buildOrderRequest([{ ...product, price: 1e308 }, { ...product, price: 1e308 }], 'EN', price).error, 'invalid');
});

test('large carts retain complete text for manual sending', () => {
  const result = buildOrderRequest(Array.from({ length: 200 }, () => product), 'TR', price);
  assert.equal(result.error, null);
  assert.equal(result.href, null);
  assert.ok(result.text.includes('200. Zultanite'));
});

test('unknown language falls back to Turkish; display formatter stays unchanged', () => {
  const result = buildOrderRequest([product], 'XX', value => `$${Number(value) * 0.03}`);
  assert.ok(result.text.includes(orderRequestCopy.TR.intro));
  assert.ok(result.text.includes('$36.015'));
  assert.ok(result.text.includes('TRY 1200.5'));
});
