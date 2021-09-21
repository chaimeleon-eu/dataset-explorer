import React from 'react';
import {useState, useCallback} from 'react';
import ReactDOM from 'react-dom';
import { DropdownButton, Dropdown, Nav, Button } from 'react-bootstrap';
import { useKeycloak } from '@react-keycloak/web';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useParams,
  } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';

import DatasetsView from "./components/DatasetsView";
import TraceView from "./components/TraceView";
import Config from "./config.json";
import DataManager from "./api/DataManager.js";
import MessageView from "./components/MessageView.js";

const UserInfo = () => {
  let { keycloak } = useKeycloak();

  return (
    <DropdownButton id="dropdown-basic-button" title={keycloak.idTokenParsed.name +
          " (" + keycloak.idTokenParsed.email + ")"}>
      <Dropdown.Item href="#" onClick={() => {keycloak.logout();}}>Log Out</Dropdown.Item>
    </DropdownButton>);
}

const NavMenu = () => {

  return (
    <Nav variant="pills" >
      <Nav.Item>
        <Nav.Link href="/datasets">Datasets</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/traces" eventKey="link-1">Traces</Nav.Link>
      </Nav.Item>
    </Nav>

  );

}

const App = () => {

    let { keycloak } = useKeycloak();
    const [dataManager, setDataManager] = React.useState(new DataManager(keycloak.token));
    const [message, setMessage] = useState(null);
    const postMessage = (message) => {
        setMessage(message);
    };
    return (
      <div className="m-3">
        <MessageView message={message} />
        <div className="w-100 p-3 h-auto d-inline-block ">
          <div className="float-start">
            <h4 className="m-0 p-0">Datsuc</h4>
            <Button className="m-0 p-0" size="sm" variant="link">{Config.appVersion}</Button>
          </div>
          <div className="float-start ml-2"><NavMenu /></div>
          <div className="float-end"><UserInfo /></div>
        </div>
        <div>

        <br />
        <Switch>
            <Route path="/datasets">
              <DatasetsView dataManager={dataManager} postMessage={postMessage}/>
            </Route>
            <Route path="/traces">
              <TraceView dataManager={dataManager} postMessage={postMessage} />
            </Route>
            </Switch>
        </div>
      </div>
    );
}

export default App;
