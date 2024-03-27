import React, { useCallback, MouseEvent } from "react";
import { Button, Badge, Row, Col, Container } from "react-bootstrap";
import { CheckCircle, CheckCircleFill, DashCircle, DashCircleFill, XCircleFill, XCircle } from "react-bootstrap-icons";

interface FilterFlagsProps {
    searchParams: URLSearchParams;
    filterUpdate: Function;
    loading: boolean;
}


const lblFalse = "Hide datasets flagged with '#flag'";
const lblTrue = "Show only datasets flagged with '#flag'";

const radios = [
    { iconUnchecked: <CheckCircle pointerEvents="none" />, iconChecked: <CheckCircleFill pointerEvents="none" />, lbl: lblTrue, value: "true" },
    { iconUnchecked: <DashCircle pointerEvents="none" />, iconChecked: <DashCircleFill pointerEvents="none" />, lbl: lblFalse, value: "false" },
    //{ iconUnchecked: <XCircle />, iconChecked: <XCircleFill />, lbl: lblMissing, value: "null" },
  ];

function getSearchParamValue(searchParams: URLSearchParams, filter: string) {
    return searchParams.get(filter) === null ? null 
      : (searchParams.get(filter)?.toLowerCase() === "true" ? "true" : "false");
}

function getFilterFlag(searchParams: URLSearchParams, 
        flagName: string, filter: string, updParamsCb: (e: MouseEvent) => void, 
        bg: string, text: string, disabled: boolean) {
    return (
        <Row xs={1} sm={1} md={1} lg={1} xl={2} xxl={2} title={`Filter datasets that have the flag '${filter}'.`} 
                className="ms-0 me-0" style={{display: "flex", flexDirection: "row"}}>
            <Col xs={4} style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                <Badge pill bg={bg} text={text}>{flagName}</Badge> 
            </Col>
            <Col style={{display: "flex", overflowX: "visible", marginLeft: "auto"}}>
                    {radios.map((radio, idx) => (
                    <Button
                        title={radio.lbl.replace("#flag", filter)}
                        className="p-0 mt-1 mb-1 ms-1 me-1 fs-5"
                        key={`tgbtn-${idx}`}
                        variant="link"
                        data-filter-value={radio.value}
                        onClick={(e:React.MouseEvent<HTMLButtonElement>) => updParamsCb(e)}
                        disabled={disabled}
                        data-filter={`${filter}`}
                    >
                        { getSearchParamValue(searchParams, filter) === radio.value ? radio.iconChecked : radio.iconUnchecked }
                    </Button>
                    ))}
                <Button id={`${filter}--1`} disabled={disabled} data-filter={`${filter}`} data-filter-value={null} 
                    onClick={updParamsCb} title={`Remove filter for the '${filter}' flag`}  size="sm" variant="link" className="ps-0 pt-0 mt-0 fw-bold">
                    {
                         getSearchParamValue(searchParams, filter) 
                            ?  <XCircle pointerEvents="none" data-filter={`${filter}`} style={{"backgroundColor": "white", "fontSize": "0.9rem"}}/>
                            : <XCircleFill pointerEvents="none" data-filter={`${filter}`} style={{"backgroundColor": "white", "fontSize": "0.9rem"}}/>
                    }
                    
                </Button>
            </Col>
        </Row>
    )
}

function FilterFlags({searchParams, filterUpdate, loading}: FilterFlagsProps) {
    const updParamsCb = useCallback((e: MouseEvent) => {
        const el = e.target as HTMLInputElement;
        const k: string | null = el.getAttribute("data-filter");
        if (k) {
            filterUpdate({[k]: el.getAttribute("data-filter-value")});
        } else {
            console.error("The elem doesn't have a field called 'data-filter'")
        }
    }, [searchParams, filterUpdate]);
    const disabled = loading === true;
    return <div className="mt-1 mb-4">
        <h6>Dataset flags</h6>
            <Container className="m-0 p-0">
                {getFilterFlag(searchParams, "Draft", "draft", updParamsCb, "light", "dark", disabled)}
                {getFilterFlag(searchParams, "Published", "public", updParamsCb, "dark", "light", disabled)}
                {getFilterFlag(searchParams, "Invalidated", "invalidated", updParamsCb, "secondary", "light", disabled)}
            </Container>
    </div>;
}

export default FilterFlags;