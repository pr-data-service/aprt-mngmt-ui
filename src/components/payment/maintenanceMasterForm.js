import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormBuilder from '../common/formBuilder';
import AppDialog from '../common/appDialog';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';

import CONSTANSTS from '../../utils/constants';
import APIConstants from '../../utils/apiConatants';
import { AppContext } from '../../components/common/context/appContext';
import AxiosApi from '../../utils/httpRequestHandler';

const { VALIDATOR_TYPE_REQUIRED, VALIDATOR_TYPE_OPTIONAL } = CONSTANSTS.FORM_CONSTANTS;

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
}));

const MaintenanceMasterForm = React.forwardRef(({getListViewData=()=> {}}, ref) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [id, setId] = React.useState(0);
    const [data, setData] = React.useState();

    const {handleBackDrop} = React.useContext(AppContext);

    React.useImperativeHandle(ref, () => ({
        handleOpen: handleOpen
      }));

      React.useEffect(() => {
        if(!id || id<=0) {
            setData(null);
        }
    }, [id])

    const [open, setOpen] = React.useState(false);

    const handleOpen = (id) => {
        setId(id);
        setOpen(true);
        if(id && id>0) {
            getDataFromAPI(id);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getDataFromAPI = async (id) => {
        try {
            handleBackDrop(true);
            let response = await AxiosApi.getData(APIConstants.FLAT_DETAILS_GET + id, null);
            setData(response.data);
            handleBackDrop(false);
        } catch (error) {
            console.error(error.message);
        }
    }

    
    const onSubmit = async data => {
        console.log(data);
        try{
            handleBackDrop(true);
            let msg = "Successfully saved.";
            if(id && id > 0) {
                data.id = id;
                msg="Successfully updated."
            }
            let response = await AxiosApi.postData(APIConstants.MAINTANANCE_MASTER_CREATE_OR_UPDATE, data);
            console.log(response.data);
            handleBackDrop(false);
            getListViewData();
            enqueueSnackbar(msg, { variant: "success" });
            handleClose();
        }catch(error){
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
            handleBackDrop(false);
        }
    }


    return <div className={classes.root}>
        <Dialog open={open} onClose={handleClose} >
            <DialogTitle id="form-dialog-title">Flat Details Registration</DialogTitle>
            <DialogContent>

                <Grid container >
                    <Grid item xs={12}>
                        <FormBuilder fields={fields} data={data} onSubmit={onSubmit} cancelEvent={handleClose} submitButton={<Button type="submit" color="primary"> Save </Button>}/>
                    </Grid>

                </Grid>
            </DialogContent>
            
        </Dialog>

    </div>
});

export default MaintenanceMasterForm;


const fields = [
    { "name": "amount", label: "Amount", defaultValue: "", "type": "NUMBER", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED  },
    { "name": "fromDate", label: "From Date", defaultValue: "", "type": "DATE", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED  },
    { "name": "toDate", label: "To Date", defaultValue: "", "type": "DATE", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED  },
]



