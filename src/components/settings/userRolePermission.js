import { Box, Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import CONSTANSTS from '../../utils/constants';
import { AppContext } from '../common/context/appContext';
import AxiosApi from '../../utils/httpRequestHandler';
import APIConstants from '../../utils/apiConatants';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
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
    //width: "80%"
  },
  addIcon: {
    cursor: "pointer",
    marginLeft: 10
  },

  headerElement: {
    textAlign: "center"
  },
  permissionElementsContainer: {
    display: "flex"
  },
  permissionElement: {
    marginLeft: 10,
    marginRight: 10,
    width: "100%"
  },
  select: {
    width: "100%"
  }
}));

const UserRolePermission = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { handleBackDrop, handleDialogOpen, handleDialogClose } = React.useContext(AppContext);
  const [data, setData] = React.useState([]);


  React.useEffect(() => {
    getDataFromAPI();
  }, []);

  const getDataFromAPI = async (reqParams) => {
    try {
      handleBackDrop(true);
      let response = await AxiosApi.getData(APIConstants.USER_ROLE_PERMISSION_GET, reqParams);
      setData(response.data);
      handleBackDrop(false);
    } catch (error) {
      console.error(error.message);
      handleBackDrop(false);
    }
  }

  const updateData = (object, role) => (type, isChecked) => {
    let obj = data.find( f => f.object === object && f.role === role);
    if(obj) {
      obj = {...perm, ...obj};
      obj[type] = isChecked;
      saveOrUpdate(obj);
    } else {
      let newPerm = {object: object, role: role, ...perm};
      newPerm[type] = isChecked;
      
      saveOrUpdate(newPerm);
    }
    
  }

  const saveOrUpdate = async (data) => {
    try {
        handleBackDrop(true);
        let response = await AxiosApi.postData(APIConstants.USER_ROLE_PERMISSION_CREATE_OR_UPDATE, data);
        getDataFromAPI();
        enqueueSnackbar("Updated successfully", { variant: 'success' });
    } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' })
    }
}


  return <Box className={classes.container}>
    <Grid container>
      <Grid item xs={8}>
        <span className={classes.header} >User Role Permission</span>
      </Grid>
      <Grid item xs={4}></Grid>
    </Grid>
    <Box className={classes.listContainer}>
      <Grid container className={classes.row} style={{ background: '#e5e5e563', color: "#0a0b0b85", fontWeight: "bold" }}>
        <Grid item xs={3} className={classes.headerElement}>Object</Grid>
        <Grid item xs={2} className={classes.headerElement}>Role</Grid>
        <Grid item xs={3} className={classes.headerElement}></Grid>
        <Grid item xs={4} className={classes.headerElement}>Permissions</Grid>
      </Grid>

      {OBJECTS.map((object, index) => <React.Fragment>
        <Grid container className={classes.row} style={(index % 2 != 0) ? { background: '#e5e5e563' } : {}}>

          <PermissionRow object={object} data={data} setData={updateData}/>

        </Grid>
      </React.Fragment>
      )}
    </Box>
  </Box>
}

export default UserRolePermission;

const OBJECTS = [
  { name: CONSTANSTS.OBJECTS.OWNERS, label: CONSTANSTS.OBJECTS_LABEL[CONSTANSTS.OBJECTS.OWNERS] },
  { name: CONSTANSTS.OBJECTS.FLAT_DETAILS, label: CONSTANSTS.OBJECTS_LABEL[CONSTANSTS.OBJECTS.FLAT_DETAILS] },
  { name: CONSTANSTS.OBJECTS.MAINTENANCE, label: CONSTANSTS.OBJECTS_LABEL[CONSTANSTS.OBJECTS.MAINTENANCE] },
  { name: CONSTANSTS.OBJECTS.EVENTS, label: CONSTANSTS.OBJECTS_LABEL[CONSTANSTS.OBJECTS.EVENTS] },
  { name: CONSTANSTS.OBJECTS.PAYMENT, label: CONSTANSTS.OBJECTS_LABEL[CONSTANSTS.OBJECTS.PAYMENT] },
  { name: CONSTANSTS.OBJECTS.PAYMENT_DETAILS, label: CONSTANSTS.OBJECTS_LABEL[CONSTANSTS.OBJECTS.PAYMENT_DETAILS] },
  { name: CONSTANSTS.OBJECTS.EXPENSE, label: CONSTANSTS.OBJECTS_LABEL[CONSTANSTS.OBJECTS.EXPENSE] },
  { name: CONSTANSTS.OBJECTS.ACCOUNT, label: CONSTANSTS.OBJECTS_LABEL[CONSTANSTS.OBJECTS.ACCOUNT] },
  { name: CONSTANSTS.OBJECTS.ACCOUNT_TRANSACTION, label: CONSTANSTS.OBJECTS_LABEL[CONSTANSTS.OBJECTS.ACCOUNT_TRANSACTION] },
]

const perm = {create: false, view: false, edit: false, delete: false};

const SelectTag = ({value, setData}) => {
  const classes = useStyles();


  return <select name="role" id="role" className={classes.select} onChange={(ev) => setData(ev.currentTarget.value)}>
    <option value="ADMIN">Admin</option>
    <option value="USER">User</option>
  </select>
}

const PermissionElements = ({permission, setData}) => {
  const classes = useStyles();

  return <Box className={classes.permissionElementsContainer}>
    <Box className={classes.permissionElement}>
      <input type="checkbox" id="CREATE" name="CREATE" value="create" checked={permission.create} onChange={(ev) => setData("create", ev.currentTarget.checked)}/>
      <span for="CREATE"> Create</span><br></br>
    </Box>
    <Box className={classes.permissionElement}>
      <input type="checkbox" id="VIEW" name="VIEW" value="view" checked={permission.view} onChange={(ev) => setData("view", ev.currentTarget.checked)}/>
      <span for="VIEW"> View</span><br></br>
    </Box>
    <Box className={classes.permissionElement}>
      <input type="checkbox" id="EDIT" name="EDIT" value="edit" checked={permission.edit} onChange={(ev) => setData("edit", ev.currentTarget.checked)}/>
      <span for="EDIT"> Edit</span><br></br>
    </Box>
    <Box className={classes.permissionElement}>
      <input type="checkbox" id="DELETE" name="DELETE" value="delete" checked={permission.delete} onChange={(ev) => setData("delete", ev.currentTarget.checked)}/>
      <span for="DELETE"> Delete</span><br></br>
    </Box>
  </Box>
}

const PermissionRow = ({object, data, setData}) => {
  const [role, setRole] = React.useState("ADMIN");
  
  const permission = getData(data, object.name, role);

  return <React.Fragment key={object.name}>
    <Grid item xs={3}>{object.label}</Grid>
    <Grid item xs={2}><SelectTag valye={role} setData={setRole}/></Grid>
    <Grid item xs={3}></Grid>
    <Grid item xs={4}>
      <PermissionElements object={object.name} permission={permission} setData={setData(object.name, role)}/>
    </Grid>
  </React.Fragment>
}

const getData = (data, object, role) => {
  let obj = data.find( f => f.object === object && f.role === role);
  let create= obj ? obj.create : false;
  let view= obj ? obj.view : false;
  let edit= obj ? obj.edit : false;
  let del= obj ? obj.delete : false;
  return {create: create, view: view, edit: edit, del: del}
}
