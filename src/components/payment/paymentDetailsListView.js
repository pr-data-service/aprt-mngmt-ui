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
import Utils from '../../utils/utils';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getFormattedDateTime } from '../../utils/dateHandler';
import { Box, makeStyles } from '@material-ui/core';

const { MONTHS_FULL_FORM } = Constants;
const object = CONSTANSTS.OBJECTS.PAYMENT_DETAILS;


const useStyles = makeStyles((theme) => ({
    container: {
        padding: 10,
    },
}));
const PaymentDetailsListView = () => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const maintenanceListViewRef = React.useRef();
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
                reqParams.parentFieldName = Utils.getForienKeyFieldName(params);
                reqParams.parentRecordId = params.id;
            }            

            handleBackDrop(true);
            let response = await AxiosApi.getData(APIConstants.PAYMENT_DETAILS_LIST_VIEW_GET, reqParams);
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


    const getRows = () => {
        let arr = new Array();
        for (let i = 0; i < 1000; i++) {
            arr.push({ id: i, fName: 'Demo' + i, lName: 'Demo' + i, phone1: "+91-44444444" + i, phone2: "+91-5555555" + i, email: "abc" + i + "@test.com", })
        }
        return arr;
    }

    const downLoadCSV = () => {        
        let header = columns.filter(f => !f.hidden).map(m => { return {name: m.dataField, label: m.text} });
        let params = {isSerial: true};
        let totalAmount = data.filter(f => !f.isCanceled).map(m => m.amount).reduce((partialSum, a) => partialSum + a, 0);
        params.additionalRows = ["", "Total Amount", totalAmount];
        Utils.downloadCSVFile("payment-details-list-view-"+getFormattedDateTime(), header, data, params);
    }

    let rows = data.map( m => { return { ...m, paymentMonth: MONTHS_FULL_FORM[m.paymentMonth]}});

    const toolBarIcon = [
        { name: "PDF", title: "Export to .pdf file", onClick: ()=>{},  }, 
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
        {!isDetailView && <PageHeader object={CONSTANSTS.OBJECTS.PAYMENT_DETAILS}/>}
        <ListView ref={maintenanceListViewRef} object={CONSTANSTS.OBJECTS.PAYMENT_DETAILS} columns={columns} rows={rows} toolBarIcon={getToolBarIcon()} getListViewData={getDataFromAPI} rowStyle={rowStyle}/>
    </Box>
}

export default PaymentDetailsListView;


const columns = [{
    dataField: 'id',
    text: 'ID',
    type:"NUMBER",
    hidden: true,
}, {
    dataField: 'flatNo',
    text: 'Flat No',
    type:"TEXT",
    headerStyle: { width: 50, },
    headerAttrs: { title: 'Flat No' }
}, {
    dataField: 'amount',
    text: 'Amount',
    type:"TEXT",
    headerStyle: { width: 70, },
    headerAttrs: { title: 'Amount' }
}, {
    dataField: 'paymentMonth',
    text: 'Payment For Month',
    type:"NUMBER",
    sort: true,
    headerStyle: { width: 150, },
    headerAttrs: { title: 'Payment For Month' }
}, {
    dataField: 'paymentYear',
    text: 'Payment For Year',
    type:"NUMBER",
    sort: true,
    headerStyle: { width: 140, },
    headerAttrs: { title: 'Payment For Year' }
}, {
    dataField: 'paymentDate',
    text: 'Payment Date',
    type:"DATE",
    sort: true,
    headerStyle: { width: 100, },
    headerAttrs: { title: 'Payment Date' }
}, {
    dataField: 'eventName',
    text: 'Event Name',
    type:"TEXT",
    sort: true,
    headerStyle: { width: 150, },
    headerAttrs: { title: 'Event Name' }
}, {
    dataField: 'paymentForSessionName',
    text: 'Payment for Session',
    type:"TEXT",
    sort: true,
    headerStyle: { width: 150, },
    headerAttrs: { title: 'Payment for Session' }
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
}, 
// {
//     dataField: 'modifiedDate',
//     text: 'Modified Date',
//     sort: true,
//     headerStyle: { width: 150, },
//     headerAttrs: { title: 'Modified Date' }
// },
{
    dataField: 'emptyCol',
    type: "EMPTY",
    headerStyle: { width: 80, },
},
];


const rowStyle = (row, rowIndex) => {
    const style = {};
    if (row.isCanceled) {
        style.color = 'red';
        //   style.animation = 'blinker 1s linear infinite';
    }

    return style;
};