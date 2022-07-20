import { Button, InputGroup, FormControl, Container, Form, Row, Col } from "react-bootstrap";
import { PencilFill, ArrowCounterclockwise } from 'react-bootstrap-icons';
import { useRef, useState, useEffect, Fragment } from "react";
import { useKeycloak } from '@react-keycloak/web';

import StaticValues from "../api/StaticValues.js";
import Dialog from "./Dialog";
import Message from "../model/Message.js";
import licenses from "../licenses.json";

function Body(props) {
  const [value, setValue] = useState(props.oldValue);
  const updValue = (newVal) => {
    setValue(newVal);
    props.updValue(newVal);
  }
  //console.log(value);
  return  <div className="mb-3">
    <Button title="Restore Initial value" variant="link" onClick={(e) => updValue(props.oldValue)}>Restore original</Button><br />
    {
      props.oldValue === null || props.oldValue === undefined || props.oldValue.length < 20 ?
          <input type="text" className="ms-2 w-100" title="Modify field's value"
            aria-label="Edit value" value={value === undefined || value === null ? "" : value} onInput={(e) => {e.preventDefault();updValue(e.target.value);}} />
         : <textarea rows="3" wrap="hard" className="ms-2 w-100" title="Modify field's value"
            aria-label="Edit value" value={value === undefined || value === null ? "" : value} onInput={(e) => {e.preventDefault();updValue(e.target.value);}} />
    }

  </div>;
}

function BodyPid(props) {
  const [value, setValue] = useState(props.oldValue);
  //console.log(`value is ${JSON.stringify(value)}`);
  //console.log(`props.oldValue is ${JSON.stringify(props.oldValue)}`);
  const isAuto = props.oldValue["preferred"] === null || props.oldValue["preferred"] === StaticValues.DS_PID_ZENODO;
  const [customValue, setCustomValue] = useState(props.oldValue["urls"]["custom"] === null ? "" :  props.oldValue["urls"]["custom"]);
  const [editType, setEditType] = useState(isAuto ? StaticValues.DS_PID_ZENODO : StaticValues.DS_PID_CUSTOM);
  const [expanded, setExpanded] = useState(false);

  const updValue = (newVal) => {
    setEditType(newVal["preferred"]);
    setValue(newVal);
    props.updValue(newVal);
  }
  let cssMsgAutoPid = "d-inline-block mt-2 fst-italic";
  if (!expanded) {
    cssMsgAutoPid += " overflow-ellipsis";
  }
  return  <div className="mb-3">
      <Form>
        <Form.Group onChange={e => {
          //console.log(`${e.target.value}`)
          //setEditType(e.target.value);

          /// IGNORE input changes
          if (e.target.nodeName === 'INPUT' && e.target.type === "radio") {
            if (e.target.value === StaticValues.DS_PID_ZENODO) {
              updValue({
                preferred: StaticValues.DS_PID_ZENODO,
                urls: value["urls"]
              });
            } else if (e.target.value === StaticValues.DS_PID_CUSTOM) {
              let newUrls = {...value["urls"]};
              newUrls[StaticValues.DS_PID_CUSTOM] = customValue;
              updValue({
                preferred: StaticValues.DS_PID_CUSTOM,
                urls: newUrls
              });
            } else {
              throw new Error(`Unhandled option ${e.target.value }`);
            }
          }
        }
        }>
          <Form.Check type="radio" id={StaticValues.DS_PID_ZENODO} style={{marginBottom: "2em"}}>            
            <Form.Check.Input id={StaticValues.DS_PID_ZENODO} type="radio" isValid name="pid" defaultChecked={isAuto ? true : false} value={StaticValues.DS_PID_ZENODO} />
            <Form.Check.Label htmlFor={StaticValues.DS_PID_ZENODO}>
              {  
                value["urls"][StaticValues.DS_PID_ZENODO] !== null ? "Use automatically generated PID" : "Generate PID automatically"
              }
            </Form.Check.Label>
            {
              value["urls"][StaticValues.DS_PID_ZENODO] !== null ?
                <div  className="ms-2 w-100"><a href={props.oldValue["urls"][StaticValues.DS_PID_ZENODO]} title="Custom Zenodo PID URL">
                  {props.oldValue["urls"][StaticValues.DS_PID_ZENODO]}
                </a></div>
                : <div className="ms-2 w-100 d-flex">
                    <div className={cssMsgAutoPid}>
                      The dataset's metadata and index (not the images nor clinical data) will be deposited in <a href="zenodo.org">Zenodo.org</a> in order to obtain a DOI.
                      Metadata includes the content of "Details" tab: author, contact information, creation date, license, etc.
                      Index includes the content of "Studies" tab: study id, study name, subject and series.
                    </div>
                    <div className="d-inline-block">
                      <Button title="Expand" className="fs-3 float-end m-0 p-0 ms-3" style={{textDecoration: "none"}} variant="link" onClick={() => setExpanded(!expanded)}>
                        {expanded ? "-" : "+"}
                      </Button></div>
                  </div>
            }
          </Form.Check>


          <Form.Check type="radio" id={StaticValues.DS_PID_CUSTOM}>            
            <Form.Check.Input id={StaticValues.DS_PID_CUSTOM} type="radio" isValid name="pid" defaultChecked={isAuto ? false : true} value={StaticValues.DS_PID_CUSTOM} />
            <Form.Check.Label htmlFor={StaticValues.DS_PID_CUSTOM}>Use custom PID - edit URL below</Form.Check.Label>
            <input disabled={editType === StaticValues.DS_PID_CUSTOM ? false : true} type="text" className="ms-2 w-100" title="Enter custom PID URL"
              aria-label="Enter custom PID URL" value={customValue}
              onInput={(e) => {
                e.preventDefault();
                e.stopPropagation();
                //e.target.value =
                setCustomValue(e.target.value);
                let newVal = {...value};
                newVal["preferred"] =  StaticValues.DS_PID_CUSTOM;
                newVal["urls"][StaticValues.DS_PID_CUSTOM] = e.target.value;
                updValue(newVal);
              }} />
          </Form.Check>
        </Form.Group>
        
      </Form>
  </div>;
}

function BodyLicense(props) {
  const [value, setValue] = useState(props.oldValue);
  const isCustom = licenses.findIndex(el => el["title"] === value["title"] && el["url"] === value["url"]) === -1;
  const [customValue, setCustomValue] = useState(isCustom ? value : {title: "", url: ""});

  const updValue = (newVal) => {
    setValue(prev => {
      return {...prev, ...newVal};
    });
    props.updValue(newVal);
  }
  return  <div className="mb-3">
    <Button title="Restore Initial value" variant="link" onClick={(e) => updValue(props.oldValue)}>Restore original</Button><br />
    <select onChange={(e) => {e.preventDefault();updValue(JSON.parse(e.target.value));}} value={isCustom ? JSON.stringify(customValue) :  JSON.stringify(value) }>
      <option key="-1" value={JSON.stringify(customValue)}>Custom License</option>
      {licenses.map((el, idx) => <option key={idx.toString()} value={JSON.stringify(el)}>{el.title}</option>)}
    </select>
    {
      isCustom ?
          <div className="mt-4">
            <FormControl className="w-100"
              placeholder="Title"
              aria-label="License title"
              title="Set the custom license's title"
              value={customValue.title} onInput={(e) => {e.preventDefault();setCustomValue({...customValue, "title": e.target.value});updValue({...value, "title": e.target.value});}}
            />
              <FormControl className="mt-2 w-100"
                placeholder="URL"
                aria-label="License url"
                title="Set the custom license's URL"
                value={customValue.url} onInput={(e) => {e.preventDefault();setCustomValue({...customValue, "url": e.target.value});updValue({...value, "url": e.target.value});}}
              />
          </div>
        : <Fragment />
    }
  </div>;
}

function Footer(props) {

  return <div className="w-100 p-1">
    <Button title="Discard changes and close dialog" className="float-end m-1" onClick={() => {props.updValue(props.oldValue);Dialog.HANDLE_CLOSE();}}>Cancel</Button>
    <Button title="Update field and close dialog" className="float-end m-1" onClick={() => {
      props.patchDataset();
      Dialog.HANDLE_CLOSE();
    }}>Update</Button>
  </div>
}

function transformValue(field, value) {
  if (field === "pids") {
    let sVal = Object.create(null);
    sVal["preferred"] = value["preferred"];
    if (value["preferred"] === StaticValues.DS_PID_CUSTOM) {
      sVal["urls"] = Object.create(null);
      sVal["urls"][StaticValues.DS_PID_CUSTOM] = value["urls"][StaticValues.DS_PID_CUSTOM];
    }
    return sVal;
  } else 
    return value;
}


function DatasetFieldEdit(props) {
  let [value, setValue] = useState(props.oldValue);
  useEffect(() => setValue(props.oldValue), [props.oldValue]);
  let { keycloak } = useKeycloak();
  //console.log(`props.oldValue is ${JSON.stringify(props.oldValue)}`);
  //console.log(`dfe value is ${JSON.stringify(value)}`);
  const [isPatchValue, setIsPatchValue] = useState(false);
  const updValue = (newVal) => {setValue(newVal);};
  const patchDataset = () => setIsPatchValue(true);
  useEffect(() => {
    if (isPatchValue) {
      let sVal = transformValue(props.field, value);
      props.patchDataset(keycloak.token, props.datasetId, props.field, sVal);
      setIsPatchValue(false);
    }
  }, [isPatchValue]);
  // const patchDatasetCb = (newData) => setData( prevValues => {
  //    return { ...prevValues, data: newData.data, isLoading: newData.isLoading, isLoaded: newData.isLoaded, error: newData.error, status: newData.status}}
  //  );
  
  let body = null;
  if (props.field === "license" || props.field === "licenseUrl") {
    body = <BodyLicense updValue={updValue} field={props.field} oldValue={props.oldValue} />;
  } else if (props.field === "pids") {
    body = <BodyPid updValue={updValue} field={props.field} oldValue={value} />;
  } else {
    body = <Body updValue={updValue} field={props.field} oldValue={props.oldValue} />;
  }
  return <Button title={`Edit field '${props.fieldDisplay}'`} variant="link" className="m-0 ms-1 me-1 p-0" onClick={() =>
      {
        props.showDialog({
          show: true,
          footer: <Footer updValue={updValue} patchDataset={patchDataset} oldValue={props.oldValue} />,
          body: body,
          title: <span>Edit <b>{props.fieldDisplay}</b></span>,
          size: Dialog.SIZE_LG,
          onBeforeClose: null
        });
        //patchDataset(props.field, props.newValue, props.succUpdCb);
      }} >
    <PencilFill />
  </Button>
}

export default DatasetFieldEdit;
