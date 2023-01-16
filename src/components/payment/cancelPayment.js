import { Box, Button, Grid } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React from 'react';
import { AppContext } from '../common/context/appContext';
import { TextField } from '../common/fields';
import AxiosApi from '../../utils/httpRequestHandler';
import APIConstants from '../../utils/apiConatants';


const CancelPayment = ({id, refreshData}) => {
    const { handleBackDrop, handleDialogOpen, handleDialogClose } = React.useContext(AppContext);
    const { enqueueSnackbar } = useSnackbar();

    const [remarks, setRemarks] = React.useState("");


    const cancelPayment = async () => {
        try {
            if(remarks && remarks != "") {
                if(remarks.length < 10) {
                    enqueueSnackbar("Remarks should be more than 10 character.", { variant: "error" });
                } else {
                    handleBackDrop(true);
                    let data = {id: parseInt(id), cancelRemarks: remarks};
                    let response = await AxiosApi.patchData(APIConstants.PAYMENT_CANCEL, data);
                    console.log(response.data);
                    enqueueSnackbar("Successfully canceled.", { variant: "success" });
                    if (refreshData && refreshData instanceof Function) {
                        refreshData();
                    }
                    handleBackDrop(false);
                    handleDialogClose();
                }
            } else {
                enqueueSnackbar("Please prvide remarks.", { variant: "error" });
            }
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
            handleBackDrop(false);
        }        
    }

    return <Grid container spacing={2}>
        <Grid item xs={12}>
            <TextField 
            key={"outlined-size-small-cancel"}
            id={"outlined-size-small-cancel"}
            name={"cancel"}
            label={"Cancel Remarks"}
            variant="outlined"
            size="small"
            style={{width: "100%"}}
            multiline={true}
            minRows={5}
            onChange={(event) => setRemarks(event.target.value)}/>
        </Grid>
        <Grid item xs={7}></Grid>
        <Grid item xs={5} style={{display: "flex", justifyContent: "flex-end"}}>
            <Button onClick={handleDialogClose} color="primary" variant="outlined"> Cancel </Button>
            <Box style={{width: 10}}></Box>
            <Button onClick={cancelPayment} color="primary" variant="outlined"> Cancel Payment </Button>
        </Grid>
    </Grid>
}


export default CancelPayment;
