// src/components/CategoryBadge.js
import C from '../Utils/colors';

const CategoryBadge = ({ label }) => (
  <span
    style={{
      display:       'inline-block',
      padding:       '3px 10px',
      background:    `${C.amber}22`,
      border:        `1px solid ${C.amber}55`,
      borderRadius:  20,
      fontSize:      11,
      color:         C.gold,
      fontWeight:    600,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    }}
  >
    {label}
  </span>
);

export default CategoryBadge;
