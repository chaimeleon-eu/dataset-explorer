import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Router, HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

import App from "./App";
import Login from "./components/Login";

const RenderUserAuthenticated = () => {
  let { keycloak } = useKeycloak();
  console.log("keycloak is ");
  console.log(keycloak);
  return keycloak.authenticated ? <App /> : <Login />;
}

export const AppRouter = () => {
    return (
        <HashRouter>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/">
            <Redirect to={{ pathname: '/datasets' }} />
          </Route>
          <Route exact path={["/datasets", "/traces"]} component={RenderUserAuthenticated}/>
        </HashRouter>
    );
}

export default AppRouter;
