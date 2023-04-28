import { useKeycloak } from "@react-keycloak/web";
import React, { useState, useEffect, Fragment, useCallback } from "react";
import { Button, Placeholder } from "react-bootstrap";
import Select from 'react-select';

function toSelId(val) {
    return {value: val.id, label: `${val.name} (${val.id})`}
}


function BodyId(props) {
    const [dataState, setDataState] = useState({
        oldValue: null,
        isLoading: true,
         isLoaded: false,
         error: null,
         data: null,
         status: -1
      });
      
    const [selectedOption, setSelectedOption] = useState(null);
    const { keycloak } = useKeycloak();
    console.log(selectedOption);

    const updSelectedOption = useCallback((newVal) => {
        setSelectedOption(newVal);//toSelId(newVal));
        props.updValue(newVal.value);
      }, [setSelectedOption, props.updValue]);

    useEffect(() => {
        if (props.keycloakReady && keycloak.authenticated) { 
            props.dataManager.getUpgradableDatasets(keycloak.token)
            .then((xhr) => {
                    const data = JSON.parse(xhr.response);
                    let oldValue = null;
                    if (props.oldValue) {
                        const sel = data.find(e => e.id === props.oldValue);
                        if (sel) {
                            setSelectedOption(toSelId(sel));
                        }
                        oldValue = sel;
                    }
                    setDataState( prevValues => {
                        return { ...prevValues, data, oldValue, isLoading: false, isLoaded: true, error: null, status: xhr.status}
                    });
                }, 
              (xhr) => setDataState( prevValues => {
                return { ...prevValues, data: null, isLoading: false, isLoaded: true, error: xhr.responseText, status: xhr.status, oldValue: null}
              }))

        }

    }, [props.keycloakReady, keycloak.authenticated]);
    if (dataState.isLoading) {
        return <Placeholder className="mb-3" as="div" animation="glow">
            <Placeholder as="a" xs={2}/> <br />
            <Placeholder as="select" className="w-100" />
        </Placeholder>
    } else {
        if (dataState) {
            return (<div className="mb-3">
                    Select from datasets created and released by you (chosen dataset's next version is updated automatically when you release this dataset). 
                    <br /> 
                    {   dataState.oldValue ?
                            <Button title="Restore Initial value" variant="link" onClick={(e) => updSelectedOption(toSelId(dataState.oldValue))}>Restore original</Button> : <Fragment />
                    }<br />
                        <Select
                            value={selectedOption}
                            onChange={updSelectedOption}
                            options={dataState.data.map(e => {return toSelId(e);} )}
                        />
                </div>);
        } else {

        }
    }

}

export default BodyId;