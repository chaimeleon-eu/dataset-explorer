
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloakConfig from './keycloak';
import React, {useState} from "react";

import App from "./App";


function AppKeycloak() {
  const [keycloakReady, setKeycloakReady] = useState(false);
  // const [keycloakProviderInitConfig, setKeycloakProviderInitConfig] = useState(
  //   {"redirectUri": window.location.href});
  const eventLogger = (event, //error
      ) => {
    //console.log('onKeycloakEvent', event, error)
          if (event && event === 'onReady'){
              setKeycloakReady(true);
          }
  }

  const tokenLogger = (tokens) => {
    console.log('onKeycloakTokens', tokens)
  }
  // const urlChangedUpdKeycloakUri = (newUri) => {
  //   const uri = window.location.origin + newUri;
  //   console.log(`new keycloak redir uri is ${uri}`);
  //   setKeycloakProviderInitConfig({...keycloakProviderInitConfig, "redirectUri": uri});
  // }
  //Config.keycloak["redirectUri"] = keycloakRedirUri;

  //console.log(keycloakConfig["redirectUri"]);
  return (
        <ReactKeycloakProvider authClient={keycloakConfig}
//          initConfig={keycloakProviderInitConfig}
          onEvent={eventLogger}
          onTokens={tokenLogger}
          // initOptions={{
          //           adapter: "default",
          //       }}
          //      LoadingComponent={<Loading />}
          >
          <App keycloakReady={keycloakReady}/>
              </ReactKeycloakProvider>

  );
}

export default AppKeycloak;
