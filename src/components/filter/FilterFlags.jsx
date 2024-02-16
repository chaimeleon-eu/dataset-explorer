import { useCallback, useEffect, useMemo, useRef } from "react";
import { Badge, InputGroup, ButtonGroup, ToggleButton } from "react-bootstrap";
import { CheckCircle, CheckCircleFill, DashCircle, DashCircleFill, XCircle, XCircleFill } from "react-bootstrap-icons";

const lblFalse = "Hide datasets flagged with '#flag'";
const lblTrue = "Show only datasets flagged with '#flag'";
const lblMissing = "Show all datasets including those flagged with '#flag'";

const radios = [
    { iconUnchecked: <CheckCircle />, iconChecked: <CheckCircleFill />, lbl: lblTrue, value: "true" },
    { iconUnchecked: <DashCircle />, iconChecked: <DashCircleFill />, lbl: lblFalse, value: "false" },
    { iconUnchecked: <XCircle />, iconChecked: <XCircleFill />, lbl: lblMissing, value: "null" },
  ];

function getSearchParamValue(searchParams, filter) {
    return searchParams.get(filter) === null ? "null" 
      : (searchParams.get(filter).toLowerCase() === "true" ? "true" : "false");
}

function getFilterFlag(searchParams, flagName, filter, updParamsCb, disabled) {
    return (
        <div title={`Control datasets that have the flag '${filter}' set.`}>
            <Badge className="ms-2 me-2" pill bg="light" text="dark">{flagName}</Badge> 
            <ButtonGroup>
                {radios.map((radio, idx) => (
                <ToggleButton
                    title={radio.lbl.replace("#flag", filter)}
                    className="p-0 mt-0 mb-0 ms-1 me-1"
                    key={`tgbtn-${idx}`}
                    id={`${filter}-${idx}`}
                    type="radio"
                    variant="clear"
                    value={radio.value}
                    checked={ getSearchParamValue(searchParams, filter) === radio.value}
                    onChange={updParamsCb}
                    disabled={disabled}
                >
                    { getSearchParamValue(searchParams, filter) === radio.value ? radio.iconChecked : radio.iconUnchecked }
                </ToggleButton>
                ))}
            </ButtonGroup>
        </div>
    )
}

function FilterFlags({searchParams, updSearchParams, loading}) {

    const updParamsCb = useCallback((e) => {
        const value = e.target.value === "null" ? null : e.target.value;
        updSearchParams({[e.target.id.substring(0, e.target.id.indexOf("-"))]: value});
    }, [searchParams, updSearchParams]);
    const disabled = loading === true;
    console.log(loading);
    return <div className="mt-1 mb-1">
        <h5>Flags</h5>
        {getFilterFlag(searchParams, "Draft", "draft", updParamsCb, disabled)}
        {getFilterFlag(searchParams, "Published", "public", updParamsCb, disabled)}
        {getFilterFlag(searchParams, "Invalidated", "invalidated", updParamsCb, disabled)}
    </div>;
}

export default FilterFlags;