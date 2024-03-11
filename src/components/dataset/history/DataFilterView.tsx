import React, {ReactNode, useEffect, useState} from "react";
import { Accordion, Button, Col, Container, Row } from "react-bootstrap";
import DataManager from "../../../api/DataManager";
import FilterCategory from "../../../model/FilterCategory";
import TraceTable from "../../../model/TraceTable";

import DataFilterCategory from "./DataFilterCategory";

interface FiltersType {
  [key: string]: Map<string, any>;
}

interface DataFilterViewProps {
  dataManager: DataManager;
  traces: TraceTable[];
  updFilteredData: Function;
  postMessage: Function;
}

function DataFilterView(props: DataFilterViewProps) {
  //var [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState<FiltersType>(Object.create(null));
  const [categories, setCategories] = useState<FilterCategory[]>([]);

  useEffect(() => {
        setCategories([
          {
            categoryTitle: "User Action types",
            filterCategoryName: "userActions",
            filterMapping: function(inResult: string[]): Map<string, boolean> {return new Map(inResult.map(el => [el, true]));},
            //filterElUpd: function(oldValues, id, newValue) {oldValues[id] = newValue; return oldValues;},
            filterApply: function(traces: TraceTable[], filtersValues: Map<string, boolean>) {
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
            categoryMapping: function(inResult: string[]) {
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
      const updFilters = (filterName: string, newValues: any) => {
          setFilters( prevValues => {
            prevValues[filterName] = newValues;
            return { ...prevValues };
          });
        };

      const updFilter = (filtersName: string, id: string, value: any) => {
          setFilters( prevValues => {
            let filter = prevValues[filtersName];
            if (filter !== undefined)
              filter.set(id, value);
            return { ...prevValues };
          });
        };

  let components: ReactNode[] = [];
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
