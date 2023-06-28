import React from 'react';
import ListView from '../common/listView';
import PageHeader from '../common/pageHeader';
import AxiosApi from '../../utils/httpRequestHandler';
import APIConstants from '../../utils/apiConatants';
import { useSnackbar } from 'notistack';
import AppDialog from '../common/appDialog';
import ConfirmDialog from '../common/confirmDialog';
import { AppContext } from '../../components/common/context/appContext';
import EventsForm from './eventsForm';
import CONSTANSTS from '../../utils/constants';
import Utils from '../../utils/utils';
import { getFormattedDateTime } from '../../utils/dateHandler';

const { VALIDATOR_TYPE_REQUIRED, VALIDATOR_TYPE_OPTIONAL } = CONSTANSTS.FORM_CONSTANTS;
const object = CONSTANSTS.OBJECTS.EVENTS;     


const EventsListView = () => {
    const { enqueueSnackbar } = useSnackbar();
    const eventListViewRef = React.useRef(null);
    const appDialogRef = React.useRef(null);
    const confrmDialogRef = React.useRef(null);
    
    const { handleBackDrop, handleDialogOpen, handleDialogClose } = React.useContext(AppContext);

    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        getDataFromAPI();
    }, []);

    const getDataFromAPI = async (reqParams) => {
        handleBackDrop(true);
        let response = await AxiosApi.getData(APIConstants.EVENTS_LIST_VIEW_GET, reqParams);
        setData(response.data);        
        handleBackDrop(false);
    }

    const addEvt = () => {
        handleDialogOpen({ ...defaultFormProps, handleClose: handleDialogClose, callbackOnSubmit: (data) => getDataFromAPI()});
    }

    const editEvt = () => {
        let row = eventListViewRef.current.getSelectedRow();
        if (row && row.length == 1) {
            handleDialogOpen({ ...defaultFormProps, handleClose: handleDialogClose, callbackOnSubmit: (data) => getDataFromAPI(), id:row[0].id});
        } else {
            appDialogRef.current.handleOpen({ title: "Information Dialog", contentText: "Please select one record!" });
        }

    }

    const deleteEvt = () => {
        let row = eventListViewRef.current.getSelectedRow();
        if (row && row.length > 0) {
            confrmDialogRef.current.handleOpen({ title: "Confirmation Dialog", contentText: "Are you confirm to delet data?" });
        } else {
            appDialogRef.current.handleOpen({ title: "Information Dialog", contentText: "Please select one or more record!" });
        }
    }

    const deleteData = async () => {
        try {
            let row = eventListViewRef.current.getSelectedRow();
            let ids = row.map(r => r.id);
            let response = await AxiosApi.deleteData(APIConstants.EVENTS_DELETE_BATCH, ids);
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
            if( value == "ACTIVE" || value == "IN-ACTIVE") {
                let row = eventListViewRef.current.getSelectedRow();
                if (row && row.length == 1) {
                    handleBackDrop(true);
                    let url = value == "ACTIVE" ? APIConstants.EVENTS_ACTIVE : APIConstants.EVENTS_INACTIVE;
                    let response = await AxiosApi.getData(url+row[0].id);
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

    const downLoadCSV = () => {        
        let header = columns.filter(f => !f.hidden).map(m => { return {name: m.dataField, label: m.text} });
        let params = {isSerial: true};
        Utils.downloadCSVFile("event-list-view-"+getFormattedDateTime(), header, data, params);
    }

    const toolBarIcon = [
        { name: "ADD", title: "Add Owners", onClick: addEvt, }, 
        { name: "EDIT", title: "Edit Owners", onClick: editEvt, }, 
        { name: "DELETE", title: "Delete Owners", onClick: deleteEvt, }, 
        { name: "PDF", title: "Export to .pdf file", onClick: () => { }, }, 
        { name: "CSV", title: "Export to .csv file", onClick: downLoadCSV, }, 
        {
            name: "MORE", title: "More options", onClick: onChangeMore, options: [
                { value: "ACTIVE", text: "ACTIVE" },
                { value: "IN-ACTIVE", text: "IN-ACTIVE" }]
        }];

        const getToolBarIcon = () => {
            let list = [...toolBarIcon];
    
            if(!Utils.isPermission(object, CONSTANSTS.USER_PERMISSION.CREATE)) {
                list = list.filter( f => f.name !== "ADD");
            }
    
            if(!Utils.isPermission(object, CONSTANSTS.USER_PERMISSION.EDIT)) {
                list = list.filter( f => f.name !== "EDIT");
            }
    
            if(!Utils.isPermission(object, CONSTANSTS.USER_PERMISSION.DELETE)) {
                list = list.filter( f => f.name !== "DELETE");
            }
            
            return list;
        }    

    return <div style={{ padding: 10 }}>
        <AppDialog ref={appDialogRef} maxWidth="xs" />
        <ConfirmDialog ref={confrmDialogRef} clickEvent={deleteData} />
        <PageHeader object={CONSTANSTS.OBJECTS.EVENTS} />
        <ListView ref={eventListViewRef} object={CONSTANSTS.OBJECTS.EVENTS} columns={getColumns(columns)} rows={data} toolBarIcon={getToolBarIcon()} getListViewData={getDataFromAPI}/>
    </div>
}

export default EventsListView;


const getColumns = (cols) => {
    if (cols) {
        let columns = [...cols];
        columns.forEach((col, i) => {
            if (col.dataField == "name") {
                col.formatExtraData = {
                    detailLinkUrl: "/" + CONSTANSTS.OBJECTS.EVENTS.toLowerCase() + "/detail_view/"
                };
                col.events = {
                    onClick: (e, column, columnIndex, row, rowIndex) => {                        
                        console.log(e);
                        console.log(column);
                        console.log(columnIndex);
                        console.log(row);
                        console.log(rowIndex);
                        //alert('Click on Product ID field');
                    },
                    onMouseEnter: (e, column, columnIndex, row, rowIndex) => {
                        console.log(e);
                        console.log(column);
                        console.log(columnIndex);
                        console.log(row);
                        console.log(rowIndex);
                        console.log('onMouseEnter on Product ID field');
                    }
                }
            }
        })
        return columns;
    }
    return cols;
}

const columns = [{
    dataField: 'id',
    text: 'ID',
    type: "NUMBER",
    hidden: true,
}, {
    dataField: 'name',
    text: 'Name',
    type: "TEXT",
    sort: true,
    headerStyle: { width: 20, },
    headerAttrs: { title: 'Name' },
    headerStyle: { width: 200, },
}, {
    dataField: 'description',
    text: 'Description',
    type: "TEXT",
    sort: true,
    headerAttrs: { title: 'Description' },
    headerStyle: { width: 150, },
}, {
    dataField: 'targetAmount',
    text: 'Target Amount',
    type: "TEXT",
    sort: true,
    headerAttrs: { title: 'Target Amount' },
    headerStyle: { width: 120, },
}, {
    dataField: 'amountPerFlat',
    text: 'Amount Per Flat',
    type: "NUMBER",
    sort: true,
    headerAttrs: { title: 'Amount Per Flat' },
    headerStyle: { width: 120, },
}, {
    dataField: 'isActive',
    text: 'Is Active',
    type: "TEXT",
    sort: true,
    headerAttrs: { title: 'Is Active' },
    headerStyle: { width: 80, },
    style: { width: 80, }
}, {
    dataField: 'createdByName',
    text: 'Created By',
    type: "TEXT",
    sort: true,
    headerAttrs: { title: 'Created By' },
    headerStyle: { width: 150, },
}, {
    dataField: 'createdDate',
    text: 'Created Date',
    type: "DATE",
    sort: true,
    headerAttrs: { title: 'Created Date' },
    headerStyle: { width: 150, },
    style: { width: 150, }
}, {
    dataField: 'modifiedByName',
    text: 'Modified By',
    type: "TEXT",
    sort: true,
    headerAttrs: { title: 'Modified By' },
    headerStyle: { width: 150, },
}, {
    dataField: 'modifiedDate',
    text: 'Updated Date',
    type: "DATE",
    sort: true,
    headerAttrs: { title: 'Updated Date' },
    headerStyle: { width: 150, },
    style: { width: 150, }
}];

const fields = [
    { "name": "name", label: "Name", defaultValue: "", "type": "TEXT", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    { "name": "description", label: "Description", defaultValue: "", "type": "TEXT", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    { "name": "targetAmount", label: "Target Amount", defaultValue: "", "type": "NUMBER", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    { "name": "amountPerFlat", label: "Amount Per Flat", defaultValue: "", "type": "NUMBER", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    // { "name": "type", label: "Type", defaultValue: "", "type": "LIST", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED, 
    //         options: Object.values(CONSTANSTS.EVENT_TYPES).map( m => {return {value: m, text: m}}),
    //         watch: {callback: callbackForField("type")}
    // },
    // { "name": "parentEventId", label: "Parent Event", defaultValue: "", "type": "LIST", "isHeaden": true, validationType: VALIDATOR_TYPE_REQUIRED, 
    //     options:[],
    //     onLoadEventProps: { apiUrl: APIConstants.EVENTS_LIST_GET, reqParams: {searchFieldName: "type", searchFieldValue: "ONETIME"}, fieldNames: ["id", "name"]},
    //     watch: {callback: callbackForField("parentEventId")}
    // },
];

const defaultFormProps = {
    title: "Add/Edit Events", 
    contentText: "", 
    maxWidth: "xs", 
    type:"FORM", 
    object: CONSTANSTS.OBJECTS.EVENTS, 
    fields: fields, 
}