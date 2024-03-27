import { useKeycloak } from "@react-keycloak/web";
import React, { useCallback, useEffect, useState } from "react";
import { Container, Dropdown } from "react-bootstrap";
import DataManager from "../../api/DataManager";
import LoadingData from "../../model/LoadingData";
import Message from "../../model/Message";
import Util from "../../Util";
import LoadingView from "../LoadingView";

const ALL_PROJECTS = "All projects";

function getSelProj(data: string[], searchParams: URLSearchParams): string {
    let selProj = searchParams.get("project");
    if (selProj === null) {
        if (data.length >= 2) {
            selProj = ALL_PROJECTS;
        } else if (data.length === 1) {
            selProj = data[1] ?? "";
        } else {
            selProj = ALL_PROJECTS;
        }
    }
    return selProj;
}

interface FilterProjectProps {
    searchParams: URLSearchParams;
    filterUpdate: Function;
    loading: boolean;
    keycloakReady: boolean;
    dataManager: DataManager;
    postMessage: Function;
}

function FilterProject(props: FilterProjectProps): JSX.Element {
    const { keycloak } = useKeycloak();
    const [data, setData] = useState<LoadingData<string[]>>({
        loading: false,
        statusCode: -1,
        data: [],
        error: null
    });

    useEffect(() => {
        setData(prev => {
            return {...prev, loading: true, data: [], error: null }
          });
            props.dataManager.getProjects(keycloak.token)
              .then(
                (xhr: XMLHttpRequest) => {
                  //setIsLoaded(true);
                  const data = JSON.parse(xhr.response) ?? [];
                  //setData(d);
                  if (data.length >= 2) {
                    data.push("All projects");
                  }
                  setData(prev => {
                    return {...prev, loading: false, data, error: null, statusCode: xhr.status}
                  })
                },
                (xhr: XMLHttpRequest) => {
                  const error = Util.getErrFromXhr(xhr);
                  props.postMessage(new Message(Message.ERROR, error.title, error.text));
                  setData(prev => {
                    return {...prev, loading: false, data: [], error, statusCode: xhr.status }
                  });
                });


    }, [props.searchParams, props.keycloakReady, props.filterUpdate])

    const disabled = props.loading === true;
    const selProj = getSelProj(data.data ?? [], props.searchParams);

    const onSelectProj = useCallback((eventKey: any, event: Object) => {
        if (eventKey === ALL_PROJECTS) {
            props.filterUpdate({project: null});
        } else {
            props.filterUpdate({project: eventKey});
        }
    }, [props.filterUpdate, props.searchParams, props.keycloakReady, data, setData])

    // Only show the filter when there are more than one projects 
    if (data.data && data.data.length > 1) {
        return <div className="mt-4 mb-4">
            <h6>Projects</h6>
            <Container fluid className="m-0 p-0">
                {
                    !data.loading ?
                        <Dropdown title="Select the project " className="me-1 ms-2" drop="down-centered" onSelect={onSelectProj}>
                            <Dropdown.Toggle size="sm" variant="primary" id="dropdown-basic">
                                {selProj === ALL_PROJECTS ? <i>{selProj}</i> : selProj} 
                            </Dropdown.Toggle>

                            <Dropdown.Menu style={{ "fontSize": "0.9rem", "minWidth": "2rem" }}>
                                {
                                    data.data?.filter(p => p !== selProj).map(p => 
                                            <Dropdown.Item disabled={disabled} eventKey={p} key={p}>{p === ALL_PROJECTS ? <i>{p}</i> : p}</Dropdown.Item>
                                        )
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                        : <LoadingView what="projects filter values" />
                }
            </Container>
        </div>;
    } else {
        return <></>;
    }
}

export default FilterProject;