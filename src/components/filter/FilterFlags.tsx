import { useCallback, useEffect, useMemo, useRef } from "react";
import { Button, Badge, InputGroup, ButtonGroup, ToggleButton } from "react-bootstrap";
import { CheckCircle, CheckCircleFill, DashCircle, DashCircleFill, X, XCircleFill,XCircle } from "react-bootstrap-icons";

const lblFalse = "Hide datasets flagged with '#flag'";
const lblTrue = "Show only datasets flagged with '#flag'";
const lblMissing = "Show all datasets including those flagged with '#flag'";

const radios = [
    { iconUnchecked: <CheckCircle pointerEvents="none" />, iconChecked: <CheckCircleFill pointerEvents="none" />, lbl: lblTrue, value: "true" },
    { iconUnchecked: <DashCircle pointerEvents="none" />, iconChecked: <DashCircleFill pointerEvents="none" />, lbl: lblFalse, value: "false" },
    //{ iconUnchecked: <XCircle />, iconChecked: <XCircleFill />, lbl: lblMissing, value: "null" },
  ];

function getSearchParamValue(searchParams, filter?: string | null) {
    return searchParams.get(filter) === null ? null 
      : (searchParams.get(filter).toLowerCase() === "true" ? "true" : "false");
}

function getFilterFlag(searchParams: Object, flagName: string, filter: string, updParamsCb: Function, disabled: boolean) {
    return (
        <tr title={`Filter datasets that have the flag '${filter}'.`}>
            <td>
                <Badge className="ms-2 me-2" pill bg="light" text="dark">{flagName}</Badge> 
            </td>
            <td>
                    {radios.map((radio, idx) => (
                    <Button
                        title={radio.lbl.replace("#flag", filter)}
                        className="p-0 mt-1 mb-1 ms-1 me-1 fs-5"
                        key={`tgbtn-${idx}`}
                        variant="clear"
                        data-filter-value={radio.value}
                        onClick={updParamsCb}
                        disabled={disabled}
                        data-filter={`${filter}`}
                    >
                        { getSearchParamValue(searchParams, filter) === radio.value ? radio.iconChecked : radio.iconUnchecked }
                    </Button>
                    ))}
                <Button id={`${filter}--1`} disabled={disabled} data-filter={`${filter}`} data-filter-value={null} onClick={updParamsCb} title={`Remove filter for the '${filter}' flag`}  size="small" variant="link" className="ps-0 pt-0 mt-0 fw-bold">
                    {
                         getSearchParamValue(searchParams, filter) 
                            ?  <XCircle pointerEvents="none" data-filter={`${filter}`} style={{"backgroundColor": "white", "fontSize": "0.9rem"}}/>
                            : <XCircleFill pointerEvents="none" data-filter={`${filter}`} style={{"backgroundColor": "white", "fontSize": "0.9rem"}}/>
                    }
                    
                </Button>
            </td>
        </tr>
    )
}

function FilterFlags({searchParams, updSearchParams, loading}) {
    const updParamsCb = useCallback((e) => {
        updSearchParams({[e.target.getAttribute("data-filter")]: e.target.getAttribute("data-filter-value")});
    }, [searchParams, updSearchParams]);
    const disabled = loading === true;
    return <div className="mt-1 mb-1">
        <h5>Filter by dataset flags</h5>
        <table>
            <tbody>
                {getFilterFlag(searchParams, "Draft", "draft", updParamsCb, disabled)}
                {getFilterFlag(searchParams, "Published", "public", updParamsCb, disabled)}
                {getFilterFlag(searchParams, "Invalidated", "invalidated", updParamsCb, disabled)}
            </tbody>
        </table>
    </div>;
}

export default FilterFlags;