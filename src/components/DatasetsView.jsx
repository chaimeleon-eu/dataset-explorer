import React, {useState, useEffect}from 'react';
import ReactDOM from 'react-dom';
import { Button, InputGroup, FormControl, Table as BTable, Container, Row, Col} from 'react-bootstrap';
import { Search as SearchIc, FilePlus as FilePlusIc } from "react-bootstrap-icons";
import { useTable, useRowSelect } from 'react-table';
import { useKeycloak } from '@react-keycloak/web';
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";

import Message from "../model/Message.js";
import Dialog from "./Dialog";
import DatasetsMainTable from "./DatasetsMainTable";
import Config from "../config.json";

function handleShow() {

}




const SearchComponent = ({initValue, setSearchString}) => {
  const [input, setInput] = useState(initValue);
  useEffect(() => {
    setInput(initValue);
  }, [initValue]);
  // const updInput = (newVal) => {
  //   setInput(newVal);
  //   setSearchString(input);
  // }

  return (
    <InputGroup className="mb-3">
      <FormControl
        type="search"
        placeholder="Dataset search"
        aria-label="Dataset search"
        aria-describedby="basic-addon2"
        //defaultValue={props.initValue}
        style={{fontWeight: "bold"}}
        onChange={(e) => setInput(e.target.value)}
        value={input}
        onKeyDown={(e) => {
          if(e.key === 'Enter') {
              setSearchString(e.target.value);
          }
        }}
      />
      <Button variant="outline-secondary" size="sm" className="search-btn" onClick={() =>setSearchString(input)}>
        <SearchIc />
      </Button>
    </InputGroup>
  );
}

function DatasetsView (props) {
  let navigate = useNavigate();
  //const [search] = useSearchParams();
  //const searchStringParam = search.get('searchString') === null ? "" : search.get('searchString');
  //console.log(`searchStringParam is ${searchStringParam}`);

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(Config.defaultLimitDatasets);
  const [searchParams, setSearchParams] = useSearchParams("");
  const searchString = searchParams.get("searchString") === null ? "" : searchParams.get("searchString");
  console.log(`searchString is ${searchString}`);
  const setSearchString = (newVal) => {
    //setSearchParams(`searchString=${encodeURIComponent(newVal)}`);
    const qPs = newVal !== null && newVal !== undefined && newVal.length > 0 ? `?searchString=${encodeURIComponent(newVal)}` : "";
    navigate({
      pathname: './',
      search: qPs,
    });
  }

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
                console.log(searchString);
                  props.dataManager.getDatasets(keycloak.token, skip, modLimit, searchString)
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
        [props.keycloakReady, skip, limit, searchString]);

      return (
        <Container fluid>
          <Row>
            <SearchComponent initValue={searchString} setSearchString={setSearchString}/>
          </Row>
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
