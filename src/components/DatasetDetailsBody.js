import React from "react";
import { ListGroup, Button, InputGroup, FormControl, Table as BTable, Container, Row, Col} from 'react-bootstrap';
import { useTable, useRowSelect } from 'react-table';
import {useState, useEffect} from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { EnvelopeFill, ClipboardPlus } from 'react-bootstrap-icons';

import Message from "../model/Message.js";

const NoDataConst = props => (
  <div>No data.</div>
);

const defaultPropGetter = () => ({});

function TableComponent({ columns, data,
  getColumnProps = defaultPropGetter,
  getCellProps = defaultPropGetter }) {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
      columns,
      data,
    }
  );

  // Render the UI for your table
  return (
    <BTable striped bordered hover size="sm" {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <td {...cell.getCellProps({className: "word-wrap"})}>
                    {cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </BTable>
  )
}

function DatasetDetailsBody(props) {
  const datasetId = props.datasetId;
  const [allValues, setAllValues] = useState({
       isLoaded: false,
       error: false,
       data: null
    });
  // const [isLoaded, setIsLoaded] = useState(false);
  // const [error, setError] = useState(false);
  // const [data, setData] = useState(null);

  let { keycloak } = useKeycloak();
  useEffect(() => {
    props.dataManager.getDataset(keycloak.token, datasetId)
      .then(
        (xhr) => {
          setAllValues( prevValues => {
             return { ...prevValues, isLoaded: true, data: JSON.parse(xhr.response)}
          });
          // setIsLoaded(true);
          // setData(JSON.parse(xhr.response));
        },
        (xhr) => {
          //setIsLoaded(true);
          let title = null;
          let text = null;
          if (!xhr.responseText) {
            if (xhr.statusText !== undefined && xhr.statusText !== null) {
                title = xhr.statusText;
                text = "Error loading data from " + xhr.responseURL;
            } else {
              title = Message.UNK_ERROR_TITLE;
              text =  "Error loading data from " + xhr.responseURL;
            }
          } else {
            const err = JSON.parse(xhr.response);
              title = err.title;
              text = err.message;
          }
          props.postMessage(new Message(Message.ERROR, title, text));
            setAllValues( prevValues => {
               return { ...prevValues, isLoaded: true, error: true}
            });
          // setError(true);
          // console.log("here");
        });

  }, []);
  const columns = React.useMemo(
    () => [

      {
        Header: 'Study ID',
        Cell: ({ row }) => (
          <Container fluid>
            <a href={ row.original.url }>{row.original.studyId}</a>
          </Container>
        )
      },
      {
        Header: 'Study Name',
        accessor: 'studyName'
      },
      {
        Header: 'Subject',
        accessor: 'subjectName'
      }

    ]);
    // ,
    // {
    //   Header: 'Mount Path',
    //   accessor: 'path',
    //   Cell: ({ cell: { value } }) => (
    //     <Container fluid bsstyle="default" style={{width: "10em", maxWidth:"10em", overflowWrap: "break-word"}}>
    //       { value }
    //     </Container>
    //   )
    // }
  // let studiesByPatient = new Map();
  // studies.map(e => {
  //   let st = studiesByPatient.get(e.subjectName)
  //   if (st === undefined) {
  //     st = [];
  //     studiesByPatient.set(e.subjectName, st);
  //   }
  //   st.push(e.studyName);
  // });
  // let data = [];
  // for (const [k, v] of studiesByPatient) {
  //   data.push({
  //     "subject": k,
  //     "studies": v
  //   })
  // }
  // const columns = React.useMemo(
  //   () => [
  //     {
  //       Header: 'Subject',
  //       accessor: 'subject'
  //     },
  //     {
  //       Header: 'Studies',
  //       accessor: 'studies',
  //       Cell: ({ cell: { value } }) => (
  //         <Container fluid>
  //           {value.map((v) => (<span className="badge rounded-pill bg-secondary m-1">{v}</span>))}
  //         </Container>
  //       )
  //     }
  //   ]);
  useEffect(() => {
    if (allValues.error === true) {
      props.onDialogDetailsClose();
    }
  }, [allValues.error]);
  if (!allValues.isLoaded) {
    return <div>loading...</div>
  }
  if (allValues.error === true) {
    return <div></div>
  }
  return(
    <Container fluid>
      <Row>
        <Col xs={4}>
          <ListGroup variant="flush">
            <ListGroup.Item><b>ID: </b>
              {allValues.data.id}
              <Button variant="link" className="m-0 ms-1 p-0" onClick={() =>
                  {navigator.clipboard.writeText(allValues.data.id).then(function() {
                    console.log('Async: Copying to clipboard was successful!');
                  }, function(err) {
                    console.error('Async: Could not copy text: ', err);
                  });}} >
                <ClipboardPlus />
              </Button>
            </ListGroup.Item>
            <ListGroup.Item><b>Name: </b>{allValues.data.name}</ListGroup.Item>
            <ListGroup.Item><b>Author: </b>
              {allValues.data.authorName}
              <a className="ms-1" href={"mailto:" + allValues.data.authorEmail }>
                <EnvelopeFill />
              </a>
            </ListGroup.Item>
            <ListGroup.Item><b>Created: </b>{new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'long' })
                  .format(Date.parse(allValues.data.creationDate))}</ListGroup.Item>
            <ListGroup.Item><b>Description: </b>{allValues.data.description}</ListGroup.Item>
            <ListGroup.Item><b>Public: </b>{allValues.data.public ? "YES" : "NO"}</ListGroup.Item>
            <ListGroup.Item><b>Studies count: </b>{allValues.data.studiesCount}</ListGroup.Item>
            <ListGroup.Item><b>Patients count: </b>{allValues.data.patientsCount}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col xs={8}>
          <TableComponent columns={columns} data={allValues.data.studies}
          NoDataComponent={NoDataConst} />
        </Col>
      </Row>
    </Container>
  );
}

export default DatasetDetailsBody;
