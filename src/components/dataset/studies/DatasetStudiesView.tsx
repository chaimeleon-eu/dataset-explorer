import React, {useMemo, useState, useEffect, Fragment, useCallback } from 'react';
import { Table as BTable, Container, Row, Col} from 'react-bootstrap';
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
import TableNoData from '../../TableNoData';
import { useSearchParams } from 'react-router-dom';
import PaginationFooter from '../../PaginationFooter';
import ItemPage from '../../../model/ItemPage';

//const STUDY_VISIBLE_SERIES = 1;

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
          ||  <TableNoData colSpan={columns.length} message="No studies available"></TableNoData>
        }
      </tbody>
    </BTable>
  )
}

function generateSeriesCellView(series: Series[], seriesLimit: number): string {
  return series.map(s => s["folderName"]).slice(0, seriesLimit).join(", ");
}

function generateSeriesCell(series: Series[], seriesLimit: number, onclickCb: Function | null): JSX.Element {
  if (series.length === 0) {
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
  keycloakReady: boolean;
  postMessage: Function;
  dataManager: DataManager;
}

function DatasetStudiesView(props: DatasetStudiesViewProps): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams("");

  let { keycloak } = useKeycloak();
  const [data, setData] = useState<LoadingData<ItemPage<Study>>>({
       loading: false,
       error: null,
       data: null,
       statusCode: -1

  });


  const updSearchParams = useCallback((params: Object) => Util.updSearchParams(params, searchParams, setSearchParams), 
    [searchParams, setSearchParams]);
  const skip = searchParams.get("skip") ? Number(searchParams.get("skip")) : 0;
  const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : Config.defaultLimitStudies;
  const onSkipChange = useCallback((skip: number) => {
    updSearchParams({skip: skip === 0 ? null : skip});
  }, [skip, limit, updSearchParams, searchParams, setSearchParams]);
  useEffect(() => {
    if (props.keycloakReady && keycloak.authenticated) {
        setData( prevValues => {
           return { ...prevValues, loading: true, error: null, data: null, statusCode: -1 }
        });
        props.dataManager.getStudies(keycloak.token, props.datasetId, skip, limit)
          .then(
            (xhr: XMLHttpRequest) => {
              const pagedStudies: ItemPage<Study> = JSON.parse(xhr.response);
              setData( prevValues => {
                return { ...prevValues, loading: false, error: null, data: pagedStudies, statusCode: xhr.status }
              });
            },
            (xhr: XMLHttpRequest) => {
              const error: LoadingError = Util.getErrFromXhr(xhr);
              props.postMessage(new Message(Message.ERROR, error.title, error.text));
              setData( prevValues => {
                return { ...prevValues, loading: false, error,
                  data: null, statusCode: xhr.status }
              });
            });
        }
  }, [props.datasetId, props.keycloakReady, keycloak.authenticated, searchParams, setSearchParams]);
  // const lastPage = Number(props.studiesCount) % Number(limit) === 0 ? 0 : 1;
  // let numPages = Math.floor(Number(props.studiesCount) / Number(limit)) + lastPage;
  // if (numPages === 0)
  //   numPages = 1;

  // const page = Number(skip) / Number(limit) + 1;
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
        Header: 'Size',
        Cell: (propsC: CellProps<any>) => (
          <div className="text-end">
            {Util.formatBytes(propsC.row.original.sizeInBytes) }
          </div>
        )
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
            <TableComponent columns={columns} data={data.data?.list ?? []} />
          </Col>
      </Row>
      
      <div className="d-flex flex-row justify-content-center w-100" >
        <PaginationFooter skip={skip} limit={limit} total={data.data?.total ?? 0} onSkipChange={onSkipChange} />
      </div>
            {/* <div className="w-100" >
        <Button className="position-relative me-4" disabled={page === 1 ? true : false}
          onClick={(e) => setSkip(skip - limit)}>Previous</Button>
        <Button className="position-relative me-4"  disabled={page === numPages ? true : false}
          onClick={(e) => setSkip(skip + limit)}>Next</Button>
        <span>Page <b>{page}</b> of <b>{numPages}</b></span>
      </div> */}
    </Container>);
}

export default DatasetStudiesView;
