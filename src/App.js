import { useState, useCallback, Fragment } from "react";
import {HashRouter, Routes, Route, Navigate, useParams, BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import {DropdownButton, Dropdown, Nav, Button, Modal } from "react-bootstrap";
import {useKeycloak, ReactKeycloakProvider } from "@react-keycloak/web";
import "bootstrap/dist/css/bootstrap.min.css";

import DatasetsView from "./components/DatasetsView";
import Config from "./config.json";
import DataManager from "./api/DataManager.js";
import MessageView from "./components/MessageView.js";
import Dialog from "./components/Dialog.js";
import Login from "./components/Login";
import DatasetView from "./components/DatasetView";
import DatasetDetailsView from "./components/DatasetDetailsView";
import DatasetHistoryView from "./components/DatasetHistoryView";
import FairView from "./components/FairView";
import NavbarView from "./components/NavbarView";

var dlgDefaultValues = {
  show: false,
  footer: <Button onClick={() => Dialog.HANDLE_CLOSE()}>Close</Button>,
  title: "DEFAULT",
  body: <div>Empty body</div>,
  size: Dialog.SIZE_LG,
  onBeforeClose: null,
  data: null
};

const App = (props) => {
  const [dlgState, setDlgState] = useState(dlgDefaultValues);
  const showDialog = dlgProps => {
    setDlgState({
      ...dlgState,
      show: true,
      footer: dlgProps.footer,
      body: dlgProps.body,
      title: dlgProps.title,
      size: dlgProps.size,
      onBeforeClose: dlgProps.onBeforeClose
    });
  };




  let {keycloak} = useKeycloak();
  const [dataManager, setDataManager] = useState(new DataManager());
  const [message, setMessage] = useState(null);
  const postMessage = message => {
    setMessage(message);
  };
  return (
      <Fragment>
        <Dialog settings={dlgState} />
        <MessageView message={message} />
        <NavbarView />
        <Fragment>

          <br />
          <BrowserRouter basename={Config.basename}>
            <Routes>
              <Route exact path="/" element={<Navigate to="/datasets" replace />} />
              <Route exact path="/fair" element={<FairView />} />
              <Route path="/datasets" element={<DatasetsView keycloakReady={props.keycloakReady} 
                  urlChangedUpdKeycloak={props.urlChangedUpdKeycloakUri}
                  dataManager={dataManager} postMessage={postMessage} />} />
                <Route path="/datasets/:datasetId/details" element={<DatasetView showDialog={showDialog} keycloakReady={props.keycloakReady} postMessage={postMessage} dataManager={dataManager} activeTab={DatasetView.TAB_DETAILS}/>} />
                <Route path="/datasets/:datasetId/studies" element={<DatasetView showDialog={showDialog} keycloakReady={props.keycloakReady} postMessage={postMessage} dataManager={dataManager} activeTab={DatasetView.TAB_STUDIES}/>} />
                <Route path="/datasets/:datasetId/history" element={<DatasetView showDialog={showDialog} keycloakReady={props.keycloakReady} postMessage={postMessage} dataManager={dataManager} activeTab={DatasetView.TAB_HISTORY}/>} />
                <Route path="/datasets/:datasetId/dashboard" element={<DatasetView showDialog={showDialog} keycloakReady={props.keycloakReady} postMessage={postMessage} dataManager={dataManager} activeTab={DatasetView.TAB_DASHBOARD}/>} />
                <Route path="*" element={
                    <main style={{ padding: "1rem" }}>
                      <p>There's nothing here!</p>
                    </main>
                  }
                />
            </Routes>
          </BrowserRouter>
        </Fragment>
      </Fragment>

  );
};

export default App;
