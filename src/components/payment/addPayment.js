import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { SelectField, TextField } from '../common/fields';
import { Box, Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import APIConstants from '../../utils/apiConatants';
import AxiosApi from '../../utils/httpRequestHandler';
import { AppContext } from '../common/context/appContext';
import Constants from '../../utils/constants';
import { DATE_TIME_FORMAT, getDateForDatePicker } from '../../utils/dateHandler';


import BootstrapTable from 'react-bootstrap-table-next';
import moment from 'moment';
import ListView from '../common/listView';
import ConfirmDialog from '../common/confirmDialog';
import PaymentDues from './paymentDues';
import CustAccordion from '../common/custAccordion';

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
    rowSecondary: {
        display: "flex",
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
        marginTop: 10
    },
    rowCustomField: {
        marginTop: 10
    },
}));


const AddPayment = ({ openDialog, handleCloseDialog, payMaintenance, recordFlatId=0 }) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const bodyRef = React.useRef(null);
    const confrmDialogRef = React.useRef(null);
    const { handleBackDrop } = React.useContext(AppContext);
    const [flatId, setFlatId] = React.useState(recordFlatId);
    const [flatList, setFlatList] = React.useState([]);


    React.useEffect(() => {
        if(flatId <= 0) {
            getFlatListFromAPI();
        }
    }, []);

    const getFlatListFromAPI = async (reqParams) => {
        try {
            handleBackDrop(true);
            let response = await AxiosApi.getData(APIConstants.FLAT_DETAILS_LIST_GET, reqParams);
            let arr = response.data ? response.data.map(m => { return { key: m.id, value: m.id, text: m.flatNo } }) : [];
            arr.unshift({ key: -9990, value: "", text: "---Select Flat---" });
            setFlatList(arr);
            handleBackDrop(false);
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }

    }

    const onChangeFlatList = (event) => {
        setFlatId(event.target.value);
    }

    const handlePay = () => {
        console.log(bodyRef.current.getPaymentData())
        let data = bodyRef.current.getPaymentData();
        let { flatId, paymentMode, paymentModeRef, paymentDate, remarks, amount, selectedRows, rows, miscellaneousFields } = data;

        if (!paymentMode || paymentMode == "") {
            enqueueSnackbar("Select payment mode!", { variant: "error" });
        } else if (paymentMode === "CHEQUE" && (!paymentModeRef || paymentModeRef == "")) {
            enqueueSnackbar("Enter Cheque No!", { variant: "error" });
        } else if (amount <= 0) {
            enqueueSnackbar("Select amount to pay!", { variant: "error" });
        } else if (!paymentDate || paymentDate == "") {
            enqueueSnackbar("Select payment date!", { variant: "error" });
        }/* else if (!remarks || remarks == "") {
            enqueueSnackbar("Enter remarks!", { variant: "error" });
        } else if (!selectedRows || selectedRows.length == 0) {
            enqueueSnackbar("Select rows to pay!", { variant: "error" });
        }*/ else if (!isValidPaymentMonthList(rows, selectedRows)) {
            enqueueSnackbar("Old dues should pay first. Please select old dues!", { variant: "error" });
        } else {
            //call api to save data......
            let payMonths = data.selectedRows.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))
            payMonths = payMonths.map(m => MONTHS_SORT_FORM[m.paymentMonth] + "-" + m.paymentYear);
            payMonths = payMonths.join(", ");

            let text = "Payable months: " + payMonths + "& amount: " + amount + "/-. Are you confirm to pay?";

            confrmDialogRef.current.handleOpen({ title: "Confirmation Dialog", contentText: text, callback: saveData });

        }
    }

    const saveData = async () => {
        //payMaintenance(data);
        try {
            let data = bodyRef.current.getPaymentData();
            const { flatId, paymentMode, paymentModeRef, paymentDate, remarks, selectedRows, miscellaneousFields } = data;
            let arrRows = selectedRows.map(m => {
                return { ...m, id: 0, flatId, paymentDate }
            });

            let miscellaneousFieldValues = Object.keys(miscellaneousFields).map( m => {
                let id = m.replace("field-","");
                let event = data.eventList.find( f => f.id == id);
                return {eventId: event.id, value: miscellaneousFields[m], sessionId: event.sessionId}
            })

            let reqParams = { 
                flatId, 
                paymentMode, 
                paymentModeRef, 
                paymentDate, 
                remarks, 
                monthList: arrRows,
                miscellaneousFields: miscellaneousFieldValues, 
                //...data, monthList: arrRows, miscellaneousFields: miscellaneousFieldValues 
            }
            
            handleBackDrop(true);
            let response = await AxiosApi.postData(APIConstants.PAYMENT_SAVE, reqParams);
            handleBackDrop(false);
            enqueueSnackbar("Successfully saved.", { variant: "success" });
            print(response.data.id);
            handleCloseDialog();
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }
    }

    const print = (id) => {
        try {
            let response = AxiosApi.downloadFile(APIConstants.PAYMENT_DOWNLOAD + id);
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }
    }

    return <React.Fragment>

        <Dialog
            fullWidth={true}
            maxWidth={"md"}
            open={openDialog}
            //onClose={handleClose}
            aria-labelledby="max-width-dialog-title"
        >
            <DialogTitle id="max-width-dialog-title">Add Payment</DialogTitle>
            <DialogContent>
                {flatId <= 0 && <Box className={`${classes.rowSecondary}`}>
                    <SelectField name="flatNo" label={"Flat No"} options={flatList} style={{ width: 100 }} onChange={onChangeFlatList} />
                </Box>}
                {flatId > 0 && <Body ref={bodyRef} flatId={flatId} />}

            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                    Cancel
                </Button>
                <Button onClick={handlePay} color="primary">
                    Pay
                </Button>
            </DialogActions>
        </Dialog>
        <ConfirmDialog ref={confrmDialogRef} />
    </React.Fragment>
}


export default AddPayment;


const selectRow = {
    mode: 'checkbox',
    clickToSelect: true,
    headerColumnStyle: { width: "3%" }
};

const Body = React.forwardRef(({ flatId }, ref) => {
    const classes = useStyles();
    const addMaintenanceRef = React.useRef(null);
    const { enqueueSnackbar } = useSnackbar();
    const [paymentTypeList, setPaymentTypeList] = React.useState([{ value: "", text: "" }, { value: "1", text: "Building Paint" }, { value: "2", text: "Durga Puja" }]);
    const { handleBackDrop } = React.useContext(AppContext);
    const [data, setData] = React.useState({});
    const [duesList, setDuesList] = React.useState([]);
    const [paymentMode, setPaymentMode] = React.useState("");
    const [paymentModeRef, setPaymentModeRef] = React.useState("");
    const [paymentDate, setPaymentDate] = React.useState(getDateForDatePicker());
    const [remarks, setRemarks] = React.useState("");
    const [arrPaymentTypeId, setArrPaymentTypeId] = React.useState([]);
    const [amountWillPay, setAmountWillPay] = React.useState(0);
    const [miscellaneousFields, setMiscellaneousFields] = React.useState({});

    React.useImperativeHandle(ref, () => ({
        getPaymentData: getPaymentData
    }));

    const getPaymentData = () => {
        return {
            flatId,
            paymentMode,
            paymentModeRef,
            paymentDate,
            remarks,
            amount: amountWillPay,
            selectedRows: addMaintenanceRef.current.getSelectedRow(),
            rows: duesList ? duesList : [],
            miscellaneousFields,
            eventList: data.eventList,
        }
    }

    React.useEffect(() => {
        getAddPageDetails(flatId);
    }, [flatId]);

    const getAddPageDetails = async (id) => {
        try {
            handleBackDrop(true);
            let response = await AxiosApi.getData(APIConstants.PAYMENT_ADD_PAGE_GET + id);
            setData(response.data);
            setDuesList(response.data.duesList);
            handleBackDrop(false);
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }

    }

    const handlePaymentDate = (event) => {
        setPaymentDate(event.target.value)
    }

    const handlePaymentMode = (event) => {
        setPaymentMode(event.target.value)
    }

    const handleRemarks = (event) => {
        setRemarks(event.target.value)
    }

    const handleAmountWillPay = () => {
        let row = addMaintenanceRef.current ? addMaintenanceRef.current.getSelectedRow() : [];
        let maintenance = row.reduce((accumulator, obj) => {
            return accumulator + parseInt(obj.amount);
        }, 0);

        let total = Object.values(miscellaneousFields).reduce((accumulator, a) => {
            return accumulator + parseInt(a);
        }, maintenance);
        setAmountWillPay(total);
    }

    const onChangeCustomField = (field) => (event) => {
        let obj = { ...miscellaneousFields };

        const re = /^[0-9\b]+$/;

        // if value is not blank, then test the regex

        if (event.target.value === '' || re.test(event.target.value)) {
            obj[field] = event.target.value;
        } else {
            delete obj[field];
        }
        setMiscellaneousFields(obj);
    }

    const addMoreDueMonth = async () => {
        try {
            let id = 0;
            let month = 0;
            let year = 0;
            if(duesList && duesList.length > 0) {
                let lastMonth = duesList[duesList.length -1];
                if(lastMonth) {
                    id = parseInt(lastMonth.id);
                    month = parseInt(lastMonth.paymentMonth);
                    year = parseInt(lastMonth.paymentYear);
                }
            }
            handleBackDrop(true);
            let response = await AxiosApi.getData(APIConstants.PAYMENT_DETAILS_ADVANCE_PAYMENT_DUES_GET+flatId+"/"+month+"/"+year);
            if(response.httpStatusCode == 200 && response.statusCode == 100) {
                console.log(response.data);
                duesList.push({...response.data, id: id+1});
                setDuesList([...duesList]);
            }                
            handleBackDrop(false);
        } catch(error) {
            console.error(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }
    }


    const list = [
        {
            name: "maintenance", summary: { heading: "Maintenance Dues", secondaryHeading: <MaintenanceHeader data={data} /> },
            children: <PaymentDues ref={addMaintenanceRef} flatId={flatId} duesList={duesList} addMoreDueMonth={addMoreDueMonth}/>
        },
        {
            name: "miscellaneous", summary: { heading: "Miscellaneous", secondaryHeading: "Miscellaneous payment fields", },
            children: <Box className={`${classes.rowSecondary}`}>
                {(data && data.eventList) && data.eventList.map(m => { return <CustomPaymentField {...m} flatId={flatId} onChange={onChangeCustomField} values={miscellaneousFields} /> })}
            </Box>
        }
    ]
    return <Box>


        {(flatId || flatId > 0) && <React.Fragment>

            {flatId && <CustAccordion list={list} />}
            <Box className={classes.row}>
                <SelectField name="paymentMode" label="Payment Mode" options={paymentMods} style={{ width: 100 }} onChange={handlePaymentMode} />
                {(paymentMode == "CHEQUE" || paymentMode == "ONLINE") && <>
                    <Box className={classes.elementSpace}></Box>
                    <TextField name="paymentModeRef" label={paymentMode == "CHEQUE" ? "Cheque No." : "Online Ref. No."} size="small" defaultValue={paymentModeRef} value={paymentModeRef} onChange={(e) => setPaymentModeRef(e.target.value)} />
                </>}
                <Box className={classes.elementSpace}></Box>
                <TextField name="amount" label="Amount(Click to check total amount)" size="small" defaultValue={amountWillPay} value={amountWillPay} InputProps={{ readOnly: true, }} onFocus={handleAmountWillPay} InputProps={{ style: { width: 200 } }} />
                <Box className={classes.elementSpace}></Box>
                <TextField name="paymentDate" label="Payment Date" size="small" type="date" defaultValue={paymentDate} onChange={handlePaymentDate} />
                <Box className={classes.elementSpace}></Box>
                <TextField multiline={true} key="remarks" name="remarks" label="Remarks" size="small" InputProps={{ style: { width: 250 } }} defaultValue="" onChange={handleRemarks} />
            </Box>

        </React.Fragment>}



    </Box>
})

const CustomPaymentField = ({ id, name, dueAmount, onChange = () => () => { }, values }) => {
    const classes = useStyles();
    const addMaintenanceRef = React.useRef(null);
    let value = values["field-" + id];
    value = value ? value : "";

    let label = name +"( Due Amount: " + dueAmount + ")";
    return <>
        <Box className={classes.rowCustomField}>
            <Typography style={{marginBottom: 5}}>{label}</Typography>
            <TextField name={"field-" + id} label={name} size="small" onChange={onChange("field-" + id)} value={value} />
            <Box className={classes.elementSpace}></Box>
        </Box>
        <Box className={classes.elementSpace}></Box>
    </>
}

const MaintenanceHeader = ({ data }) => {
    const classes = useStyles();
    return <Box className={`${classes.row}`} style={{ marginTop: 0 }}>
        <Box className={classes.elementSpace}></Box>
        <Box className={classes.label}>Current Owner: {getCurrentOwner(data)}</Box>
        <Box className={classes.elementSpace}></Box>
        <Box className={classes.label} style={{ color: "red" }}>Total Maintenance Due: ${getTotalDuesAmount(data)}/-</Box>
    </Box>
}

const getCurrentOwner = ({ currentOwner }) => {

    if (currentOwner) {
        let { firstName = "", lastName = "", contactNo1 = "" } = currentOwner ? currentOwner : {};
        let name = firstName;
        name += name != "" ? " " + lastName : "";
        name += name != "" ? ", " + contactNo1 : "";
        return name;
    }
    return "Empty";
}

const getTotalDuesAmount = ({ duesList }) => {
    if (duesList) {
        return duesList.reduce((accumulator, obj) => {
            return accumulator + parseInt(obj.amount);
        }, 0);
    }
    return 0;
}

const isValidPaymentMonthList = (rows, selectedRows) => {
    let isValid = true;
    let ids = rows.map(m => m.id);
    let selectedIds = selectedRows.map(m => m.id);
    selectedIds = selectedIds.sort((a, b) => {return a-b});
    selectedIds.forEach((f, i) => {
        console.log(f, ids[i]);
        if (f !== ids[i]) {
            isValid = false;
            return;
        }
    })
    console.log("f, ids[i]");
    return isValid;
}


const options = [
    { value: "A/0/7", text: "A/0/7" },
    { value: "A/0/7", text: "A/0/7" },
    { value: "A/0/7", text: "A/0/7" },
]

const paymentMods = [
    { value: "", text: "" },
    { value: "CASH", text: "CASH" },
    { value: "CHEQUE", text: "CHEQUE" },
    { value: "ONLINE", text: "ONLINE" },
]



const columns = [{
    dataField: 'id',
    text: 'ID',
    hidden: true,
    type: "TEXT"
}, {
    dataField: 'flatNo',
    text: 'Flat No',
    headerStyle: { width: 500, },
    headerAttrs: { title: 'Flat No' },
    type: "TEXT"
}, {
    dataField: 'paymentForSessionName',
    text: 'Session Name',
    headerStyle: { width: 500, },
    headerAttrs: { title: 'Session Name' },
    type: "TEXT"
}, {
    dataField: 'paymentMonth',
    text: 'Payment For Month',
    sort: true,
    headerStyle: { width: 150, },
    headerAttrs: { title: 'Payment For Month' },
    type: "DATE"
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



