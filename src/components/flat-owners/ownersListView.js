import React from 'react';
import ListView from '../common/listView';
import PageHeader from '../common/pageHeader';
import AxiosApi from '../../utils/httpRequestHandler';
import APIConstants from '../../utils/apiConatants';
import { useSnackbar } from 'notistack';
import AppDialog from '../common/appDialog';
import ConfirmDialog from '../common/confirmDialog';
import { AppContext } from '../../components/common/context/appContext';
import CONSTANSTS from '../../utils/constants';
import { VIEW_COLUMNS } from '../../utils/columnConstants';

const { VALIDATOR_TYPE_REQUIRED, VALIDATOR_TYPE_OPTIONAL } = CONSTANSTS.FORM_CONSTANTS;
const columns = VIEW_COLUMNS[CONSTANSTS.OBJECTS.OWNERS];

const OwnersListView = () => {
    const { enqueueSnackbar } = useSnackbar();
    // const ownersRegFormRef = React.useRef(null);
    const ownersListViewRef = React.useRef(null);
    const appDialogRef = React.useRef(null);
    const confrmDialogRef = React.useRef(null);
    
    const { handleBackDrop, handleDialogOpen, handleDialogClose } = React.useContext(AppContext);

    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        getDataFromAPI();
    }, []);

    const getDataFromAPI = async (reqParams) => {
        try {
            handleBackDrop(true);
            let response = await AxiosApi.getData(APIConstants.USER_LIST_VIEW_GET, reqParams);
            setData(response.data);        
            handleBackDrop(false);
        } catch (error) {
            console.error(error.message);      
            handleBackDrop(false);
        }        
    }

    const addEvt = () => {
        //ownersRegFormRef.current.handleOpen();
        handleDialogOpen({ ...defaultFormProps, handleClose: handleDialogClose, callbackOnSubmit: (data) => getDataFromAPI()});
    }

    const editEvt = () => {
        let row = ownersListViewRef.current.getSelectedRow();
        if (row && row.length == 1) {
            // ownersRegFormRef.current.handleOpen(row[0].id);
            handleDialogOpen({ ...defaultFormProps, handleClose: handleDialogClose, callbackOnSubmit: (data) => getDataFromAPI(), id:row[0].id,});
        } else {
            appDialogRef.current.handleOpen({ title: "Information Dialog", contentText: "Please select one record!" });
        }

    }

    const deleteEvt = () => {
        let row = ownersListViewRef.current.getSelectedRow();
        if (row && row.length > 0) {
            confrmDialogRef.current.handleOpen({ title: "Confirmation Dialog", contentText: "Are you confirm to delet data?" });
        } else {
            appDialogRef.current.handleOpen({ title: "Information Dialog", contentText: "Please select one or more record!" });
        }
    }

    const deleteData = async () => {
        try {
            let row = ownersListViewRef.current.getSelectedRow();
            let ids = row.map(r => r.id);
            let response = await AxiosApi.deleteData(APIConstants.USER_DELETE_BATCH, ids);
            console.log(response.data);
            getDataFromAPI();
            enqueueSnackbar('This is a success message!', { variant: "success" });

        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }
    }

    const toolBarIcon = [{ name: "ADD", title: "Add Owners", onClick: addEvt, }, { name: "EDIT", title: "Edit Owners", onClick: editEvt, }, { name: "DELETE", title: "Delete Owners", onClick: deleteEvt, }, { name: "PDF", title: "Export to .pdf file", onClick: () => { }, }, { name: "EXCEL", title: "Export to .excl file", onClick: () => { }, }];
    return <div style={{ padding: 10 }}>
        {/* <OwnersRegistrationForm ref={ownersRegFormRef} getListViewData={getDataFromAPI} /> */}
        <AppDialog ref={appDialogRef} maxWidth="xs" />
        <ConfirmDialog ref={confrmDialogRef} clickEvent={deleteData} />
        <PageHeader object="USER_DETAILS" iconName={"fa fa-user"} />
        <ListView ref={ownersListViewRef} object={CONSTANSTS.OBJECTS.OWNERS} columns={columns} rows={data} toolBarIcon={toolBarIcon} getListViewData={getDataFromAPI}/>
    </div>
}

export default OwnersListView;




const fields = [
    // { "name": "loginId", label: "Login ID", defaultValue: "", "type": "TEXT", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    { "name": "firstName", label: "First Name", defaultValue: "", "type": "TEXT", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    { "name": "lastName", label: "Last Name", defaultValue: "", "type": "TEXT", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    { "name": "contactNo1", label: "Phone 1", defaultValue: "", "type": "PHONE", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    { "name": "contactNo2", label: "Phone 2", defaultValue: "", "type": "PHONE", "isHeaden": false, validationType: VALIDATOR_TYPE_OPTIONAL },
    { "name": "emailId", label: "Email", defaultValue: "", "type": "EMAIL", "isHeaden": false, validationType: VALIDATOR_TYPE_OPTIONAL },
    { "name": "userAddress", label: "User Address", defaultValue: "", "type": "LONG_TEXT", "isHeaden": false, validationType: VALIDATOR_TYPE_OPTIONAL },
];

const defaultFormProps = {
    title: "Owners Registration", 
    contentText: "", 
    maxWidth: "xs", 
    type:"FORM", 
    object: CONSTANSTS.OBJECTS.OWNERS, 
    fields: fields, 
}