import {Tabs, Tab, Button, Row, Col, Container, Badge } from "react-bootstrap";
import { Navigate, useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, Fragment }from "react";
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
    props.dataManager.getDataset(keycloak.token, datasetId, 0, 0)
      .then(
        (xhr) => {
          console.log(xhr.response);
          setAllValues( prevValues => {
             return { ...prevValues, isLoaded: true, error: false, data: JSON.parse(xhr.response), status: xhr.status }
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
               return { ...prevValues, data: null, isLoaded: true, error: true, status: xhr.status}
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
      return <div>Error</div>;
    }
  }
  return (
    <Fragment>
      <Breadcrumbs elems={[{text: 'Dataset information', link: "", active: true}]}/>
      <Row className="mb-4 mt-4">
        <Col md={11}>
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
          <h3 className="container-fluid mb-0 ms-2" style={{fontSize: "1rem"}}><i>Created on {new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'long' })
                .format(Date.parse(allValues.data.creationDate))}
                </i>
          </h3>
          {( allValues.data.invalidated || allValues.data.public ?
            <h3  className="container-fluid mb-0 ms-2 mt-2" style={{fontSize: "1rem"}}>
              {( allValues.data.invalidated ? <Badge className="me-2" bg="secondary">Invalidated</Badge>: <Fragment /> )}
              {( allValues.data.public ? <Badge bg="dark">Public</Badge> : <Fragment /> )}
            </h3>
            : <Fragment />
          )}
        </Col>
        <Col md={1}>
          {keycloak.authenticated && keycloak.tokenParsed.sub === allValues.data.authorId ?
            (<Button >Invalidate</Button>) : (<Fragment />)}
        </Col>
      </Row>
      <Container fluid className="mt-0 mb-6">
        <b>Description:</b> {allValues.data.description}
      </Container>
      <Container fluid className="">
        <Tabs defaultActiveKey="details" activeKey={props.activeTab} onSelect={(k) => navigate(`/datasets/${datasetId}/${k}`)}>
          <Tab eventKey="details" title="Details">
            <DatasetDetailsView allValues={allValues} keycloakReady={props.keycloakReady} postMessage={props.postMessage} dataManager={props.dataManager}/>
          </Tab>
          <Tab eventKey="studies" title="Studies">
            <DatasetStudiesView datasetId={datasetId} studiesCount={allValues.data === null ? 0 : allValues.data.studiesCount} keycloakReady={props.keycloakReady}
              postMessage={props.postMessage} dataManager={props.dataManager}/>
          </Tab>
          {keycloak.authenticated ?
            (<Tab eventKey="history" title="History">
                <DatasetHistoryView datasetId={datasetId} keycloakReady={props.keycloakReady} postMessage={props.postMessage} dataManager={props.dataManager}/>
              </Tab>) : (<Fragment />)}
        </Tabs>
      </Container>
    </Fragment>
  );
}

DatasetView.TAB_DETAILS = "details";
DatasetView.TAB_STUDIES = "studies";
DatasetView.TAB_HISTORY = "history";

export default DatasetView;
