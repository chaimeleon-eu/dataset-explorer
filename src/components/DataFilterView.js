import React, {useEffect, useState} from "react";
import {Accordion, Container, Row, Col, Button} from "react-bootstrap";
import { useKeycloak } from '@react-keycloak/web';

import DataFilterCategory from "./DataFilterCategory.js";


function DataFilterView(props) {
  //var [categories, setCategories] = useState([]);
  let { keycloak } = useKeycloak();

  const [filters, setFilters] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
        setCategories([
          {
            categoryTitle: "User Action types",
            filterCategoryName: "userActions",
            filterMapping: function(inResult) {return new Map(inResult.map(el => [el, true]));},
            filterElUpd: function(oldValues, id, newValue) {oldValues[id] = newValue; return oldValues;},
            filterApply: function(traces, filtersValues) {
                if (filtersValues !== undefined) {
                  let tracesFiltered = [];
                  for (let t of traces) {
                    if (filtersValues.get(t.action)) {
                      tracesFiltered.push(t);
                    }
                  }
                  return tracesFiltered;
                } else {
                  return traces;
                }
              },
            categoryLoader: () => props.dataManager.getTracesActions(),
            categoryMapping: function(inResult) {
              return inResult.map((el) => {return {id: el, label: el, enabled: true, filterName: "userActions"};});}
          }
        ]);
      }, []);
      useEffect(() => {
        if (props.traces.length > 0) {
          let tracesFiltered = props.traces;
          for (let c of categories) {
            tracesFiltered = c.filterApply(props.traces, filters[c.filterCategoryName]);
          }
          props.updFilteredData(tracesFiltered);
        }
      }, [filters, props.traces]);
      const updFilters = (filterName, newValues) => {
          setFilters( prevValues => {
            prevValues[filterName] = newValues;
            return { ...prevValues };
          });
        };

      const updFilter = (filtersName, id, value) => {
          setFilters( prevValues => {
            let filter = prevValues[filtersName];
            if (filter != undefined)
              filter.set(id, value);
            return { ...prevValues };
          });
        };

  let components = [];
  if (categories.length > 0)
    components = categories.map((m, idx) => <DataFilterCategory updFilter={updFilter} updFilters={updFilters}
      category={m} postMessage={props.postMessage}/>);
  return (
    <Container fluid>
      <Row>
        <Col>
          <h3>Filter by</h3>
        </Col>
        <Col>
            <Button variant="link" className="float-end mr-0 pr-0" >Apply</Button>
        </Col>
      </Row>
      <Row>
        <Accordion defaultActiveKey="0">
          {components.map((component, index) => (
            <React.Fragment key={index}>
                  { component }
            </React.Fragment>
          ))}

        </Accordion>
      </Row>
    </Container>
  );

}

export default DataFilterView;
