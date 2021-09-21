import * as React from 'react'
import { useCallback } from 'react'
import { Redirect, useLocation } from 'react-router-dom'

import { useKeycloak } from '@react-keycloak/web'

const Login = () => {

  const login = () => {keycloak.login();}

  //let location = useLocation();
  // let currentLocationState = location.state || {
  //     from: { pathname: '/' },
  // };


  const { keycloak } = useKeycloak();
  //const login = useCallback(() => {keycloak.login();}, [keycloak]);
  if (keycloak.authenticated)
    return <Redirect to={{ pathname: '/' }} />

  return (
    <div>
      <b>Please wait while checking login status. If nothing happens please press Login. </b>
      <button type="button" onClick={login}>
        Login
      </button>
    </div>
  )
}

export default Login;
