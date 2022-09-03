import { useState, useMemo, useEffect } from "react";
import { ListGroup, Button, InputGroup, FormControl, Table as BTable, Container, Row, Col} from 'react-bootstrap';
import { useTable, useRowSelect } from 'react-table';
import { useKeycloak } from '@react-keycloak/web';

import Message from "../model/Message.js";
import DataFilterView from "./DataFilterView.js";
import LoadingView from "./LoadingView";

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


function DatasetHistoryView(props) {



  const [data, setData] = useState({
    isLoading: false,
    isLoaded: false,
    traces: [],
    tracesFiltered: [],
    error: null,
    status: -1
  });

    const updFilteredData = (tracesFiltered) => {
      setData( prevValues => {
        return { ...prevValues, tracesFiltered};
      });
    }

  // [
  //   {
  //     "action": "CREATE_NEW_DATASET",
  //     "user": props.author,
  //     "actionDate": props.actionDate
  //   }
  // ];
  let { keycloak } = useKeycloak();

  //console.log(keycloak);
    useEffect(() => {
        setData( prevValues => {
           return { ...prevValues, isLoaded: false, isLoading: true, status: -1, error: null }
           });
        if (props.keycloakReady && keycloak.authenticated) {

              props.dataManager.getTracesDataset(keycloak.token, props.datasetId)
                .then(
                  (xhr) => {
                    let traces  = [];
                    const rawTraces = JSON.parse(xhr.response).traces;
                    for (let rt of rawTraces) {
                      for (let t of rt.traces) {
                          let d = new Date(t.timestamp);
                          //console.log(t.timestamp);
                          //d.setUTCMilliseconds(t.timestamp);
                          traces.push({blockchain: rt.blockchain, action: t.userAction, user: t.userId,
                            created: d});
                      }
                    }
                    traces.sort((a,b) => b.created - a.created);
                    setData( prevValues => {
                       return { ...prevValues, isLoaded: true, traces: traces, isLoading: false, status: xhr.status, error: null }
                       });
                  },
                  (xhr) => {
                    let title = null;
                    let text = null;
                    if (!xhr.responseText) {
                      title = Message.UNK_ERROR_TITLE;
                      text = Message.UNK_ERROR_MSG;
                    } else {
                      if (xhr.responseType == "text") {
                        title = "History Error";
                        text = xhr.response;

                      } else {
                        const err = JSON.parse(xhr.response);
                          title = err.title;
                          text = err.message;
                      }
                    }
                    setData( prevValues => {
                       return { ...prevValues, isLoaded: true, traces: [], isLoading: false,
                          status: xhr.status, error: text }
                       });
                    props.postMessage(new Message(Message.ERROR, title, text));
                  });
            }

    }, //1000);},
    [props.keycloakReady, keycloak.authenticated]);

  const columns = useMemo(
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
        Header: 'Blockchain',
        accessor: 'blockchain'
      }
      ,
      {
        Header: 'Created',
        Cell: ({ row }) => (
            new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'long' })
              .format(row.original["created"])
            )
      }
    ]);
    if (data.isLoading) {
      return <LoadingView what="dataset history" />;
    }
    return (
        <Container fluid>
          <Row>
            <Col lg={3} md={12}>
              <DataFilterView traces={data.traces} updFilteredData={updFilteredData} keycloakReady={props.keycloakReady} dataManager={props.dataManager} postMessage={props.postMessage}/>
            </Col>
            <Col lg={9} md={12}><TableComponent columns={columns} data={data.tracesFiltered} NoDataComponent={NoDataConst} /></Col>
          </Row>
        </Container>
    );

}

export default DatasetHistoryView;
