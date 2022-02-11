import {Tabs, Tab} from "react-bootstrap";
import { Navigate, useParams, useNavigate } from "react-router-dom";

import DatasetDetailsView from "./DatasetDetailsView";
import DatasetHistoryView from "./DatasetHistoryView";

function DatasetView(props) {

    let params = useParams();
  let navigate = useNavigate();
    const datasetId = params.datasetId;//props.datasetId;

  return (<Tabs defaultActiveKey="details" activeKey={props.activeTab} onSelect={(k) => navigate(`/datasets/${datasetId}/${k}`)}>
      <Tab eventKey="details" title="Details">
        <DatasetDetailsView />
      </Tab>
      <Tab eventKey="history" title="History">
        <DatasetHistoryView />
      </Tab>
    </Tabs>);
}

DatasetView.TAB_DETAILS = "details";
DatasetView.TAB_HISTORY = "history";

export default DatasetView;
