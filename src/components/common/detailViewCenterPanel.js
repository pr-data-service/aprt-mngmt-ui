import { Box, Paper } from '@material-ui/core';
import React from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import CONSTANSTS from '../../utils/constants';
import PageHeader from './pageHeader';
import Utils from '../../utils/utils';
import { useSnackbar } from 'notistack';
import DetailViewService from '../../service/detailViewService';
import { AppContext } from './context/appContext';
import { VIEW_COLUMNS } from '../../utils/columnConstants';
import CustomTab from './customTab';
import PaymentDetailsListView from '../payment/paymentDetailsListView';
import ExpenseItemsListView from '../expenses/expenseItemsListView';
import ExpenseHeadForm from '../expenses/expenseHeadForm';
import ExpensesHeadListView from '../expenses/expenseHeadListView';
import ExpensesListView from '../expenses/expensesListView';
import FlatDetailsListView from '../flat-details/flatDetailsListView';
import PaymentListView from '../payment/paymentListView';
import MaintenanceDuesListView from '../payment/maintenanceDuesListView';
import NotesView from '../notes/notesView';
import MaintenanceListView from '../maintenance/maintenanceListView';

const { OBJECTS } = CONSTANSTS;
const columns = VIEW_COLUMNS[CONSTANSTS.OBJECTS.PAYMENT];


const useStyles = makeStyles((theme) => ({
    root: {
        padding: 10
    },
    container: {
        minHeight: 460,
    },
    field: {
        padding: 5
    },
    fieldLabel: {
        padding: "0px 5px 0px 5px",
        backgroundColor: "aliceblue",
        fontWeight: "bold",
        color: "#0000003d"
    },
    fieldValue: {
        padding: "0px 5px 0px 5px",
    },
    leftPanel: {
        width: "15%"
    }
}));
const DetailViewCenterPanel = React.forwardRef(({ object }, ref) => {
    const classes = useStyles();
    const params = useParams();
    const location = useLocation();
    const { enqueueSnackbar } = useSnackbar();
    const { handleBackDrop } = React.useContext(AppContext);

    const [data, setData] = React.useState(null);

    React.useImperativeHandle(ref, () => ({

    }));




    React.useEffect(() => {
        //getDataFromAPI();
    }, []);

    const getDataFromAPI = async () => {
        try {
            handleBackDrop(true);
            let response = await DetailViewService.getDataFromAPI(object, params.id);
            setData(response.data);
            handleBackDrop(false);
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }

    }

    const FieldLabeValue = ({ dataField, text, data }) => {
        let value = data ? data[dataField] : "";
        value = value && value !== "" ? value : "Empty";
        return <Box className={classes.field}>
            <Box className={classes.fieldLabel}>{text}</Box>
            <Box className={classes.fieldValue}>{value}</Box>
        </Box>
    }

    let cols = columns.filter( f => !f.hidden);
    return <Box>
        <CustomTab key={"cust-tab-"+object} tabList={getTabsData(object)}/>
        
    </Box>

})

export default DetailViewCenterPanel;

const getTabsData = (object) => {
    if(object.toUpperCase() == OBJECTS.FLAT_DETAILS) {
        return [
            {value: "1", label: "Notes", object: OBJECTS.NOTES, children: <NotesView />},
            {value: "2", label: "Payment", object: OBJECTS.PAYMENT, children: <PaymentListView />},
            {value: "3", label: "Payment Details", object: OBJECTS.PAYMENT_DETAILS, children: <PaymentDetailsListView />},
            {value: "4", label: "Maintenance Dues", object: OBJECTS.PAYMENT_DETAILS, children: <MaintenanceDuesListView />},
            {value: "5", label: "Maintenance(Monthly)", object: OBJECTS.PAYMENT_DETAILS, children: <MaintenanceListView />},
        ]
    } else if(object.toUpperCase() == OBJECTS.PAYMENT) {
        return  [
            {value: "1", label: "Notes", object: OBJECTS.NOTES, children: <NotesView />},
            {value: "2", label: "Payment Details", object: OBJECTS.PAYMENT_DETAILS, children: <PaymentDetailsListView />},
        ]
    } else if(object.toUpperCase() == OBJECTS.EXPENSE) {
        return [
            {value: "1", label: "Notes", object: OBJECTS.NOTES, children: <NotesView />},
            {value: "2", label: "Expense Items", object: OBJECTS.EXPENSE_ITEMS, children: <ExpenseItemsListView />},
        ]
    } else if(object.toUpperCase() == OBJECTS.EVENTS) {
        return [
            {value: "1", label: "Notes", object: OBJECTS.NOTES, children: <NotesView />},
            {value: "2", label: "Expense", object: OBJECTS.EXPENSE, children: <ExpensesListView object={object}/>},
            {value: "3", label: "Payment Details", object: OBJECTS.PAYMENT, children: <PaymentDetailsListView />},
            {value: "4", label: "Dues ListView", object: OBJECTS.PAYMENT_DETAILS, children: <MaintenanceDuesListView />},
        ]
    }

    return [];
}