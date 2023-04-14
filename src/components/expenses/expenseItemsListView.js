import React from 'react';
import CONSTANSTS from '../../utils/constants';
import ListView from '../common/listView';
import PageHeader from '../common/pageHeader';
import AxiosApi from '../../utils/httpRequestHandler';
import APIConstants from '../../utils/apiConatants';
import { useSnackbar } from 'notistack';
import AppDialog from '../common/appDialog';
import ConfirmDialog from '../common/confirmDialog';
import { AppContext } from '../common/context/appContext';
import LinkObject from '../common/linkObject';
import Constants from '../../utils/constants';
import Utils from '../../utils/utils';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getFormattedDateTime } from '../../utils/dateHandler';
import { Box, makeStyles } from '@material-ui/core';

const { MONTHS_FULL_FORM } = Constants;


const useStyles = makeStyles((theme) => ({
    container: {
        padding: 10,
    },
}));

const ExpenseItemsListView = () => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const expenseItemsListViewRef = React.useRef();
    const [openDialog, setOpenDialog] = React.useState(false);
    const { handleBackDrop } = React.useContext(AppContext);
    const params = useParams();
    const [data, setData] = React.useState([]);
    const isDetailView = Utils.isDetailView();
    
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    React.useEffect(() => {
        getDataFromAPI();
    }, []);

    const getDataFromAPI = async (reqParams) => {
        try{
            if(isDetailView) {
                reqParams = reqParams ? {...reqParams} : {};
                reqParams.parentFieldName = "expenseId";
                reqParams.parentRecordId = params.id;;
            }
            

            handleBackDrop(true);
            let response = await AxiosApi.getData(APIConstants.EXPENSES_ITEMS_LIST_VIEW_GET, reqParams);
            setData(response.data);
            handleBackDrop(false);
        }catch(error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }
        
    }

    const addEvt = () => {
        setOpenDialog(true);
    }

    const editEvt = () => {
    }

    const deleteEvt = () => {
        alert(33)
    }

    const payMaintenance = () => {
        alert(44)
    }

    const downLoadCSV = () => {
        let header = columns.filter(f => !f.hidden).map(m => { return {name: m.dataField, label: m.text} });
        let params = {isSerial: true};
        let totalAmount = data.filter(f => !f.isCanceled).map(m => m.amount).reduce((partialSum, a) => partialSum + a, 0);
        params.additionalRows = ["", "Total Amount", totalAmount];
        Utils.downloadCSVFile("expense-items-list-view-"+getFormattedDateTime(), header, data, params);
    }

    let rows = data.map( m => { return { ...m, paymentMonth: MONTHS_FULL_FORM[m.paymentMonth]}});

    const toolBarIcon = [
        // { name: "PDF", title: "Export to .pdf file", onClick: ()=>{},  }, 
        { name: "CSV", title: "Export to .csv file", onClick: downLoadCSV, }, 
    ];
    return <Box className={classes.container}>
        {!isDetailView && <PageHeader object={CONSTANSTS.OBJECTS.EXPENSE_ITEMS}/>}
        <ListView ref={expenseItemsListViewRef} object={CONSTANSTS.OBJECTS.EXPENSE_ITEMS} columns={columns} rows={rows} toolBarIcon={toolBarIcon} getListViewData={getDataFromAPI} /*isSearchRequired={false}*//>
    </Box>
}

export default ExpenseItemsListView;


const columns = [{
    dataField: 'id',
    text: 'ID',
    type:"NUMBER",
    hidden: true,
}, {
    dataField: 'itemHead',
    text: 'Item Head',
    type:"TEXT",
    headerStyle: { width: 500, },
    headerAttrs: { title: 'Item Head' }
}, {
    dataField: 'amount',
    text: 'Amount',
    type:"TEXT",
    headerStyle: { width: 100, },
    headerAttrs: { title: 'Amount' }
}, {
    dataField: 'isCanceled',
    text: 'Is Canceled',
    type:"BOOLEAN",
    sort: true,
    headerStyle: { width: 80, },
    headerAttrs: { title: 'Is Canceled' }
}, {
    dataField: 'createdDate',
    text: 'Created Date',
    type:"DATE",
    sort: true,
    headerStyle: { width: 150, },
    headerAttrs: { title: 'Created Date' }
}, {
    dataField: 'modifiedDate',
    text: 'Modified Date',
    type:"DATE",
    sort: true,
    headerStyle: { width: 150, },
    headerAttrs: { title: 'Modified Date' }
}, {
    dataField: 'emptyCol',
    type:'EMPTY',
    text: '',
    headerStyle: { width: 235, },
}];

const rowStyle = (row, rowIndex) => {
    const style = {};
    if (row.isCanceled) {
        style.color = 'red';
        //   style.animation = 'blinker 1s linear infinite';
    }

    return style;
};