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
import { TextField } from '../common/fields';
import CustAccordion from '../common/custAccordion';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { useParams } from 'react-router-dom';

const { VALIDATOR_TYPE_REQUIRED, VALIDATOR_TYPE_OPTIONAL } = CONSTANSTS.FORM_CONSTANTS;

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    field: {
        width: "100%"
    }
}));

const ExpenseHeadForm = React.forwardRef(({ getListViewData, object, isDetailView }, ref) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [id, setId] = React.useState(0);
    const [expenseHeadData, setExpenseHeadData] = React.useState();
    const { handleBackDrop } = React.useContext(AppContext);
    const [expenseOnEvent, setExpenseOnEvent] = React.useState(false);
    const params = useParams();


    React.useImperativeHandle(ref, () => ({
        handleOpen: handleOpen,
    }));

    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        if (!id || id <= 0) {
            setExpenseHeadData(null);
        }
    }, [id])

    const handleOpen = (id) => {
        setId(id);
        setOpen(true);
        if (id && id > 0) {
            getDataFromAPI(id);
        }
    };

    const getDataFromAPI = async (id) => {
        try {
            handleBackDrop(true);
            let response = await AxiosApi.getData(APIConstants.EXPENSE_HEAD_GET + id, null);
            setExpenseHeadData(response.data);
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
        try {
            handleBackDrop(true);
            let msg = "Successfully saved.";
            if (id && id > 0) {
                data.id = id;
                msg = "Successfully updated."
            }
            if (isDetailView) {
                data.eventId = params.id
            }
            let response = await AxiosApi.postData(APIConstants.EXPENSE_HEAD_CREATE_OR_UPDATE, data);
            console.log(response.data);
            handleBackDrop(false);
            getListViewData();
            enqueueSnackbar(msg, { variant: "success" });
            handleClose();
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
            handleBackDrop(false);
        }
    }

    const handleCheckBox = (e) => {
        setExpenseOnEvent(e.target.checked);
        // let field = fields.find( f => f.name == "eventId");
        // if(e.target.checked) {
        //     field.isHeaden = false;            
        // } else {
        //     field.isHeaden = true;       
        // }
        // setFormFields([...formFields]);
    }

    const getFields = (fields) => {
        let arr = [...fields];
        let arrField = arr.filter(f => f.name == "eventId" || f.name == "empty");
        arrField.map(m => {
            m.isHeaden = !expenseOnEvent;
        });

        return arr;
    };

    return <div className={classes.root}>
        <Dialog open={open}>
            <DialogTitle id="form-dialog-title">Add Expense Head</DialogTitle>
            <DialogContent>

                <Grid container >
                    <Grid item xs={12}>
                        {!isDetailView && <FormControlLabel control={<Checkbox name="checkedC" checked={expenseOnEvent} onChange={handleCheckBox} />} label="Expense on Event" />}
                        <FormBuilder
                            fields={getFields(fields)}
                            data={expenseHeadData}
                            onSubmit={onSubmit}
                            cancelEvent={handleClose}
                            submitButton={<SubmitButton />}
                            gridItemXS={6}
                        />
                    </Grid>

                </Grid>
            </DialogContent>

        </Dialog>

    </div>
});

export default ExpenseHeadForm;


const fields = [
    {
        "name": "eventId", label: "Event", defaultValue: "", "type": "LIST", "isHeaden": true, validationType: VALIDATOR_TYPE_REQUIRED,
        options: [],
        onLoadEventProps: { apiUrl: APIConstants.EVENTS_LIST_GET, reqParams: {}, fieldNames: ["id", "name"] }
    },
    { "name": "empty", "isHeaden": false },
    { "name": "title", label: "Title", defaultValue: "", "type": "TEXT", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    { "name": "description", label: "Description", defaultValue: "", "type": "LONG_TEXT", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },

];


const SubmitButton = () => {
    return <Button type="submit" color="primary" variant="outlined"> Save </Button>
}
