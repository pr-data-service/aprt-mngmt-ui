import React from 'react';
import ListView from '../common/listView';
import PageHeader from '../common/pageHeader';
import AxiosApi from '../../utils/httpRequestHandler';
import APIConstants from '../../utils/apiConatants';
import { useSnackbar } from 'notistack';
import AppDialog from '../common/appDialog';
import ConfirmDialog from '../common/confirmDialog';
import { AppContext } from '../../components/common/context/appContext';
import EventsForm from './../events/eventsForm';
import CONSTANSTS from '../../utils/constants';
import ExpenseHeadForm from './expenseHeadForm';
import Constants from '../../utils/constants';
import { VIEW_COLUMNS } from '../../utils/columnConstants';
import Utils from '../../utils/utils';
import { useParams } from 'react-router-dom';

const columns = VIEW_COLUMNS[Constants.OBJECTS.EXPENSE_HEAD];


const ExpensesHeadListView = ({object}) => {
    const { enqueueSnackbar } = useSnackbar();
    const formRef = React.useRef(null);
    const expenseListViewRef = React.useRef(null);
    const appDialogRef = React.useRef(null);
    const confrmDialogRef = React.useRef(null);
    const isDetailView = Utils.isDetailView();
    const params = useParams();

    const {handleBackDrop} = React.useContext(AppContext);

    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        getDataFromAPI();
    }, []);

    const getDataFromAPI = async (reqParams) => {
        if(isDetailView) {
            reqParams = reqParams ? {...reqParams} : {};
            reqParams.parentFieldName = "eventId";
            reqParams.parentRecordId = params.id;;
        }
        handleBackDrop(true);
        let response = await AxiosApi.getData(APIConstants.EXPENSE_HEAD_LIST_VIEW_GET, reqParams);
        setData(response.data);        
        handleBackDrop(false);
    }

    const addEvt = () => {
        formRef.current.handleOpen();
    }

    const editEvt = () => {
        let row = expenseListViewRef.current.getSelectedRow();
        if (row && row.length == 1) {
            formRef.current.handleOpen(row[0].id);
        } else {
            appDialogRef.current.handleOpen({ title: "Information Dialog", contentText: "Please select one record!" });
        }

    }

    const deleteEvt = () => {
        let row = expenseListViewRef.current.getSelectedRow();
        if (row && row.length == 1) {
            confrmDialogRef.current.handleOpen({ title: "Confirmation Dialog", contentText: "Are you confirm to delet data?", callback: deleteData });
        } else {
            appDialogRef.current.handleOpen({ title: "Information Dialog", contentText: "Please select one record!" });
        }
    }

    const deleteData = async () => {
        try {
            let row = expenseListViewRef.current.getSelectedRow();
            let response = await AxiosApi.deleteData(APIConstants.EXPENSES_DELETE + row[0].id);
            console.log(response.data);
            getDataFromAPI();
            enqueueSnackbar('This is a success message!', { variant: "success" });
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }
    }

    const toolBarIcon = [
        { name: "ADD", title: "Add Owners", onClick: addEvt, }, 
        { name: "EDIT", title: "Edit Owners", onClick: editEvt, }, 
        { name: "DELETE", title: "Delete Owners", onClick: deleteEvt, }, 
        { name: "PDF", title: "Export to .pdf file", onClick: () => { }, }, 
        { name: "EXCEL", title: "Export to .excl file", onClick: () => { }, },
        ];
    return <div style={{ padding: 10 }}>
        <ExpenseHeadForm ref={formRef} getListViewData={getDataFromAPI} isDetailView={isDetailView} object={object}/>
        <AppDialog ref={appDialogRef} maxWidth="xs" />
        <ConfirmDialog ref={confrmDialogRef} />
        {!isDetailView && <PageHeader object={CONSTANSTS.OBJECTS.EXPENSE_HEAD} />}
        <ListView ref={expenseListViewRef} columns={getColumns(columns)} rows={data} toolBarIcon={toolBarIcon} getListViewData={getDataFromAPI}/>
    </div>
}

export default ExpensesHeadListView;


const getColumns = (cols) => {
    if (cols) {
        let columns = [...cols];
        columns.forEach((col, i) => {
            if (col.dataField == "title") {
                col.formatExtraData = {
                    detailLinkUrl: "/" + Constants.OBJECTS.EXPENSE.toLowerCase() + "/detail_view/"
                };
                col.events = {
                    onClick: (e, column, columnIndex, row, rowIndex) => {                        
                        console.log(e);
                        console.log(column);
                        console.log(columnIndex);
                        console.log(row);
                        console.log(rowIndex);
                        //alert('Click on Product ID field');
                    },
                    onMouseEnter: (e, column, columnIndex, row, rowIndex) => {
                        console.log(e);
                        console.log(column);
                        console.log(columnIndex);
                        console.log(row);
                        console.log(rowIndex);
                        console.log('onMouseEnter on Product ID field');
                    }
                }
            }
        })
        return columns;
    }
    return cols;
}