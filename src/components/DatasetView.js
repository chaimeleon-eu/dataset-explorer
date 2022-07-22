import {Tabs, Tab, Button, Row, Col, Container, Badge, DropdownButton, Dropdown } from "react-bootstrap";
import { Navigate, useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, Fragment }from "react";
import { useKeycloak } from '@react-keycloak/web';
import { EnvelopeFill, ClipboardPlus, PencilFill } from 'react-bootstrap-icons';

import DatasetDetailsView from "./DatasetDetailsView";
import DatasetHistoryView from "./DatasetHistoryView";
import DatasetStudiesView from "./DatasetStudiesView";
import Message from "../model/Message.js";
import Breadcrumbs from "./Breadcrumbs";
import UnauthorizedView from "./UnauthorizedView";
import ResourceNotFoundView from "./ResourceNotFoundView";
import DatasetFieldEdit from "./DatasetFieldEdit";
import Util from "../Util";
import Config from "../config.json";
import Dialog from "./Dialog";

function onLoadAppsDashboard(iframeDom, datasetId) {
  console.log(iframeDom);

  // Create an observer instance linked to the callback function
  const config = { attributes: true, childList: true, subtree: true };
  const targetNode = iframeDom.contentWindow.document.body;
  const cb = (mutationsList, observer) => {
    //console.log("change inside iframe");
    observer.disconnect();
    let inp = iframeDom.contentWindow.document.body.querySelector("#datasets_list-1");
    if (inp !== null) {
      //setTimeout(() =>{
        // React swallows the event, and overides the setter, we have to use the native
        let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(inp, datasetId);
        /*
        triggerFocus(inp);
        inp.value = datasetId;
        inp.defaultValue = datasetId;
        let event = new Event('input', {
            bubbles: true
        });
        inp.dispatchEvent(event);
        inp.value = datasetId;
        inp.defaultValue = datasetId;
        */
        //inp.oninput();
        let event = new Event('change', {
            bubbles: true
        });
        inp.dispatchEvent(event);
        //inp.onchange();
      //     event = new KeyboardEvent('keydown', { bubbles: true, key: 'c' });
        //  inp.dispatchEvent(event);
      //}, 5000)

      // let id = "";
      // for (const c of datasetId) {
      //   let evt = new KeyboardEvent('keydown', { key: c });
      //   inp.dispatchEvent(evt);
      //   id += c;
      //   inp.value = datasetId;
      // }

      //let evt = new KeyboardEvent('keydown', { key: '0' });
      //inp.dispatchEvent(evt);
    }
    /*
    let ymlLns = iframeDom.contentWindow.document.body.querySelectorAll("span.ace_meta");
    for (const spn of ymlLns) {
      //console.log(ymlLns);
      if (spn.innerText === "datasets_list") {
        //console.log(spn.parentNode)
        let txtDom  = spn.parentNode.querySelector("span.ace_string");
        if (txtDom !== null) {
          txtDom.innerText = "\"" + datasetId + "\"";
        } else {
          spn.parentNode.insertAdjacentHTML("beforeend", `<span class="ace_string">"${datasetId}"</span>`);
        }
      }
    }
    */
    observer.observe(targetNode, config);
  }
  const observer = new MutationObserver(cb);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
}

function triggerFocus(element) {
    var eventType = "onfocusin" in element ? "focusin" : "focus",
        bubbles = "onfocusin" in element,
        event;

    if ("createEvent" in document) {
        event = document.createEvent("Event");
        event.initEvent(eventType, bubbles, true);
    }
    else if ("Event" in window) {
        event = new Event(eventType, { bubbles: bubbles, cancelable: true });
    }

    element.focus();
    element.dispatchEvent(event);
}

function getAction(condition, actionCb, txt) {
  if (condition) {
    return <Dropdown.Item href="#"
            onClick={() => {
              actionCb();
            }}>{txt}</Dropdown.Item>
  } else {
    return <Fragment />;
  }
}

function getActions(token, data, patchDatasetCb, showDialog) {
  let entries = [];
  //if (data.editablePropertiesByTheUser.some(r => ["invalidated", "public", "draft"].includes(r))) {
      entries = [
        getAction(data.editablePropertiesByTheUser.includes("invalidated"),
            () => {patchDatasetCb(token, data["id"], "invalidated", !data.invalidated)}, data.invalidated ? "Validate" : "Invalidate"),
        getAction(data.editablePropertiesByTheUser.includes("public"),
            () => {patchDatasetCb(token, data["id"], "public", !data.public)}, data.public ? "Unpublish" : "Publish"),
        getAction(data.editablePropertiesByTheUser.includes("draft"),
                () => {patchDatasetCb(token, data["id"], "draft", false)}, "Release"),
        getAction(!data.editablePropertiesByTheUser.includes("draft"),
            () => {
              showDialog({
                show: true,
                footer: <Fragment />,
                body: <iframe onLoad={(e) => onLoadAppsDashboard(e.target, data["id"])} src={Config.kubeAppsUrl} style={{ width: "100%", height: "100%" }}/>,
                title: <span>Apps Dashboard for dataset <b>{data["id"]}</b></span>,
                size: Dialog.SIZE_XXL,
                onBeforeClose: null
              });
            }, "Use on Apps Dashboard")
      ]
  //}
  if (entries.length !== 0) {
    return  <DropdownButton title="Actions">
        {entries}
            </DropdownButton>;
  }
  return <Fragment />;
}



function DatasetView(props) {
   let location = useLocation();

    let params = useParams();
  let navigate = useNavigate();
  const datasetId = params.datasetId;//props.datasetId;
  const [allValues, setAllValues] = useState({
      isLoading: false,
       isLoaded: false,
       error: null,
       data: null,
       status: -1
    });

    let { keycloak } = useKeycloak();
    const getDataset = function(token, datasetId) {

      props.dataManager.getDataset(token, datasetId, 0, 0)
      .then(
        (xhr) => {
          let data = JSON.parse(xhr.response);
          console.log("[TMP] license set");
          if (data["license"] === null ||  data["license"] === undefined ||  data["license"].length === 0) {
            data["license"] = {title: "", url: ""};
          }
          if (data["licenseUrl"] !== null &&  data["licenseUrl"] !== undefined && data["licenseUrl"].length !== 0) {
            data["license"] = JSON.parse(data["licenseUrl"].replace(/'/g,"\""));//(typeof data["licenseUrl"] === "object" ? data["licenseUrl"] : JSON.parse(data["licenseUrl"])); //data["licenseUrl"].title;//JSON.parse(data["licenseUrl"]);
          }
          setAllValues( prevValues => {
             return { ...prevValues, isLoading: false, isLoaded: true, error: null, data: data, status: xhr.status }
          });
        },
        (xhr) => {
          const error = Util.getErrFromXhr(xhr);
          props.postMessage(new Message(Message.ERROR, error.title, error.text));
            setAllValues( prevValues => {
               return { ...prevValues, data: null, isLoading: false, isLoaded: true, error: error, status: xhr.status}
            });
        });
      }
    const patchDataset = (token, datasetId, field, value) => {
      props.dataManager.patchDataset(token, datasetId, field, value)
      .then(
        (xhr) => {
          getDataset(token, datasetId);
          // setAllValues( prevValues => {
          //   let data = JSON.parse(JSON.stringify(prevValues));
          //   data[field] = value;
          //    return { ...prevValues, isLoading: false, isLoaded: true, error: null, data, status: xhr.status }
          // });
        },
        (xhr) => {
          const error = Util.getErrFromXhr(xhr);
          props.postMessage(new Message(Message.ERROR, error.title, error.text));
          // setAllValues( prevValues => {
          //    return { ...prevValues, data: null, isLoading: false, isLoaded: true, error: Util.getErrFromXhr(xhr), status: xhr.status }
          // });
        });
      }

  useEffect(() => {
      if (props.keycloakReady) {
        getDataset(keycloak.token, datasetId);
      } else {
        getDataset(null, datasetId);
      }
    }, [props.keycloakReady]);
  if (allValues.error !== null) {
    if (allValues.status === 401) {
      return <UnauthorizedView />
    } else if (allValues.status === 404) {
      return <ResourceNotFoundView id={datasetId} />;
    } else {
      return <div>Error</div>;
    }
  } else {
    if (allValues.data === null || allValues.isLoading) {
      return <div>loading...</div>
    }
  }
  return (
    <Fragment>
      <Breadcrumbs elems={[{text: 'Dataset information', link: "", active: true}]}/>
      <Row className="mb-4 mt-4">
        <Col md={8}>
          <h3 className="container-fluid">
              <b className="me-1">{allValues.data.name}
              {
                allValues.data.editablePropertiesByTheUser.includes("draft")
                ? <DatasetFieldEdit datasetId={datasetId} showDialog={props.showDialog} field="name" fieldDisplay="Dataset name" oldValue={allValues.data.name} patchDataset={patchDataset}/>
                : <Fragment />
              }
              </b>
              (
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
          <h3 className="container-fluid mb-0 ms-2" style={{fontSize: "1rem"}}>
            <i>Created on {new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'long' })
                .format(Date.parse(allValues.data.creationDate))}
            </i>
            <span  className="container-fluid mb-0 ms-2" style={{fontSize: "1rem"}}>
              {( allValues.data.invalidated ? <Badge className="me-2" bg="secondary">Invalidated</Badge>: <Fragment /> )}
              {( allValues.data.public ? <Badge bg="dark">Published</Badge> : <Fragment /> )}
              {( allValues.data.draft ? <Badge bg="light" text="dark">Draft</Badge> : <Fragment /> )}
            </span>
          </h3>

        </Col>
        <Col md={4}>
          <div className="float-end">
            {getActions(keycloak.token, allValues.data, patchDataset, props.showDialog)}
          </div>
        </Col>
      </Row>
      <Container fluid>
        <b>Description:</b> <span dangerouslySetInnerHTML={{ __html: allValues.data.description }}></span>
        {
          allValues.data.editablePropertiesByTheUser.includes("description")
          ? <DatasetFieldEdit datasetId={datasetId} showDialog={props.showDialog} field="description" fieldDisplay="Dataset description"
              oldValue={allValues.data.description} patchDataset={patchDataset}/>
          : <Fragment />
        }
      </Container>
      <Container fluid className="w-100 h-75">
        <Tabs defaultActiveKey="details" activeKey={props.activeTab} onSelect={(k) => navigate(`/datasets/${datasetId}/${k}`)}>
          <Tab eventKey="details" title="Details">
            <DatasetDetailsView patchDataset={patchDataset} showDialog={props.showDialog} 
              allValues={allValues} keycloakReady={props.keycloakReady} postMessage={props.postMessage} dataManager={props.dataManager}/>
          </Tab>

          {keycloak.authenticated ?
            [
                (<Tab eventKey="studies" title="Studies" key="studies">
                  <DatasetStudiesView datasetId={datasetId} studiesCount={allValues.data === null ? 0 : allValues.data.studiesCount} keycloakReady={props.keycloakReady}
                    postMessage={props.postMessage} dataManager={props.dataManager}/>
                </Tab>),
                (<Tab eventKey="history" title="History" key="history">
                      <DatasetHistoryView datasetId={datasetId} keycloakReady={props.keycloakReady} postMessage={props.postMessage} dataManager={props.dataManager}/>
                </Tab>)
                /*,
                (<Tab eventKey="dashboard" title="Dashboard"  key="dashboard">
                  <div className="w-100 h-100" style={{ height: "50vh" }}>
                  <iframe onLoad={(e) => onLoadAppsDashboard(e.target, datasetId)} src={Config.kubeAppsUrl} style={{ width: "100%", height: "50vh" }}/>
                  </div>
                </Tab>)
                */
            ] : (<Fragment />)}
        </Tabs>
      </Container>
    </Fragment>
  );
}

DatasetView.TAB_DETAILS = "details";
DatasetView.TAB_STUDIES = "studies";
DatasetView.TAB_HISTORY = "history";
DatasetView.TAB_DASHBOARD = "dashboard";

export default DatasetView;
