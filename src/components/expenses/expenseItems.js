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

export default ExpenseItems;

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


