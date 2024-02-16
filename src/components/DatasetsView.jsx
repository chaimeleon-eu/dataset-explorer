import React, {useState, useEffect, useCallback }from 'react';
import ReactDOM from 'react-dom';
import { Button, InputGroup, FormControl, Table as BTable, Container, Row, Col } from 'react-bootstrap';
import { Search as SearchIc, FilePlus as FilePlusIc } from "react-bootstrap-icons";
import { useTable, useRowSelect } from 'react-table';
import { useKeycloak } from '@react-keycloak/web';
import { useLocation, useSearchParams, useNavigate, createSearchParams } from "react-router-dom";

import Message from "../model/Message.js";
import Dialog from "./Dialog";
import DatasetsSearch from  "./DatasetsSearch";
import DatasetsMainTable from "./DatasetsMainTable";
import Config from "../config.json";
import DatasetsFiltering from './filter/DatasetsFiltering.jsx';
import PaginationFooter from './PaginationFooter.jsx';

function getSortDirectionDesc(searchParam, sortBy) {
  if (!sortBy) {
    sortBy = "creationDate";
  }

  if (!searchParam) {
    switch (sortBy) {
      case "name":
      case "authorName": searchParam = "ascending"; break;
      case "creationDate":
      case "studiesCount":
      case "subjectsCount": searchParam =  "descending"; break;
      default: console.warn(`Column ${sortBy} not handled when sort dir not set`); searchParam =  "descending"; 
    }
  } 
  return searchParam;// === "ascending" ? false : true;
}



function DatasetsView (props) {
  //let navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams("");

  //const [search] = useSearchParams();
  //const searchStringParam = search.get('searchString') === null ? "" : search.get('searchString');
  //console.log(`searchStringParam is ${searchStringParam}`);

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState(null);
  // const [skip, setSkip] = useState(0);
  // const [limit, setLimit] = useState(Config.defaultLimitDatasets);

  const updSearchParams = useCallback((params) => {
    for (const [k, v] of Object.entries(params)) {
      if (v !== null) {
        searchParams.set(k, v);
      } else {
        searchParams.delete(k);
      }
    }
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

  const searchString = searchParams.get("searchString") ? decodeURIComponent(searchParams.get("searchString")) : "";
  const sortBy = searchParams.get("sortBy") ?? "creationDate";
  const sortDirection = getSortDirectionDesc(searchParams.get("sortDirection"), searchParams.get("sortBy") ?? "creationDate");
  const skip = searchParams.get("skip") ? Number(searchParams.get("skip")) : 0;
  const limit = searchParams.get("limit") ? Number(searchParams.get("skip")) : Config.defaultLimitDatasets;
  
  const onSkipChange = useCallback((skip) => {
    updSearchParams({skip: skip === 0 ? null : skip});
  }, [skip, updSearchParams]);


  //console.log(`searchString is ${searchString}`);
  // const setSearchString = (newVal) => {
  //   //setSearchParams(`searchString=${encodeURIComponent(newVal)}`);
  //   const qPs = newVal !== null && newVal !== undefined && newVal.length > 0 ? `?searchString=${encodeURIComponent(newVal)}` : "";
  //   navigate({
  //     pathname: './',
  //     search: qPs,
  //   });
  // }

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
                if (data?.list?.length === limit+1) {
                  modLimit += 1;
                }
                //console.log(searchString);
                  props.dataManager.getDatasets(keycloak.token, 
                      {
                        skip, modLimit, searchString, sortBy, sortDirection, "v2": true,
                        ...(searchParams.get("draft") !== null) && {draft: searchParams.get("draft")},
                        ...(searchParams.get("public") !== null) && {public: searchParams.get("public")},
                        ...(searchParams.get("invalidated") !== null) && {invalidated: searchParams.get("invalidated")}                        
                      })
                    .then(
                      (xhr) => {
                        setIsLoaded(true);
                        const d = JSON.parse(xhr.response);
                        //console.log(d);
                        setData(d);
                      },
                      (xhr) => {
                        setIsLoaded(true);
                        //console.log(xhr);
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
        [props.keycloakReady, searchParams, sortBy, sortDirection, skip, limit, searchString]);
      return (
        <Container fluid>
          <Row>
            <DatasetsSearch initValue={searchString} updSearchParams={updSearchParams} />
          </Row>
          <Row>
            <Col lg={2}>
              <DatasetsFiltering updSearchParams={updSearchParams} searchParams={searchParams} />
            </Col>
            <Col>
              <DatasetsMainTable data={data && data?.list ? data.list.slice(0, limit) : []} showDialog={props.showDialog}
                dataManager={props.dataManager}
                postMessage={props.postMessage}
                currentSort={{
                  id: sortBy, 
                  desc: sortDirection === "descending" ? true : false
                }}
                updSearchParams={updSearchParams}
                />
                <div className="d-flex flex-row justify-content-center w-100" >
                  {/*
                  <Button variant="link" className="position-relative start-50 me-4" disabled={skip === 0 ? true : false} onClick={(e) => updSearchParams({skip: skip - limit})}>&lt; Previous</Button>
                  <Button variant="link" className="position-relative start-50"  disabled={data?.list?.length <= limit ? true : false} onClick={(e) => updSearchParams({skip: skip + limit})}>Next &gt;</Button>
                  TableNavigationPages skip={skip} limit={limit} total={data} */}
                  <PaginationFooter skip={skip} limit={limit} total={data?.total} onSkipChange={onSkipChange} className="" />
                </div>
              </Col>
          </Row>
        </Container>
      );
}

export default DatasetsView;
