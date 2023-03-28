import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { SelectField, TextField } from '../common/fields';
import { useSnackbar } from 'notistack';
import APIConstants from '../../utils/apiConatants';
import AxiosApi from '../../utils/httpRequestHandler';
import { AppContext } from '../common/context/appContext';
import Constants from '../../utils/constants';
import { getFormattedDateTime } from '../../utils/dateHandler';


import BootstrapTable from 'react-bootstrap-table-next';
import moment from 'moment';
import ListView from '../common/listView';
import ConfirmDialog from '../common/confirmDialog';
import CONSTANSTS from '../../utils/constants';
import Utils from '../../utils/utils';
import { useParams } from 'react-router-dom';
import PageHeader from '../common/pageHeader';
import { Box } from '@material-ui/core';

const { MONTHS_SORT_FORM } = Constants;

const useStyles = makeStyles((theme) => ({
    container: {
        padding: 10,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        width: 'fit-content',
    },
    formControl: {
        marginTop: theme.spacing(2),
        minWidth: 120,
    },
    formControlLabel: {
        marginTop: theme.spacing(1),
    },


    row: {
        display: "flex",
        marginTop: 10
    },
    headerRow: {
        position: "absolute",
        zIndex: 40
    },
    elementSpace: {
        width: 10
    },
    label: {
        padding: 4
    },
    tableContainer: {
        // marginTop: 10
    }
}));

const selectRow = {
    mode: 'checkbox',
    clickToSelect: true,
    headerColumnStyle: { width: "3%" }
};

const MaintenanceDuesListView = React.forwardRef(({ flatId }, ref) => {
    const classes = useStyles();
    const listViewRef = React.useRef(null);
    const params = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const { handleBackDrop } = React.useContext(AppContext);
    const isDetailView = Utils.isDetailView();
    let parentObject = isDetailView ? Utils.getObjectNameFromUrl() : "";
    const [data, setData] = React.useState([]);
    
    React.useImperativeHandle(ref, () => ({
        getSelectedRow: () => listViewRef.current.getSelectedRow(),
    }));

    React.useEffect(() => {
        getDataFromAPI();
    }, []);

    const getDataFromAPI = async (reqParams) => {
        try{
            if(isDetailView) {
                reqParams = reqParams ? {...reqParams} : {}; 
                
                
                if (parentObject === CONSTANSTS.OBJECTS.EVENTS) {
                    reqParams.object = parentObject;
                    reqParams.id = params.id;
                } else {
                    reqParams.parentFieldName = Utils.getForienKeyFieldName(params);
                    reqParams.parentRecordId = params.id;
                }
                
            }            

            handleBackDrop(true);
            let response = await AxiosApi.getData(APIConstants.PAYMENT_DETAILS_DUES_LIST_VIEW_GET, reqParams);
            setData(response.data);
            handleBackDrop(false);
        }catch(error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }
        
    }

    const downLoadCSV = () => { 
        let fileName = "payment-list-view-";
        let header = []; 
        if(CONSTANSTS.OBJECTS.EVENTS == parentObject) {
            fileName = "dues-list-view-";
            header = columnsEventsDues.filter(f => !f.hidden).map(m => { return {name: m.dataField, label: m.text} });
        } else {
            header = columns.filter(f => !f.hidden).map(m => { return {name: m.dataField, label: m.text} });
        }     
        let params = {isSerial: true};
        let totalAmount = data.map(m => m.amount).reduce((partialSum, a) => partialSum + a, 0);
        params.additionalRows = ["", "Total Amount", totalAmount];
        Utils.downloadCSVFile(fileName+getFormattedDateTime(), header, data, params);
    }

    const getColumns = () => {
        if(isDetailView) {
            
            if(CONSTANSTS.OBJECTS.EVENTS == parentObject) {
                return columnsEventsDues;
            }
            let arr = JSON.parse(JSON.stringify(columns));
            arr = arr.filter( f => f.dataField != "flatNo");
            let fld = arr.find( f => f.type == "EMPTY");
            if(fld) {
                fld.headerStyle.width = 202
            }
            return arr;
        }
        return columns;
    }

    const toolBarIcon = [
        { name: "PDF", title: "Export to .pdf file", onClick: () => { }, }, 
        { name: "CSV", title: "Export to .csv file", onClick: downLoadCSV, },
        { name: "REFRESH", title: "Refresh data...", onClick: () => getDataFromAPI()} 
    ];

    return <Box className={classes.container}>
        {!isDetailView && <PageHeader label="Maintenance Dues" object={CONSTANSTS.OBJECTS.PAYMENT_DETAILS}/>}
        <ListView ref={listViewRef} columns={getColumns()} rows={data} getListViewData={getDataFromAPI} toolBarIcon={toolBarIcon}/>
    </Box>
})

export default MaintenanceDuesListView;



const getRowsAfterModifying = (rows) => {
    if(rows) {
        let arr = [...rows].map( m => {
            let paymentMonth = m.paymentMonth ? CONSTANSTS.MONTHS_FULL_FORM[m.paymentMonth] : "";
            return {...m, paymentMonthName: paymentMonth};
        })
        return arr;
    }
    return [];
}
const columnsEventsDues = [{
    dataField: 'id',
    text: 'ID',
    headerStyle: { width: 40, },
    hidden: true,
    type: "TEXT"
}, {
    dataField: 'flatNo',
    text: 'Flat No',
    headerStyle: { width: 70, },
    headerAttrs: { title: 'Flat No' },
    type: "TEXT"
}, {
    dataField: 'amount',
    text: 'Dues Amount',
    headerStyle: { width: 150, },
    headerAttrs: { title: 'Dues Amount' },
    type: "NUMBER"
}, {
    dataField: 'ownersName',
    text: 'Owners Name',
    headerStyle: { width: 300, },
    headerAttrs: { title: 'Owners Name' },
    type: "TEXT"
},  {
    dataField: 'contactNo',
    text: 'Contact No',
    headerStyle: { width: 80, },
    headerAttrs: { title: 'Contact No' },
    type: "TEXT"
},  {
    dataField: 'empty',
    headerStyle: { width: 340, },
    type: "EMPTY",
},];

const columns = [{
    dataField: 'id',
    text: 'ID',
    hidden: true,
    type: "TEXT"
}, {
    dataField: 'flatNo',
    text: 'Flat No',
    headerStyle: { width: 70, },
    headerAttrs: { title: 'Flat No' },
    type: "TEXT"
}, {
    dataField: 'amount',
    text: 'Amount',
    headerStyle: { width: 80, },
    headerAttrs: { title: 'Flat No' },
    type: "NUMBER"
}, {
    dataField: 'paymentForSessionName',
    text: 'Session Name',
    headerStyle: { width: 280, },
    headerAttrs: { title: 'Session Name' },
    type: "TEXT"
}, {
    dataField: 'paymentMonthName',
    text: 'Payment For Month',
    sort: true,
    headerStyle: { width: 150, },
    headerAttrs: { title: 'Payment For Month' },
}, {
    dataField: 'paymentYear',
    text: 'Payment For Year',
    sort: true,
    headerStyle: { width: 150, },
    headerAttrs: { title: 'Payment For Year' },
    type: "NUMBER"
}, {
    dataField: 'empty',
    headerStyle: { width: 439, },
    type: "EMPTY"
},];


const rows = [
    { id: 1, flatNo: "A/0/7", paymentForMonth: "00-03-2022" },
    { id: 2, flatNo: "A/0/7", paymentForMonth: "00-04-2022" },
    { id: 3, flatNo: "A/0/7", paymentForMonth: "00-05-2022" },
    { id: 4, flatNo: "A/0/7", paymentForMonth: "00-06-2022" },
    { id: 5, flatNo: "A/0/7", paymentForMonth: "00-07-2022" }
]

const data = {
    records: rows,
    currentMaintenance: 450
}