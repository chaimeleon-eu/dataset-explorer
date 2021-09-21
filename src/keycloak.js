import Keycloak from 'keycloak-js';

const keycloak = Keycloak({
  'url': 'http://localhost:8080/auth',
  'realm': 'CHAIMELEON',
  'clientId': 'datsuc',
  'onLoad': 'login-required'
});

export default keycloak;
