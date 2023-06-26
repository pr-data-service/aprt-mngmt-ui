import React from 'react'
import { Box, Button, Grid, makeStyles } from '@material-ui/core';
import { AppContext } from '../common/context/appContext';
import CONSTANSTS from '../../utils/constants';
import AxiosApi from '../../utils/httpRequestHandler';
import APIConstants from '../../utils/apiConatants';

import { VIEW_COLUMNS } from '../../utils/columnConstants';
import { useSnackbar } from 'notistack';
const { VALIDATOR_TYPE_REQUIRED, VALIDATOR_TYPE_OPTIONAL } = CONSTANSTS.FORM_CONSTANTS;
const columns = VIEW_COLUMNS[CONSTANSTS.OBJECTS.OWNERS];



const useStyles = makeStyles((theme) => ({
    container: {
        padding: 10
    },
    row: {
        padding: '5px 10px',
        "&:hover .show-events": {
            display: 'block !important',
        }
    },
    header: {
        color: "#0a0b0b85",
        fontWeight: "bold",
        fontSize: 20
    },
    listContainer: {
        //width: "80%"
    },
    addIcon: {
        cursor: "pointer",
        marginLeft: 10
    }
}));

const Transaction = () => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { handleBackDrop, handleDialogOpen, handleDialogClose } = React.useContext(AppContext);

    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        getDataFromAPI();
    }, []);

    const getDataFromAPI = async (reqParams) => {
        try {
            handleBackDrop(true);
            let response = await AxiosApi.getData(APIConstants.ACCOUNT_TRANSACTION_LIST_GET, reqParams);
            setData(response.data);        
            handleBackDrop(false);
        } catch (error) {
            console.error(error.message);      
            handleBackDrop(false);
        }        
    }
    
    const addEvt = () => {
        //ownersRegFormRef.current.handleOpen();
        handleDialogOpen({ ...defaultFormProps, handleClose: handleDialogClose, callbackOnSubmit: (data) => getDataFromAPI() });
    }

    const deleteEvt = (id) => async () => {
        try {
            handleBackDrop(true);
            let response = await AxiosApi.deleteData(APIConstants.ACCOUNT_TRANSACTION_DELETE+id);
            console.log(response.data);
            handleBackDrop(false);
            getDataFromAPI();
            enqueueSnackbar("Successfully deleted.", { variant: "success" });
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
            handleBackDrop(false);
        }
    }


    return <Box className={classes.container}>
        <Grid container>
            <Grid item xs={8}>
                <span className={classes.header} >Transactions</span>
                <i className={`fa fa-plus ${classes.addIcon}`}  aria-hidden="true" onClick={addEvt} title="Add Transaction"></i>
            </Grid>
            <Grid item xs={4}></Grid>
        </Grid>
        <Box className={classes.listContainer}>
            <Grid container className={classes.row} style={  {background: '#e5e5e563', color: "#0a0b0b85", fontWeight: "bold"}}>
                <Grid item xs={1}>Srl. No.</Grid>
                <Grid item xs={2}>Type</Grid>
                <Grid item xs={2}>Ref. No</Grid>
                <Grid item xs={1}>Amount</Grid>
                <Grid item xs={4}>Remarks</Grid>
                <Grid item xs={1}>Trans. Date</Grid>
                <Grid item xs={1}></Grid>
            </Grid>
        {data && data.map( (m, index) => <>
            <Grid container className={classes.row} style={  (index%2 != 0) ? {background: '#e5e5e563'} : {}}>
            <Grid item xs={1}>{index+1}</Grid>
            <Grid item xs={2}>{m.type}</Grid>
            <Grid item xs={2}>{m.refNo}</Grid>
            <Grid item xs={1}>{m.amount}</Grid>
            <Grid item xs={4}>{m.remarks}</Grid>
            <Grid item xs={1}>{m.transDate}</Grid>
            <Grid item xs={1}>
                <span className={"show-events"} style={{cursor: "pointer", display: "none", textAlign: "center"}} title="Click here to delete." onClick={deleteEvt(m.id)}>
                    <i className="fa fa-trash" aria-hidden="true"></i>
                </span>
            </Grid>
            </Grid>
        </>)}
        
        </Box>
    </Box>
}

export default Transaction

const fields = [
    // { "name": "loginId", label: "Login ID", defaultValue: "", "type": "TEXT", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    { "name": "type", label: "Type", defaultValue: "", type: "LIST", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED,
        options: [{ value: "DEPOSIT", text: "DEPOSIT" }, { value: "WITHDRAW", text: "WITHDRAW" }],
    },
    { "name": "refNo", label: "Referance No.", defaultValue: "", "type": "TEXT", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    { "name": "amount", label: "Amount", defaultValue: "", "type": "NUMBER", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    { "name": "transDate", label: "Transaction Date", defaultValue: "", "type": "DATE", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    { "name": "remarks", label: "Remarks", defaultValue: "", "type": "LONG_TEXT", "isHeaden": false, validationType: VALIDATOR_TYPE_OPTIONAL },
];

const defaultFormProps = {
    title: "Account Transactions", 
    contentText: "", 
    maxWidth: "xs", 
    type:"FORM", 
    object: CONSTANSTS.OBJECTS.ACCOUNT_TRANSACTION, 
    fields: fields, 
}
