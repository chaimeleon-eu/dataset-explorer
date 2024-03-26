import React, {useState, useEffect, useCallback }from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useKeycloak } from '@react-keycloak/web';
import { useSearchParams } from "react-router-dom";

import Message from "../model/Message";
import DatasetsSearch from  "./DatasetsSearch";
import DatasetsMainTable from "./DatasetsMainTable";
import Config from "../config.json";
import DatasetsFiltering from './filter/DatasetsFiltering';
import PaginationFooter from './PaginationFooter';
import type LoadingData from '../model/LoadingData';
import DataManager from '../api/DataManager';
import ItemPage from '../model/ItemPage';
import Dataset from '../model/Dataset';
import Util from '../Util';

function getSortDirectionDesc(searchParam?: string | null, sortBy?: string | null): string {
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

interface DatasetsViewProps {
  keycloakReady: boolean;
  dataManager: DataManager;
  postMessage: Function;
  activeTab?: string;
}

function DatasetsView (props: DatasetsViewProps) {
  //let navigate = useNavigate();
  let { keycloak } = useKeycloak();
  const [searchParams, setSearchParams] = useSearchParams("");

  //const [search] = useSearchParams();
  //const searchStringParam = search.get('searchString') === null ? "" : search.get('searchString');
  //console.log(`searchStringParam is ${searchStringParam}`);

  const [allData, setAllData] = useState<LoadingData<ItemPage<Dataset>>>({
    data: null,
    error: null,
    loading: false,
    statusCode: -1
  });

  const updSearchParams = useCallback((params: Object) => {
    for (const [k, v] of Object.entries(params)) {
      if (v !== null) {
        searchParams.set(k, v);
      } else {
        searchParams.delete(k);
      }
    }
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

  const searchStringTmp: string | null = searchParams.get("searchString");
  const searchString: string = searchStringTmp ? decodeURIComponent(searchStringTmp) : "";
  const sortBy: string = searchParams.get("sortBy") ?? "creationDate";
  const sortDirection: string = getSortDirectionDesc(searchParams.get("sortDirection"), searchParams.get("sortBy") ?? "creationDate");
  const skip: number = searchParams.get("skip") ? Number(searchParams.get("skip")) : 0;
  const limit: number = searchParams.get("limit") ? Number(searchParams.get("limit")) : Config.defaultLimitDatasets;
  
  const onSkipChange = useCallback((skip: number) => {
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


      //console.log(keycloak);
        useEffect(() => {
            //setTimeout(function() {
            //console.log(keycloak.authenticated);
            //if (props.keycloakReady) {
                // let modLimit = limit;
                // if (allData.data?.list?.length === limit+1) {
                //   modLimit += 1;
                // }
                //console.log(searchString);
                
                setAllData(prev => {
                  return {...prev, loading: true, data: null, error: null }
                });
                  props.dataManager.getDatasets(keycloak.token, 
                      {
                        skip, limit, searchString, sortBy, sortDirection, //v2: true,
                        ...(searchParams.get("draft") !== null) && {draft: searchParams.get("draft")},
                        ...(searchParams.get("public") !== null) && {public: searchParams.get("public")},
                        ...(searchParams.get("invalidated") !== null) && {invalidated: searchParams.get("invalidated")}                        
                      })
                    .then(
                      (xhr: XMLHttpRequest) => {
                        //setIsLoaded(true);
                        const data = JSON.parse(xhr.response);
                        //setData(d);
                        setAllData(prev => {
                          return {...prev, loading: false, data, error: null, statusCode: xhr.status}
                        })
                      },
                      (xhr: XMLHttpRequest) => {
                        const error = Util.getErrFromXhr(xhr);
                        props.postMessage(new Message(Message.ERROR, error.title, error.text));
                        setAllData(prev => {
                          return {...prev, loading: false, data: null, error, statusCode: xhr.status }
                        });
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
              <DatasetsFiltering updSearchParams={updSearchParams} searchParams={searchParams}  loading={allData.loading} />
            </Col>
            <Col>
              <DatasetsMainTable data={allData.data && allData.data?.list ? allData.data.list.slice(0, limit) : []}
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
                  <PaginationFooter skip={skip} limit={limit} total={allData.data?.total ?? 0} onSkipChange={onSkipChange} />
                </div>
              </Col>
          </Row>
        </Container>
      );
}

export default DatasetsView;
