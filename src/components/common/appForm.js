import { Button, Grid } from '@material-ui/core';
import React from 'react';
import { AppContext } from './context/appContext';
import FormBuilder from './formBuilder';
import AxiosApi from '../../utils/httpRequestHandler';
import Utils from '../../utils/utils';
import { useSnackbar } from 'notistack';
import CONSTANSTS from '../../utils/constants';
import CustAccordion from './custAccordion';
import ExpenseItems from '../expenses/expenseItems';



const AppForm = React.forwardRef(({
    object = "",
    fields = [],
    handleClose = () => { },
    submitButton = <Button type="submit" color="primary" variant="outlined"> Save </Button>,
    id = 0,
    isValidFormData,
    callbackOnSubmit,
    ...otherProps
}, ref) => {

    const { enqueueSnackbar } = useSnackbar();
    const { handleBackDrop, handleDialogOpen } = React.useContext(AppContext);
    const [formFields, setFormFields] = React.useState(JSON.parse(JSON.stringify(fields)));
    const [data, setData] = React.useState();


    React.useImperativeHandle(ref, () => ({

    }));

    React.useEffect(() => {
        if (id && id > 0) {
            getDataFromAPI(id);
        }
    }, [id]);

    const getDataFromAPI = async (id) => {
        try {
            handleBackDrop(true);
            let response = await AxiosApi.getData(Utils.getGETApiUrl(object) + id, null);
            setData(response.data);
            handleBackDrop(false);
        } catch (error) {
            console.error(error.message);
        }
    }


    const onSubmit = async data => {
        console.log(data);
        try {
            if (isValidFormData && isValidFormData instanceof Function && !isValidFormData(data)) {
                return false;
            }

            handleBackDrop(true);
            let msg = "Successfully saved.";
            if (id && id > 0) {
                data.id = id;
                msg = "Successfully updated."
            }
            let response = await AxiosApi.postData(Utils.getFormPOSTApiUrl(object), data);
            console.log(response.data);
            enqueueSnackbar(msg, { variant: "success" });
            if (callbackOnSubmit && callbackOnSubmit instanceof Function) {
                callbackOnSubmit(response.data);
            }
            handleBackDrop(false);
            handleClose();
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
            handleBackDrop(false);
        }
    }
    return <Grid container >
        <Grid item xs={12}>
            <FormBuilder
                fields={formFields}
                data={data}
                onSubmit={onSubmit}
                cancelEvent={handleClose}
                submitButton={submitButton}
                //externalComponent={getExternalComponent(object, otherProps, data)}
                {...otherProps} />
        </Grid>
    </Grid>
});


export default AppForm;


const getExternalComponent = (object, props, data) => {
    const list = [];

    if (object == CONSTANSTS.OBJECTS.EXPENSES) {
        const { expenseItemsRef } = props;
        list.push(
            {
                name: "itemHeads", summary: { heading: "Item Heads", secondaryHeading: "" },
                children: <ExpenseItems ref={expenseItemsRef} data={data ? data.items : []} />
            }
        )
    }
    return list.length > 0 ? <CustAccordion list={list} /> : null;
}