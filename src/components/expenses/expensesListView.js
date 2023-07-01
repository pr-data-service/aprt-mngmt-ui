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
import ExpensesForm from './expensesForm';
import Constants from '../../utils/constants';
import { VIEW_COLUMNS } from '../../utils/columnConstants';
import Utils from '../../utils/utils';
import { useParams } from 'react-router-dom';
import { getFormattedDateTime } from '../../utils/dateHandler';
import { makeStyles } from '@material-ui/core';
import { Box } from '@material-ui/core';

const columns = VIEW_COLUMNS[Constants.OBJECTS.EXPENSE];

const useStyles = makeStyles((theme) => ({
    container: {
        padding: 10,
    },
}));

const ExpensesListView = () => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const expensesFormRef = React.useRef(null);
    const expenseListViewRef = React.useRef(null);
    const appDialogRef = React.useRef(null);
    const confrmDialogRef = React.useRef(null);
    const { handleBackDrop } = React.useContext(AppContext);
    const isDetailView = Utils.isDetailView();
    const object = CONSTANSTS.OBJECTS.EXPENSE;
    const params = useParams();

    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        getDataFromAPI();
    }, []);

    const getDataFromAPI = async (reqParams) => {
        if (isDetailView) {
            reqParams = reqParams ? { ...reqParams } : {};
            reqParams.parentFieldName = "eventId";
            reqParams.parentRecordId = params.id;
        }
        handleBackDrop(true);
        let response = await AxiosApi.getData(APIConstants.EXPENSES_LIST_VIEW_GET, reqParams);
        setData(response.data);
        handleBackDrop(false);
    }

    const addEvt = () => {
        expensesFormRef.current.handleOpen();
    }

    const editEvt = async () => {
        let row = expenseListViewRef.current.getSelectedRow();
        if (row && row.length == 1) {
            let response = await AxiosApi.getData(APIConstants.EXPENSES_GET + row[0].id); 
            isExpenseApprovedOrCanceled(response.data, ()=>(expensesFormRef.current.handleOpen(row[0].id)));
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

    const downLoadCSV = () => {
        let header = columns.filter(f => !f.hidden).map(m => { return { name: m.dataField, label: m.text } });
        let params = { isSerial: true };

        let totalAmount = data.filter(f => !f.isCanceled).map(m => m.amount).reduce((partialSum, a) => partialSum + a, 0);
        params.additionalRows = ["", "", "Total Amount", totalAmount];
        Utils.downloadCSVFile("expense-list-view-" + getFormattedDateTime(), header, data, params);
    }

    const isExpenseApprovedOrCanceled = (object, action) => {
        if (object && (object.isCanceled === null || !object.isCanceled )) {
            if (object && object.approvedbySecId && object.approvedbySecId > 0 && object.approvedByTrsId && object.approvedByTrsId > 0) {
                enqueueSnackbar('Voucher was approved', { variant: 'error' });
            } else {
                action();
            }
        } else {
            enqueueSnackbar('Expense Canceled', { variant: 'error' });
        } 
    }

    const toolBarIcon = [
        { name: "ADD", title: "Add Owners", onClick: addEvt, },
        { name: "EDIT", title: "Edit Owners", onClick: editEvt, },
        { name: "DELETE", title: "Delete Owners", onClick: deleteEvt, },
        // { name: "PDF", title: "Export to .pdf file", onClick: () => { }, }, 
        { name: "CSV", title: "Export to .csv file", onClick: downLoadCSV, },
    ];

    const getToolBarIcon = () => {
        let list = [...toolBarIcon];

        if (!Utils.isPermission(object, CONSTANSTS.USER_PERMISSION.CREATE)) {
            list = list.filter(f => f.name !== "ADD");
        }

        if (!Utils.isPermission(object, CONSTANSTS.USER_PERMISSION.EDIT)) {
            list = list.filter(f => f.name !== "EDIT");
        }

        if (!Utils.isPermission(object, CONSTANSTS.USER_PERMISSION.DELETE)) {
            list = list.filter(f => f.name !== "DELETE");
        }

        return list;
    }

    return <Box className={classes.container}>
        <ExpensesForm ref={expensesFormRef} getListViewData={getDataFromAPI} />
        <AppDialog ref={appDialogRef} maxWidth="xs" />
        <ConfirmDialog ref={confrmDialogRef} />
        {!isDetailView && <PageHeader object={CONSTANSTS.OBJECTS.EXPENSE} />}
        <ListView ref={expenseListViewRef} object={CONSTANSTS.OBJECTS.EXPENSE} columns={getColumns(columns)} rows={data} toolBarIcon={getToolBarIcon()} getListViewData={getDataFromAPI} rowStyle={rowStyle} />
    </Box>
}

export default ExpensesListView;


const getColumns = (cols) => {
    if (cols) {
        let columns = [...cols];
        columns.forEach((col, i) => {
            if (col.dataField == "voucherNo") {
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

const rowStyle = (row, rowIndex) => {
    const style = {};
    if (row.isCanceled) {
        style.color = 'red';
        //   style.animation = 'blinker 1s linear infinite';
    }

    return style;
};