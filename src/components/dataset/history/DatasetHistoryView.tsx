import { useState, useMemo, useEffect } from "react";
import { Button, Table as BTable, Container, Row, Col} from 'react-bootstrap';
import React, { CellProps, useTable } from 'react-table';
import type { Column } from 'react-table';
import { useKeycloak } from '@react-keycloak/web';
import {
  useSearchParams,
} from 'react-router-dom';

import Message from "../../../model/Message";
import DataFilterView from "./DataFilterView";
import LoadingView from "../../LoadingView";
import Config from "../../../config.json";
import LoadingData from "../../../model/LoadingData";
import DataManager from "../../../api/DataManager";
import Util from "../../../Util";
import TraceTable from "../../../model/TraceTable";
import RespTraces from "../../../model/RespTraces";
import TracesBCPaginated from "../../../model/TracesBCPaginated";
import LoadingError from "../../../model/LoadingError";
import TableNoData from "../../TableNoData";

class LoadingTraces extends LoadingData<TraceTable[]> {
  tracesFiltered: TraceTable[];
  totalTracesCnt: number;
}

interface TableComponentProps<TData extends object> {

  columns: Array<Column<TData>>;
  data: Array<TData>;
}

function TableComponent({ columns, data }: TableComponentProps<any>): JSX.Element {
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
        {
        ( rows.length > 0 && rows.map((row, i) => {
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
        })
        ) || <TableNoData colSpan={columns.length} message="No history data available"></TableNoData>      
      }
      </tbody>
    </BTable>
  )
}

interface DatasetHistoryViewProps {
  datasetId: string;
  keycloakReady: boolean;
  postMessage: Function;
  dataManager: DataManager;

}


function DatasetHistoryView(props: DatasetHistoryViewProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const defSkip = searchParams.get("skipStudies");
  const defLimit = searchParams.get("limitStudies");
  const skip = defSkip === null ? 0 : Number(defSkip);
  const limit = defLimit === null ? Config.defaultLimitTraces : Number(defLimit);

  const [data, setData] = useState<LoadingTraces>({
    loading: false,
    data: [],
    tracesFiltered: [],
    totalTracesCnt: 0,
    error: null,
    statusCode: -1
  });

    const updFilteredData = (tracesFiltered: LoadingTraces) => {
      setData( (prevValues: LoadingTraces) => {
        return { ...prevValues, ...tracesFiltered};
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
          setData( prevValues => {
              return { ...prevValues, loading: true }
              });
          props.dataManager.getTracesDataset(keycloak.token, props.datasetId, skip, limit)
            .then(
              (xhr: XMLHttpRequest) => {
                let totalTracesCnt = 0;
                let traces: TraceTable[]  = [];
                const resp: RespTraces | undefined = JSON.parse(xhr.response);
                const rawTraces: TracesBCPaginated[] | undefined = resp?.traces;
                console.log(rawTraces);
                if (rawTraces) {
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
                  traces.sort((a,b) => b.created.getTime() - a.created.getTime());
                  setData( prevValues => {
                      return { ...prevValues, totalTracesCnt, loading: false, traces: traces, statusCode: xhr.status, error: null }
                      });
                }
              },
              (xhr: XMLHttpRequest) => {
                const error: LoadingError = Util.getErrFromXhr(xhr);
                setData( prevValues => {
                   return { ...prevValues, totalTracesCnt: 0, traces: [], loading: false,
                    statusCode: xhr.status, error }
                   });
                   props.postMessage(new Message(Message.ERROR, error.title, error.text));
              });
            }

    }, //1000);},
    [props.keycloakReady, keycloak.authenticated, searchParams]);

  const columns: Column<any>[] = useMemo(
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
        accessor: "",
        Cell: (propsC: CellProps<any>) => (
            new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'long' })
              .format(propsC.row.original["created"])
            )
      },
      {
        Header: 'Details',
        accessor: 'details' as const
      }
    ], []);
    if (data.loading) {
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
              <DataFilterView traces={data.data ?? []} updFilteredData={updFilteredData} 
                 dataManager={props.dataManager} 
                postMessage={props.postMessage}/>
            </Col>
            <Col lg={9} md={12} className="d-flex flex-column">
              <TableComponent columns={columns} data={data.tracesFiltered} />
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
