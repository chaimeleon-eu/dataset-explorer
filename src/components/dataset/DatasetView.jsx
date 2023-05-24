import {Tab, Button, Row, Col, Container, Badge, DropdownButton, Dropdown, Nav } from "react-bootstrap";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect, Fragment, useCallback }from "react";
import { useKeycloak } from '@react-keycloak/web';
import { EnvelopeFill } from 'react-bootstrap-icons';
import PropTypes from "prop-types";

import DatasetDetailsView from "./details/DatasetDetailsView";
import DatasetHistoryView from "./history/DatasetHistoryView";
import DatasetStudiesView from "./studies/DatasetStudiesView";
import Message from "../../model/Message.js";
import Breadcrumbs from "../Breadcrumbs";
import UnauthorizedView from "../UnauthorizedView";
import ResourceNotFoundView from "../ResourceNotFoundView";
import DatasetFieldEdit from "./common/DatasetFieldEdit";
import Util from "../../Util";
import Config from "../../config.json";
import Dialog from "../Dialog";



function onLoadAppsDashboard(iframeDom, datasetId, uNameKeycloak) {
  // Create an observer instance linked to the callback function
  const config = { attributes: true, childList: true, subtree: true };
  const targetNode = iframeDom.contentWindow.document.body;
  let uNameKube = null;
  if (uNameKeycloak !== null && uNameKeycloak !== undefined) {
    uNameKube = Util.parseK8sNames(uNameKeycloak, true);
  }
  console.log(uNameKube);
  const cb = (mutationsList, observer) => {
    //console.log("change inside iframe");
    observer.disconnect();
    // const cContext = iframeDom.contentWindow.document.body.querySelector("div.kubeapps-dropdown-section > span.kubeapps-dropdown-header");
    // if (cContext !== null) {
    //   console.log(cContext);
    //   cContext.dispatchEvent( new Event('click',{
    //     bubbles: true
    //   }) );
    //   if (uNameKube !== null) {
    //     const selectNamespace = iframeDom.contentWindow.document.body.querySelector(".application-notes");
    //     if (selectNamespace !== null) {
    //       console.log(selectNamespace);
    //       selectNamespace.value = uNameKube;
    //       // const opts = selectNamespace.querySelectorAll("a");
    //       // for (const o of opts) {
    //       //   if (o.value === uNameKube) {
    //       //     selectNamespace.value = 
    //       //   }
    //       // }
    //     }
    //   }
    // }
    let inp = iframeDom.contentWindow.document.body.querySelector("#datasets_list-0");
    if (inp !== null) {
        // React swallows the event, and overides the setter, we have to use the native
        let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(inp, datasetId);
        let event = new Event('change', {
            bubbles: true
        });
        inp.dispatchEvent(event);
    }
    // Set all links in the Installation Notes section to be openable in a new tab
    const appnotes = iframeDom.contentWindow.document.body.querySelector(".application-notes");
    if (appnotes !== null) {
      const links = appnotes.querySelectorAll("a");
      console.log(links);
      for (let a of links) {
        a.target = "_blank";
      }
    }

    observer.observe(targetNode, config);
  }
  const observer = new MutationObserver(cb);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
}

// function triggerFocus(element) {
//     var eventType = "onfocusin" in element ? "focusin" : "focus",
//         bubbles = "onfocusin" in element,
//         event;

//     if ("createEvent" in document) {
//         event = document.createEvent("Event");
//         event.initEvent(eventType, bubbles, true);
//     }
//     else if ("Event" in window) {
//         event = new Event(eventType, { bubbles: bubbles, cancelable: true });
//     }

//     element.focus();
//     element.dispatchEvent(event);
// }

function getAction(condition, actionCb, txt, keyName) {
  if (condition) {
    return <Dropdown.Item eventKey={keyName} key={keyName} href="#"
            onClick={() => {
              actionCb();
            }}>{txt}</Dropdown.Item>
  } else {
    return <Fragment />;
  }
}

function showDialogPublishDs(token, patchDatasetCb, showDialog,  data) {
  if (!data["public"]) {
    const  showZenodo = data["pids"]["preferred"] == null;
    showDialog({
      show: true,
      footer: <div>
          <Button className="m-2" onClick={() => {patchDatasetCb(token, data["id"], "public", !data.public);Dialog.HANDLE_CLOSE();}}>Publish</Button>
          <Button className="m-2" onClick={() => Dialog.HANDLE_CLOSE()}>Cancel</Button>
        </div>,
      body: <div>
          The published dataset:
          <ul>
            <li>will be visible and usable by registered users out of CHAIMELEON consortium</li>
            <li>will be visible (the metadata, never the contents) by unregistered users</li>
            {showZenodo ? <li>the metadata and a small index of studies will be deposited publicly in Zenodo.org in order to obtain a DOI*</li> : <Fragment />}
          </ul>
          {showZenodo ?
              <div className="mt-4">
                *Metadata includes the content of &quot;Details&quot; tab: author, creation date, contact information, license and statistical info.
                Index of studies includes some content of &quot;Studies&quot; tab: study id, study name, subject name and series name.
              </div>
              : <Fragment/>}
        </div>,
      title: <div>Publish dataset <b>{data["name"]}</b> (<i>{data["id"]}</i>)</div>,
      size: Dialog.SIZE_LG,
      onBeforeClose: null
    });
  } else {
    patchDatasetCb(token, data["id"], "public", !data.public);
  }
}

function showDialogAppDashhboard(datasetId, showDialog, onBeforeClose, uNameKeycloak) {
  showDialog({
    show: true,
    footer: <Fragment />,
    body: <iframe onLoad={(e) => onLoadAppsDashboard(e.target, datasetId, uNameKeycloak)} src={Config.kubeAppsUrl} style={{ width: "100%", height: "100%" }}/>,
    title: <span>Apps Dashboard for dataset <b>{datasetId}</b></span>,
    size: Dialog.SIZE_XXL,
    onBeforeClose: () => onBeforeClose()
  });
}

function popPath(path) {
  let pS = path.split("/");
  pS.pop();
  return pS.join("/");
}

Actions.propTypes = {
  data: PropTypes.object,
  patchDatasetCb: PropTypes.func,
  showDialog: PropTypes.func
}

function Actions({data, patchDatasetCb, showDialog}) {

  let { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const location = useLocation();
  let entries = [];
  //if (data.editablePropertiesByTheUser.some(r => ["invalidated", "public", "draft"].includes(r))) {
      entries = [
        getAction(!data["creating"] && !data["invalidated"] ,
            () => {
              const path = location.pathname;
              // if (keycloak.authenticated) {
              //   navigate(`${path}/${DatasetView.SHOW_DLG_APP_DASHBOARD}`);
              //   showDialogAppDashhboard(data["id"], showDialog, () => {
              //     navigate(popPath(path));
              //   })
              // } else {
                if (path.endsWith(DatasetView.SHOW_DLG_APP_DASHBOARD))
                  keycloak.login();
                else {
                  navigate(`${path}/${DatasetView.SHOW_DLG_APP_DASHBOARD}`);
                  keycloak.login();
                }
              //}
            }, "Use on Apps Dashboard", "action-use-dashboard")
      ]
      console.log(`data.editablePropertiesByTheUser ${data.editablePropertiesByTheUser}`);
      if (keycloak.authenticated) {
        entries.push(
          getAction(data.editablePropertiesByTheUser.includes("invalidated"),
            () => {patchDatasetCb(keycloak.token, data["id"], "invalidated", 
                !data.invalidated)}, data.invalidated ? "Validate" : "Invalidate", "action-invalidate"),
          getAction(data.editablePropertiesByTheUser.includes("public"),
              () => showDialogPublishDs(keycloak.token, patchDatasetCb, showDialog,  data), 
                  data.public ? "Unpublish" : "Publish", "action-publish"),
          getAction(data.editablePropertiesByTheUser.includes("draft"),
                  () => {patchDatasetCb(keycloak.token, data["id"], "draft", false)}, "Release", "action-release")
        );
      }
  //}
  if (entries.length !== 0) {
    return  <DropdownButton key="actions-drop" title="Actions">
        {entries}
            </DropdownButton>;
  }
  return <Fragment />;
}

DatasetView.propTypes = {
  dataManager: PropTypes.object,
  postMessage: PropTypes.func,
  showDialog: PropTypes.func,
  keycloakReady: PropTypes.bool,
  showdDlgOpt: PropTypes.string,
  activeTab: PropTypes.string
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
    const handlePostMsg = useCallback((msgType, title, text) => {
      props.postMessage(new Message(msgType, title, text));
    }, []);

    let { keycloak } = useKeycloak();
    const getDataset = useCallback((token, datasetId) => {

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
          if (xhr.status === 401) {
            keycloak.login();
          } else {
            props.postMessage(new Message(Message.ERROR, error.title, error.text));
              setAllValues( prevValues => {
                return { ...prevValues, data: null, isLoading: false, isLoaded: true, error: error, status: xhr.status}
              });
          }
        });
      }, [props.dataManager, keycloak]);
    const patchDataset = (token, datasetId, field, value) => {
      props.dataManager.patchDataset(token, datasetId, field, value)
      .then(
        () => {
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
        console.log(`props.showdDlgOpt ${props.showdDlgOpt}`);
        getDataset(keycloak.token, datasetId);
        if (props.showdDlgOpt === DatasetView.SHOW_DLG_APP_DASHBOARD) {
          if (keycloak.authenticated) {
            showDialogAppDashhboard(datasetId, props.showDialog, () => {
              navigate(popPath(location.pathname));
            },
            keycloak.idTokenParsed.preferred_username
            )
          } else {
            keycloak.login();
          }
        }
      } 
      // else {
      //   getDataset(null, datasetId);
      // }
    }, [props.keycloakReady, keycloak.authenticated]);
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
        <Col md={11}>
          <span className="h3">
              <b className="me-1">{allValues.data.name}
              {
                allValues.data.editablePropertiesByTheUser.includes("draft")
                ? <DatasetFieldEdit datasetId={datasetId} showDialog={props.showDialog} field="name" fieldDisplay="Dataset name" oldValue={allValues.data.name} patchDataset={patchDataset}/>
                : <Fragment />
              }
              </b>
          </span>
            <sup  className="container-fluid ms-0" style={{fontSize: "0.9rem"}}>
              {( allValues.data.invalidated ? <Badge pill className="me-2" bg="secondary">Invalidated</Badge>: <Fragment /> )}
              {( allValues.data.public ? <Badge pill bg="dark">Published</Badge> : <Fragment /> )}
              {( allValues.data.draft ? <Badge pill bg="light" text="dark">Draft</Badge> : <Fragment /> )}
            </sup>
            <div>
              <i>Created on </i> 
                {new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'long' })
                    .format(Date.parse(allValues.data.creationDate))}
                {keycloak.authenticated ? (
                <Fragment>
                  <i> by </i>
                    {allValues.data.authorName}
                    <a className="ms-1" title="Send an email to the dataset author" href={"mailto:" + allValues.data.authorEmail }>
                      <EnvelopeFill />
                    </a>
                    </Fragment>
                ) : (<Fragment />)}
              </div>

        </Col>
        <Col md={1}>
          <div className="float-end">
            <Actions data={allValues.data} patchDatasetCb={patchDataset} showDialog={props.showDialog}/>
          </div>
        </Col>
      </Row>
      <Container fluid className="w-100 h-75">

        <Tab.Container defaultActiveKey="details" activeKey={props.activeTab} onSelect={(k) => navigate(`/datasets/${datasetId}/${k}`)}>
          <Row>
            <Col sm={2}>
              <Nav variant="pills" className="flex-column mb-5">
                <Nav.Item>
                  <Nav.Link eventKey="details">Details</Nav.Link>
                </Nav.Item>
                {keycloak.authenticated ?
                  [
                      (<Nav.Item key="studies-nav">
                        <Nav.Link eventKey="studies" key="studies">Studies</Nav.Link>
                      </Nav.Item>),
                      (<Nav.Item key="history-nav">
                        <Nav.Link eventKey="history">History</Nav.Link>
                      </Nav.Item>)
                  ] : (<Fragment />)}
              </Nav>

            </Col>
            <Col sm={10}>
              <Tab.Content>
                <Tab.Pane eventKey="details">
                  <DatasetDetailsView patchDataset={patchDataset} showDialog={props.showDialog} getDataset={getDataset}
                    allValues={allValues} keycloakReady={props.keycloakReady} postMessage={props.postMessage} dataManager={props.dataManager}/>
                </Tab.Pane>

                {keycloak.authenticated ?
                  [
                    (<Tab.Pane eventKey="studies"  key="studies-pane">
                      <DatasetStudiesView datasetId={datasetId} studiesCount={allValues.data === null ? 0 : allValues.data.studiesCount} keycloakReady={props.keycloakReady}
                        postMessage={props.postMessage} dataManager={props.dataManager}/>
                    </Tab.Pane>),
                    (<Tab.Pane eventKey="history" key="history-pane" >
                      <DatasetHistoryView datasetId={datasetId} keycloakReady={props.keycloakReady} postMessage={props.postMessage} dataManager={props.dataManager}/>
                     </Tab.Pane>)
                  ] : (<Fragment />)}
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </Fragment>
  );
}

DatasetView.TAB_DETAILS = "details";
DatasetView.TAB_STUDIES = "studies";
DatasetView.TAB_HISTORY = "history";
//DatasetView.TAB_DASHBOARD = "dashboard";

DatasetView.SHOW_DLG_APP_DASHBOARD = "dlg-app-dashboard"

export default DatasetView;
