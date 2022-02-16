import React, {useMemo} from 'react';
import { ListGroup, Button, InputGroup, FormControl, Table as BTable, Container, Row, Col} from 'react-bootstrap';
import { useTable, useRowSelect } from 'react-table';

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
        <TableComponent columns={columns} data={props.allValues.data.studies}
        NoDataComponent={NoDataConst} />
          </Col>
      </Row>
    </Container>);
}

export default DatasetStudiesView;
