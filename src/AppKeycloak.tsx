import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloakConfig from './keycloak';
import  React, { useState, useCallback, Fragment } from "react";
import Config from "./config.json";

import App from "./App";

function AppKeycloak() {

    const [keycloakReady, setKeycloakReady] = useState(false);
      // const [keycloakProviderInitConfig, setKeycloakProviderInitConfig] = useState(
  //   {"redirectUri": window.location.href});
  const onEvent = useCallback((event, error) => {
    console.log('onKeycloakEvent', event);
          if (event && (event === 'onReady')) {
              setKeycloakReady(true);
          }
          if (error) {
            console.error(error);
            //postMessage(new Message(Message.ERROR, "Keycloak provider error", error.error))
          }
          console.log('keycloak ready', keycloakReady);
  }, []);

  const tokenLogger = (tokens) => {
    console.log('onKeycloakTokens');//, tokens)
  }

    return (
        <ReactKeycloakProvider authClient={keycloakConfig}
          initOptions={Config.keycloak.initOptions}
          onEvent={onEvent}
          onTokens={tokenLogger}
          // initOptions={{
          //           adapter: "default",
          //       }}
          //      LoadingComponent={<Loading />}
          ><App keycloakReady={keycloakReady}/></ReactKeycloakProvider>
    );
}

export default AppKeycloak;