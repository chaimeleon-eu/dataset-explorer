import React, {useState, useEffect} from "react";
import {InputGroup, FormControl, Accordion} from "react-bootstrap";

import Message from "../model/Message.js";

function DataFilterEntry(props) {
  return (
    <InputGroup size="sm" className="mb-2">
      <InputGroup.Checkbox aria-label="Checkbox for following text input" />
      <InputGroup.Text style={{"width": "80%", "backgroundColor": "rgba(255,255,255,0)"}}><span className="d-inline-block text-truncate" style={{"max-width": "100%"}}>{props.label}</span></InputGroup.Text>
    </InputGroup>
  );
}

function DataFilterCategory(props) {
  var [categories, setCategories] = useState([]);
  var [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    props.category.categoryLoader()
      .then(
        (xhr) => {
          setIsLoaded(true);
          const result = JSON.parse(xhr.response);
          const mapping = props.category.categoryMapping(result);
          setCategories(mapping);
        },
        (xhr) => {
          setIsLoaded(true);
          let title = null;
          let text = null;
          if (!xhr.responseText) {
            title = Message.UNK_ERROR_TITLE;
            text = Message.UNK_ERROR_MSG;
          } else {
            const err = JSON.parse(xhr.response);
              title = err.title;
              text = err.message;
          }
          props.postMessage(new Message(Message.ERROR, title, text));
        });
      }, [props.category]);
  const components = categories.map((m, idx) => <DataFilterEntry  label={m.label}/>);
  return (
    <Accordion.Item eventKey="0">
      <Accordion.Header>{props.category.categoryTitle}</Accordion.Header>
      <Accordion.Body>
        {components.map((component, index) => (
          <React.Fragment key={index}>
                { component }
          </React.Fragment>
        ))}
      </Accordion.Body>
    </Accordion.Item>
  );

}

export default DataFilterCategory;
