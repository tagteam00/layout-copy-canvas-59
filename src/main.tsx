
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add global error handler for uncaught exceptions
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// Add global promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Create a try-catch block around the root render to ensure we can recover from errors
try {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log("Application successfully mounted to DOM");
  } else {
    console.error("Failed to find root element");
    document.body.innerHTML = '<div style="padding: 20px; text-align: center;"><h1>Application Error</h1><p>Failed to initialize the application. Please refresh the page.</p></div>';
  }
} catch (error) {
  console.error("Failed to render application:", error);
  document.body.innerHTML = '<div style="padding: 20px; text-align: center;"><h1>Application Error</h1><p>An unexpected error occurred while initializing the application. Please refresh the page.</p></div>';
}
