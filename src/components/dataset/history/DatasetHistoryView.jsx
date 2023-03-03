import { useState, useMemo, useEffect, useCallback } from "react";
import { ListGroup, Button, InputGroup, FormControl, Table as BTable, Container, Row, Col} from 'react-bootstrap';
import { useTable, useRowSelect } from 'react-table';
import { useKeycloak } from '@react-keycloak/web';
import {
  useSearchParams,
} from 'react-router-dom';

import Message from "../../../model/Message";
import DataFilterView from "./DataFilterView";
import LoadingView from "../../LoadingView";
import Config from "../../../config.json";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const defSkip = searchParams.get("skipStudies");
  const defLimit = searchParams.get("limitStudies");
  const skip = defSkip === null ? 0 : Number(defSkip);
  const limit = defLimit === null ? Config.defaultLimitTraces : Number(defLimit);

  const [data, setData] = useState({
    isLoading: false,
    isLoaded: false,
    traces: [],
    tracesFiltered: [],
    totalTracesCnt: 0,
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
  const handlePostMsg = useCallback((msgType, title, text) => {
    props.postMessage(new Message(msgType, title, text));
  }, []);
  //console.log(keycloak);
    useEffect(() => {
        setData( prevValues => {
          return { ...prevValues, isLoaded: false, isLoading: true, status: -1, error: null }
          });
        if (props.keycloakReady && keycloak.authenticated) {
          props.dataManager.getTracesDataset(keycloak.token, props.datasetId, skip, limit)
            .then(
              (xhr) => {
                let totalTracesCnt = 0;
                let traces  = [];
                const rawTraces = JSON.parse(xhr.response).traces;
                for (let rt of rawTraces) {
                  console.log(rt.countAllTraces);
                  if (rt.countAllTraces !== undefined)
                    totalTracesCnt += rt.countAllTraces;
                  for (let t of rt.traces) {
                      let d = new Date(t.timestamp);
                      //console.log(t.timestamp);
                      //d.setUTCMilliseconds(t.timestamp);
                      traces.push({blockchain: rt.blockchain, action: t.userAction, user: t.userId,
                        created: d, details: t.details});
                  }
                }
                traces.sort((a,b) => b.created - a.created);
                setData( prevValues => {
                    return { ...prevValues, totalTracesCnt, isLoaded: true, traces: traces, isLoading: false, status: xhr.status, error: null }
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
                handlePostMsg(Message.ERROR, title, text);
                setData( prevValues => {
                   return { ...prevValues, totalTracesCnt: 0,  isLoaded: true, traces: [], isLoading: false,
                      status: xhr.status, error: text }
                   });
              });
            }

    }, //1000);},
    [props.keycloakReady, keycloak.authenticated, searchParams]);

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
      },
      {
        Header: 'Details',
        accessor: 'details'
      }
    ]);
    if (data.isLoading) {
      return <LoadingView what="dataset history" />;
    }
    const lastPage = Number(data.totalTracesCnt) % Number(limit) === 0 ? 0 : 1;
    let numPages = Math.floor(Number(data.totalTracesCnt) / Number(limit)) + lastPage;
    if (numPages === 0)
      numPages = 1;
  
    const page = Number(skip) / Number(limit) + 1;
    return (
        <Container fluid>
          <Row>
            <Col lg={3} md={12}>
              {/* <DataFilterView traces={data.traces} updFilteredData={updFilteredData} 
                keycloakReady={props.keycloakReady} dataManager={props.dataManager} 
                postMessage={props.postMessage}/> */}
            </Col>
            <Col lg={9} md={12} className="d-flex flex-column">
              <TableComponent columns={columns} data={data.tracesFiltered} NoDataComponent={NoDataConst} />
              <div className="w-100  d-flex  justify-content-center align-self-end" >
                <Button className="position-relative me-4" disabled={page === 1 ? true : false}
                  onClick={(e) => {
                    setSearchParams(prevValues => {
                      return { ...prevValues, 
                      skipStudies: (skip - limit),
                      limitStudies: limit };
                      });
                    // setSkipLimit(prevValues => {
                    //   return { ...prevValues, skip, limit };
                    // });
                  }
                  }>Previous</Button>
                <Button className="position-relative me-4"  disabled={page === numPages ? true : false}
                  onClick={(e) => {
                    setSearchParams(prevValues => {
                      return { ...prevValues, 
                      skipStudies: (skip + limit),
                      limitStudies: limit };
                      });
                    // setSkipLimit(prevValues => {
                    //   return { ...prevValues, skip, limit };
                    // });
                  }
                    }>Next</Button>
                <span>Page <b>{page}</b> of <b>{numPages}</b></span>
              </div>
            </Col>
          </Row>
        </Container>
    );

}

export default DatasetHistoryView;
