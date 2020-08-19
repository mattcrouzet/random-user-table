import './Loader.css';

import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="loader" role="progressbar">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export default Loader;
