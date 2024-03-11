import { Button, FormControl } from "react-bootstrap";
import React, { useState, Fragment, FormEvent } from "react";

import licenses from "../../../../licenses.json";


interface License {
  title: string;
  url: string;
}

interface BodyLicenseProps {
  oldValue: License;
  updValue: Function;
}

function BodyLicense(props: BodyLicenseProps) {
    const [value, setValue] = useState(props.oldValue);
    const isCustom = licenses.findIndex(el => el["title"] === value["title"] && el["url"] === value["url"]) === -1;
    const [customValue, setCustomValue] = useState<License>(isCustom ? value : {title: "", url: ""});
  
    const updValue = (newVal: License) => {
      setValue((prev: License) => {
        return {...prev, ...newVal};
      });
      props.updValue(newVal);
    }
    const updCustomValue = (e: FormEvent<HTMLInputElement>, field: string) => {
      e.preventDefault();
      const t = e.target as HTMLInputElement;
      setCustomValue({...customValue, [field]: t.value});
      updValue({...value, [field]: t.value});
    };
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
                value={customValue.title} onInput={(e: FormEvent<HTMLInputElement>) => updCustomValue(e, "title")}
              />
                <FormControl className="mt-2 w-100"
                  placeholder="URL"
                  aria-label="License url"
                  title="Set the custom license's URL"
                  value={customValue.url} onInput={(e: FormEvent<HTMLInputElement>) => updCustomValue(e, "url")}
                />
            </div>
          : <Fragment />
      }
    </div>;
}

export default BodyLicense;