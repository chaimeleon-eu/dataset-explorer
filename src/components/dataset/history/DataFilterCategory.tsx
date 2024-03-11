import React, {useState, useEffect } from "react";
import {InputGroup, Accordion} from "react-bootstrap";
import FilterCategory from "../../../model/FilterCategory";
import FilterTrace from "../../../model/FilterTrace";
import LoadingData from "../../../model/LoadingData";

import Message from "../../../model/Message";
import Util from "../../../Util";

interface DataFilterEntry {
  filterName: string;
  id: string;
  updFilter: Function;
  label: string;
}

function DataFilterEntry(props: DataFilterEntry) {
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

interface DataFilterCategoryProps {
  updFilter: Function;
  updFilters: Function;
  category: FilterCategory;
  postMessage: Function;
} 

function DataFilterCategory(props: DataFilterCategoryProps) {
  const [data, setData] = useState<LoadingData<FilterTrace[]>>({
      loading: false,
      data: [],
      error: null,
      statusCode: -1
    });
  useEffect(() => {
      setData( prevValues => {
        return { ...prevValues, loading: true, status: -1, error: null, data: [] }
      });
          props.category.categoryLoader()
            .then(
              (xhr: XMLHttpRequest) => {
                const result: string[] = JSON.parse(xhr.response);
                const mapping = props.category.categoryMapping(result);
                setData( prevValues => {
                  return { ...prevValues, loading: false, statusCode: xhr.status, error: null, data: mapping }
                });
                props.updFilters(props.category.filterCategoryName, props.category.filterMapping(result));
              },
              (xhr: XMLHttpRequest) => {
                const error = Util.getErrFromXhr(xhr);
                setData( prevValues => {
                  return { ...prevValues, loading: false, data:[], statusCode: xhr.status, error }
                });
                props.postMessage(new Message(Message.ERROR, error.title, error.text));
            });
      }, []);
  const components = data.data?.map((m, idx) => <DataFilterEntry
    updFilter={props.updFilter} filterName={m.filterName} id={m.id} label={m.label}/>);
  return (
    <Accordion.Item eventKey="0">
      <Accordion.Header>{props.category.categoryTitle}</Accordion.Header>
      <Accordion.Body>
        {components && components.map((component, index) => (
          <React.Fragment key={index}>
                { component }
          </React.Fragment>
        ))}
      </Accordion.Body>
    </Accordion.Item>
  );

}

export default DataFilterCategory;
