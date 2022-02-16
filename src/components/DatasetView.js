import {Tabs, Tab, Button, Row } from "react-bootstrap";
import { Navigate, useParams, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect }from "react";
import { useKeycloak } from '@react-keycloak/web';
import { EnvelopeFill, ClipboardPlus } from 'react-bootstrap-icons';

import DatasetDetailsView from "./DatasetDetailsView";
import DatasetHistoryView from "./DatasetHistoryView";
import DatasetStudiesView from "./DatasetStudiesView";
import Message from "../model/Message.js";
import Breadcrumbs from "./Breadcrumbs";
import UnauthorizedView from "./UnauthorizedView";
import ResourceNotFoundView from "./ResourceNotFoundView";

function DatasetView(props) {
   let location = useLocation();

    let params = useParams();
  let navigate = useNavigate();
  const datasetId = params.datasetId;//props.datasetId;
  const [allValues, setAllValues] = useState({
       isLoaded: false,
       error: false,
       data: null,
       status: -1
    });
  // const [isLoaded, setIsLoaded] = useState(false);
  // const [error, setError] = useState(false);
  // const [data, setData] = useState(null);

  let { keycloak } = useKeycloak();
  useEffect(() => {
    props.dataManager.getDataset(keycloak.token, datasetId)
      .then(
        (xhr) => {
          setAllValues( prevValues => {
             return { ...prevValues, isLoaded: true, data: JSON.parse(xhr.response), status: xhr.status }
          });
          // setIsLoaded(true);
          // setData(JSON.parse(xhr.response));
        },
        (xhr) => {
          //setIsLoaded(true);
          let title = null;
          let text = null;
          if (!xhr.responseText) {
            if (xhr.statusText !== undefined && xhr.statusText !== null) {
                title = xhr.statusText;
                text = "Error loading data from " + xhr.responseURL;
            } else {
              title = Message.UNK_ERROR_TITLE;
              text =  "Error loading data from " + xhr.responseURL;
            }
          } else {
            const err = JSON.parse(xhr.response);
              title = err.title;
              text = err.message;
          }
          //props.postMessage(new Message(Message.ERROR, title, text));
            setAllValues( prevValues => {
               return { ...prevValues, isLoaded: true, error: true, status: xhr.status}
            });
          // setError(true);
          // console.log("here");
        });

  }, [props.keycloakReady]);
  if (!allValues.isLoaded) {
    return <div>loading...</div>
  }
  if (allValues.error === true) {
    if (allValues.status === 401) {
      return <UnauthorizedView />
    } else if (allValues.status === 404) {
      return <ResourceNotFoundView id={datasetId} />;
    } else {
      return <div></div>;
    }
  }
  console.log(allValues);
  return (
    <React.Fragment>
    <Breadcrumbs elems={[{text: 'Dataset information', link: "", active: true}]}/>
    <Row className="mb-4">
    <h3 className="container-fluid mb-0">
      <b>{allValues.data.name}</b> (
        <i>{allValues.data.id}</i>
        <Button variant="link" className="m-0 ms-1 p-0" onClick={() =>
            {navigator.clipboard.writeText(allValues.data.id).then(function() {
              console.log('Async: Copying to clipboard was successful!');
            }, function(err) {
              console.error('Async: Could not copy text: ', err);
            });}} >
          <ClipboardPlus />
        </Button>
      )
    </h3>
    <div style={{fontSize: "1rem"}}><i>Created on {new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'long' })
          .format(Date.parse(allValues.data.creationDate))}
          </i>
    </div>
    </Row>
    <p>
    <b>Description:</b> {allValues.data.description}
    </p>
    <Tabs defaultActiveKey="details" activeKey={props.activeTab} onSelect={(k) => navigate(`/datasets/${datasetId}/${k}`)}>
      <Tab eventKey="details" title="Details">
        <DatasetDetailsView allValues={allValues} keycloakReady={props.keycloakReady} postMessage={postMessage} dataManager={props.dataManager}/>
      </Tab>
      <Tab eventKey="studies" title="Studies">
        <DatasetStudiesView allValues={allValues} keycloakReady={props.keycloakReady} postMessage={postMessage} dataManager={props.dataManager}/>
      </Tab>
      {keycloak.authenticated ?
        (<Tab eventKey="history" title="History">
            <DatasetHistoryView keycloakReady={props.keycloakReady} postMessage={postMessage} dataManager={props.dataManager}/>
          </Tab>) : (<React.Fragment />)}
    </Tabs>
    </React.Fragment>
  );
}

DatasetView.TAB_DETAILS = "details";
DatasetView.TAB_STUDIES = "studies";
DatasetView.TAB_HISTORY = "history";

export default DatasetView;
