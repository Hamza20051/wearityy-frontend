import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import the Redux store with the correct path
import { Provider } from 'react-redux';
import store from './store/store';  // Correct path to store.js
import App from './App';
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Wrap the App component with the Provider and pass the store */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
