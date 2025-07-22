
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import Module from 'module';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


//import React from 'react';
import ReactDOM from 'react-dom/client';
//import App from './App.tsx';
import './index.css'; // TailwindCSS included here

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
