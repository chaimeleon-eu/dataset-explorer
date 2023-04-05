import Keycloak from 'keycloak-js';
import Config from "./config.json";

const keycloak = new Keycloak(Config.keycloak.config);

//keycloak.init(Config.keycloak.initOptions);

export default keycloak;
