import { useState, useCallback, Fragment } from "react";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import { useKeycloak } from '@react-keycloak/web';

function UserInfo(props) {
  let {keycloak} = useKeycloak();

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
        keycloak.idTokenParsed.name + " (" + keycloak.idTokenParsed.email + ")"
      }
    >
      <Dropdown.Item
        href="#"
        onClick={() => {
          keycloak.logout();
        }}
      >
        Log Out
      </Dropdown.Item>
    </DropdownButton>)}

      </Fragment>);
};

export default UserInfo;
