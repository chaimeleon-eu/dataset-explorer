import React, {useMemo, useState, useEffect, Fragment } from 'react';
import { Button, Table as BTable, Container, Row, Col} from 'react-bootstrap';
import { CellProps, useTable } from 'react-table';
import type { Column } from 'react-table';
import { useKeycloak } from '@react-keycloak/web';

import Config from "../../../config.json";
import Message from "../../../model/Message";
import LoadingView from "../../LoadingView";
import Series from "../../../model/Series";
import LoadingData from "../../../model/LoadingData";
import LoadingError from "../../../model/LoadingError";
import DataManager from '../../../api/DataManager';
import Study from '../../../model/Study';
import Util from '../../../Util';

const STUDY_VISIBLE_SERIES = 1;

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
                    <td {...cell.getCellProps({className: "word-wrap"})}>
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
            )
          }) ) 
          ||  <span>No studies available</span>
        }
      </tbody>
    </BTable>
  )
}

function generateSeriesCellView(series: Series[], seriesLimit: number): string {
  return series.map(s => s["folderName"]).slice(0, seriesLimit).join(", ");
}

function generateSeriesCell(series: Series[], seriesLimit: number, onclickCb: Function | null): JSX.Element {
  if (series.length == 0) {
    return <Fragment />;
  }

 //  { generateSeriesCellView(row.original.series, row.original.visibleSeriesLimit) }
 //  { (row.original.visibleSeriesLimit > STUDY_VISIBLE_SERIES ? <Button size="sm" variant="link" >...>></Button> :
 //    ( row.original.visibleSeriesLimit == row.original.series.length ? )
 // ) }
  return (<>{generateSeriesCellView(series, seriesLimit)}</>);
}

interface DatasetStudiesViewProps {
  datasetId: string;
  studiesCount: number;
  keycloakReady: boolean;
  postMessage: Function;
  dataManager: DataManager;
}

function DatasetStudiesView(props: DatasetStudiesViewProps): JSX.Element {
  const [skip, setSkip] = useState<number>(0);
  const [limit] = useState<number>(Config.defaultLimitStudies);
  const [data, setData] = useState<LoadingData<Study[]>>({
       loading: false,
       error: null,
       data: [],
       statusCode: -1

  });

    let { keycloak } = useKeycloak();
  useEffect(() => {
    if (props.studiesCount != 0) {
      setData( prevValues => {
         return { ...prevValues, loading: true, error: null, data: [], statusCode: -1 }
      });
      if (props.keycloakReady && keycloak.authenticated) {
        props.dataManager.getStudies(keycloak.token, props.datasetId, skip, limit)
          .then(
            (xhr: XMLHttpRequest) => {
              let studies = JSON.parse(xhr.response).list;
              for (let study of studies) {
                  study.visibleSeriesLimit = STUDY_VISIBLE_SERIES;
              }
              setData( prevValues => {
                return { ...prevValues, loading: false, error: null, data: studies, statusCode: xhr.status }
              });
            },
            (xhr: XMLHttpRequest) => {
              const error: LoadingError = Util.getErrFromXhr(xhr);
              setData( prevValues => {
                return { ...prevValues, loading: false, error,
                  data: [], statusCode: xhr.status }
              });
              props.postMessage(new Message(Message.ERROR, error.title, error.text));
            });
        }
      }
  }, [props.keycloakReady, keycloak.authenticated, skip, limit, props.studiesCount]);
  const lastPage = Number(props.studiesCount) % Number(limit) === 0 ? 0 : 1;
  let numPages = Math.floor(Number(props.studiesCount) / Number(limit)) + lastPage;
  if (numPages === 0)
    numPages = 1;

  const page = Number(skip) / Number(limit) + 1;
  const columns = useMemo(
    () => [

      {
        Header: 'Study ID',
        Cell: (propsC: CellProps<any>) => (
          <Container fluid>
            <a href={ propsC.row.original.url }>{propsC.row.original.studyId}</a>
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
      },
      {
        Header: 'Series',
        Cell: (propsC: CellProps<any>) => (
          <Container fluid>
            { generateSeriesCell(propsC.row.original.series, propsC.row.original.series.length, null) }
          </Container>
        )
      }

    ], [data.data]);

    if (data.loading) {
      return <LoadingView what="studies" />;
    }
  return (
    <Container fluid>
      <Row>
          <Col>
            <TableComponent columns={columns} data={data.data ?? []} />
          </Col>
      </Row>
      <div className="w-100" >
        <Button className="position-relative me-4" disabled={page === 1 ? true : false}
          onClick={(e) => setSkip(skip - limit)}>Previous</Button>
        <Button className="position-relative me-4"  disabled={page === numPages ? true : false}
          onClick={(e) => setSkip(skip + limit)}>Next</Button>
        <span>Page <b>{page}</b> of <b>{numPages}</b></span>
      </div>
    </Container>);
}

export default DatasetStudiesView;
