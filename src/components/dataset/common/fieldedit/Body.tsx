import { Button} from "react-bootstrap";
import React, {useState} from "react";

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

export default Body;
  