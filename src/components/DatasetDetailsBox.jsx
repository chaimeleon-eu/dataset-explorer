import {Tabs, Tab, Button, Row, Col, Container, Badge, DropdownButton, Dropdown, Nav, ListGroup } from "react-bootstrap";
import { Navigate, useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, Fragment }from "react";
import { useKeycloak } from '@react-keycloak/web';
import { EnvelopeFill, ClipboardPlus, PencilFill } from 'react-bootstrap-icons';

import StaticValues from "../api/StaticValues.js";
import Message from "../model/Message.js";
import DatasetFieldEdit from "./DatasetFieldEdit";



function DatasetDetailsBox(props) {
    const datasetDetails = props.datasetDetails;
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
        <p>
              <b>ID: </b>
              {datasetDetails.data.id}
              <Button variant="link" className="m-0 p-0 ms-1" onClick={() =>
                  {navigator.clipboard.writeText(datasetDetails.data.id).then(function() {
                    console.log('Async: Copying to clipboard was successful!');
                  }, function(err) {
                    console.error('Async: Could not copy text: ', err);
                  });}} >
                <ClipboardPlus />
              </Button>
              </p>
              <p><b>Studies/Subjects count: </b>{datasetDetails.data.studiesCount}/{datasetDetails.data.subjectsCount}</p>
              <p><b>Age range: </b>{ageLstItem}</p>
              <p><b>Sex: </b>{datasetDetails.data.sex !== null ? datasetDetails.data.sex.join(", ") : "-"}</p>
              <p><b>Modality: </b>{datasetDetails.data.modality !== null ? datasetDetails.data.modality.join(", ") : "-"}</p>
              <p><b>Body part(s): </b>{datasetDetails.data.bodyPart !== null ? datasetDetails.data.bodyPart.join(", ") : "-"}
              </p>
        </Container>
    );
}

export default DatasetDetailsBox;