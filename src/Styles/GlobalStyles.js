// src/styles/GlobalStyles.js
import C from '../Utils/colors';

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html  { scroll-behavior: smooth; }
    body  { background: ${C.bg}; color: ${C.cream}; font-family: 'Inter', sans-serif; min-height: 100vh; }

    ::-webkit-scrollbar       { width: 6px; }
    ::-webkit-scrollbar-track { background: ${C.bg}; }
    ::-webkit-scrollbar-thumb { background: ${C.amber}; border-radius: 3px; }
    ::placeholder             { color: ${C.muted}; opacity: 1; }

    @keyframes fadeUp  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    @keyframes spin    { to   { transform:rotate(360deg); } }
    @keyframes scaleIn { from { opacity:0; transform:scale(0.95); }    to { opacity:1; transform:scale(1); } }

    .card-anim  { animation: fadeUp  0.45s ease both; }
    .modal-anim { animation: scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both; }
  `}</style>
);

export default GlobalStyles;
