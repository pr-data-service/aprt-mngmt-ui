import React from 'react';
import CONSTANSTS from '../../utils/constants';
import ListView from '../common/listView';
import PageHeader from '../common/pageHeader';
import AddPayment from './addPayment';
import AxiosApi from '../../utils/httpRequestHandler';
import APIConstants from '../../utils/apiConatants';
import { useSnackbar } from 'notistack';
import AppDialog from '../common/appDialog';
import ConfirmDialog from '../common/confirmDialog';
import { AppContext } from '../common/context/appContext';
import LinkObject from '../common/linkObject';
import Constants from '../../utils/constants';
import { VIEW_COLUMNS } from '../../utils/columnConstants';
import Utils from '../../utils/utils';
import { useParams } from 'react-router-dom';
import { getFormattedDateTime } from '../../utils/dateHandler';
import { makeStyles } from '@material-ui/core';
import { Box } from '@material-ui/core';

const { MONTHS_FULL_FORM } = Constants;
const columns = VIEW_COLUMNS[Constants.OBJECTS.PAYMENT];
const object = CONSTANSTS.OBJECTS.PAYMENT;

const useStyles = makeStyles((theme) => ({
    container: {
        padding: 10,
    },
}));

const PaymentListView = () => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const maintenanceListViewRef = React.useRef();
    const [openDialog, setOpenDialog] = React.useState(false);
    const { handleBackDrop } = React.useContext(AppContext);
    const appDialogRef = React.useRef(null);
    const confrmDialogRef = React.useRef(null);
    const isDetailView = Utils.isDetailView();
    const params = useParams();

    const [data, setData] = React.useState([]);

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    React.useEffect(() => {
        getDataFromAPI();
    }, []);

    const getDataFromAPI = async (reqParams) => {
        try {
            if (isDetailView) {
                reqParams = reqParams ? { ...reqParams } : {};
                reqParams.parentFieldName = "flatId";
                reqParams.parentRecordId = params.id;
            }
            handleBackDrop(true);
            let response = await AxiosApi.getData(APIConstants.PAYMENT_LIST_VIEW_GET, reqParams);
            setData(response.data);
            handleBackDrop(false);
        } catch (error) {
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
        let row = maintenanceListViewRef.current.getSelectedRow();
        if (row && row.length == 1) {
            confrmDialogRef.current.handleOpen({ title: "Confirmation Dialog", contentText: "Are you confirm to delete data?", callback: deleteData });
        } else {
            appDialogRef.current.handleOpen({ title: "Information Dialog", contentText: "Please select one record!" });
        }
    }

    const deleteData = async () => {
        try {
            let row = maintenanceListViewRef.current.getSelectedRow();
            let ids = row.map(r => r.id);
            let response = await AxiosApi.deleteData(APIConstants.PAYMENT_DELETE + row[0].id);
            console.log(response.data);
            getDataFromAPI();
            enqueueSnackbar('This is a success message!', { variant: "success" });

        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }
    }

    const payMaintenance = () => {
        alert(44)
    }


    const getRows = () => {
        let arr = new Array();
        for (let i = 0; i < 1000; i++) {
            arr.push({ id: i, fName: 'Demo' + i, lName: 'Demo' + i, phone1: "+91-44444444" + i, phone2: "+91-5555555" + i, email: "abc" + i + "@test.com", })
        }
        return arr;
    }
    const downLoadCSV = () => {
        let header = columns.filter(f => !f.hidden).map(m => { return { name: m.dataField, label: m.text } });
        let params = { isSerial: true };

        let totalAmount = data.filter(f => !f.isCanceled).map(m => m.amount).reduce((partialSum, a) => partialSum + a, 0);
        params.additionalRows = ["", "Total Amount", totalAmount];
        Utils.downloadCSVFile("payment-list-view-" + getFormattedDateTime(), header, data, params);
    }

    const getFlatId = () => {
        if(isDetailView) {
            let parentObject = Utils.getObjectNameFromUrl();
            return parentObject == CONSTANSTS.OBJECTS.FLAT_DETAILS ? params.id : 0;
        }
        return 0;        
    }

    let rows = data.map(m => { return { ...m, paymentMonth: MONTHS_FULL_FORM[m.paymentMonth] } });

    const toolBarIcon = [
        { name: "ADD", title: "Add Maintenance", onClick: addEvt, },
        { name: "DELETE", title: "Delete Maintenance", onClick: deleteEvt, },
        { name: "PDF", title: "Export to .pdf file", onClick: () => { }, },
        { name: "CSV", title: "Export to .csv file", onClick: downLoadCSV, },
    ];

    const getToolBarIcon = () => {
        let list = [...toolBarIcon];

        if(!Utils.isPermission(object, CONSTANSTS.USER_PERMISSION.CREATE)) {
            list = list.filter( f => f.name !== "ADD");
        }

        if(!Utils.isPermission(object, CONSTANSTS.USER_PERMISSION.EDIT)) {
            list = list.filter( f => f.name !== "EDIT");
        }

        if(!Utils.isPermission(object, CONSTANSTS.USER_PERMISSION.DELETE)) {
            list = list.filter( f => f.name !== "DELETE");
        }
        
        return list;
    }  

    return <Box className={classes.container}>
        {!isDetailView && <PageHeader object={CONSTANSTS.OBJECTS.PAYMENT} />}
        <ListView ref={maintenanceListViewRef} object={CONSTANSTS.OBJECTS.PAYMENT} columns={getColumns(columns)} rows={rows} toolBarIcon={getToolBarIcon()} getListViewData={getDataFromAPI} rowStyle={rowStyle} />
        {openDialog && <AddPayment openDialog={openDialog} handleCloseDialog={handleCloseDialog} payMaintenance={payMaintenance} recordFlatId={getFlatId()}/>}
        <AppDialog ref={appDialogRef} maxWidth="xs" />
        <ConfirmDialog ref={confrmDialogRef} />
    </Box>
}

export default PaymentListView;


const getColumns = (cols) => {
    if (cols) {
        let columns = [...cols];
        columns.forEach((col, i) => {
            if (col.dataField == "billNo") {
                col.formatExtraData = {
                    detailLinkUrl: "/" + Constants.OBJECTS.PAYMENT.toLowerCase() + "/detail_view/"
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