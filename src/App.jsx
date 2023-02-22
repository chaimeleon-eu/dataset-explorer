import  React, { useState, Fragment, useCallback } from "react";
import {Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import PropTypes from "prop-types";

import DatasetsView from "./components/DatasetsView";
import Config from "./config.json";
import DataManager from "./api/DataManager.js";
import MessageView from "./components/MessageView";
import Dialog from "./components/Dialog";
import DatasetView from "./components/DatasetView";
import FairView from "./components/FairView";
import SupportView from "./components/SupportView";
import NavbarView from "./components/NavbarView";
import Footer from "./components/Footer";
//import { Nav } from "react-bootstrap";

function getDSV({tab, sdo, dataManager, keycloakReady, postMessage, showDialog}) {
  return (
    <DatasetView showDialog={showDialog} keycloakReady={keycloakReady} 
    postMessage={postMessage} dataManager={dataManager} activeTab={tab} showdDlgOpt={sdo}/>
    );
}

App.propTypes = {
  keycloakReady: PropTypes.bool
}

function App(props) {
  const keycloakReady = props.keycloakReady;
  const handleClose = useCallback(() => Dialog.HANDLE_CLOSE());
  let dlgDefaultValues = {
    show: false,
    footer: <Button onClick={handleClose}>Close</Button>,
    title: "DEFAULT",
    body: <div>Empty body</div>,
    size: Dialog.SIZE_LG,
    onBeforeClose: null,
    data: null
  };
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
  const [dataManager] = useState(new DataManager());
  const [message, setMessage] = useState(null);
  const postMessage = message => {
    setMessage(message);
  };
  let opt = {
    dataManager,
    keycloakReady,
    postMessage,
    showDialog,
    sdo: null,
    tab: null
  }
  return (
      <Fragment>
        <Dialog settings={dlgState} />
        <MessageView message={message} />
        <NavbarView />
        <div className="flex-grow-1 align-items-stretch ms-3 me-3">

          <br />
          <BrowserRouter basename={Config.basename}>
            <Routes>
              <Route exact path="/" element={<Navigate to="/datasets" replace />} />
              <Route exact path="/fair" element={<FairView />} />
              <Route exact path="/support" element={<SupportView />} />
              <Route path="/datasets" element={<DatasetsView keycloakReady={props.keycloakReady} 
                  dataManager={dataManager} postMessage={postMessage} />} />
                <Route path="/datasets/:datasetId/details" 
                  element={<DatasetView showDialog={showDialog} keycloakReady={props.keycloakReady} 
                    postMessage={postMessage} dataManager={dataManager} activeTab={DatasetView.TAB_DETAILS}/>} />
                <Route path="/datasets/:datasetId/details/dlg-app-dashboard" 
                  element={getDSV({...opt, tab: DatasetView.TAB_DETAILS, sdo: DatasetView.SHOW_DLG_APP_DASHBOARD })} />
                <Route path="/datasets/:datasetId/studies" 
                  element={<DatasetView showDialog={showDialog} keycloakReady={props.keycloakReady} 
                  postMessage={postMessage} dataManager={dataManager} activeTab={DatasetView.TAB_STUDIES}/>} />
                <Route path="/datasets/:datasetId/studies/dlg-app-dashboard" 
                  element={getDSV({...opt, tab: DatasetView.TAB_STUDIES, sdo: DatasetView.SHOW_DLG_APP_DASHBOARD })} />
                <Route path="/datasets/:datasetId/history" 
                  element={<DatasetView showDialog={showDialog} keycloakReady={props.keycloakReady} 
                    postMessage={postMessage} dataManager={dataManager} activeTab={DatasetView.TAB_HISTORY}/>} />
                <Route path="/datasets/:datasetId/history/dlg-app-dashboard" 
                  element={getDSV({...opt, tab: DatasetView.TAB_HISTORY, sdo: DatasetView.SHOW_DLG_APP_DASHBOARD })} />
                <Route path="*" element={
                    <main style={{ padding: "1rem" }}>
                      <p>There is nothing here!</p>
                    </main>
                  }
                />
            </Routes>
          </BrowserRouter>
        </div>
        <Footer />
      </Fragment>

  );
}

export default App;
