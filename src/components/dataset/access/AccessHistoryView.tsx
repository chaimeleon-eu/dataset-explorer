import React, {useMemo, useState, useEffect, useCallback } from 'react';
import { Table as BTable, Container, Row, Col} from 'react-bootstrap';
import { CellProps, Column, useTable } from 'react-table';
import { useKeycloak } from '@react-keycloak/web';
import { useSearchParams } from "react-router-dom";

import Config from "../../../config.json";
import Message from "../../../model/Message";
import LoadingView from "../../LoadingView";
import Util from '../../../Util';
import type AccessHistory from "../../../model/AccessHistory";
import type ItemPage from "../../../model/ItemPage";
import DataManager from '../../../api/DataManager';
import PaginationFooter from '../../PaginationFooter';
import LoadingData from '../../../model/LoadingData';
import TableNoData from "../../TableNoData";

interface TableComponentProps {

  columns: Array<Column<any>>;
  data: Array<any>;
}

function TableComponent({ columns, data }: TableComponentProps): JSX.Element {
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
          ( 
            rows.length > 0 && rows.map((row, i) => {
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
            }) 
          ) ||  <TableNoData colSpan={columns.length} message="No access history data available"></TableNoData>
        }
      </tbody>
    </BTable>
  )
}

function getLongType(shortT: string | null | undefined): string {
  switch (shortT) {
    case "i": return "interactive";
    case "b": return "batch";
    default: return "unknown";
  }
}

interface AccessHistoryViewProps {
  datasetId: string;
  keycloakReady: boolean;
  dataManager: DataManager;
  postMessage: Function;

}


function AccessHistoryView(props: AccessHistoryViewProps): JSX.Element {
    const [searchParams, setSearchParams] = useSearchParams("");
    let { keycloak } = useKeycloak();
    const [data, setData] = useState<LoadingData<ItemPage<AccessHistory>>>({
      statusCode: -1,
       loading: false,
       error: null,
       data: {
        total: 0,
        returned: 0,
        skipped: 0,
        limit: 0,
        list: []
       }

    });
    const updSearchParams = useCallback((params: Object) => Util.updSearchParams(params, searchParams, setSearchParams), [searchParams, setSearchParams]);
    const skip = searchParams.get("skip") ? Number(searchParams.get("skip")) : 0;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : Config.defaultLimitAccess;
  
    const onSkipChange = useCallback((skip: number) => {
      updSearchParams({skip: skip === 0 ? null : skip});
    }, [skip, limit, updSearchParams, searchParams, setSearchParams]);

  useEffect(() => {
      if (props.keycloakReady && keycloak.authenticated) {
        setData( prevValues => {
           return { ...prevValues, loading: true, error: null, data: null, statusCode: -1 }
        });
        props.dataManager.getDatasetAccessHistory(keycloak.token, props.datasetId, skip, limit)
          .then(
            (xhr: XMLHttpRequest) => {
              let  data = JSON.parse(xhr.response);
              for (let idx = 0; idx < data.list.length; ++idx) {
                if (data.list[idx]["creationTime"] && data.list[idx]["creationTime"].length > 0) {
                  data.list[idx]["creationTime"] = new Date(data.list[idx]["creationTime"]);
                } else {
                  data.list[idx]["creationTime"] = null;
                }
                if (data.list[idx]["startTime"] && data.list[idx]["startTime"].length > 0) {
                  data.list[idx]["startTime"] = new Date(data.list[idx]["startTime"]);
                } else {
                  data.list[idx]["startTime"] = null;
                }
                if (data.list[idx]["endTime"] && data.list[idx]["endTime"].length > 0) {
                  data.list[idx]["endTime"] = new Date(data.list[idx]["endTime"]);
                } else {
                  data.list[idx]["endTime"] = null;
                }
              }
              setData( prevValues => {
                return { ...prevValues, loading: false, error: null, data, statusCode: xhr.status }
              });
            },
            (xhr: XMLHttpRequest) => {
                const error = Util.getErrFromXhr(xhr);
                props.postMessage(new Message(Message.ERROR, error.title, error.text));
                setData( prevValues => {
                    return { ...prevValues, loading: false, error, data: null, statusCode: xhr.status}
                });
            });
        }
  }, [props.keycloakReady, props.datasetId, keycloak.authenticated, searchParams, setSearchParams]);
  const columns = useMemo(
    () => [
      {
        Header: 'Created',
        Cell: ({ row }: CellProps<any>) => (
          row.original["creationTime"] ?
            new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'long' })
              .format(row.original["creationTime"])
              : ""
            )
      },
      {
        Header: 'User',
        accessor: 'username'
      },
      {
        Header: 'Type',
        Cell: ({ row }: CellProps<any>) => (getLongType(row.original["accessType"]))
      },
      {
        Header: 'Tool',
        Cell: ({ row }: CellProps<any>) => (`${row.original["toolName"]} (${row.original["toolVersion"]})`)
      },
      {
        Header: 'Image',
        accessor: 'image'
      },
      {
        Header: 'Resources',
        accessor: 'resourcesFlavor'
      },
      {
        Header: 'Start',
        Cell: ({ row }: CellProps<any>) => (
          row.original["startTime"] ?
            new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'long' })
              .format(row.original["startTime"])
            : ""
            )
      },
      {
        Header: 'End',
        Cell: ({ row }: CellProps<any>) => (
          row.original["endTime"] ?
            new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'long' })
              .format(row.original["endTime"])
              : ""
            )
      },
      {
        Header: 'Exec time (h:m:s)',
        Cell: ({ row }: CellProps<any>) => (
          row.original["endTime"] && row.original["startTime"] ?
            Util.msToTime(Math.abs(row.original["endTime"] - row.original["startTime"]))
            :  ""
          )
      },
      {
        Header: 'End Status',
        accessor: 'endStatus'
      },
      {
        Header: 'Job Type',
        accessor: 'openchallengeJobType'
      },
      {
        Header: 'Command',
        accessor: 'cmdLine'
      }


    ], [data.data]);

    if (data.loading) {
      return <LoadingView what="access history list" />;
    }
  return (
    <Container fluid>
      <Row>
          <Col>
            <TableComponent columns={columns} data={data.data?.list ?? []} />
          </Col>
      </Row>
      <div className="d-flex flex-row justify-content-center w-100" >
        <PaginationFooter skip={skip} limit={limit} total={data.data?.total ?? 0} onSkipChange={onSkipChange} />
      </div>
    </Container>);
}

export default AccessHistoryView;