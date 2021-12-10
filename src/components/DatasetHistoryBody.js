import React from "react";
import { ListGroup, Button, InputGroup, FormControl, Table as BTable, Container, Row, Col} from 'react-bootstrap';
import { useTable, useRowSelect } from 'react-table';
import {useState, useEffect} from 'react';
import { useKeycloak } from '@react-keycloak/web';

import Message from "../model/Message.js";
import DataFilterView from "./DataFilterView.js";

const NoDataConst = props => (
  <div>No data.</div>
);

function TableComponent({ columns, data }) {
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
                  <td {...cell.getCellProps()}>
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


function DatasetHistoryBody(props) {
  const data = [
    {
      "action": "CREATE_NEW_DATASET",
      "user": props.author,
      "actionDate": props.actionDate
    }
  ];
  const columns = React.useMemo(
    () => [
      {
        Header: 'Action',
        accessor: 'action'
      },
      {
        Header: 'User',
        accessor: 'user'
      },
      {
        Header: 'Action Date',
        Cell: ({ row }) => (
            new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'long' })
              .format(Date.parse(row.original["actionDate"]))
          )
      }
    ]);
      return (
          <Container fluid>
            <Row>
              <Col lg={3} md={12}>
                <DataFilterView dataManager={props.dataManager} postMessage={props.postMessage}/>
              </Col>
              <Col lg={9} md={12}><TableComponent columns={columns} data={data} NoDataComponent={NoDataConst} /></Col>
            </Row>
          </Container>
      );

}

export default DatasetHistoryBody;
