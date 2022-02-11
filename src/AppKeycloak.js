
import {useKeycloak, ReactKeycloakProvider } from "@react-keycloak/web";
import keycloakConfig from './keycloak';
import {useState} from "react";

import App from "./App";

function AppKeycloak() {
  const [keycloakReady, setKeycloakReady] = useState(false);
  const eventLogger = (event: unknown, error: unknown) => {
    //console.log('onKeycloakEvent', event, error)
          if (event && event === 'onReady'){
              setKeycloakReady(true);
          }
  }

  const tokenLogger = (tokens: unknown) => {
    //console.log('onKeycloakTokens', tokens)
  }
  return (
        <ReactKeycloakProvider authClient={keycloakConfig}
          onEvent={eventLogger}
          onTokens={tokenLogger}
          // initOptions={{
          //           onLoad: "login-required",
          //       }}
          //      LoadingComponent={<Loading />}
          >
          <App keycloakReady={keycloakReady}/>
              </ReactKeycloakProvider>

  );
}

export default AppKeycloak;
