import { Link } from "react-router-dom";
import { Badge, Button, Table as BTable } from 'react-bootstrap';
import { ClipboardPlus, ArrowDownUp, CaretDownFill, CaretUpFill, CheckCircleFill, XCircleFill } from "react-bootstrap-icons";
import { useTable, useRowSelect, useFilters, useGlobalFilter, useSortBy } from 'react-table';
import React, { Fragment, useMemo, useState } from 'react';
import {matchSorter} from 'match-sorter';
import PropTypes from "prop-types";

import Dialog from "./Dialog";

/* eslint react/prop-types: 0 */

const NoDataConst = () => (
  <div>No data.</div>
);

// const IndeterminateCheckbox = forwardRef(
//   ({ indeterminate, ...rest }, ref) => {
//     const defaultRef = useRef()
//     const resolvedRef = ref || defaultRef

//     useEffect(() => {
//       resolvedRef.current.indeterminate = indeterminate
//     }, [resolvedRef, indeterminate])

//     return (
//       <>
//         <input type="checkbox" ref={resolvedRef} {...rest} />
//       </>
//     )
//   }
// )

// Define a default UI for filtering
// function GlobalFilter({
//   preGlobalFilteredRows,
//   globalFilter,
//   setGlobalFilter,
// }) {
//   const count = preGlobalFilteredRows.length
//   const [value, setValue] = useState(globalFilter)
//   const onChange = useAsyncDebounce(value => {
//     setGlobalFilter(value || undefined)
//   }, 200)

//   return (
//     <span>
//       Search:{' '}
//       <input
//         value={value || ""}
//         onChange={e => {
//           setValue(e.target.value);
//           onChange(e.target.value);
//         }}
//         placeholder={`${count} records...`}
//         style={{
//           fontSize: '1.1rem',
//           border: '0',
//         }}
//       />
//     </span>
//   )
// }

// Define a default UI for filtering
DefaultColumnFilter.propTypes = {
  column: PropTypes.object
}

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

// This is a custom filter UI for selecting
// a unique option from a list
SelectColumnFilter.propTypes = {
  column: PropTypes.object
}

function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

// This is a custom filter UI that uses a
// slider to set the filter value between a column's
// min and max values
SliderColumnFilter.propTypes = {
  column: PropTypes.object
}

function SliderColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the min and max
  // using the preFilteredRows

  const [min, max] = useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    preFilteredRows.forEach(row => {
      min = Math.min(row.values[id], min)
      max = Math.max(row.values[id], max)
    })
    return [min, max]
  }, [id, preFilteredRows])

  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        value={filterValue || min}
        onChange={e => {
          setFilter(parseInt(e.target.value, 10))
        }}
      />
      <button onClick={() => setFilter(undefined)}>Off</button>
    </>
  )
}

// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
NumberRangeColumnFilter.propTypes = {
  column: PropTypes.object
}

function NumberRangeColumnFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) {
  const [min, max] = useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    preFilteredRows.forEach(row => {
      min = Math.min(row.values[id], min)
      max = Math.max(row.values[id], max)
    })
    return [min, max]
  }, [id, preFilteredRows])

  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <input
        value={filterValue[0] || ''}
        type="number"
        onChange={e => {
          const val = e.target.value
          setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]])
        }}
        placeholder={`Min (${min})`}
        style={{
          width: '70px',
          marginRight: '0.5rem',
        }}
      />
      to
      <input
        value={filterValue[1] || ''}
        type="number"
        onChange={e => {
          const val = e.target.value
          setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined])
        }}
        placeholder={`Max (${max})`}
        style={{
          width: '70px',
          marginLeft: '0.5rem',
        }}
      />
    </div>
  )
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter(row => {
    const rowValue = row.values[id]
    return rowValue >= filterValue
  })
}

MoreLink.propTypes = {
  row: PropTypes.object
}

function MoreLink({row}) {
  return  (
    <div>
      <Link className="btn btn-link" to={`/datasets/${row.original["id"]}/details`}>More</Link>
    </div>
  );
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = val => typeof val !== 'number'

ColIdRender.propTypes = {
  row: PropTypes.object
}

function ColIdRender({row}) {
  return (
    <Fragment>
    {row.original["id"]}
    <Button variant="link" className="m-0 p-0 ms-1" onClick={() =>
        {navigator.clipboard.writeText(row.original["id"]).then(function() {
          console.log('Async: Copying to clipboard was successful!');
        }, function(err) {
          console.error('Async: Could not copy text: ', err);
        });}} >
        <ClipboardPlus />
      </Button>
      </Fragment>
  );
}

ColNameIdRender.propTypes = {
  row: PropTypes.object
}

function ColNameIdRender({row}) {
  const [copySuc, setCopySuc] = useState(null);
  const txtIdClass = "text-secondary" + (copySuc !== null ? (copySuc ? " copy-success " : " copy-error ") : "");
  
  return (
    <Fragment>
    {row.original["name"]}
    &nbsp;(<i className={txtIdClass} onAnimationEnd={() => setCopySuc(null)}>{row.original["id"]}</i>
    <Button variant="link" className="m-0 p-0 ms-1" onClick={(e) =>
        {navigator.clipboard ? 
          navigator.clipboard.writeText(row.original["id"]).then(function() {
              console.log('Async: Copying to clipboard was successful!');
              setCopySuc(true);
            }, function(err) {
              console.error('Async: Could not copy text: ', err);
              setCopySuc(false);
            })
            : console.error('Async: Could not copy text') ||  setCopySuc(false)
        }} >

        {copySuc !== null ? (copySuc ? <CheckCircleFill color="green"/> : <XCircleFill color="red"/>) : <ClipboardPlus />}
        
      </Button>)
      </Fragment>
  );
}

ColFlagsRender.propTypes = {
  row: PropTypes.object
}

function ColFlagsRender({row}) {
  return (
      <div className="mt-1 mb-1">
        {( row.original["invalidated"] ? <Fragment><Badge pill bg="secondary">Invalidated</Badge><br /></Fragment> : <Fragment /> )}
        {( row.original["public"] ? <Badge pill bg="dark">Published</Badge> : <Fragment /> )}
        {( row.original["draft"] ? <Badge pill bg="light" text="dark">Draft</Badge> : <Fragment /> )}
      </div>
  );
}
Table.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array
}

function Table({ columns, data, sortBy, updSearchParams//, showDialog, dataManager, postMessage, onDialogDetailsClose 
    }) {
  const filterTypes = useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )

  const defaultColumn = useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, headerGroups, rows, prepareRow,
    //selectedFlatRows,
     // getTableBodyProps,
     // state,
      //state: { selectedRowIds, globalFilter },
      visibleColumns,
      setSortBy
     // preGlobalFilteredRows,
     // setGlobalFilter 
    } = useTable({
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
      manualSortBy: true,
      initialState: {
          sortBy
      }
    },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    useSortBy,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        // Let's make a column for selection
        // {
        //   id: 'selection',
        //   // The header can use the table's getToggleAllRowsSelectedProps method
        //   // to render a checkbox
        //   Header: ({ getToggleAllRowsSelectedProps }) => (
        //     <div>
        //       <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
        //     </div>
        //   ),
        //   // The cell can use the individual row's getToggleRowSelectedProps method
        //   // to the render a checkbox
        //   Cell: ({ row }) => (
        //     <div>
        //       <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
        //     </div>
        //   ),
        // },

        ...columns,
        {
          id: 'operations',
          disableSortBy: true,
          Cell: ({row}) => <MoreLink row={row}/>
        }
      ])
    }
  );

  // Render the UI for your table
  return (
    <BTable striped bordered hover size="sm" {...getTableProps()} >
      <thead>
        {headerGroups.map(headerGroup => (
          <tr key="header" {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th key={`th-${Math.random().toString(16).slice(2)}`} 
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  onClick={() => 
                    {
                      // console.log(column);
                      column.toggleSortBy(!column.isSortedDesc);
                      updSearchParams({sortBy: column.id, sortDirection: column.isSortedDesc ? "ascending" : "descending"});
                      //setSortBy(sortBy);
                    }} //column.toggleSortBy(!column.isSortedDesc)}
              >
                {column.render('Header')}
                <span>
                    { column.canSort ? (column.isSorted
                      ? (column.isSortedDesc
                        ? <CaretDownFill />
                        :  <CaretUpFill />)
                      : <ArrowDownUp className="ms-1" size="0.75em"/> ) 
                    : ""}
                  </span>
              </th>
            ))}
          </tr>
        ))}
        <tr>
          <th
            colSpan={visibleColumns.length}
            style={{
              textAlign: 'left',
            }}
          >
            {/*
              <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
            */}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => {
          prepareRow(row)
          return (
            <tr key={`tr-${Math.random().toString(16).slice(2)}`} {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <td key={`td-${Math.random().toString(16).slice(2)}`} {...cell.getCellProps()}>
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

DatasetsMainTable.propTypes = {
  data: PropTypes.array,
  showDialog: PropTypes.func,
  dataManager: PropTypes.object,
  postMessage: PropTypes.func
}


function DatasetsMainTable(props) {
  const sortBy = useMemo(() => {return [props.currentSort]}, [props.currentSort]);
  const columns = useMemo(() => [
    // {
    //   Header: 'ID',
    //   id: "id",
    //   disableSortBy: true,
    //   Cell: ({row}) => <ColIdRender  row={row}/> 
    // },
    {
      Header: ()=><Fragment>Dataset (<i>ID</i>)</Fragment>,
      id: "name",
      accessor: 'name',
      Cell: ({row}) => <ColNameIdRender  row={row}/>
    },
    {
      Header: 'Flags',
      id: "flags",
      Cell: ({row}) => <ColFlagsRender   row={row}/> 
    },
    {
      Header: 'Author',
      id: "authorName",
      accessor: 'authorName'
    },
    {
      Header: 'Created',
      id: "creationDate",
      accessor: 'creationDate',
      Cell: ({ row }) => (
          new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'long' })
            .format(Date.parse(row.original["creationDate"]))
        )
    },
    {
      Header: 'Studies',
      id: "studiesCount",
      accessor: 'studiesCount'
    },
    {
      Header: 'Subjects',
      id: "subjectsCount",
      accessor: 'subjectsCount'
    }
  ], [props]);
    return <Table columns={columns} data={props.data} NoDataComponent={NoDataConst}
      showDialog={props.showDialog} dataManager={props.dataManager}
      postMessage={props.postMessage}
      onDialogDetailsClose={Dialog.HANDLE_CLOSE}
      sortBy={sortBy}
      updSearchParams={props.updSearchParams}
      />
}

export default DatasetsMainTable;
