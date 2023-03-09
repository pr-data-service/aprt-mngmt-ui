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
import Utils from '../../utils/utils';
import { getFormattedDateTime } from '../../utils/dateHandler';
import AppForm from '../common/appForm';
import { useParams } from 'react-router-dom';

const { MONTHS_FULL_FORM } = Constants;
const { VALIDATOR_TYPE_REQUIRED, VALIDATOR_TYPE_OPTIONAL } = CONSTANSTS.FORM_CONSTANTS;

const MaintenanceListView = () => {
    const { enqueueSnackbar } = useSnackbar();
    const maintenanceListViewRef = React.useRef(null);
    const maintenanceFormRef = React.useRef(null);
    const [openDialog, setOpenDialog] = React.useState(false);
    const { handleBackDrop, handleDialogOpen, handleDialogClose } = React.useContext(AppContext);
    const appDialogRef = React.useRef(null);
    const confrmDialogRef = React.useRef(null);
    const object = Utils.getObjectNameFromUrl();
    const isDetailView = Utils.isDetailView();
    const params = useParams();

    const [data, setData] = React.useState([]);

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    React.useEffect(() => {
        getDataFromAPI();
    }, []);

    const getDataFromAPI = async (reqParams) => {
        try {
            if (isDetailView) {
                reqParams = reqParams ? { ...reqParams } : {};
                reqParams.parentFieldName = "flatId";
                reqParams.parentRecordId = params.id;
            }
            handleBackDrop(true);
            let response = await AxiosApi.getData(APIConstants.MAINTANANCE_LIST_VIEW_GET, reqParams);
            setData(response.data);
            handleBackDrop(false);
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }

    }

    const addEvt = () => {
        //maintenanceFormRef.current.handleOpen();
        handleDialogOpen({ ...getFormParams(), handleClose: handleDialogClose, callbackOnSubmit: (data) => getDataFromAPI()});
    }

    const editEvt = () => {
        let row = maintenanceListViewRef.current.getSelectedRow();
        if (row && row.length == 1) {
            handleDialogOpen({ ...getFormParams(), handleClose: handleDialogClose, id:row[0].id, callbackOnSubmit: (data) => getDataFromAPI()});
        } else {
            handleDialogOpen({ title: "Information Dialog", contentText: "Please select one record!" });
        }
    }

    const getFormParams = () => {
        let reqParams = {...defaultFormProps};
        if (isDetailView) {
            reqParams.paramsToSave = {flatId : params.id};
            reqParams.fields = reqParams.fields.filter( f => f.name != "flatId");
        }
        return reqParams;
    }

    const deleteEvt = () => {
        let row = maintenanceListViewRef.current.getSelectedRow();
        if (row && row.length == 1) {
            confrmDialogRef.current.handleOpen({ title: "Confirmation Dialog", contentText: "Are you confirm to delet data?" });
        } else {
            handleDialogOpen({ title: "Information Dialog", contentText: "Please select only one record!" });
        }
    }

    const deleteData = async () => {
        try {
            let row = maintenanceListViewRef.current.getSelectedRow();
            let ids = row.map(r => r.id);
            let response = await AxiosApi.deleteData(APIConstants.MAINTANANCE_DELETE_BATCH, ids);
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
                    handleDialogOpen({ title: "Information Dialog", contentText: "Please select one record!" });
                }
            }
            
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }
    }

    const downLoadCSV = () => {        
        let header = columns.filter(f => !f.hidden).map(m => { return {name: m.dataField, label: m.text} });
        let params = {isSerial: true};
        Utils.downloadCSVFile("Maintenance-"+getFormattedDateTime(), header, data, params);
    }

    const toolBarIcon = [{ name: "ADD", title: "Add Maintenance", onClick: addEvt, },
        { name: "EDIT", title: "Edit Maintenance", onClick: editEvt, },
        { name: "DELETE", title: "Delete Maintenance", onClick: deleteEvt, },
        { name: "PDF", title: "Export to .pdf file", onClick: () => { }, },
        { name: "CSV", title: "Export to .csv file", onClick: downLoadCSV, }, 
    ];
    return <div style={{ padding: 10 }}>
        {!isDetailView && <PageHeader object={CONSTANSTS.OBJECTS.MAINTENANCE} />}
        <ListView ref={maintenanceListViewRef} object={CONSTANSTS.OBJECTS.MAINTENANCE} columns={columns} rows={data} toolBarIcon={toolBarIcon} getListViewData={getDataFromAPI} rowStyle={rowStyle}/>
        <ConfirmDialog ref={confrmDialogRef} clickEvent={deleteData} />
    </div>
}

export default MaintenanceListView;


const columns = [{
    dataField: 'id',
    text: 'ID',
    type: "NUMBER",
    hidden: true,
}, {
    dataField: 'flatNo',
    text: 'Flat No',
    type: "TEXT",
    sort: true,
    headerStyle: { width: 150, },
    headerAttrs: { title: 'Flat No' }
}, {
    dataField: 'amount',
    text: 'Amount',
    type: "TEXT",
    headerStyle: { width: 100, },
    headerAttrs: { title: 'Amount' }
}, {
    dataField: 'sessionName',
    text: 'Session',
    type: "TEXT",
    sort: true,
    headerStyle: { width: 150, },
    headerAttrs: { title: 'Session' }
}, /*{
    dataField: 'isActive',
    text: 'Is Active',
    type: "Boolean",
    sort: true,
    headerStyle: { width: 100, },
    headerAttrs: { title: 'Is Active' }
},*/ {
    dataField: 'createdDate',
    text: 'Created Date',
    sort: true,
    headerStyle: { width: 150, },
    headerAttrs: { title: 'Created Date' }
}, {
    dataField: 'createdByName',
    text: 'Created By',
    type: "TEXT",
    sort: true,
    headerStyle: { width: 150, },
    headerAttrs: { title: 'Created By' }
}, {
    dataField: 'modifiedDate',
    text: 'Modified Date',
    sort: true,
    headerStyle: { width: 150, },
    headerAttrs: { title: 'Modified Date' }
}, {
    dataField: 'modifiedByName',
    text: 'Modified By',
    type: "TEXT",
    sort: true,
    headerStyle: { width: 150, },
    headerAttrs: { title: 'Modified By' }
}, {
    dataField: 'emptyCol',
    type: "EMPTY",
    text: '',
    headerStyle: { width: 120, },
},];




const fields = [
    {
        "name": "flatId", label: "Flat No", defaultValue: "", type: "LIST", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED,
        options: [{ value: "99999", text: "All Flats" }],
        onLoadEventProps: { apiUrl: APIConstants.FLAT_DETAILS_LIST_GET, reqParams: {}, fieldNames: ["id", "flatNo"] }
    },
    // {
    //     "name": "sessionId", label: "Session", defaultValue: "", "type": "LIST", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED,
    //     options: [],
    //     onLoadEventProps: { apiUrl: APIConstants.SESSION_DETAILS_LIST_GET, reqParams: {}, fieldNames: ["id", "name"] }
    // },
    { "name": "amount", label: "Amount", defaultValue: "", "type": "NUMBER", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
]

const defaultFormProps = {
    title: "Maintenance", 
    contentText: "", 
    maxWidth: "xs", 
    type:"FORM", 
    object: CONSTANSTS.OBJECTS.MAINTENANCE, 
    fields: fields, 
}


const rowStyle = (row, rowIndex) => {
    const style = {};
    if (row.isActive) {
        style.color = '#337ab7';
        //   style.animation = 'blinker 1s linear infinite';
    }

    return style;
};