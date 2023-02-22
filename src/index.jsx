import React from 'react';
import ReactDOM from 'react-dom';

// Careful with the order of CSS loading, if you want to modify Bootstrap's settings
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import AppKeycloak from './AppKeycloak';
import reportWebVitals from './reportWebVitals';

const Loading = () => <div>Loading, please wait...</div>

ReactDOM.render(
  <React.StrictMode>
      <AppKeycloak />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
