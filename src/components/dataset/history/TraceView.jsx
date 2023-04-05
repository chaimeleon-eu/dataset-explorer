import React from 'react';
import ReactDOM from 'react-dom';
import {Container, Row, Col,Table as BTable} from "react-bootstrap";
import { Search as SearchIc, FilePlus as FilePlusIc } from "react-bootstrap-icons";
import { useTable, useRowSelect } from 'react-table';

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


function TraceView(props) {
  const data = [];
  const columns = React.useMemo(
    () => [
      {
        Header: 'Dataset',
        accessor: 'dataset'
      },
      {
        Header: 'Version',
        accessor: 'version'
      },
      {
        Header: 'Created',
        accessor: 'created'
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

export default TraceView;
