import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import Cart from '../../src/Cart';

export default function Fixture() {
  const params = new URLSearchParams(location.search);
  const mode = params.get('mode');
  const [cart, setCart] = useState(mode === 'empty' ? [] : Array.from({ length: mode === 'long' ? 200 : 2 }, (_, i) => ({
    id: `product-${i}`, name: `Zultanite ${i}`, price: mode === 'invalid' ? 'bad' : 1200,
    img: '/src/zultanitering.jpg',
  })));
  return <MemoryRouter><Cart lang={params.get('lang') || 'EN'}
    t={{ yourBag: 'Bag', emptyBag: 'Empty bag', remove: 'Remove', continueShopping: 'Continue shopping' }}
    cart={cart} removeFromCart={index => setCart(items => items.filter((_, i) => i !== index))}
    formatPrice={value => `${Number(value)} TL`} /></MemoryRouter>;
}
createRoot(document.getElementById('root')).render(<Fixture />);
