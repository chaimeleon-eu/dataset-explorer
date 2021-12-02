import Keycloak from 'keycloak-js';
import Config from "./config.json";

const keycloak = Keycloak(Config.keycloak);

export default keycloak;
