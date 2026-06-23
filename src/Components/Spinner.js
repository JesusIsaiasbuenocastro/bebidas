// src/components/Spinner.js
import C from '../Utils/colors';

const Spinner = ({ size = 36 }) => (
  <div
    style={{
      width:          size,
      height:         size,
      border:         `3px solid ${C.border}`,
      borderTopColor: C.amber,
      borderRadius:   '50%',
      animation:      'spin 0.8s linear infinite',
    }}
  />
);

export default Spinner;
