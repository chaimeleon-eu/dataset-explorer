import { Container, Badge } from "react-bootstrap";
import React, { Fragment }from "react";

import DatasetFieldEdit from "../common/DatasetFieldEdit";
import RouteFactory from "../../../api/RouteFactory";
import Dataset from "../../../model/Dataset";
import DataManager from "../../../api/DataManager";
import Util from "../../../Util";

const PREVIOUS_ID = "Previous version";
const NEXT_ID = "Next version";

interface EntryWithStudyResult {
  txt: string;
  show: boolean;
}

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

function getEntryWithStudyCnt(entryLst: string[] | null, countLst: number[] | null): EntryWithStudyResult {
  let txt: string = "-";
  let show = false;
  if (entryLst && entryLst.length > 0) {
    if (countLst && countLst.length > 0 && entryLst.length  === countLst.length) {
      txt = entryLst.map((s, idx) => `${s} (${countLst[idx]})`).join(", ");
      show = true;
    } else {
      txt = entryLst.join(", ");
    }
  }
  return {txt, show};
}

function getYearLowHigh(ageLow: number | null, ageHigh: number | null, ageUnit: string[], 
    ageNullCount: number | null, unknownTxt: string): string {
  let ageLstItemTxt: string = "-";
  if (ageLow !== null && ageHigh !== null) {
    ageLstItemTxt = `Between ${ageLow} ${ageUnit.length >= 1 ? ageUnit[0] : ""} and ${ageHigh} ${ageUnit.length >= 2 ? ageUnit[1] : ""}`;
  } else if (ageLow !== null)  {
    ageLstItemTxt = `Greater than ${ageLow} ${ageUnit.length >= 1 ? ageUnit[0] : ""}`;
  } else if (ageHigh !== null)  {
    ageLstItemTxt = `Less than ${ageHigh} ${ageUnit.length >= 2 ? ageUnit[1] : ""}`;
  }

  if (ageLow !== null || ageHigh !== null) {
    if (ageNullCount && ageNullCount === 1) {
      ageLstItemTxt += ` (1 study with ${unknownTxt} unknown)`;
    } else if (ageNullCount && ageNullCount >= 1) {
      ageLstItemTxt += ` (${ageNullCount} studies with ${unknownTxt} unknown)`;
    }
  }
  return ageLstItemTxt;
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
    const ageLstItemTxt: string = getYearLowHigh(dataset.ageLow, dataset.ageHigh, dataset.ageUnit, dataset.ageNullCount, "age");
    const diagnosisLstItemTxt: string = getYearLowHigh(dataset.diagnosisYearLow, dataset.diagnosisYearHigh, [], dataset.diagnosisYearNullCount, "diagnosis year");

    const sex = getEntryWithStudyCnt(dataset.sex, dataset.sexCount);
    const modality = getEntryWithStudyCnt(dataset.modality, dataset.modalityCount);
    const bodyPart = getEntryWithStudyCnt(dataset.bodyPart, dataset.bodyPartCount);
    const manufacturer = getEntryWithStudyCnt(dataset.manufacturer, dataset.manufacturerCount);

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
        <p title="The project that this dataset is part of"><b>Project</b><br /><span className="ms-3">{dataset.project}</span></p>
        { getIDLink(PREVIOUS_ID, dataset.previousId, 
            dataset.editablePropertiesByTheUser.includes("previousId"),
            dataset, props.showDialog, props.patchDataset, props.keycloakReady, props.dataManager) }
        { getIDLink(NEXT_ID, dataset.nextId, false) }
        <p title="The number of studies followed by number of all subjects in this dataset"><b>Studies/Subjects count</b><br />
          <span className="ms-3">{dataset.studiesCount}/{dataset.subjectsCount}</span></p>
        <p title="The range of the ages of all subjects in this dataset, DICOM tag (0010, 1010) or subject clinical data"><b>Age range</b><br />
          <span className="ms-3">{ageLstItemTxt}</span></p>
        <p title="The range of the diagnosis years for all subjects in this dataset, subject clinical data"><b>Year of diagnosis range</b><br />
          <span className="ms-3">{diagnosisLstItemTxt}</span></p>
        <p title="The set of sexes of all subjects in this dataset, DICOM tag (0010, 0040) or subject clinical data"><b>Sex{sex.show ? " (#studies)" : ""}</b><br />
          <span className="ms-3">{sex.txt}</span></p>
        <p title="The set of modalities used to generate the images in this dataset, DICOM tag (0008, 0060)"><b>Modality{modality.show ? " (#studies)" : ""}</b><br />
          <span className="ms-3">{modality.txt}</span></p>
        <p title="The set of manufacturers of the equipment used to produce the data, Dicom tag (0008,0070)"><b>Manufacturer{manufacturer.show ? " (#studies)" : ""}</b><br />
          <span className="ms-3">{manufacturer.txt}</span></p>
        <p title="The various body parts represented by the underlying studies, DICOM tag (0018, 0015)"><b>Body part{bodyPart.show ? " (#studies)" : ""}</b><br />
          <span className="ms-3">{bodyPart.txt}</span></p>
        <p title="The list of tags set on the series that compose this dataset"><b>Series tags</b><br />
          <span className="ms-3">{dataset.seriesTags !== null && dataset.seriesTags !== undefined && dataset.seriesTags.length > 0 ? 
          dataset.seriesTags.map(t => <Badge pill key={t} bg="light" text="dark" className="ms-1 me-1">{t}</Badge>) : "-"}</span></p>
        <p title="The size occupied by the dataset on the platform' storage"><b>Size</b><br />
          <span className="ms-3">{dataset.sizeInBytes !== null && dataset.sizeInBytes !== undefined ? Util.formatBytes(dataset.sizeInBytes) : "unknown"}</span></p>
      </Container>
    );
}

export default DatasetDetailsBox;