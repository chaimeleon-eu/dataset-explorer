import { Button} from "react-bootstrap";
import React, {FormEvent, useState} from "react";

interface BodyProps {
  oldValue: string | null | undefined;
  updValue: Function;
}

function Body(props: BodyProps) {
    const [value, setValue] = useState(props.oldValue);
    const updValue = (newVal: string | null | undefined) => {
      setValue(newVal);
      props.updValue(newVal);
    }
    //console.log(value);
    return  <div className="mb-3">
      <Button title="Restore Initial value" variant="link" onClick={(e) => updValue(props.oldValue)}>Restore original</Button><br />
      {
        props.oldValue === null || props.oldValue === undefined || props.oldValue.length < 20 ?
            <input type="text" className="ms-2 w-100" title="Modify field's value"
              aria-label="Edit value" value={value === undefined || value === null ? "" : value} 
              onInput={(e: FormEvent<HTMLInputElement>) => {e.preventDefault();updValue((e.target as HTMLInputElement).value);}} />
           : <textarea rows={3} wrap="hard" className="ms-2 w-100" title="Modify field's value"
              aria-label="Edit value" value={value === undefined || value === null ? "" : value} 
              onInput={(e: FormEvent<HTMLTextAreaElement>) => {e.preventDefault();updValue((e.target as HTMLTextAreaElement).value);}} />
      }
  
    </div>;
  }

export default Body;
  