import React, {useMemo, useState, useEffect, Fragment } from 'react';
import { ListGroup, Button, InputGroup, FormControl, Table as BTable, Container, Row, Col} from 'react-bootstrap';
import { useTable, useRowSelect } from 'react-table';
import { useKeycloak } from '@react-keycloak/web';

import Config from "../config.json";
import Message from "../model/Message";
import LoadingView from "./LoadingView";

const STUDY_VISIBLE_SERIES = 1;

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

function generateSeriesCellView(series, seriesLimit) {
  return series.slice(0, seriesLimit).join(", ");
}

function generateSeriesCell(series, seriesLimit, onclickCb) {
  if (series.length == 0) {
    return <Fragment />;
  }

 //  { generateSeriesCellView(row.original.series, row.original.visibleSeriesLimit) }
 //  { (row.original.visibleSeriesLimit > STUDY_VISIBLE_SERIES ? <Button size="sm" variant="link" >...>></Button> :
 //    ( row.original.visibleSeriesLimit == row.original.series.length ? )
 // ) }
  return (generateSeriesCellView(series, seriesLimit));
}


function DatasetStudiesView(props) {
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(Config.defaultLimitStudies);
  const [data, setData] = useState({
       isLoaded: false,
       isLoading: false,
       error: null,
       data: [],
       status: -1

  });

    let { keycloak } = useKeycloak();
  useEffect(() => {
    if (props.studiesCount != 0) {
      setData( prevValues => {
         return { ...prevValues, isLoading: true, isLoaded: false, error: null,
           data: [], status: -1 }
      });
      props.dataManager.getDataset(keycloak.token, props.datasetId, skip, limit)
        .then(
          (xhr) => {
            let studies = JSON.parse(xhr.response).studies;
            for (let study of studies) {
                study.visibleSeriesLimit = STUDY_VISIBLE_SERIES;
            }
            setData( prevValues => {
               return { ...prevValues, isLoading: false, isLoaded: true, error: null,
                 data: JSON.parse(xhr.response).studies, status: xhr.status }
            });
          },
          (xhr) => {
            //setIsLoaded(true);
            let title = null;
            let text = null;
            if (!xhr.responseText) {
              if (xhr.statusText !== undefined && xhr.statusText !== null) {
                  title = xhr.statusText;
                  text = "Error loading data from " + xhr.responseURL;
              } else {
                title = Message.UNK_ERROR_TITLE;
                text =  "Error loading data from " + xhr.responseURL;
              }
            } else {
              const err = JSON.parse(xhr.response);
                title = err.title;
                text = err.message;
            }
            setData( prevValues => {
               return { ...prevValues, isLoading: false, isLoaded: true, error: text,
                 data: [], status: xhr.status }
            });
            props.postMessage(new Message(Message.ERROR, title, text));
          });
      }
  }, [props.keycloakReady, skip, limit, props.studiesCount]);
  const lastPage = Number(props.studiesCount) % Number(limit) === 0 ? 0 : 1;
  let numPages = Math.floor(Number(props.studiesCount) / Number(limit)) + lastPage;
  if (numPages == 0)
    numPages = 1;

  const page = Number(skip) / Number(limit) + 1;
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
      },
      {
        Header: 'Series',
        Cell: ({ row }) => (
          <Container fluid>
            { generateSeriesCell(row.original.series, row.original.series.length, null) }
          </Container>
        )
      }

    ], [data.data]);

    if (data.isLoading) {
      return <LoadingView what="studies" />;
    }
  return (
    <Container fluid>
      <Row>
          <Col>
            <TableComponent columns={columns} data={data.data}
            NoDataComponent={NoDataConst} />
          </Col>
      </Row>
      <div className="w-100" >
        <Button className="position-relative me-4" disabled={page == 1 ? true : false}
          onClick={(e) => setSkip(skip - limit)}>Previous</Button>
        <Button className="position-relative me-4"  disabled={page == numPages ? true : false}
          onClick={(e) => setSkip(skip + limit)}>Next</Button>
        <span>Page <b>{page}</b> of <b>{numPages}</b></span>
      </div>
    </Container>);
}

export default DatasetStudiesView;
