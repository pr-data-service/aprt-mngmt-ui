import React from 'react';
import { Box, Button, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FormBuilder from '../common/formBuilder';
import CONSTANSTS from '../../utils/constants';
import SessionDetails from './sessionDetails';
import AxiosApi from '../../utils/httpRequestHandler';
import APIConstants from '../../utils/apiConatants';
import { AppContext } from '../common/context/appContext';
import { useSnackbar } from 'notistack';
import { convertDatePickerDateToAPIDate } from '../../utils/dateHandler';

const { VALIDATOR_TYPE_REQUIRED, VALIDATOR_TYPE_OPTIONAL } = CONSTANSTS.FORM_CONSTANTS;

const useStyles = makeStyles((theme) => ({
    container: {
        // top: "50%",
        // left: "47%",
        // position: "fixed",
        // marginTop: "-11em",
        // marginLeft: "-15em",
    },
    subContainer: {
        // width: 500,
        minHeight: 450,
        margin: "20px 430px",
    },
    titleContainer: {
        width: "100%",
        height: 40,
        textAlign: "center",
        background: "aliceblue",
        fontSize: 26
    },
    subTitleContainer: {
        width: "100%",
        height: 35,
        fontSize: 20
    },
    itemContainer: {
        padding: "5px 20px"
    },
    backButtonContainer: {
        marginTop: -33,
        paddingLeft: 5
    }
}));

const RegisterProject = () => {

    const classes = useStyles();
    const [index, setIndex] = React.useState(0);
    const [apartmentDetails, setApartmentDetails] = React.useState();
    const [userDetails, setUserDetails] = React.useState();
    const [sessionDetails, setSessionDetails] = React.useState();
    const { enqueueSnackbar } = useSnackbar();
    const { handleBackDrop } = React.useContext(AppContext);
    const [password, setPassword] = React.useState();


    const onSubmit = async (data) => {
        try {
            setSessionDetails(data);
            handleBackDrop(true);

            let inputParams = {
                apartmentDetails,
                userDetails,
                sessionDetails: {
                    ...data, 
                    fromDate: convertDatePickerDateToAPIDate(data.fromDate),
                    toDate: convertDatePickerDateToAPIDate(data.toDate)
                }
            };

            console.log(inputParams);
            let response = await AxiosApi.postData(APIConstants.PROJECT_CREATE_OR_UPDATE, inputParams);
            console.log(response.data);
            setPassword(response.data);
            setIndex(index + 1);
            handleBackDrop(false);
            enqueueSnackbar("Successfully subscribed.", { variant: "success" });
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
            handleBackDrop(false);
        }
    }


    return <Box className={classes.container}>
        <Paper elevation={2} className={classes.subContainer}>
            <Grid container>
                <Grid item xs={12}>
                    <Box className={classes.titleContainer}>
                        <Box>Register Account</Box>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    {index == 0 && <ApartmentDetails setData={setApartmentDetails} data={apartmentDetails} setIndex={setIndex} />}
                    {index == 1 && <UserDetails setData={setUserDetails} data={userDetails} setIndex={setIndex} />}
                    {index == 2 && <SessionDetails onSubmit={onSubmit} data={sessionDetails} setIndex={setIndex} />}
                    {index == 3 && <Box>
                        Login Id: {userDetails.contactNo1}<br/>
                        Password: {password}
                        <br/>
                        <a href="/login">Click here to login.</a>
                    </Box>}
                </Grid>
            </Grid>
        </Paper>
    </Box>
}

export default RegisterProject;

const ApartmentDetails = ({ setData, data, setIndex }) => {
    const classes = useStyles();

    const onSubmit = async data => {
        setData(data);
        setIndex(1);
    }

    return <Box className={classes.itemContainer}>
        <Grid container>
            <Grid item xs={12}>
                <Box className={classes.subTitleContainer}>
                    <Box>Apartment Details</Box>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <FormBuilder fields={appFields} data={data} gridItemXS={12} onSubmit={onSubmit} submitButton={<Button type="submit" color="primary" variant='outlined'> Next </Button>} />
            </Grid>
        </Grid>
    </Box>
}
//fields={fields} data={eventData} onSubmit={onSubmit} cancelEvent={handleClose}

const appFields = [
    { "name": "name", label: "Name", defaultValue: "", "type": "TEXT", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    { "name": "address1", label: "Address Line 1", defaultValue: "", "type": "TEXT", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    { "name": "address2", label: "Address Line 2", defaultValue: "", "type": "TEXT", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    { "name": "pinCode", label: "Pin Code", defaultValue: "", "type": "TEXT", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    { "name": "state", label: "State", defaultValue: "", "type": "TEXT", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
]


const UserDetails = ({ setData, data, setIndex }) => {
    const classes = useStyles();

    const onSubmit = async data => {
        setData(data);
        setIndex(2);
    }

    return <Box className={classes.itemContainer}>
        <Grid container>
            <Grid item xs={12}>
                <Box className={classes.subTitleContainer}>
                    <Box>User Details</Box>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <FormBuilder fields={userFields} data={data} gridItemXS={12} onSubmit={onSubmit} submitButton={<Button type="submit" color="primary" variant='outlined'> Next </Button>} />
            </Grid>
            <Grid item xs={12} className={classes.backButtonContainer}>
                <Button color="primary" variant='outlined' onClick={() => setIndex(0)}> Back </Button>
            </Grid>
        </Grid>
    </Box>
}

const userFields = [
    { "name": "firstName", label: "First Name", defaultValue: "", "type": "TEXT", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    { "name": "lastName", label: "Last Name", defaultValue: "", "type": "TEXT", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    { "name": "contactNo1", label: "Phone 1", defaultValue: "", "type": "PHONE", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },

]