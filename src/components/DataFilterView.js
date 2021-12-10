import React, {useEffect, useState} from "react";
import {Accordion, Container, Row, Col, Button} from "react-bootstrap";
import { useKeycloak } from '@react-keycloak/web';

import DataFilterCategory from "./DataFilterCategory.js";


function DataFilterView(props) {
  var [categories, setCategories] = useState([]);
  let { keycloak } = useKeycloak();
    useEffect(() => {
        setCategories([
          {
            categoryTitle: "User Action types",
            categoryLoader: () => props.dataManager.getTracesActions(keycloak.token),
            categoryMapping: function(inResult) {
              return inResult.map((el) => {return {label: el};});}
          }
        ]);
      }, []);

  let components = [];
  if (categories.length > 0)
    components = categories.map((m, idx) => <DataFilterCategory  category={m} postMessage={props.postMessage}/>);
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
