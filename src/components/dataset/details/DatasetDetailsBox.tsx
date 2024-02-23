import {Tabs, Tab, Button, Row, Col, Container, Badge, DropdownButton, Dropdown, Nav, ListGroup } from "react-bootstrap";
import { Navigate, useParams, useNavigate, useLocation } from "react-router-dom";
import React, { Fragment }from "react";
import { EnvelopeFill, ClipboardPlus, PencilFill } from 'react-bootstrap-icons';

import StaticValues from "../../../api/StaticValues";
import Message from "../../../model/Message";
import DatasetFieldEdit from "../common/DatasetFieldEdit";
import RouteFactory from "../../../api/RouteFactory";

const PREVIOUS_ID = "Previous version";
const NEXT_ID = "Next version";

function getIdEdit(text, ds, showDialog, patchDataset, keycloakReady, dataManager) {
  if (text === PREVIOUS_ID && ds.editablePropertiesByTheUser.includes("previousId")) {
    return <DatasetFieldEdit datasetId={ds.id} showDialog={showDialog} field="previousId" fieldDisplay="previous version"
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
    return <p title={`ID of the ${text} version of this dataset`}><b>{text}</b>
          { getIdEdit(text, data, showDialog, patchDataset, keycloakReady, dataManager) }<br />
          <span className="ms-3">{ id ? <a href={RouteFactory.getPath(RouteFactory.DATASET_DETAILS, { datasetId: id } )}>{id}</a> : "-" }</span>
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
      <Container fluid className="pt-3 pb-1 bg-light bg-gradient border border-secondary rounded">
        <p title="The ID of the dataset"><b>ID</b><br /><span className="ms-3">{datasetDetails.data.id}</span>
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
        <p title="The number of studies followed by number of all subjects in this dataset"><b>Studies/Subjects count</b><br />
          <span className="ms-3">{datasetDetails.data.studiesCount}/{datasetDetails.data.subjectsCount}</span></p>
        <p title="The range of the ages of all subjects in this dataset, DICOM tag (0010, 1010)"><b>Age range</b><br />
          <span className="ms-3">{ageLstItem}</span></p>
        <p title="The set of genders of all subjects in this dataset, DICOM tag (0010, 0040)"><b>Gender</b><br />
          <span className="ms-3">{datasetDetails.data.sex !== null && datasetDetails.data.sex !== undefined ? datasetDetails.data.sex.join(", ") : "-"}</span></p>
        <p title="The set of modalities used to generate the images in this dataset, DICOM tag (0008, 0060)"><b>Modality</b><br />
          <span className="ms-3">{datasetDetails.data.modality !== null && datasetDetails.data.modality !== undefined && datasetDetails.data.modality.length > 0  ? datasetDetails.data.modality.join(", ") : "-"}</span></p>
        <p title="The various body parts represented by the underlying studies, DICOM tag (0018, 0015)"><b>Body part(s)</b><br />
          <span className="ms-3">{datasetDetails.data.bodyPart !== null && datasetDetails.data.bodyPart !== undefined && datasetDetails.data.bodyPart.length > 0  ? datasetDetails.data.bodyPart.join(", ") : "-"}</span></p>
        <p title="The list of tags set on the series that compose this dataset"><b>Series tags</b><br />
          <span className="ms-3">{datasetDetails.data.seriesTags !== null && datasetDetails.data.seriesTags !== undefined && datasetDetails.data.seriesTags.length > 0 ? 
          datasetDetails.data.seriesTags.map(t => <Badge pill key={t} bg="light" text="dark" className="ms-1 me-1">{t}</Badge>) : "-"}</span></p>
      </Container>
    );
}

export default DatasetDetailsBox;