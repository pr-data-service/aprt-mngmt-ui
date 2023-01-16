import { Box, Button, FormControl, Grid, InputLabel, Select } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React from 'react';
import APIConstants from '../../utils/apiConatants';
import { convertAPIDateToDatePickerDate, getDateForDatePicker, parseAPIDate } from '../../utils/dateHandler';
import AxiosApi from '../../utils/httpRequestHandler';
import { AppContext } from '../common/context/appContext';
import { SelectField, TextField } from '../common/fields';

const AddLastPaymentDate = ({ flatId = 0, handleClose = () => { } }) => {

    const { handleBackDrop } = React.useContext(AppContext);
    const { enqueueSnackbar } = useSnackbar();
    const [data, setData] = React.useState([]);
    const [sessionList, setSessionList] = React.useState([]);
    const [session, setSession] = React.useState();
    const sessionId = session ? session.id : 0;
    const [paymentDate, setPaymentDate] = React.useState(getDateForDatePicker());

    React.useEffect(() => {
        getFlatListFromAPI();
    }, []);

    const getFlatListFromAPI = async (reqParams) => {
        try {
            handleBackDrop(true);
            let response = await AxiosApi.getData(APIConstants.SESSION_DETAILS_LIST_GET, reqParams);
            setData(response.data);
            let arr = response.data ? response.data.map(m => { return { key: m.id, value: m.id, text: m.name + " (" + m.fromDate + " to " + m.toDate + ") " } }) : [];
            arr.unshift({ key: -9990, value: ' ', text: "---Select Session---" });
            setSessionList(arr);
            handleBackDrop(false);
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }

    }

    const onChangeSessionList = (event) => {
        let session = data.find(f => f.id == event.target.value);
        setSession(session);

        setPaymentDate(convertAPIDateToDatePickerDate(session.fromDate));
    }
    const handlePaymentDate = (event) => {
        setPaymentDate(event.target.value);
    }

    const onSave = async () => {
        try {
            let frmDate = parseAPIDate(session.fromDate);
            let toDate = parseAPIDate(session.toDate);
            let date = new Date(paymentDate);
            if (date >= frmDate && date <= toDate) {
                console.log(paymentDate);
                let data = {
                    flatId,
                    paymentId: -9999,
                    paymentMonth: date.getMonth() + 1, //January is 0!
                    paymentYear: date.getFullYear(),
                    eventId: 1,
                    paymentForSessionId: 0,
                }
                handleBackDrop(true);
                let response = await AxiosApi.postData(APIConstants.PAYMENT_DETAILS_CREATE_OR_UPDATE, data);
                handleBackDrop(false);
                enqueueSnackbar("Successfully saved.", { variant: "success" });
                handleClose(true);
            }
        } catch (error) {
            console.log(error.message);
            handleBackDrop(false);
            enqueueSnackbar(error.message, { variant: "error" });
        }

    }

    return <Grid container>
        <Grid item xs={6}>
            <SelectField name="sessionId" label={"Session Name"} autoWidth={true} options={sessionList} value={sessionId} style={{ width: "100%" }} onChange={onChangeSessionList} />
        </Grid>
        <Grid item xs={6}>
            {sessionId > 0 &&
                <TextField name="paymentDate" label="Payment Date" size="small" type="date" value={paymentDate} onChange={handlePaymentDate} />}
        </Grid>
        <Grid item xs={12} style={{ justifyContent: "end", display: "flex" }}>
            <Button variant='outlined' color="primary" onClick={() => handleClose(false)}> Cancel </Button>
            <Box style={{ width: 10 }}></Box>
            <Button variant='outlined' color="primary" onClick={onSave}> Save </Button>
        </Grid>
    </Grid>
}

export default AddLastPaymentDate;
