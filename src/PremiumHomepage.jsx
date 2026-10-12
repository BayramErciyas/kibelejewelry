import React from 'react';
import { Link } from 'react-router-dom';
import zultaniteRing from './zultanitering.jpg';
import zultaniteBracelet from './zultanitebracelet.jpg';
import necklace from './necklace.jpg';
import telkari from './telkari.jpg';
import './PremiumHomepage.css';

// Isolated visual prototype. Not wired into the existing routes or commerce logic.
const categories = [
  { title: 'Rings', image: zultaniteRing, href: '/store' },
  { title: 'Necklaces', image: necklace, href: '/store' },
  { title: 'Bracelets', image: zultaniteBracelet, href: '/store' },
  { title: 'Artisan Jewelry', image: telkari, href: '/store' },
];

export default function PremiumHomepage() {
  return <main className="kibele-editorial">
    <div className="ke-announcement">DISCOVER THE ART OF CAPPADOCIA</div>
    <header className="ke-header">
      <span className="ke-menu" aria-hidden="true">☰</span>
      <Link to="/" className="ke-wordmark" aria-label="Kibele Jewelry home">KIBELE</Link>
      <span aria-hidden="true">JEWELRY</span>
    </header>
    <nav className="ke-nav" aria-label="Collections">
      <Link to="/store">JEWELRY</Link><Link to="/jewellery">ZULTANITE</Link><Link to="/store">COLLECTIONS</Link><Link to="/store">CAPPADOCIA</Link>
    </nav>
    <section className="ke-hero" aria-labelledby="ke-hero-title">
      <div className="ke-hero-copy"><div className="ke-eyebrow">Kibele · Cappadocia</div><h1 id="ke-hero-title">The Art of Brilliance</h1><p>Distinctive gemstones, timeless craftsmanship, and stories inspired by Cappadocia.</p><Link className="ke-button" to="/store">Discover the collection</Link></div>
    </section>
    <section className="ke-section" aria-labelledby="ke-categories"><div className="ke-eyebrow" style={{textAlign:'center'}}>Curated for you</div><h2 id="ke-categories">Discover Jewelry</h2><div className="ke-grid">{categories.map(item=><Link className="ke-tile" to={item.href} key={item.title}><img src={item.image} alt={item.title} loading="lazy"/><span>{item.title}</span></Link>)}</div></section>
    <section className="ke-story"><div className="ke-story-image" role="img" aria-label="Kibele jewelry collection"/><div className="ke-story-copy"><div className="ke-eyebrow">Our signature</div><h2>Born of a remarkable place.</h2><p>Explore jewelry that celebrates the color, spirit and artistry of Cappadocia.</p><Link className="ke-button" to="/jewellery">Explore Zultanite</Link></div></section>
    <footer className="ke-footer">KIBELE JEWELRY · CAPPADOCIA</footer>
  </main>;
}
