import { useContext } from 'react';
import { LanguageContext } from './App';
import Cart from './Cart';

// Legacy entry point uses the same safe flow as /cart.
export default function Card() {
  return <Cart {...useContext(LanguageContext)} />;
}
