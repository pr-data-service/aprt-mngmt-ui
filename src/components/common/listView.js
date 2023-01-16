//react-bootstrap-table-next help link
//https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html?selectedKind=Pagination&selectedStory=Fully%20Custom%20Pagination&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybook%2Factions%2Factions-panel

// "react-bootstrap-table-next": "^2.0.1",
// "react-bootstrap-table2-paginator": "^2.1.2",



import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
// import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
// require('react-bootstrap-table-next/dist/react-bootstrap-table2.min.css');


import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Utils from '../../utils/utils';
import ToolBar from './toolBar';

const useStyles = makeStyles((theme) => ({
  allToolBtnContainer: {
    display: 'flex',
    margin: "7px 0px"
  },
  toolBtnContainer: {
    marginRight: 5,
    border: "1px solid #83818187",
    borderRadius: 2
  },
  buttonStyle: {
    padding: 7,
    marginTop: -2
  }
}));

const HeaderFormatter = (column, colIndex) => {
  let style = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "inherit"
  };
  return <div style={style}> {column.text} </div>
}

const ColumnFormatter = (cell, row, rowIndex, formatExtraData = {}) => {
  let style = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "inherit"
  };
  let val = cell;
  if (cell === true || cell === false) {
    val = new String(cell);
  }

  let { detailLinkUrl } = formatExtraData;
  if (detailLinkUrl) {
    val = <Link to={detailLinkUrl + row.id}> {val ? val : "Empty"} </Link>
  }
  return <div style={style} title={val}> {val} </div>
}

const selectRow = {
  mode: 'checkbox',
  clickToSelect: true,
  headerColumnStyle: { width: "3%" }
};
const ListView = React.forwardRef(({
  object,
  columns,
  rows = [],
  toolBarIcon,
  getData,
  getListViewData = () => { },
  isSearchRequired = true,
  wrapperClasses = "table_overflow",
  isPagingRequired = true,
  rowStyle= {}
}, ref) => {

  const classes = useStyles();
  let [selectedRow, setSelectedRow] = React.useState([]);
  const [reqParams, setReqParams] = React.useState({});
  const isDetailView = Utils.isDetailView();
  const wrapperClassesCust = isDetailView ? "table_overflow-detail-view" : wrapperClasses;

  React.useImperativeHandle(ref, () => ({
    getSelectedRow: () => selectedRow,
  }));

  React.useEffect(() => {
    setSelectedRow([]);
  }, [rows.length])

  const options = {
    onSizePerPageChange: (sizePerPage, page) => {
      console.log('Size per page change!!!');
      console.log('Newest size per page:' + sizePerPage);
      console.log('Newest page:' + page);
    },
    // onPageChange: (page, sizePerPage) => {
    //   console.log('Page change!!!');
    //   console.log('Newest size per page:' + sizePerPage);
    //   console.log('Newest page:' + page);
    // }
    custom: true,
    totalSize: rows.length
  };

  const onSearchEvent = (fieldValues) => {
   // setReqParams({ searchFieldName: fieldName, searchFieldValue: searchValue });

    if (fieldValues) {
      getListViewData({ seacrchFields: fieldValues });
    }
  }

  const onRowSelect = (row, isSelect, rowIndex, e) => {
    let arr = [...selectedRow];
    if (isSelect) {
      arr.push(row);
    } else {
      arr = arr.filter(f => f.id !== row.id);
    }
    setSelectedRow(arr)
  }

  const getColumns = (columns) => {
    let arr = [];
    if (columns) {
      arr = [...columns];
      arr = isDetailView ? arr.filter(f => f.dataField !== "emptyCol") : arr;
      arr = arr.map((m) => {
        return {
          ...m,
          headerFormatter: HeaderFormatter,
          formatter: ColumnFormatter,
        }
      })
    }
    return arr;
  }


  return <div className='react-bootstrap-table-container' key={"list-view-" + rows.length}>
    {isPagingRequired && <PagingTable 
      object={object}
      classes={classes} options={options} toolBarIcon={toolBarIcon}
      isSearchRequired={isSearchRequired}
      onSearchEvent={onSearchEvent}
      columns={columns} rows={rows} getColumns={getColumns} selectedRow={selectedRow.map(m => m.id)} onRowSelect={onRowSelect}
      wrapperClasses={wrapperClassesCust} 
      rowStyle={rowStyle}/>}

    {!isPagingRequired && <Table 
      object={object}
      classes={classes} options={options} toolBarIcon={toolBarIcon}
      isSearchRequired={isSearchRequired}
      onSearchEvent={onSearchEvent}
      columns={columns} rows={rows} getColumns={getColumns} selectedRow={selectedRow.map(m => m.id)} onRowSelect={onRowSelect}
      wrapperClasses={wrapperClassesCust} 
      rowStyle={rowStyle}/>}
  </div>
})

export default ListView;

const Table = ({ key = "default-table", object, classes, options, toolBarIcon, isSearchRequired, onSearchEvent,
  columns, rows, getColumns, selectedRow, onRowSelect, wrapperClasses, rowStyle }) => {
  return <div>
    {(toolBarIcon && isSearchRequired) && <ToolBar
      object={object}
      icons={toolBarIcon}
      search={isSearchRequired ? { columns: columns, onSearchEvent: onSearchEvent } : null}/>}
    <BootstrapTable
      key={"list-view" + key}
      keyField='id' data={[...rows]} columns={getColumns(columns)}
      striped
      hover
      condensed
      selectRow={{ ...selectRow, selected: selectedRow, onSelect: onRowSelect }}
      wrapperClasses={wrapperClasses}
      rowStyle={rowStyle}
    />
  </div>
}


const PagingTable = ({ key = "default-table", object, classes, options, toolBarIcon, isSearchRequired, onSearchEvent,
  columns, rows, getColumns, selectedRow, onRowSelect, wrapperClasses, rowStyle }) => {
  return <PaginationProvider pagination={paginationFactory(options)}>
    {
      ({ paginationProps, paginationTableProps }) => (
        <div>
          <ToolBar
            object={object}
            icons={toolBarIcon}
            search={isSearchRequired ? { columns: columns, onSearchEvent: onSearchEvent } : null}
            rightElements={[<PaginationListStandalone {...paginationProps} />]} />
          <BootstrapTable
            key={"list-view" + key}
            keyField='id' data={[...rows]} columns={getColumns(columns)}
            striped
            hover
            condensed
            selectRow={{ ...selectRow, selected: selectedRow, onSelect: onRowSelect }}
            {...paginationTableProps}
            wrapperClasses={wrapperClasses}
            rowStyle={rowStyle}
          />
        </div>
      )
    }
  </PaginationProvider>
}

const columns = [{
  dataField: 'id',
  text: 'ID',
  hidden: true
}];

