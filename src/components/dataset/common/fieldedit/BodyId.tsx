import { useKeycloak } from "@react-keycloak/web";
import React, { useState, useEffect, Fragment, useCallback } from "react";
import { Button, Placeholder } from "react-bootstrap";
import Select, { ActionMeta, Props, GroupBase, SingleValue } from 'react-select';
import DataManager from "../../../../api/DataManager";
import LoadingData from "../../../../model/LoadingData";
import Util from "../../../../Util";

interface SelOpt {
    value: string;
    label: string;

}

interface DatasetId {
    id: string;
    name: string;
}

interface DataState extends LoadingData<DatasetId[] | null | undefined> {
    oldValue: DatasetId | null | undefined;

}

function toSelId(val: DatasetId): SelOpt {
    return {value: val.id, label: `${val.name} (${val.id})`}
}

function CustomSelect<
  Option = SelOpt,
  IsMulti extends boolean = false,
  Group extends GroupBase<SelOpt> = GroupBase<SelOpt>
>(props: Props<SelOpt, IsMulti, Group>) {
  return (
    <Select {...props} theme={(theme) => ({ ...theme, borderRadius: 0 })} />
  );
}

interface BodyIdProps {
    updValue: Function;
    keycloakReady: boolean;
    dataManager: DataManager;
    oldValue: string | null;
}

function BodyId(props: BodyIdProps) {
    const [dataState, setDataState] = useState<DataState>({
        oldValue: null,
        loading: true,
         error: null,
         data: null,
         statusCode: null
      });
      
    const [selectedOption, setSelectedOption] = useState<SelOpt | null>(null);
    const { keycloak } = useKeycloak();

    const updSelectedOption = useCallback((newVal: SingleValue<SelOpt>, action?:  ActionMeta<SelOpt> | null) => {
        console.log(action);
        if (action && action.action === "clear") {
            props.updValue(null);
        } else {
            if (newVal) {
                props.updValue(newVal.value);
            }
        }
        setSelectedOption(newVal);//toSelId(newVal));
      }, [setSelectedOption, props.updValue]);

    useEffect(() => {
        if (props.keycloakReady && keycloak.authenticated) { 
            props.dataManager.getUpgradableDatasets(keycloak.token)
                .then((xhr: XMLHttpRequest) => {
                        const data: DatasetId[] = JSON.parse(xhr.response) as DatasetId[];
                        let oldValue: DatasetId | null | undefined = null;
                        if (props.oldValue) {
                            const sel = data.find((e: DatasetId) => e.id === props.oldValue);
                            if (sel) {
                                setSelectedOption(toSelId(sel));
                            }
                            oldValue = sel;
                        }
                        setDataState( prevValues => {
                            return { ...prevValues, data, oldValue, loading: false, error: null, statusCode: xhr.status}
                        });
                    }, 
                (xhr: XMLHttpRequest) => setDataState( prevValues => {
                    return { ...prevValues, data: null, loading: false, error: Util.getErrFromXhr(xhr), oldValue: null, statusCode: xhr.status}
                }))

        }

    }, [props.keycloakReady, keycloak.authenticated]);
    if (dataState.loading) {
        return <Placeholder className="mb-3" as="div" animation="glow">
            <Placeholder as="a" xs={2}/> <br />
            <Placeholder as="select" className="w-100" />
        </Placeholder>
    } else {
        return (<div className="mb-3">
                Select from datasets created and released by you (chosen dataset's next version is updated automatically when you release this dataset). 
                <br /> 
                {   
                    dataState.oldValue ?
                        <Button title="Restore Initial value" variant="link" onClick={(e) => dataState.oldValue ? updSelectedOption(toSelId(dataState.oldValue)) : console.log("none")}>Restore original</Button> : <Fragment />
                }<br />
                    <CustomSelect
                    isClearable
                        isSearchable
                        value={selectedOption}
                        onChange={updSelectedOption}
                        options={dataState.data?.map(e => {return toSelId(e);} ) ?? []}
                    />
            </div>);
    }

}

export default BodyId;