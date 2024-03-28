import React from 'react'
import { Navigate } from 'react-router-dom'

import { useKeycloak } from '@react-keycloak/web'

const Login = () => {
  //let navigate = useNavigate();

  const login = () => {keycloak.login();}

  //let location = useLocation();
  // let currentLocationState = location.state || {
  //     from: { pathname: '/' },
  // };


  const { keycloak } = useKeycloak();
  //const login = useCallback(() => {keycloak.login();}, [keycloak]);
  if (keycloak.authenticated)
    return <Navigate to={{ pathname: '/' }} />
  else {
    keycloak.login();
  }

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
