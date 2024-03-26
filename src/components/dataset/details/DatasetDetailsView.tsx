import React, { Fragment } from "react";
import { Container, Row, Col} from 'react-bootstrap';
import DataManager from "../../../api/DataManager";
import StaticValues from "../../../api/StaticValues";
import Dataset from "../../../model/Dataset";

import DatasetFieldEdit from "../common/DatasetFieldEdit";
import DatasetDetailsBox from "./DatasetDetailsBox";
import MessageBox from "./MessageBox";

interface DatasetDetailsViewProps {
  dataset: Dataset;
  showDialog: Function;
  patchDataset: Function;
  getDataset: Function;
  keycloakReady: boolean;
  dataManager: DataManager;
  postMessage: Function;
}

function DatasetDetailsView(props: DatasetDetailsViewProps) {
  const dataset = props.dataset;
  // let ageLstItem = <span>-</span>;
  // if (dataset.ageLow != null && dataset.ageHigh != null) {
  //   ageLstItem = <span>Between {dataset.ageLow} {dataset.ageUnit[0]} and {dataset.ageHigh} {dataset.ageUnit[1]}</span>
  // } else if (dataset.ageLow != null)  {
  //   ageLstItem = <span>Greater than {dataset.ageLow} {dataset.ageUnit[0]}</span>
  // } else if (dataset.ageHigh != null)  {
  //   ageLstItem = <span>Less than {dataset.ageHigh} {dataset.ageUnit[1]}</span>

  // }
  let pids = dataset.pids;
  let pidUrl: string = "";
  //let pidsPatch = Object.create(null);
  //pidsPatch["preferred"] = pids["preferred"];
  if (pids["preferred"] === StaticValues.DS_PID_ZENODO) {
    pidUrl = pids.urls.zenodoDoi ?? "";
    ///pidsPatch[pids["preferred"]] = pids["url"]
  } else if (pids["preferred"] === StaticValues.DS_PID_CUSTOM) {
    pidUrl = pids.urls.custom ?? "";
  }

  return(
    <Container fluid>
      <Row>
        <MessageBox postMessage={props.postMessage} keycloakReady={props.keycloakReady} dataManager={props.dataManager} 
          dataset={dataset} getDataset={props.getDataset}/>
      </Row>

      <Row>
        <Col md={8}>
          <p>
            <b className="h5">Description:</b>
            {
              dataset.editablePropertiesByTheUser.includes("description")
              ? <DatasetFieldEdit datasetId={dataset.id} showDialog={props.showDialog} field="description" fieldDisplay="Dataset description"
                  oldValue={dataset.description} patchDataset={props.patchDataset} keycloakReady={props.keycloakReady} dataManager={props.dataManager}/>
              : <Fragment />
            }
            <br></br>
            <span className="ms-4" dangerouslySetInnerHTML={{ __html: dataset.description }}></span>
            
          </p>

          <p>
          <b className="h5">Contact Information: </b>
                { dataset.editablePropertiesByTheUser.includes("contactInfo") ?
                      <DatasetFieldEdit  datasetId={dataset.id} showDialog={props.showDialog} field="contactInfo" fieldDisplay="Contact information" 
                        oldValue={dataset.contactInfo} patchDataset={props.patchDataset} keycloakReady={props.keycloakReady} dataManager={props.dataManager} />
                    : <Fragment /> }
          <br></br>
            <span className="ms-4">{dataset.contactInfo}</span>
          </p>
          <div className="pt-2 pb-2 ps-1 pe-1 bg-light bg-gradient">
            <p>
            { pidUrl.length > 0 ?
              <Fragment><i>Cite this dataset as </i><b><a href={pidUrl}>{pidUrl}</a></b></Fragment> : 
                (dataset.editablePropertiesByTheUser.includes("pids") ? <i>Add a PID URL to allow citations </i> : <Fragment/> ) }

            { dataset.editablePropertiesByTheUser.includes("pids") ?
                      <DatasetFieldEdit datasetId={dataset.id} showDialog={props.showDialog} field="pids" 
                          fieldDisplay="Permanent ID (PID) URL"
                        oldValue={pids} patchDataset={props.patchDataset} keycloakReady={props.keycloakReady} dataManager={props.dataManager}/>
                      : <Fragment/>
            }            
            </p>
            <p>
              {
                dataset.license.title === null || dataset.license.title.length === 0
                  || dataset.license.url === null || dataset.license.url.length === 0 ?
                  (
                    dataset.editablePropertiesByTheUser.includes("license")  ?
                      <i>Add a license </i> : <i>The dataset license has yet to be set.</i>
                  )
                  : 
                  <Fragment>
                    <i>This dataset is offered under the following license: </i>
                    <b><a href={dataset.license.url}>{dataset.license.title}</a></b>
                  </Fragment>
              }
              
              { dataset.editablePropertiesByTheUser.includes("license")  ?
                          <DatasetFieldEdit datasetId={dataset.id} showDialog={props.showDialog} 
                              field={dataset.editablePropertiesByTheUser.includes("license") ? "license" : "licenseUrl"} 
                              fieldDisplay="Dataset license" oldValue={dataset.license}
                            patchDataset={props.patchDataset} keycloakReady={props.keycloakReady} dataManager={props.dataManager} />
                        : <Fragment /> }
            </p>
            <p>
              {
                dataset.lastIntegrityCheck ? 
                  <i>Last integrity check performed on <b>{new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'long' }).format(Date.parse(dataset.lastIntegrityCheck))}</b>.</i>
                  : <i>The interity of the dataset has not been checked yet.</i>
                }
            </p>
          </div>
        </Col>
        <Col md={4}>
          <DatasetDetailsBox patchDataset={props.patchDataset} showDialog={props.showDialog} keycloakReady={props.keycloakReady} dataset={dataset} 
            dataManager={props.dataManager}  
          />
        </Col>
      </Row>
    </Container>
  );
}

export default DatasetDetailsView;
