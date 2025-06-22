import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './features/store';
import App from './App';
import { ThemeModeProvider } from './ThemeContext';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeModeProvider>
          <App />
        </ThemeModeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
