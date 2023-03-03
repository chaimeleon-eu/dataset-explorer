import React, {useState, useEffect } from "react";
import {InputGroup, FormControl, Accordion} from "react-bootstrap";
import { useKeycloak } from '@react-keycloak/web';

import Message from "../../../model/Message.js";
import Util from "../../../Util";

function DataFilterEntry(props) {
  const [checked, setChecked] = useState(true);
  return (
    <InputGroup size="sm" className="mb-2">
      <InputGroup.Checkbox defaultChecked={checked} onChange={() =>
          {
            props.updFilter(props.filterName,
              props.id, !checked);
            setChecked(!checked);
            }
          }
             aria-label="Checkbox for following text input" />
      <InputGroup.Text style={{"width": "80%", "backgroundColor": "rgba(255,255,255,0)"}}>
        <span className="d-inline-block text-truncate"
          style={{"maxWidth": "100%"}}>{props.label}
        </span>
      </InputGroup.Text>
    </InputGroup>
  );
}

function DataFilterCategory(props) {
  const [data, setData] = useState({
      isLoading: false,
      isLoaded: false,
      data: [],
      error: null,
      status: -1
    });
  let { keycloak } = useKeycloak();
  useEffect(() => {
      setData( prevValues => {
        return { ...prevValues, isLoaded: false, isLoading: true, status: -1, error: null, data: [] }
      });
          props.category.categoryLoader()
            .then(
              (xhr) => {
                const result = JSON.parse(xhr.response);
                const mapping = props.category.categoryMapping(result);
                setData( prevValues => {
                  return { ...prevValues, isLoaded: true, isLoading: false, status: xhr.status, error: null, data: mapping }
                });
                props.updFilters(props.category.filterCategoryName, props.category.filterMapping(result));
              },
              (xhr) => {
                const error = Util.getErrFromXhr(xhr);
                setData( prevValues => {
                  return { ...prevValues, isLoaded: true, isLoading: false, data:[],
                    status: xhr.status, error }
                });
                props.postMessage(new Message(Message.ERROR, error.title, error.text));
            });
      }, []);
  const components = data.data.map((m, idx) => <DataFilterEntry
    updFilter={props.updFilter} checked={true} filterName={m.filterName} id={m.id} label={m.label}/>);
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
