
import {useKeycloak, ReactKeycloakProvider } from "@react-keycloak/web";
import keycloakConfig from './keycloak';
import {useState} from "react";
//import Keycloak from 'keycloak-js';
import Config from "./config.json";

import App from "./App";


//const keycloakConfig = Keycloak(Config.keycloak);

function AppKeycloak() {
  const [keycloakReady, setKeycloakReady] = useState(false);
  // const [keycloakProviderInitConfig, setKeycloakProviderInitConfig] = useState(
  //   {"redirectUri": window.location.href});
  const eventLogger = (event: unknown, error: unknown) => {
    //console.log('onKeycloakEvent', event, error)
          if (event && event === 'onReady'){
              setKeycloakReady(true);
          }
  }

  const tokenLogger = (tokens: unknown) => {
    //console.log('onKeycloakTokens', tokens)
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
