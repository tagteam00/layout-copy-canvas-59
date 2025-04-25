
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/design-tokens.css';
import { Providers } from './providers';

createRoot(document.getElementById("root")!).render(
  <Providers>
    <App />
  </Providers>
);
