import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormBuilder from '../common/formBuilder';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';
import UsersService from '../../service/usersService';
import AxiosApi from '../../utils/httpRequestHandler';
import APIConstants from '../../utils/apiConatants';
import { AppContext } from '../../components/common/context/appContext';
import CONSTANSTS from '../../utils/constants';

const { VALIDATOR_TYPE_REQUIRED, VALIDATOR_TYPE_OPTIONAL } = CONSTANSTS.FORM_CONSTANTS;

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
}));

const EventsForm = React.forwardRef(({ getListViewData }, ref) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [id, setId] = React.useState(0);
    const [eventData, setEventData] = React.useState();
    const {handleBackDrop} = React.useContext(AppContext);


    React.useImperativeHandle(ref, () => ({
        handleOpen: handleOpen,
    }));

    const [open, setOpen] = React.useState(false);



    React.useEffect(() => {
        if(!id || id<=0) {
            setEventData(null);
        }
    }, [id])
    
    const handleOpen = (id) => {
        setId(id);
        setOpen(true);
        if(id && id>0) {
            getDataFromAPI(id);
        }
    };

    const getDataFromAPI = async (id) => {
        try {
            handleBackDrop(true);
            let response = await AxiosApi.getData(APIConstants.EVENTS_GET + id, null);
            setEventData(response.data);
            handleBackDrop(false);
        } catch (error) {
            console.error(error.message);
        }
    }

    const handleClose = () => {
        setOpen(false);
    };


    const onSubmit = async data => {
        console.log(data);
        try{
            handleBackDrop(true);
            let msg = "Successfully saved.";
            if(id && id > 0) {
                data.id = id;
                msg="Successfully updated."
            }
            let response = await AxiosApi.postData(APIConstants.EVENTS_CREATE_OR_UPDATE, data);
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
        {open && <Dialog open={open}>
            <DialogTitle id="form-dialog-title">Add Events</DialogTitle>
            <DialogContent>

                <Grid container >
                    <Grid item xs={12}>
                        <FormBuilder fields={fields} data={eventData} onSubmit={onSubmit} cancelEvent={handleClose} submitButton={<Button type="submit" color="primary" variant='outlined'> Save </Button>} />
                    </Grid>

                </Grid>
            </DialogContent>

        </Dialog>}

    </div>
});

export default EventsForm;


const callbackForField = (fieldName) => ({field, value, formFields, setFormFields, setValue, ...otherProps}) => {
    
    if(fieldName === "type") {debugger
        let fld = formFields.find( f => f.name === "targetAmount");        
        if(value === "REGULAR" && !fld.isHeaden) {
            fld.isHeaden = true;
        } else if(fld.isHeaden){
            fld.isHeaden = false;
        } 
        
        fld = formFields.find( f => f.name === "parentEventId");
        if(value === "SUBEVENT" && fld.isHeaden) {
            fld.isHeaden = false;
        } else if(!fld.isHeaden) {
            fld.isHeaden = true;
        }

        if(value !== "ONETIME") {
            //setFormFields([...formFields]);
        }
        setFormFields([...formFields]);

    } else if(fieldName === "parentEventId") {
        
        if(!value || value == "-99999" || value == "") {
            let fld = formFields.find( f => f.name === "amountPerFlat");
            if(fld && fld.isHeaden) {
                fld.isHeaden = false;
                setFormFields([...formFields]);
            }
            
        } else {
            let fld = formFields.find( f => f.name === "amountPerFlat");
            if(fld) {
                fld.isHeaden = true;
                setFormFields([...formFields]);
            }
        }
    }
    
}

const fields = [
    { "name": "name", label: "Name", defaultValue: "", "type": "TEXT", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    { "name": "description", label: "Description", defaultValue: "", "type": "TEXT", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    { "name": "targetAmount", label: "Target Amount", defaultValue: "", "type": "NUMBER", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    { "name": "amountPerFlat", label: "Amount Per Flat", defaultValue: "", "type": "NUMBER", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    // { "name": "type", label: "Type", defaultValue: "", "type": "LIST", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED, 
    //         options: Object.values(CONSTANSTS.EVENT_TYPES).map( m => {return {value: m, text: m}}),
    //         watch: {callback: callbackForField("type")}
    // },
    // { "name": "parentEventId", label: "Parent Event", defaultValue: "", "type": "LIST", "isHeaden": true, validationType: VALIDATOR_TYPE_REQUIRED, 
    //     options:[],
    //     onLoadEventProps: { apiUrl: APIConstants.EVENTS_LIST_GET, reqParams: {searchFieldName: "type", searchFieldValue: "ONETIME"}, fieldNames: ["id", "name"]},
    //     watch: {callback: callbackForField("parentEventId")}
    // },
]

