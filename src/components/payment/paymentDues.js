import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { SelectField, TextField } from '../common/fields';
import { Box } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import APIConstants from '../../utils/apiConatants';
import AxiosApi from '../../utils/httpRequestHandler';
import { AppContext } from '../common/context/appContext';
import Constants from '../../utils/constants';
import { } from '../../utils/dateHandler';


import BootstrapTable from 'react-bootstrap-table-next';
import moment from 'moment';
import ListView from '../common/listView';
import ConfirmDialog from '../common/confirmDialog';
import CONSTANSTS from '../../utils/constants';

const { MONTHS_SORT_FORM } = Constants;

const useStyles = makeStyles((theme) => ({
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

const PaymentDues = React.forwardRef(({ flatId, duesList = [], addMoreDueMonth= ()=>{} }, ref) => {
    const classes = useStyles();
    const listViewRef = React.useRef(null);
    
    React.useImperativeHandle(ref, () => ({
        getSelectedRow: () => listViewRef.current.getSelectedRow(),
    }));

    return <Box className={`${classes.tableContainer} add-maitenance`}>
        <ListView
            key={"add-maint"}
            ref={listViewRef}
            columns={columns}
            rows={getRowsAfterModifying(duesList)}
            isSearchRequired={false}
            wrapperClasses="table_overflow-add-maitenance"
            isPagingRequired={false} />
            <a href="javascript:void(0)" title="Add more month" onClick={addMoreDueMonth}>Add more</a>
    </Box>
})

export default PaymentDues;

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

const columns = [{
    dataField: 'id',
    text: 'ID',
    hidden: true,
    type: "TEXT"
}, {
    dataField: 'flatNo',
    text: 'Flat No',
    headerStyle: { width: 100, },
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
    type: "DATE"
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