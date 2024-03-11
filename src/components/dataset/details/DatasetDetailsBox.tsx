import { Container, Badge } from "react-bootstrap";
import React, { Fragment }from "react";

import DatasetFieldEdit from "../common/DatasetFieldEdit";
import RouteFactory from "../../../api/RouteFactory";
import Dataset from "../../../model/Dataset";
import DataManager from "../../../api/DataManager";

const PREVIOUS_ID = "Previous version";
const NEXT_ID = "Next version";

function getIdEdit(text: string, ds?: Dataset, showDialog?: Function, patchDataset?: Function, keycloakReady?: boolean, dataManager?: DataManager) {
  if (text === PREVIOUS_ID && ds && ds.editablePropertiesByTheUser.includes("previousId") && showDialog && patchDataset && keycloakReady && dataManager) {
    return <DatasetFieldEdit datasetId={ds.id} showDialog={showDialog} field="previousId" fieldDisplay="previous version"
      oldValue={ds.previousId} patchDataset={patchDataset} keycloakReady={keycloakReady} dataManager={dataManager}/>;
  } else if (text === NEXT_ID){
    return <Fragment />;
  } else {
    console.warn(`Unhandled ID edit option ${text}`);
  }
  return <Fragment />;
}

function getIDLink(text: string, id: string | null, canEdit: boolean, data?: Dataset, 
      showDialog?: Function, patchDataset?: Function, keycloakReady?: boolean, dataManager?: DataManager) {
  if (id || canEdit) {
    return <p title={`ID of the ${text} version of this dataset`}><b>{text}</b>
          { getIdEdit(text, data, showDialog, patchDataset, keycloakReady, dataManager) }<br />
          <span className="ms-3">{ id ? <a href={RouteFactory.getPath(RouteFactory.DATASET_DETAILS, { datasetId: id } )}>{id}</a> : "-" }</span>
        </p>;
  } else {
    return <Fragment />
  }
}

interface DatasetDetailsBoxProps {
  dataset: Dataset;
  showDialog: Function;
  patchDataset: Function;
  keycloakReady: boolean;
  dataManager: DataManager;
}

function DatasetDetailsBox(props: DatasetDetailsBoxProps) {
    //const [bgCopyId]
    const dataset = props.dataset;
    let ageLstItem = <span>-</span>;
    if (dataset.ageLow != null && dataset.ageHigh != null) {
      ageLstItem = <span>Between {dataset.ageLow} {dataset.ageUnit[0]} and {dataset.ageHigh} {dataset.ageUnit[1]}</span>
    } else if (dataset.ageLow != null)  {
      ageLstItem = <span>Greater than {dataset.ageLow} {dataset.ageUnit[0]}</span>
    } else if (dataset.ageHigh != null)  {
      ageLstItem = <span>Less than {dataset.ageHigh} {dataset.ageUnit[1]}</span>  
    }

    return(
      <Container fluid className="pt-3 pb-1 bg-light bg-gradient border border-secondary rounded">
        <p title="The ID of the dataset"><b>ID</b><br /><span className="ms-3">{dataset.id}</span>
              {
              //   <Button variant="link" className="m-0 p-0 ps-1 pe-1 ms-1 bg-warning" onClick={(e) =>
              //     {navigator.clipboard.writeText(dataset.id).then(function() {
              //       console.log('Async: Copying to clipboard was successful!');
              //     }, function(err) {
              //       console.error('Async: Could not copy text: ', err);
              //     });}} >
              //   <ClipboardPlus />
              // </Button>
}
        </p>
        { getIDLink(PREVIOUS_ID, dataset.previousId, 
            dataset.editablePropertiesByTheUser.includes("previousId"),
            dataset, props.showDialog, props.patchDataset, props.keycloakReady, props.dataManager) }
        { getIDLink(NEXT_ID, dataset.nextId, false) }
        <p title="The number of studies followed by number of all subjects in this dataset"><b>Studies/Subjects count</b><br />
          <span className="ms-3">{dataset.studiesCount}/{dataset.subjectsCount}</span></p>
        <p title="The range of the ages of all subjects in this dataset, DICOM tag (0010, 1010)"><b>Age range</b><br />
          <span className="ms-3">{ageLstItem}</span></p>
        <p title="The set of genders of all subjects in this dataset, DICOM tag (0010, 0040)"><b>Gender</b><br />
          <span className="ms-3">{dataset.sex !== null && dataset.sex !== undefined ? dataset.sex.join(", ") : "-"}</span></p>
        <p title="The set of modalities used to generate the images in this dataset, DICOM tag (0008, 0060)"><b>Modality</b><br />
          <span className="ms-3">{dataset.modality !== null && dataset.modality !== undefined && dataset.modality.length > 0  ? dataset.modality.join(", ") : "-"}</span></p>
        <p title="The various body parts represented by the underlying studies, DICOM tag (0018, 0015)"><b>Body part(s)</b><br />
          <span className="ms-3">{dataset.bodyPart !== null && dataset.bodyPart !== undefined && dataset.bodyPart.length > 0  ? dataset.bodyPart.join(", ") : "-"}</span></p>
        <p title="The list of tags set on the series that compose this dataset"><b>Series tags</b><br />
          <span className="ms-3">{dataset.seriesTags !== null && dataset.seriesTags !== undefined && dataset.seriesTags.length > 0 ? 
          dataset.seriesTags.map(t => <Badge pill key={t} bg="light" text="dark" className="ms-1 me-1">{t}</Badge>) : "-"}</span></p>
      </Container>
    );
}

export default DatasetDetailsBox;