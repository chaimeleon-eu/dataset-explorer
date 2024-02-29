import { Button, FormControl } from "react-bootstrap";
import React, { useState, Fragment } from "react";

import licenses from "../../../../licenses.json";


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
        {licenses.map((el, idx) => <option key={btoa(el.title)} value={JSON.stringify(el)}>{el.title}</option>)}
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

export default BodyLicense;