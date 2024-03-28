import { Button, Form } from "react-bootstrap";
import React, {useState, FormEvent} from "react";

import StaticValues from "../../../../api/StaticValues";

interface Pid {
  preferred: string | null;
  urls: {
    [key: string]: string | null;
  }
}

interface BodyPidProps {
  oldValue: Pid;
  updValue: Function;
}

function BodyPid(props: BodyPidProps) {
    const [value, setValue] = useState<Pid>(props.oldValue);
    //console.log(`value is ${JSON.stringify(value)}`);
    //console.log(`props.oldValue is ${JSON.stringify(props.oldValue)}`);
    const isAuto = props.oldValue["preferred"] === null || props.oldValue["preferred"] === StaticValues.DS_PID_ZENODO;
    const oldCustValue: string = props.oldValue["urls"]["custom"] === null ||  props.oldValue["urls"]["custom"] === undefined  ? "" :  props.oldValue["urls"]["custom"];
    const [customValue, setCustomValue] = useState<string>(oldCustValue);
    const [editType, setEditType] = useState(isAuto ? StaticValues.DS_PID_ZENODO : StaticValues.DS_PID_CUSTOM);
    const [expanded, setExpanded] = useState(false);
  
    const updValue = (newVal: Pid) => {
      setEditType(newVal["preferred"] ?? StaticValues.DS_PID_ZENODO);
      setValue(newVal);
      props.updValue(newVal);
    }
  
    if (value["preferred"] === null) {
      updValue({...value, preferred: StaticValues.DS_PID_ZENODO});
  
    }
    console.log(` value is ${JSON.stringify(value)}`);
  
    let cssMsgAutoPid = "d-inline-block mt-2 fst-italic";
    let msgAutoPid = "The dataset's metadata and index (not the images nor clinical data) will be deposited in <a href=\"zenodo.org\">Zenodo.org</a> in order to obtain a DOI.\n"
      + "Metadata includes the content of \"Details\" tab: author, contact information, creation date, license, etc.\n"
      + "Index includes the content of \"Studies\" tab: study id, study name, subject and series.";
    if (!expanded) {
      cssMsgAutoPid += " overflow-ellipsis";
    } else {
      msgAutoPid = msgAutoPid.replace(/(?:\r\n|\r|\n)/g, '<br>');
    }
    const formOnChange = (e: FormEvent<HTMLInputElement>) =>  {
      //console.log(`${e.target.value}`)
      //setEditType(e.target.value);

      /// IGNORE input changes
      const t = e.target as HTMLInputElement;
      if (t.nodeName === 'INPUT' && t.type === "radio") {
        if (t.value === StaticValues.DS_PID_ZENODO) {
          updValue({
            preferred: StaticValues.DS_PID_ZENODO,
            urls: value["urls"]
          });
        } else if (t.value === StaticValues.DS_PID_CUSTOM) {
          let newUrls = {...value["urls"]};
          newUrls[StaticValues.DS_PID_CUSTOM] = customValue;
          updValue({
            preferred: StaticValues.DS_PID_CUSTOM,
            urls: newUrls
          });
        } else {
          throw new Error(`Unhandled option ${t.value }`);
        }
      }
    }
    let urlZenodo: string | null | undefined = null;
    if ( value && value["urls"] && value["urls"]?.[StaticValues.DS_PID_ZENODO] !== null && value["urls"]?.[StaticValues.DS_PID_ZENODO] !== undefined) {
      urlZenodo = value["urls"][StaticValues.DS_PID_ZENODO];
    }
    const urlZ: string = urlZenodo ? urlZenodo : "";
    return  <div className="mb-3">
        <Form>
          <Form.Group onChange={formOnChange}>
            <Form.Check type="radio" id={StaticValues.DS_PID_ZENODO} style={{marginBottom: "2em"}}>            
              <Form.Check.Input id={StaticValues.DS_PID_ZENODO} type="radio" isValid name="pid" defaultChecked={isAuto ? true : false} value={StaticValues.DS_PID_ZENODO} />
              <Form.Check.Label htmlFor={StaticValues.DS_PID_ZENODO}>
                {  
                  value["urls"][StaticValues.DS_PID_ZENODO] !== null ? "Use automatically generated PID" : "Generate PID automatically"
                }
              </Form.Check.Label>
              {
                value["urls"][StaticValues.DS_PID_ZENODO] !== null ?
                  <div  className="ms-2 w-100"><a href={urlZ} title="Custom Zenodo PID URL">
                    {value["urls"][StaticValues.DS_PID_ZENODO]}
                  </a></div>
                  : <div className="ms-2 w-100 d-flex">
                      <div className={cssMsgAutoPid} dangerouslySetInnerHTML={{__html: msgAutoPid}}></div>
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
                  const t = e.target as HTMLInputElement;
                  //e.target.value =
                  setCustomValue(t.value);
                  let newVal = {...value};
                  newVal["preferred"] =  StaticValues.DS_PID_CUSTOM;
                  newVal["urls"][StaticValues.DS_PID_CUSTOM] = t.value;
                  updValue(newVal);
                }} />
            </Form.Check>
          </Form.Group>
          
        </Form>
    </div>;
}

export default BodyPid;