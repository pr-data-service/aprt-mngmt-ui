import { Button, Grid, makeStyles } from "@material-ui/core";
import { Box } from "@mui/material";
import React from "react";
import APIConstants from "../../utils/apiConatants";
import FormBuilder from "../common/formBuilder";
import AxiosApi from '../../utils/httpRequestHandler';
import CONSTANSTS from "../../utils/constants";

const { VALIDATOR_TYPE_REQUIRED, VALIDATOR_TYPE_OPTIONAL } = CONSTANSTS.FORM_CONSTANTS;

const useStyles = makeStyles(()=>({
    header: {
        color: "#0a0b0b85",
        fontWeight: "bold",
        fontSize: 20,
        paddingTop: 10,
        paddingBottom:10,
    },
    container: {
        paddingLeft: 10,
    },
    formContainer: {
        // width: '20%',
    }
}));



const EmailSetup = () => {
    let classes= useStyles();
    const [data, setData] = React.useState(Object);

    React.useEffect(()=>{
        getDataFromAPI();
    },[])

    const getDataFromAPI = async() => {
        try {
            let response = await AxiosApi.getData(APIConstants.EMAIL_SETUP_GET);
            delete response.data["password"]
            setData(response.data);
            console.log(response.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    const onSubmit = async (obj) => {
        try {
            console.log(obj);
            let response = await AxiosApi.postData(APIConstants.EMAIL_SETUP_CREATE_OR_UPDATE, obj);
            console.log(response.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    const fields = [
        { "name": "email", label: "Email", defaultValue: "", "type": "TEXT", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
        { "name": "password", label: "Password", defaultValue: "", "type": "PASSWORD", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED},
        { "name": "isActive", label: "Is Active", defaultValue: "", "type": "CHECK_BOX", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    ];

    return <Box className={classes.container}>
        <Grid className={classes.header}>Email Setup</Grid>
        <Grid item xs={3} className={classes.formContainer}>
            <FormBuilder fields={fields} onSubmit={onSubmit} gridItemXS={12} submitButton={<Button type="submit" color="primary" variant='outlined'> Save </Button>} data={data}/>
        </Grid>
    </Box>
}

export default EmailSetup;