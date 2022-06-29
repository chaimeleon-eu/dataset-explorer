import { Button, InputGroup, FormControl, Container, Form } from "react-bootstrap";
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
  const isAuto = value.startsWith(StaticValues.AUTO_GEN_PID_PREFIX);
  const [customValue, setCustomValue] = useState(isAuto ? "" : value );
  const [editType, setEditType] = useState(isAuto ? StaticValues.AUTO_GEN_PID_PREFIX : "manual");

  const updValue = (newVal) => {
    console.log(newVal);
    setValue(newVal);
    props.updValue(newVal);
  }

  return  <div className="mb-3">
      <Form>
        <Form.Group onChange={e => {
          setEditType(e.target.value);
          if (e.target.value === StaticValues.AUTO_GEN_PID_PREFIX) {
            updValue(StaticValues.AUTO_GEN_PID_PREFIX);
          } else if (e.target.value === "manual") {
            updValue(customValue);
          } else {
            throw new Error(`Unhandled option ${e.target.value }`);
          }
        }
        }>
          <Form.Check type="radio" label="Generate automatically" name="pid" defaultChecked={isAuto ? true : false} value={StaticValues.AUTO_GEN_PID_PREFIX}/>
          <Form.Check type="radio" label="Manually set PID (edit URL bellow)" name="pid" defaultChecked={isAuto ? false : true} value="manual"/>
        </Form.Group>
        <input disabled={editType === "manual" ? false : true} type="text" className="ms-2 w-100" title="Enter custom PID url"
          aria-label="Enter custom PID url" value={customValue}
          onInput={(e) => {e.preventDefault();setCustomValue(e.target.value);updValue(e.target.value);}} />
      </Form>
  </div>;
}

function BodyLicense(props) {
  const [value, setValue] = useState(props.oldValue);
  const isCustom = licenses.findIndex(el => el["title"] === value["title"] && el["url"] === value["url"]) === -1;
  const [customValue, setCustomValue] = useState(isCustom ? value : {title: "", url: ""});

  const updValue = (newVal) => {
    console.log(newVal);
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


function DatasetFieldEdit(props) {
  let [value, setValue] = useState(props.oldValue);
  const [isPatchValue, setIsPatchValue] = useState(false);
  const updValue = (newVal) => {setValue(newVal);};
  let { keycloak } = useKeycloak();
  var patchDataset = () => setIsPatchValue(true);
  useEffect(() => {
    if (isPatchValue) {
      props.patchDataset(keycloak.token, props.datasetId, props.field, value);
      setIsPatchValue(false);
    }
  }, [isPatchValue]);
  // const patchDatasetCb = (newData) => setData( prevValues => {
  //    return { ...prevValues, data: newData.data, isLoading: newData.isLoading, isLoaded: newData.isLoaded, error: newData.error, status: newData.status}}
  //  );
  let body = null;
  if (props.field === "license" || props.field === "licenseUrl") {
    body = <BodyLicense updValue={updValue} field={props.field} oldValue={props.oldValue} />;
  } else if (props.field === "pidUrl") {
    body = <BodyPid updValue={updValue} field={props.field} oldValue={props.oldValue} />;
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
