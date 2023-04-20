import { Button, Grid, makeStyles } from "@material-ui/core";
import { Box } from "@mui/material";
import React from "react";
import APIConstants from "../../utils/apiConatants";
import FormBuilder from "../common/formBuilder";
import AxiosApi from '../../utils/httpRequestHandler';
import CONSTANSTS from "../../utils/constants";
import { useSnackbar } from 'notistack';


const { VALIDATOR_TYPE_REQUIRED, VALIDATOR_TYPE_OPTIONAL } = CONSTANSTS.FORM_CONSTANTS;

const useStyles = makeStyles(() => ({
    header: {
        color: "#0a0b0b85",
        fontWeight: "bold",
        fontSize: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    mainContainer: {
        display: 'flex',
        // justifyContent: 'space-between',
    },
    container: {
        paddingLeft: 10,
        width: '50%',
    },
    formContainer: {
        // width: '20%',
    }
}));



const EmailSetup = () => {
    let classes = useStyles();
    let { enqueueSnackbar } = useSnackbar();
    const [data, setData] = React.useState(Object);
    const [checkboxes, setCheckboxes] = React.useState([]);

    React.useEffect(() => {
        getDataFromAPI();
        getServiceDataFromAPI();
    }, [])

    const getDataFromAPI = async () => {
        try {
            let response = await AxiosApi.getData(APIConstants.EMAIL_SETUP_GET);
            delete response.data["password"]
            setData(response.data);
            console.log(response.data);
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }
    }

    const getServiceDataFromAPI = async () => {
        try {
            let response = await AxiosApi.getData(APIConstants.EMAIL_SERVICE_GET);
            setCheckboxes(response.data);
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }
    }

    const onSubmit = async (obj) => {
        try {
            let response = await AxiosApi.postData(APIConstants.EMAIL_SETUP_CREATE_OR_UPDATE, obj);
            enqueueSnackbar("Email setup successfully updated.", { variant: "success" });
        } catch (error) {
            console.log(error.message, { variant: "error" });
        }
    }

    const onSubmitService = async (obj) => {
        try {
            // obj.isActive = value;
            let response = await AxiosApi.postData(APIConstants.EMAIL_SERVICE_CREATE_OR_UPDATE, obj);
            enqueueSnackbar("Email service successfully updated.", { variant: "success" });
            getServiceDataFromAPI();
        } catch (error) {
            console.log(error.message, { variant: "error" });
        }
    }

    const fields = [
        { "name": "email", label: "Email", defaultValue: "", "type": "TEXT", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
        { "name": "password", label: "Password", defaultValue: "", "type": "PASSWORD", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
        { "name": "isActive", label: "Is Active", defaultValue: "", "type": "CHECK_BOX", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    ];

    const defaultCheckboxes = [
        { id: null, isActive: false, type: 'Payment' },
        { id: null, isActive: false, type: 'Voucher' },
    ];

    return <Box className={classes.mainContainer}>
        <Box className={classes.container}>
            <Grid className={classes.header}>Email Setup</Grid>
            <Grid item xs={6} className={classes.formContainer}>
                <FormBuilder fields={fields} onSubmit={onSubmit} gridItemXS={12} submitButton={<Button type="submit" color="primary" variant='outlined'> Save </Button>} data={data} />
            </Grid>
        </Box>
        <Box className={classes.container}>
            <Grid className={classes.header}>Email Service</Grid>
            <Grid container spacing={2} item xs={6}>
                {
                    defaultCheckboxes.map((m, index) => {
                        checkboxes && checkboxes.map((e) => {
                            if (m.type === e.type) {
                                m = e;
                            }
                        })
                        return <Grid item xs={6} key={index + "p"}>
                            <label style={{fontWeight: 'normal', fontSize: 12}}>{m.type}</label><span>{" "}</span>
                            <input type="checkbox" checked={m.isActive} onChange={(e) => { let obj ={...m, isActive: e.currentTarget.checked}; onSubmitService(obj)}} />
                        </Grid>
                    })
                }
            </Grid>
        </Box>
    </Box>
}

export default EmailSetup;
