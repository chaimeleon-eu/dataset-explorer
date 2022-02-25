import React, {useMemo, useState, useEffect } from 'react';
import { ListGroup, Button, InputGroup, FormControl, Table as BTable, Container, Row, Col} from 'react-bootstrap';
import { useTable, useRowSelect } from 'react-table';
import { useKeycloak } from '@react-keycloak/web';

import Config from "../config.json";
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


function DatasetStudiesView(props) {
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(Config.defaultLimitStudies);
  const [data, setData] = useState([]);

    let { keycloak } = useKeycloak();
  useEffect(() => {
    if (props.studiesCount != 0 && props.keycloakReady) {
      props.dataManager.getDataset(keycloak.token, props.datasetId, skip, limit)
        .then(
          (xhr) => {
            setData(JSON.parse(xhr.response).studies);
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
          });
      }
  }, [props.keycloakReady, skip, limit, props.studiesCount]);
  const lastPage = Number(props.studiesCount) % Number(limit) === 0 ? 0 : 1;
  let numPages = Math.floor(Number(props.studiesCount) / Number(limit)) + lastPage;
  if (numPages == 0)
    numPages = 1;

  const page = Number(skip) / Number(limit) + 1;
  const columns = useMemo(
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
  return (
    <Container fluid>
      <Row>
          <Col>
            <TableComponent columns={columns} data={data}
            NoDataComponent={NoDataConst} />
          </Col>
      </Row>
      <div className="w-100" >
        <Button className="position-relative me-4" disabled={page == 1 ? true : false}
          onClick={(e) => setSkip(skip - limit)}>Previous</Button>
        <Button className="position-relative me-4"  disabled={page == numPages ? true : false}
          onClick={(e) => setSkip(skip + limit)}>Next</Button>
        <span>Page <b>{page}</b> of <b>{numPages}</b></span>
      </div>
    </Container>);
}

export default DatasetStudiesView;
