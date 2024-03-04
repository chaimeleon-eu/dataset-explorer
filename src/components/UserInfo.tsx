import { useState, useCallback, Fragment } from "react";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import { useKeycloak } from '@react-keycloak/web';
import { Person } from "react-bootstrap-icons";


import Config from "../config.json";

function UserInfo(props) {
  let {keycloak} = useKeycloak();

  return (
    <Fragment>
    {!keycloak.authenticated && (
      <Button
      size="sm"
        type="button"
        className="text-blue-800"
        onClick={() => keycloak.login()}
      >
        Login
      </Button>
    )}

    {keycloak.authenticated && (
            <Dropdown size="sm" title="Logged in user options" className="float-end me-1" drop="down-centered" >
            <Dropdown.Toggle size="sm"  variant="primary" id="dropdown-basic">
                <Person /> { keycloak.idTokenParsed.name /* + " (" + keycloak.idTokenParsed.email + ")"*/ }
            </Dropdown.Toggle>
      
      <Dropdown.Menu style={{"fontSize": "0.9rem", "minWidth": "2rem"}}>

      <Dropdown.Item style={{"fontSize": "0.9rem"}} href={Config.userAccountUrl} key="useraccount" target="_blank" >
        User Account
      </Dropdown.Item>
      <Dropdown.Item
        style={{"fontSize": "0.9rem"}}
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
    </Dropdown.Menu>
    </Dropdown>)}

      </Fragment>);
};

export default UserInfo;
