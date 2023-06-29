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
import Utils from '../../utils/utils';
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

const ExpensesForm = React.forwardRef(({ getListViewData }, ref) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [id, setId] = React.useState(0);
    const [expenseData, setExpenseData] = React.useState();
    const expenseItemsRef = React.useRef(null);
    const {handleBackDrop} = React.useContext(AppContext);
    const isDetailView = Utils.isDetailView();
    const params = useParams();
    const [open, setOpen] = React.useState(false);

    React.useImperativeHandle(ref, () => ({
        handleOpen: handleOpen,
    }));

    React.useEffect(() => {
        if(!id || id<=0) {
            setExpenseData(null);
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
            let response = await AxiosApi.getData(APIConstants.EXPENSES_GET + id, null);
            setExpenseData(response.data);
            handleBackDrop(false);
        } catch (error) {
            console.error(error.message);
        }
    }

    const handleClose = () => {
        setOpen(false);
    };

    const isValidItemHeads = (itemsValues) => {
        let isValid = true;
        if(itemsValues) {
            itemsValues.map( m => {
                if(isValid) {
                    if(!m.itemHead || m.itemHead === "" || !m.amount) {
                        isValid = false;
                    } else {
                        try {
                            parseFloat(m.amount)
                        } catch (error) {
                            isValid = false;
                        }
                    }                    
                }
                
            })
        } else {
            isValid = false;
        }
        return isValid;
    }

    const onSubmit = async data => {
        console.log(data);               
        try{
            let itemsValues = expenseItemsRef.current.getItemsValues();
            if(itemsValues.length <= 0) {
                enqueueSnackbar("Item Heads not found. Please add at least one.", { variant: "error" });
                return;
            } else if(!isValidItemHeads(itemsValues)) {
                enqueueSnackbar("Please check Item Heads", { variant: "error" });
                return;
            }

            handleBackDrop(true);
            let msg = "Successfully saved.";
            if(id && id > 0) {
                data.id = id;
                msg="Successfully updated."
            }
            data.items = itemsValues;
            if (isDetailView) {
                data.eventId = params.id
            }
            let response = await AxiosApi.postData(APIConstants.EXPENSES_CREATE_OR_UPDATE, data);
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

    const list = [
        {
            name: "itemHeads", summary: { heading: "Item Heads", secondaryHeading: ""},
            children: <ExpenseItems ref={expenseItemsRef} data={expenseData? expenseData.items : []}/>
        }
    ]

    const getFields = (fields) => {
        let arr = [...fields];
        let field = arr.find(f => f.name == "eventId");
        field.isHeaden = isDetailView ? true : false;
        return arr;
    };

    return <div className={classes.root}>
        <Dialog open={open}>
            <DialogTitle id="form-dialog-title">Add Expense</DialogTitle>
            <DialogContent>

                <Grid container >
                    <Grid item xs={12}>
                        <FormBuilder 
                            fields={getFields(fields)} 
                            data={expenseData} 
                            onSubmit={onSubmit} 
                            cancelEvent={handleClose} 
                            submitButton={<Button type="submit" color="primary" variant="outlined"> Save </Button>} 
                            gridItemXS={6} 
                            externalComponent={<CustAccordion list={list} />}
                        />
                    </Grid>
                    
                </Grid>
            </DialogContent>

        </Dialog>

    </div>
});

export default ExpensesForm;


const fields = [
    { "name": "title", label: "Title", defaultValue: "", "type": "TEXT", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    { "name": "accountNo", label: "A/C", defaultValue: "", "type": "TEXT", "isHeaden": false, validationType: VALIDATOR_TYPE_OPTIONAL },
    // { "name": "amount", label: "Amount", defaultValue: "", "type": "NUMBER", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    { "name": "description", label: "Description", defaultValue: "", "type": "LONG_TEXT", "isHeaden": false, validationType: VALIDATOR_TYPE_OPTIONAL },
    {
        "name": "paymentMode", label: "Payment Mode", defaultValue: "", type: "LIST", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED,
        options: [{ value: "CASH", text: "CASH" }, { value: "CHEQUE", text: "CHEQUE" }, { value: "ONLINE", text: "ONLINE" }],
    },
    { "name": "expenseDate", label: "Expense Date", defaultValue: "", "type": "DATE", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    { "name": "eventId", label: "Event", defaultValue: "-99999", "type": "LIST", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED, 
            options:[],
            onLoadEventProps: { apiUrl: APIConstants.EVENTS_LIST_GET, reqParams: {}, fieldNames: ["id", "name"]}
    },
    //{ "name": "isEventExpenseHead", label: "isEventExpenseHead", defaultValue: true, "type": "CHECK_BOX", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
];


const ExpenseItems = React.forwardRef(({ data=[] }, ref) => {
    const fieldObj = {index: 0, itemHead: "", amount: 0};  
    const [fields, setFields] = React.useState([fieldObj]);
    const [fieldIndex, setFieldIndex] = React.useState(1);


    React.useImperativeHandle(ref, () => ({
        getItemsValues: () => fields
    }));

    React.useEffect(() => {
        if(data && data.length > 0) {
            const arrData = data.map( (m, index) => { return {index: index, itemHead: m.itemHead, amount: m.amount} });
            setFields(arrData);
            setFieldIndex(arrData.length);
        }        
    }, [data])

    const addItem = () => {
        fields.push({...fieldObj, index: fieldIndex });
        setFieldIndex(fieldIndex+1);
        setFields([...fields]);
    }

    const removeItem = (index) => () => {
        setFields(fields.filter( f => f.index !== index));
    }

    const setValue = (index, fieldName) => (event) => {
        let fld = fields.find( f => f.index === index);
        if(fld) {
            fld[fieldName] = event.target.value;
        } else {
            fld = {index: index,};
            fld[fieldName] = event.target.value;
            fields.push(fld);
        }
        setFields([...fields]);
    }

    return <Grid container spacing={2}>
        <Grid item xs={12}><Button color="primary" variant="outlined" onClick={addItem}> Add </Button></Grid>
        {fields.map( m => <Item {...m} removeItem={removeItem} setValue={setValue}/>)}
        
    </Grid>
})

const Item = ({index, itemHead, amount, removeItem=()=>()=>{}, setValue=()=>()=>{}}) => {
    const classes = useStyles();
    return <Grid item xs={12}>
        <Grid container spacing={3} key={"item-"+index}>
            <Grid item xs={6}>
                <TextField name={"itemHead"} label={"Item Head-"+index} size="small" className={classes.field} onChange={setValue(index, "itemHead")} value={itemHead}/>
            </Grid>
            <Grid item xs={3}>
                <TextField name="amount" label="Amount" size="small" className={classes.field} onChange={setValue(index, "amount")} value={amount}/>
            </Grid>
            <Grid item xs={3}>
                <Button color="primary" variant="outlined" onClick={removeItem(index)}> Remove </Button>
            </Grid>
        </Grid>
    </Grid>
}


