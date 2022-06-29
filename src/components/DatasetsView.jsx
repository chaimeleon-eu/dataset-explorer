import React, {useState, useEffect}from 'react';
import ReactDOM from 'react-dom';
import { Button, InputGroup, FormControl, Table as BTable, Container, Row, Col} from 'react-bootstrap';
import { Search as SearchIc, FilePlus as FilePlusIc } from "react-bootstrap-icons";
import { useTable, useRowSelect } from 'react-table';
import { useKeycloak } from '@react-keycloak/web';
import { useLocation } from "react-router-dom";

import Message from "../model/Message.js";
import Dialog from "./Dialog.js";
import DatasetsMainTable from "./DatasetsMainTable.js";
import Config from "../config.json";

function handleShow() {

}




const SearchComponent = () => {

  return (
    <InputGroup className="mb-3">
      <FormControl
        placeholder="Dataset search"
        aria-label="Dataset search"
        aria-describedby="basic-addon2"
      />
      <Button variant="outline-secondary" size="sm" id="button-addon2">
        <SearchIc />
      </Button>
    </InputGroup>
  );
}

function DatasetsView (props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(Config.defaultLimitDatasets);

  // const location = useLocation();
  //
  // useEffect(() => {
  //   props.urlChangedUpdKeycloakUri(location.pathname);
  // }, [location]);


      //const data = [{name: "A", version: "1.0", created: "2021-08-09Z08:03:0000"}];

      let { keycloak } = useKeycloak();

      //console.log(keycloak);
        useEffect(() => {
            //setTimeout(function() {
            //console.log(keycloak.authenticated);
            //if (props.keycloakReady) {
                let modLimit = limit;
                if (data.length === limit+1) {
                  modLimit += 1;
                }
                  props.dataManager.getDatasets(keycloak.token, skip, modLimit)
                    .then(
                      (xhr) => {
                        setIsLoaded(true);
                        setData(JSON.parse(xhr.response));
                      },
                      (xhr) => {
                        setIsLoaded(true);
                        console.log(xhr);
                        let title = null;
                        let text = null;
                        if (!xhr.responseText) {
                          title = Message.UNK_ERROR_TITLE;
                          text = Message.UNK_ERROR_MSG;
                        } else {
                          const err = JSON.parse(xhr.response);
                            title = err.title;
                            text = err.message;
                        }
                        props.postMessage(new Message(Message.ERROR, title, text));
                      });
                //}

        }, //1000);},
        [props.keycloakReady, skip, limit]);

      return (
        <Container fluid>
          <Row>
            <DatasetsMainTable data={data.slice(0, limit)} showDialog={props.showDialog}
              dataManager={props.dataManager}
              postMessage={props.postMessage}/>
          </Row>
          <div className="w-100" >
            <Button className="position-relative start-50 me-4" disabled={skip == 0 ? true : false} onClick={(e) => setSkip(skip - limit)}>Previous</Button>
            <Button className="position-relative start-50"  disabled={data.length <= limit ? true : false} onClick={(e) => setSkip(skip + limit)}>Next</Button>
          </div>
        </Container>
      );
}

export default DatasetsView;
