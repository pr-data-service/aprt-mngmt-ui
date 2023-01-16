import { Box, Button, Grid, makeStyles } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useLocation } from 'react-router-dom';
import APIConstants from '../../utils/apiConatants';
import AxiosApi from '../../utils/httpRequestHandler';
import { AppContext } from '../common/context/appContext';
import FormBuilder from '../common/formBuilder';
import CONSTANSTS from '../../utils/constants';
import Utils from '../../utils/utils';
import {convertDatePickerDateToAPIDate} from '../../utils/dateHandler';

const { VALIDATOR_TYPE_REQUIRED, VALIDATOR_TYPE_OPTIONAL } = CONSTANSTS.FORM_CONSTANTS;

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
        width: "80%"
    }
}));

const SessiononListView = () => {
    const classes = useStyles();
    const location = useLocation();
    const { enqueueSnackbar } = useSnackbar();
    const { handleBackDrop, handleDialogOpen, handleDialogClose } = React.useContext(AppContext);

    const [data, setData] = React.useState(null);


    React.useEffect(() => {
        getDataFromAPI();
    }, []);

    const getDataFromAPI = async (reqParams) => {
        try {
            handleBackDrop(true);
            let response = await AxiosApi.getData(APIConstants.SESSION_DETAILS_LIST_GET, reqParams);
            setData(response.data);
            handleBackDrop(false);
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }

    }

    const onSubmit = async (data) => {
        try {
            handleBackDrop(true);
            let msg = "Successfully saved.";
debugger
            let obj = {...data};
            obj.fromDate = convertDatePickerDateToAPIDate(data.fromDate);
            obj.toDate = convertDatePickerDateToAPIDate(data.toDate);
            let response = await AxiosApi.postData(APIConstants.SESSION_DETAILS_CREATE_OR_UPDATE, obj);
            console.log(response.data);
            handleBackDrop(false);
            getDataFromAPI();
            enqueueSnackbar(msg, { variant: "success" });
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
            handleBackDrop(false);
        }
    }
    

    const deleteEvt = (id) => async () => {
        try {
            handleBackDrop(true);
            let response = await AxiosApi.deleteData(APIConstants.SESSION_DETAILS_DELETE+id);
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
            <Grid item xs={8} className={classes.header}>Add Session</Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={8}>
                <FormBuilder fields={fields} gridItemXS={4}  onSubmit={onSubmit} submitButton={<Button type="submit" color="primary" variant='outlined'> Save </Button>} />
            </Grid>
            <Grid item xs={4}></Grid>
        </Grid>
        <Grid container>
            <Grid item xs={12} className={classes.header}>Session List</Grid>
        </Grid>
        <Box className={classes.listContainer}>
        {data && data.map( (m, index) => <>
            <Grid container className={classes.row} style={  (index%2 == 0) ? {background: '#e5e5e563'} : {}}>
            <Grid item xs={5}>Name: {m.name}</Grid>
            <Grid item xs={3}>From Date: {m.fromDate}</Grid>
            <Grid item xs={3}>To Date: {m.toDate}</Grid>
            <Grid item xs={1}>
                <span className={"show-events"} style={{cursor: "pointer", display: "none"}} onClick={deleteEvt(m.id)}>
                    <i className="fa fa-trash" aria-hidden="true"></i>
                </span>
            </Grid>
            </Grid>
        </>)}
        
        </Box>
    </Box>
}

export default SessiononListView;


const fields = [
    { "name": "name", label: "Name", defaultValue: "", "type": "TEXT", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    { "name": "fromDate", label: "From Date", defaultValue: "", "type": "DATE", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    { "name": "toDate", label: "To Date", defaultValue: "", "type": "DATE", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED }, 
]