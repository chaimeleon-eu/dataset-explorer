import { Fragment } from "react";
import { useParams } from "react-router-dom";
import { ListGroup, Button, InputGroup, FormControl, Container, Row, Col} from 'react-bootstrap';
import {useState, useEffect} from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { EnvelopeFill, ClipboardPlus } from 'react-bootstrap-icons';

import StaticValues from "../api/StaticValues.js";
import Message from "../model/Message.js";
import DatasetFieldEdit from "./DatasetFieldEdit";
import DatasetDetailsBox from "./DatasetDetailsBox";


function DatasetDetailsView(props) {
  const datasetDetails = props.allValues;
  let { keycloak } = useKeycloak();
  let ageLstItem = <span>-</span>;
  if (datasetDetails.data.ageLow != null && datasetDetails.data.ageHigh != null) {
    ageLstItem = <span>Between {datasetDetails.data.ageLow} {datasetDetails.data.ageUnit[0]} and {datasetDetails.data.ageHigh} {datasetDetails.data.ageUnit[1]}</span>
  } else if (datasetDetails.data.ageLow != null)  {
    ageLstItem = <span>Greater than {datasetDetails.data.ageLow} {datasetDetails.data.ageUnit[0]}</span>
  } else if (datasetDetails.data.ageHigh != null)  {
    ageLstItem = <span>Less than {datasetDetails.data.ageHigh} {datasetDetails.data.ageUnit[1]}</span>

  }
  let pids = datasetDetails.data.pids;
  let pidUrl = "";
  //let pidsPatch = Object.create(null);
  //pidsPatch["preferred"] = pids["preferred"];
  if (pids["preferred"] !== null) {
    pidUrl = pids["urls"][pids["preferred"]];
    ///pidsPatch[pids["preferred"]] = pids["url"]
  }

  return(
    <Container fluid>

      <Row>
        <Col md={8}>
          <p>
            <b className="h5">Description:</b>
            {
              datasetDetails.data.editablePropertiesByTheUser.includes("description")
              ? <DatasetFieldEdit datasetId={datasetDetails.data.id} showDialog={props.showDialog} field="description" fieldDisplay="Dataset description"
                  oldValue={datasetDetails.data.description} patchDataset={props.patchDataset}/>
              : <Fragment />
            }
            <br></br>
            <span className="ms-4" dangerouslySetInnerHTML={{ __html: datasetDetails.data.description }}></span>
            
          </p>

          <p>
          <b className="h5">Contact Information: </b>
                { datasetDetails.data.editablePropertiesByTheUser.includes("contactInfo") ?
                      <DatasetFieldEdit  datasetId={datasetDetails.data.id} showDialog={props.showDialog} field="contactInfo" fieldDisplay="Contact information" oldValue={datasetDetails.data.contactInfo} patchDataset={props.patchDataset} />
                    : <Fragment /> }
          <br></br>
            <span className="ms-4">{datasetDetails.data.contactInfo}</span>
          </p>
          <div className="pt-2 pb-2 ps-1 pe-1 bg-light bg-gradient">
            <p>
            { pidUrl.length > 0 ?
              <Fragment><i>Cite this dataset as </i><b><a href={pidUrl}>{pidUrl}</a></b></Fragment> : 
                (datasetDetails.data.editablePropertiesByTheUser.includes("pids") ? <i>Add a PID URL to allow citations </i> : <Fragment/> ) }

            { datasetDetails.data.editablePropertiesByTheUser.includes("pids") ?
                      <DatasetFieldEdit datasetId={datasetDetails.data.id} showDialog={props.showDialog} field="pids" 
                          fieldDisplay="Permanent ID (PID) URL"
                        oldValue={pids} patchDataset={props.patchDataset}/>
                      : <Fragment/>
            }            
            </p>
            <p>
              {
                datasetDetails.data.license.title === null || datasetDetails.data.license.title.length === 0
                  || datasetDetails.data.license.url === null || datasetDetails.data.license.url.length === 0 ?
                  (
                    datasetDetails.data.editablePropertiesByTheUser.includes("license")  ?
                      <i>Add a license </i> : <i>The dataset license has yet to be set.</i>
                  )
                  : 
                  <Fragment>
                    <i>This dataset is offered under the following license: </i>
                    <b><a href={datasetDetails.data.license.url}>{datasetDetails.data.license.title}</a></b>
                  </Fragment>
              }
              
              { datasetDetails.data.editablePropertiesByTheUser.includes("license")  ?
                          <DatasetFieldEdit datasetId={datasetDetails.data.id} showDialog={props.showDialog} 
                              field={datasetDetails.data.editablePropertiesByTheUser.includes("license") ? "license" : "licenseUrl"} 
                              fieldDisplay="Dataset license" oldValue={datasetDetails.data.license}
                            patchDataset={props.patchDataset} />
                        : <Fragment /> }
            </p>
          </div>
        </Col>
        <Col md={4}>
          <DatasetDetailsBox datasetDetails={datasetDetails} />
        </Col>
      </Row>
    </Container>
  );
}

export default DatasetDetailsView;
