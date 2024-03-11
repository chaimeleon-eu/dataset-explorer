import React, { Fragment } from "react";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import { useKeycloak } from '@react-keycloak/web';


import Config from "../config.json";

function UserInfo() {
  let {keycloak} = useKeycloak();

  const name: string = keycloak.idTokenParsed?.["name"] ?? "<i>Unknown user</i>";
  const email: string = keycloak.idTokenParsed?.["email"] ? " (" + keycloak.idTokenParsed?.["email"] + ")" : "";

  return (
    <Fragment>
    {!keycloak.authenticated && (
      <Button
        type="button"
        className="text-blue-800"
        onClick={() => keycloak.login()}
      >
        Login
      </Button>
    )}

    {keycloak.authenticated && (<DropdownButton
      id="dropdown-basic-button"
      title={
        name + email
      }
    >
      <Dropdown.Item href={Config.userAccountUrl} key="useraccount" target="_blank" >
        User Account
      </Dropdown.Item>
      <Dropdown.Item
        href="#" key="logout"
        onClick={() => {
             // workaround for changes with oidc logout in Keycloak 18.0.0
        // See https://www.keycloak.org/docs/latest/upgrading/index.html#openid-connect-logout
      //   console.log(`old logout url: ${keycloak.createLogoutUrl()}` );
      //   keycloak.createLogoutUrl = function(options) 
      //   {
      //     let url = keycloak.endpoints.logout()
      //     + '?client_id=' + encodeURIComponent(keycloak.clientId)
      //     + '&post_logout_redirect_uri=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/" + Config.basename);

      //     if (keycloak.idToken) {
      //         url += '&id_token_hint=' + encodeURIComponent(keycloak.idToken);
      //     }

      //     return url;
      //   }
       const url = window.location.protocol + "//" + window.location.host + Config.basename;
       //console.log("Logout redir url: " + url);
      // console.log(keycloak);
          keycloak.logout({
            redirectUri: url
          });
        }}
      >
        Log Out
      </Dropdown.Item>
    </DropdownButton>)}

      </Fragment>);
};

export default UserInfo;
