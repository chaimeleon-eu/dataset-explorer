import React from "react";
import { useParams } from "react-router-dom";
import { ListGroup, Button, InputGroup, FormControl, Container, Row, Col} from 'react-bootstrap';
import {useState, useEffect} from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { EnvelopeFill, ClipboardPlus } from 'react-bootstrap-icons';

import Message from "../model/Message.js";


function DatasetDetailsView(props) {
  const datasetDetails = props.allValues;
  let { keycloak } = useKeycloak();
  let ageLstItem = <span>-</span>;
  if (datasetDetails.data.ageLow != null && datasetDetails.data.ageHigh != null) {
    ageLstItem = <span>Between {datasetDetails.data.ageLow} {datasetDetails.data.ageUnit[0]} and {datasetDetails.data.ageHigh} {datasetDetails.data.ageUnit[1]}</span>
  } else if (datasetDetails.data.ageLow != null)  {
    ageLstItem = <span>Greater than {datasetDetails.data.ageLow} {datasetDetails.data.ageUnit[0]}</span>
  } else if (datasetDetails.data.ageHigh != null)  {
    ageLstItem = <span>Less than {datasetDetails.data.ageHigh} {datasetDetails.data.ageUnit[1]}</span>

  }

  return(
    <Container fluid>
      <Row>
        <Col>
          <ListGroup>
            {keycloak.authenticated ? (
              <ListGroup.Item><b>Author: </b>
                {datasetDetails.data.authorName}
                <a className="ms-1" href={"mailto:" + datasetDetails.data.authorEmail }>
                  <EnvelopeFill />
                </a>
              </ListGroup.Item>
            ) : (<React.Fragment />)}
            <ListGroup.Item><b>Studies count: </b>{datasetDetails.data.studiesCount}</ListGroup.Item>
            <ListGroup.Item><b>Subjects count: </b>{datasetDetails.data.subjectsCount}</ListGroup.Item>
            <ListGroup.Item><b>Age range: </b>{ageLstItem}</ListGroup.Item>
            <ListGroup.Item><b>Sex: </b>{datasetDetails.data.sex !== null ? datasetDetails.data.sex.join(", ") : "-"}</ListGroup.Item>
            <ListGroup.Item><b>Modality: </b>{datasetDetails.data.modality !== null ? datasetDetails.data.modality.join(", ") : "-"}</ListGroup.Item>
            <ListGroup.Item><b>Body part(s): </b>{datasetDetails.data.bodyPart !== null ? datasetDetails.data.bodyPart.join(", ") : "-"}</ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}

export default DatasetDetailsView;
