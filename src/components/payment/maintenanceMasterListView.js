import React from 'react';
import CONSTANSTS from '../../utils/constants';
import ListView from '../common/listView';
import PageHeader from '../common/pageHeader';
import AxiosApi from '../../utils/httpRequestHandler';
import APIConstants from '../../utils/apiConatants';
import { useSnackbar } from 'notistack';
import AppDialog from '../common/appDialog';
import ConfirmDialog from '../common/confirmDialog';
import { AppContext } from '../../components/common/context/appContext';
import LinkObject from '../common/linkObject';
import Constants from '../../utils/constants';
import MaintenanceMasterForm from './maintenanceMasterForm';

const { MONTHS_FULL_FORM } = Constants;

const MaintenanceMasterListView = () => {
    const { enqueueSnackbar } = useSnackbar();
    const maintenanceListViewRef = React.useRef(null);
    const maintenanceMasterFormRef = React.useRef(null);
    const [openDialog, setOpenDialog] = React.useState(false);
    const { handleBackDrop } = React.useContext(AppContext);
    const appDialogRef = React.useRef(null);
    const confrmDialogRef = React.useRef(null);

    const [data, setData] = React.useState([]);

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    React.useEffect(() => {
        getDataFromAPI();
    }, []);

    const getDataFromAPI = async (reqParams) => {
        try {
            handleBackDrop(true);
            let response = await AxiosApi.getData(APIConstants.MAINTANANCE_MASTER_LIST_VIEW_GET, reqParams);
            setData(response.data);
            handleBackDrop(false);
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }

    }

    const addEvt = () => {
        maintenanceMasterFormRef.current.handleOpen();
    }

    const editEvt = () => {
    }

    const deleteEvt = () => {
        let row = maintenanceListViewRef.current.getSelectedRow();
        if (row && row.length > 0) {
            confrmDialogRef.current.handleOpen({ title: "Confirmation Dialog", contentText: "Are you confirm to delet data?" });
        } else {
            appDialogRef.current.handleOpen({ title: "Information Dialog", contentText: "Please select one or more record!" });
        }
    }

    const deleteData = async () => {
        try {
            let row = maintenanceListViewRef.current.getSelectedRow();
            let ids = row.map(r => r.id);
            let response = await AxiosApi.deleteData(APIConstants.MAINTANANCE_MASTER_DELETE_BATCH, ids);
            console.log(response.data);
            getDataFromAPI();
            enqueueSnackbar('This is a success message!', { variant: "success" });

        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }
    }

    const onChangeMore = async (value) => {
        try {
            if( value == "ACTIVE") {
                let row = maintenanceListViewRef.current.getSelectedRow();
                if (row && row.length == 1) {
                    handleBackDrop(true);
                    let response = await AxiosApi.getData(APIConstants.MAINTANANCE_MASTER_ACTIVE+row[0].id);
                    handleBackDrop(false);
                    getDataFromAPI();
                } else {
                    appDialogRef.current.handleOpen({ title: "Information Dialog", contentText: "Please select one record!" });
                }
            }
            
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }
    }


    const getRows = () => {
        let arr = new Array();
        for (let i = 0; i < 1000; i++) {
            arr.push({ id: i, fName: 'Demo' + i, lName: 'Demo' + i, phone1: "+91-44444444" + i, phone2: "+91-5555555" + i, email: "abc" + i + "@test.com", })
        }
        return arr;
    }


    let rows = data.map(m => { return { ...m, paymentMonth: MONTHS_FULL_FORM[m.paymentMonth] } });

    const toolBarIcon = [{ name: "ADD", title: "Add Maintenance", onClick: addEvt, },
    { name: "DELETE", title: "Delete Maintenance", onClick: deleteEvt, },
    { name: "PDF", title: "Export to .pdf file", onClick: () => { }, },
    { name: "EXCEL", title: "Export to .excl file", onClick: () => { }, },
    {
        name: "MORE", title: "More options", onClick: onChangeMore, options: [
            { value: "ACTIVE", text: "ACTIVE" },
            { value: "IN-ACTIVE", text: "IN-ACTIVE" }]
    }];
    return <div style={{ padding: 10 }}>
        <PageHeader object={CONSTANSTS.OBJECTS.MAINTENANCE_MASTER} />
        <ListView ref={maintenanceListViewRef} columns={columns} rows={rows} toolBarIcon={toolBarIcon} getListViewData={getDataFromAPI} isSearchRequired={false} />
        <MaintenanceMasterForm ref={maintenanceMasterFormRef} getListViewData={getDataFromAPI} />
        <AppDialog ref={appDialogRef} maxWidth="xs" />
        <ConfirmDialog ref={confrmDialogRef} clickEvent={deleteData} />
    </div>
}

export default MaintenanceMasterListView;


const columns = [{
    dataField: 'id',
    text: 'ID',
    type: "NUMBER",
    hidden: true,
}, {
    dataField: 'amount',
    text: 'Amount',
    type: "TEXT",
    headerStyle: { width: 100, },
    headerAttrs: { title: 'Amount' }
}, {
    dataField: 'fromDate',
    text: 'From Date',
    type: "DATE",
    sort: true,
    headerStyle: { width: 150, },
    headerAttrs: { title: 'From Date' }
}, {
    dataField: 'toDate',
    text: 'To Date',
    type: "DATE",
    sort: true,
    headerStyle: { width: 150, },
    headerAttrs: { title: 'To Date' }
}, {
    dataField: 'strActiveInActive',
    text: 'Active/In-Active',
    type: "BOOLEAN",
    sort: true,
    headerStyle: { width: 150, },
    headerAttrs: { title: 'Active/In-Active' }
}, {
    dataField: 'createdDate',
    text: 'Created Date',
    sort: true,
    headerStyle: { width: 150, },
    headerAttrs: { title: 'Created Date' }
}, {
    dataField: 'modifiedDate',
    text: 'Modified Date',
    sort: true,
    headerStyle: { width: 150, },
    headerAttrs: { title: 'Modified Date' }
},];

