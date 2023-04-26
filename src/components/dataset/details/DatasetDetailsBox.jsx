import {Tabs, Tab, Button, Row, Col, Container, Badge, DropdownButton, Dropdown, Nav, ListGroup } from "react-bootstrap";
import { Navigate, useParams, useNavigate, useLocation } from "react-router-dom";
import React, { Fragment }from "react";
import { EnvelopeFill, ClipboardPlus, PencilFill } from 'react-bootstrap-icons';

import StaticValues from "../../../api/StaticValues.js";
import Message from "../../../model/Message.js";
import DatasetFieldEdit from "../common/DatasetFieldEdit";
import RouteFactory from "../../../api/RouteFactory.js";

const PREVIOUS_ID = "Previous";
const NEXT_ID = "Next";

function getIdEdit(text, ds, showDialog, patchDataset, keycloakReady, dataManager) {
  if (text === PREVIOUS_ID && ds.previousId && ds.editablePropertiesByTheUser.includes("previousId")) {
    return <DatasetFieldEdit datasetId={ds.id} showDialog={showDialog} field="previousId" fieldDisplay="Dataset previous ID"
      oldValue={ds.previousId} patchDataset={patchDataset} keycloakReady={keycloakReady} dataManager={dataManager}/>;
  } else if (text === NEXT_ID){
    return <Fragment />;
  } else {
    console.warn(`Unhandled ID edit option ${text}`);
  }
  return <Fragment />;
}

function getIDLink(text, id, canEdit, data, showDialog, patchDataset, keycloakReady, dataManager) {
  if (id || canEdit) {
    return <p title={`ID of the ${text} version of this dataset`}><b>{text}: </b>
        { id ? <a href={RouteFactory.getPath(RouteFactory.DATASET_DETAILS, { datasetId: id } )}>{id}</a> : "-" }
        { getIdEdit(text, data, showDialog, patchDataset, keycloakReady, dataManager) }
        </p>;
  } else {
    return <Fragment />
  }
}

function DatasetDetailsBox(props) {
    //const [bgCopyId]
    const datasetDetails = props.datasetDetails;
    let ageLstItem = <span>-</span>;
    if (datasetDetails.data.ageLow != null && datasetDetails.data.ageHigh != null) {
      ageLstItem = <span>Between {datasetDetails.data.ageLow} {datasetDetails.data.ageUnit[0]} and {datasetDetails.data.ageHigh} {datasetDetails.data.ageUnit[1]}</span>
    } else if (datasetDetails.data.ageLow != null)  {
      ageLstItem = <span>Greater than {datasetDetails.data.ageLow} {datasetDetails.data.ageUnit[0]}</span>
    } else if (datasetDetails.data.ageHigh != null)  {
      ageLstItem = <span>Less than {datasetDetails.data.ageHigh} {datasetDetails.data.ageUnit[1]}</span>  
    }

    return(
      <Container fluid className="pt-3 pb-1 bg-light bg-gradient">
        <p title="The ID of the dataset"><b>ID: </b>{datasetDetails.data.id}
              {
              //   <Button variant="link" className="m-0 p-0 ps-1 pe-1 ms-1 bg-warning" onClick={(e) =>
              //     {navigator.clipboard.writeText(datasetDetails.data.id).then(function() {
              //       console.log('Async: Copying to clipboard was successful!');
              //     }, function(err) {
              //       console.error('Async: Could not copy text: ', err);
              //     });}} >
              //   <ClipboardPlus />
              // </Button>
}
        </p>
        { getIDLink(PREVIOUS_ID, datasetDetails.data.previousId, 
            datasetDetails.data.editablePropertiesByTheUser.includes("previousId"),
            datasetDetails.data, props.showDialog, props.patchDataset, props.keycloakReady, props.dataManager) }
        { getIDLink(NEXT_ID, datasetDetails.data.nextId, false) }
        <p><b>Studies/Subjects count: </b>{datasetDetails.data.studiesCount}/{datasetDetails.data.subjectsCount}</p>
        <p><b>Age range: </b>{ageLstItem}</p>
        <p title="The set of genders of all patients part of this dataset"><b>Gender: </b>{datasetDetails.data.sex !== null && datasetDetails.data.sex !== undefined ? datasetDetails.data.sex.join(", ") : "-"}</p>
        <p><b>Modality: </b>{datasetDetails.data.modality !== null && datasetDetails.data.modality !== undefined && datasetDetails.data.modality.length > 0  ? datasetDetails.data.modality.join(", ") : "-"}</p>
        <p><b>Body part(s): </b>{datasetDetails.data.bodyPart !== null && datasetDetails.data.bodyPart !== undefined && datasetDetails.data.bodyPart.length > 0  ? datasetDetails.data.bodyPart.join(", ") : "-"}</p>
        <p><b>Series tags: </b>{datasetDetails.data.seriesTags !== null && datasetDetails.data.seriesTags !== undefined && datasetDetails.data.seriesTags.length > 0 ? 
          datasetDetails.data.seriesTags.map(t => <Badge pill key={t} bg="light" text="dark" className="ms-1 me-1">{t}</Badge>) : "-"}</p>
      </Container>
    );
}

export default DatasetDetailsBox;