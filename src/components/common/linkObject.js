import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { useSnackbar } from 'notistack';
import { Box, Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AppDialog from '../common/appDialog';
import { SelectField, TextField } from '../common/fields';
import { AppContext } from '../common/context/appContext';
import CONSTANSTS from '../../utils/constants';
import AxiosApi from '../../utils/httpRequestHandler';
import APIConstants from '../../utils/apiConatants';
import ConfirmDialog from './confirmDialog';


const { OBJECTS, OBJECTS_LABEL } = CONSTANSTS;
const objectList = Object.values(OBJECTS).map(m => { return { value: m, text: OBJECTS_LABEL[m] } });

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    row: {
        display: "flex",
        marginTop: 10
    },
    elementSpace: {
        width: 10
    },
    label: {
        padding: 4
    },
}));

const LinkObject = React.forwardRef(({ object }, ref) => {

    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();

    const appDialogRef = React.useRef(null);
    const { handleBackDrop } = React.useContext(AppContext);

    const [open, setOpen] = React.useState(true);
    const [id, setId] = React.useState(0);


    React.useImperativeHandle(ref, () => ({
        handleDialog: handleDialog
    }));

    const handleDialog = (isOpen, id) => {
        if (isOpen) {
            setId(id);
            appDialogRef.current.handleOpen({ title: "Link Flat" });
        } else {
            appDialogRef.current.handleClose();
        }
    }

    const handleClose = () => {
        setId(0);
        setOpen(false);
    };





    return <Box className={classes.root}>
        <AppDialog ref={appDialogRef} maxWidth="md" requiredCancelBtn={true} requiredOKBtn={false}>
            <Body id={id} object={object} handleClose={handleClose} />
        </AppDialog>
    </Box>

});

export default LinkObject;

const Body = ({ id, object, handleClose }) => {
    const classes = useStyles();
    const confrmDialogRef = React.useRef(null);
    const { enqueueSnackbar } = useSnackbar();
    const { handleBackDrop } = React.useContext(AppContext);

    let objects = objectList.filter(f => f.value !== object);
    objects = [objects[0]];

    const [data, setData] = React.useState([]);
    const [linkObject, setLinkObject] = React.useState(objects[0].value);
    const [linkRecordId, setLinkRecordId] = React.useState(0);
    const [linkObjectRecords, setLinkObjectRecords] = React.useState([]);
    const [currentLinkUserDetails, setCurrentLinkUserDetails] = React.useState(null);

    React.useEffect(() => {
        getDataFromAPI(linkObject);
    }, []);


    const getDataFromAPI = async (linkObj) => {
        try {
            let reqParams = {
                object: object,
                id,
                linkObject : linkObj? linkObj : linkObject,
                linkRecordId
            }
            handleBackDrop(true);
            let response = await AxiosApi.getData(APIConstants.COMMON_LINK_OBJECT_GET, reqParams);
            if(response) {
                if(response.httpStatusCode == 200 && response.statusCode == 100 && response.data) {
                    let {userList, ...linkDetails} = response.data;
                    if(userList || linkDetails) {
                        if(userList) {
                            let arr = userList.map(m => { return { value: m.id, text: m.firstName + " " + m.lastName + ", " + m.contactNo1 } });
                            if(arr.length > 0) {
                                setLinkRecordId(arr[0].value);
                            }
                            setLinkObjectRecords(arr); 
                        }                                       
                        setCurrentLinkUserDetails(linkDetails);
                    } else {
                        console.error("userList: ", userList, "linkDetails: ", linkDetails);
                    }                    
                } else {
                    console.info(JSON.stringify(response));
                }
            } else {
                console.error(response.message);
                enqueueSnackbar(response.message, { variant: "error" });
            }

        } catch(error) {
            console.error(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }        
        handleBackDrop(false);
    }

    const goToLinkData = () => {
        confrmDialogRef.current.handleOpen({ title: "Confirmation Dialog", contentText: "Are you confirm to link data?", callback: linkData });
    }

    const linkData = async () => {
        try {
            if (id > 0 && linkObject && linkObject !== "" && linkRecordId && linkRecordId > 0) {
                let reqParams = {
                    object: object,
                    id,
                    linkObject,
                    linkRecordId
                }
                handleBackDrop(true);
                let response = await AxiosApi.postData(APIConstants.COMMON_LINK_OBJECT_SAVE, reqParams);
                let { statusCode, message, httpStatusCode, data } = response;
                console.log(response.data);
                if(statusCode === 100) {
                    enqueueSnackbar("Successfully Linked Object", { variant: "success" });
                    handleClose(true);
                } else {
                    enqueueSnackbar(message, { variant: "error" });
                }
                handleBackDrop(false);
                
                
            } else {
                console.error("Record id not found");
                enqueueSnackbar("Record id not found", { variant: "error" });
            }
        } catch(error) {
            console.error(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }
        
    }

    const onChangeLinkObject = (event) => {
        setLinkObject(event.target.value);
        setLinkRecordId(0);
        setLinkObjectRecords([]);                
        setCurrentLinkUserDetails(null);
        getDataFromAPI(event.target.value);
    }

    const onChangeLinkRecordId = (event) => {
        setLinkRecordId(event.target.value);
    }

    
    
    const getCurrentLabelText = () => {
        let { firstName="", lastName="", contactNo1="" } = currentLinkUserDetails ? currentLinkUserDetails : {};
        let name = firstName;
        name += name != "" ? " " + lastName : "";
        name += name != "" ? ", " + contactNo1 : "";
        return name;
    }
    
    return <><Box className={classes.row}>

        <Box className={classes.row}>
            <SelectField name="link_object" options={objects} style={{ width: 100 }} onChange={onChangeLinkObject} />
            <Box className={classes.elementSpace}></Box>
            <Box className={classes.label}>
                Current Owner: {getCurrentLabelText()}</Box>
            <Box className={classes.elementSpace}></Box>
            <SelectField name="owner" options={linkObjectRecords} style={{ width: 300 }} onChange={onChangeLinkRecordId}/>
            <Box className={classes.elementSpace}></Box>
            <Button onClick={goToLinkData} variant="contained" color="primary">  Link </Button>
        </Box>
    </Box>
    <ConfirmDialog ref={confrmDialogRef} />
    </>
}


const owners = [
    { value: "A/0/7", text: "Animesh Roy, 9681819623" },
    { value: "A/0/7", text: "Rahul Roy, 9681819623" },
    { value: "A/0/7", text: "Sourav Roy, 9681819623" },
]