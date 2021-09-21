import React from 'react';
import ReactDOM from 'react-dom';
import { Button, InputGroup, FormControl, Table as BTable, Container, Row, Col} from 'react-bootstrap';
import { Search as SearchIc, FilePlus as FilePlusIc } from "react-bootstrap-icons";
import { useTable, useRowSelect } from 'react-table';
import {useState, useEffect} from 'react';

import Message from "../model/Message.js";


const NoDataConst = props => (
  <div>No data.</div>
);

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    )
  }
)


function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, headerGroups, rows, prepareRow,
    selectedFlatRows,
    state: { selectedRowIds } } = useTable({
      columns,
      data,
    },
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        // Let's make a column for selection
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ])
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


const SearchComponent = () => {

  return (
    <InputGroup className="mb-3">
      <FormControl
        placeholder="Dataset search"
        aria-label="Dataset search"
        aria-describedby="basic-addon2"
      />
      <Button variant="outline-secondary" size="sm" id="button-addon2">
        <SearchIc />
      </Button>
    </InputGroup>
  );
}

function DatasetsView (props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);

      //const data = [{name: "A", version: "1.0", created: "2021-08-09Z08:03:0000"}];
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
        useEffect(() => {
          props.dataManager.datasets
            .then(
              (xhr) => {
                setIsLoaded(true);
                setData(JSON.parse(xhr.response));
              },
              (xhr) => {
                setIsLoaded(true);
                console.log(xhr);
                let title = null;
                let text = null;
                if (!xhr.responseText) {
                  title = Message.UNK_ERROR_TITLE;
                  text = Message.UNK_ERROR_MSG;
                } else {
                  const err = JSON.parse(xhr.response);
                    title = err.title;
                    text = err.message;
                }
                props.postMessage(new Message(Message.ERROR, title, text));
              });

        }, []);




      return (
        <Container fluid>
          <Row>
            <Col>
              <div className="float-left">
                <Button size="sm"><FilePlusIc className="mx-1"/>New</Button>
              </div>
            </Col>
            <Col>
              <div className="float-right">
                <SearchComponent />
              </div>
            </Col>
          </Row>
          <Col>
            <Table columns={columns} data={data} NoDataComponent={NoDataConst} />
          </Col>
        </Container>
      );
}

export default DatasetsView;
