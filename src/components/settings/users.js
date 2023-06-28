import { Box, FormControl, Grid, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React from 'react'
import APIConstants from '../../utils/apiConatants';
import CONSTANSTS from '../../utils/constants';
import AxiosApi from '../../utils/httpRequestHandler';
import Utils from '../../utils/utils';
import { AppContext } from '../common/context/appContext';
const { VALIDATOR_TYPE_REQUIRED, VALIDATOR_TYPE_OPTIONAL } = CONSTANSTS.FORM_CONSTANTS;

const useStyles = makeStyles(() => ({
    container: {
        padding: 10
    },
    row: {
        padding: '5px 10px',
        "&:hover .show-events": {
            display: 'block !important',
        }
    },
    header: {
        color: "#0a0b0b85",
        fontWeight: "bold",
        fontSize: 20
    },
    listContainer: {
        width: "80%"
    },
    addIcon: {
        cursor: "pointer",
        marginLeft: 10
    },
    select: {
        width: '100%',
        height: '25px',
        fontSize: '12px'
    }
}));

const Users = () => {
    const [data, setData] = React.useState([{ firstName: '', lastName: '', type: 'user', role: '' }]);
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { handleBackDrop, handleDialogOpen, handleDialogClose } = React.useContext(AppContext);

    React.useEffect(() => {
        getDataFromAPI();
    }, [])

    const getDataFromAPI = async () => {
        try {
            handleBackDrop(true)
            let response = await AxiosApi.getData(APIConstants.USER_LIST_ONLY_USER);
            setData(response.data);
            handleBackDrop(false)
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' })
        }
    }

    const updateUserRole = (id) => async (event) => {
        try {
            let newObject = {};
            newObject.id = id;
            newObject.role = event.target.value;
            handleBackDrop(true)
            let response = await AxiosApi.postData(APIConstants.USER_UPDATE_ONLY_USER_ROLE, newObject);
            handleBackDrop(false)
            enqueueSnackbar("Role changed successfully.", { variant: 'success' })
            getDataFromAPI();
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' })
        }
    }

    const removeRoleEvt = async (id) => {
        try {
            let response = await AxiosApi.postData(APIConstants.USER_REMOVE_ROLE + id);
            getDataFromAPI();
            enqueueSnackbar("User role removed successfully", { variant: "success" })
        } catch (error) {
            enqueueSnackbar(error.message, { variant: "error" });
        }
    }

    const addEvt = () => {
        handleDialogOpen({ ...defaultFormProps, handleClose: handleDialogClose, callbackOnSubmit: (data) => getDataFromAPI() });
    }

    const getEvents = (id) => {debugger
        let selectProps = {};
        if(!Utils.isPermission(CONSTANSTS.OBJECTS.USER, CONSTANSTS.USER_PERMISSION.EDIT)) {
            selectProps.onChange = () => false;
        } else {
            selectProps.onChange = updateUserRole(id);
        }
        return selectProps;
    }
    

    return (
        <Box className={classes.container}>
            <Grid container>
                <Grid item xs={8}>
                    <span className={classes.header} >Transactions</span>
                    {Utils.isPermission(CONSTANSTS.OBJECTS.USER, CONSTANSTS.USER_PERMISSION.CREATE) && <i className={`fa fa-plus ${classes.addIcon}`} aria-hidden="true" onClick={() => addEvt()}></i>}
                </Grid>
                <Grid item xs={4}></Grid>
            </Grid>
            <Box className={classes.listContainer}>
                <Grid container className={classes.row} style={{ background: '#e5e5e563', color: "#0a0b0b85", fontWeight: "bold" }}>
                    <Grid item xs={1}>Srl. No.</Grid>
                    <Grid item xs={3}>First Name</Grid>
                    <Grid item xs={3}>Last Name</Grid>
                    <Grid item xs={2}>Phone Number</Grid>
                    <Grid item xs={2}>Role</Grid>
                    <Grid item xs={1}></Grid>
                </Grid>
                {data && data.map((m, index) => <>
                    <Grid container className={classes.row} style={(index % 2 != 0) ? { background: '#e5e5e563' } : {}}>
                        <Grid item xs={1}>{index + 1}</Grid>
                        <Grid item xs={3}>{m.firstName}</Grid>
                        <Grid item xs={3}>{m.lastName}</Grid>
                        <Grid item xs={2}>{m.contactNo1}</Grid>
                        <Grid item xs={2}>
                            <select 
                                name="roles"
                                id="roles" 
                                className={classes.select} 
                                value={m.role} 
                                {...getEvents(m.id)}
                            >
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                                <option value="SECRETARY">Secretary</option>
                                <option value="ASST-SECRETARY">Asst. Secretary</option>
                                <option value="TREASURER">Treasurer</option>
                                <option value="ASST-TREASURER">Asst. Treasurer</option>
                            </select>
                        </Grid>
                        <Grid item xs={1}>
                            {Utils.isPermission(CONSTANSTS.OBJECTS.SESSION, CONSTANSTS.USER_PERMISSION.DELETE) && <span className={"show-events"} style={{ cursor: "pointer", display: "none", textAlign: "center" }} title="Click here to delete." onClick={() => removeRoleEvt(m.id)}>
                                <i className="fa fa-trash" aria-hidden="true"></i>
                            </span>}
                        </Grid>
                    </Grid>
                </>)}

            </Box>
        </Box>
    )
}

const fields = [
    {
        "name": "id", label: "User/Owners", defaultValue: "", type: "LIST", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED,
        options: [],
        onLoadEventProps: { apiUrl: APIConstants.USER_LIST_GET, reqParams: {}, fieldNames: ["id", "firstName,lastName"] }
    },
    {
        "name": "role", label: "Role", defaultValue: "", type: "LIST", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED,
        options: [
            { value: "USER", text: "USER" },
            { value: "ADMIN", text: "ADMIN" },
            { value: "SECRETARY", text: "Secretary" },
            { value: "ASST-SECRETARY", text: "Asst. Secretary" },
            { value: "TREASURER", text: "Treasurer" },
            { value: "ASST-TREASURER", text: "Asst. Treasurer" },
        ],
    },

];


const defaultFormProps = {
    title: "Update User Role",
    contentText: "",
    maxWidth: "xs",
    type: "FORM",
    object: CONSTANSTS.OBJECTS.USER,
    fields: fields,
}

export default Users;
