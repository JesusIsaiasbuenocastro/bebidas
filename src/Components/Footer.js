// src/components/Footer.js
import C from '../Utils/colors';

const Footer = () => (
  <footer style={{
    textAlign:   'center',
    padding:     '20px 24px',
    borderTop:   `1px solid ${C.border}`,
    color:        C.muted,
    fontSize:     12,
  }}>
    Recetas por{' '}
    <a
      href="https://www.thecocktaildb.com"
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: C.amber, textDecoration: 'none' }}
    >
      TheCocktailDB
    </a>
    {' '}· Bebidas Explorer — React + Context API
  </footer>
);

export default Footer;
