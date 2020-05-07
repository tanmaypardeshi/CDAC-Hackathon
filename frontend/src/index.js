import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {ThemeContextProvider} from './context/themer';
import {SummaryContextProvider} from './context/summary';

ReactDOM.render(
  <React.StrictMode>
      
    <SummaryContextProvider>
    <ThemeContextProvider>
    <App />
    </ThemeContextProvider>
    </SummaryContextProvider>
    
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
