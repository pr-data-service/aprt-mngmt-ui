import { Box, Button, Grid, makeStyles } from '@material-ui/core';
import AxiosApi from '../../utils/httpRequestHandler';
import React from 'react';
import APIConstants from '../../utils/apiConatants';
import { connectDependenciesBlockAndChunkGroup } from 'webpack/lib/GraphHelpers';
import FormBuilder from '../common/formBuilder';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';


const useStyles = makeStyles(()=>({
    header: {
        color: "#0a0b0b85",
        fontWeight: "bold",
        fontSize: 20,
        paddingTop: 10,
        paddingBottom:10,
    },
    leftContainer: {
        marginRight:20,
        width:'70%',
    },
    rightContainer: {
        width:'30%',
    },
    fields: {
        display: 'flex',
        justifyContent: 'space-Between',
        width: '100%',
        height:30,
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
    mainContainer: {
        display: 'flex',
        paddingLeft: 10,
        paddingRight: 10
    },
    fieldLable: {
        textAlign: "right"
    }
}));


const UserProfile = ()=> {
    let classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const[data, setData] = React.useState(Object);
    const methods = useForm({
        criteriaMode: "all"
    });
    
    React.useEffect(()=>{
        getDataFromAPI();
    },[]);

    const getDataFromAPI = async() => {
        try {
            let response = await AxiosApi.getData(APIConstants.USER_LOGGEDIN_GET);
            setData(response.data);
            console.log(response.data);
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }

    }

    const onSubmit = async (obj) =>{
        try {debugger
            obj.id= data.id;
            console.log(obj);
            let response = await AxiosApi.postData(APIConstants.USER_UPDATE_PASSWORD, obj); 
            console.log(response);
            enqueueSnackbar("Password successfully updated.", { variant: "success" });
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }
    }

    return <Box className={classes.mainContainer}>
        <Box className={classes.leftContainer}>
            <Grid className={classes.header}>User Details</Grid>
            {Object.keys(fieldLabels).map((e, index)=> {
                return <Grid className ={classes.fields} style={  (index%2 == 0) ? {background: '#e5e5e563'} : {}}>
                    <Grid item xs = {3}>{fieldLabels[e]}</Grid><Grid item xs = {9} className={classes.fieldLable}>{data[e]}</Grid>
                </Grid>
            })}
        </Box>
        <Box className={classes.rightContainer}>
            <Grid className={classes.header}>Change Password</Grid>
            <Grid>
                <FormBuilder fields={fields} onSubmit={onSubmit} gridItemXS={12} submitButton={<Button type="submit" color="primary" variant='outlined'> Save </Button>} />
            </Grid>
        </Box>
    </Box>
}

export default UserProfile;

const fields = [
    { "name": "oldPassword", label: "Old Password", defaultValue: "", "type": "PASSWORD", "isHeaden": false},
    { "name": "newPassword", label: "New Password", defaultValue: "", "type": "PASSWORD", "isHeaden": false},
    { "name": "confirmPassword", label: "Confirm Password", defaultValue: "", "type": "PASSWORD", "isHeaden": false }, 
]

const fieldLabels = {
    firstName: "First Name",
    lastName: "Last Name",
    contactNo1: "Phone Number 1",
    contactNo2: "Phone Number 2",
    userAddress: "User Address:"
};