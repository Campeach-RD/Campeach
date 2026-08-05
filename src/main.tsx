import React from 'react';
import ReactDOM from 'react-dom/client';
import CampeachApp from './campeach/CampeachApp';
import './campeach/campeach.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CampeachApp />
  </React.StrictMode>,
);
