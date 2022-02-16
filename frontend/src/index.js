import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import store from './store'

// Import properties from the react alert package needed to display alert messages
import { positions, transitions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

// Parameters to be passed as props to the Alert provider
const options = {

  timeout: 5000,
  position: positions.BOTTOM_CENTER,
  transition: transitions.SCALE,
}

ReactDOM.render(
  // Provide the store to the application as prop
  <Provider store={store}>
    {/* Add AlertProvider component to the application with the above options object as prop */}
    <AlertProvider template={AlertTemplate} {...options}>
      <App />
    </AlertProvider>
  </Provider>,
  document.getElementById('root')
);

