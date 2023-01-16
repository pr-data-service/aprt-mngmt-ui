import React from 'react';
import ListView from '../common/listView';
import PageHeader from '../common/pageHeader';
import AxiosApi from '../../utils/httpRequestHandler';
import APIConstants from '../../utils/apiConatants';
import { useSnackbar } from 'notistack';
import AppDialog from '../common/appDialog';
import ConfirmDialog from '../common/confirmDialog';
import { AppContext } from '../../components/common/context/appContext';
import LinkObject from '../common/linkObject';
import CONSTANSTS from '../../utils/constants';
import { VIEW_COLUMNS } from '../../utils/columnConstants';
import Utils from '../../utils/utils';
import {getFormattedDateTime} from '../../utils/dateHandler';
import AddLastPaymentDate from '../payment/addLastPaymentDate';

const { VALIDATOR_TYPE_REQUIRED, VALIDATOR_TYPE_OPTIONAL } = CONSTANSTS.FORM_CONSTANTS;


const columns = VIEW_COLUMNS[CONSTANSTS.OBJECTS.FLAT_DETAILS];


const FlatDetailsListView = () => {
    const { enqueueSnackbar } = useSnackbar();
    const flatDetailsListViewRef = React.useRef(null);
    const appDialogRef = React.useRef(null);
    const confrmDialogRef = React.useRef(null);
    const linkObjectRef = React.useRef(null);
    

    const { handleBackDrop, handleDialogOpen, handleDialogClose } = React.useContext(AppContext);

    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        getDataFromAPI();
    }, []);

    const getDataFromAPI = async (reqParams) => {
        try{
            handleBackDrop(true);
            let response = await AxiosApi.getData(APIConstants.FLAT_DETAILS_LIST_VIEW_GET, reqParams);
            setData(response.data);
            handleBackDrop(false);
        }catch(error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }
        
    }

    const addEvt = () => {
        handleDialogOpen({ ...defaultFormProps, handleClose: handleDialogClose, callbackOnSubmit: (data) => getDataFromAPI()});
    }

    const editEvt = () => {
        let row = flatDetailsListViewRef.current.getSelectedRow();
        if (row && row.length == 1) {
            handleDialogOpen({ ...defaultFormProps, handleClose: handleDialogClose, callbackOnSubmit: (data) => getDataFromAPI(), id:row[0].id});
        } else {
            appDialogRef.current.handleOpen({ title: "Information Dialog", contentText: "Please select one record!" });
        }

    }

    const deleteEvt = () => {
        let row = flatDetailsListViewRef.current.getSelectedRow();
        if (row && row.length > 0) {
            confrmDialogRef.current.handleOpen({ title: "Confirmation Dialog", contentText: "Are you confirm to delet data?" });
        } else {
            appDialogRef.current.handleOpen({ title: "Information Dialog", contentText: "Please select one or more record!" });
        }
    }

    const deleteData = async () => {
        try {
            let row = flatDetailsListViewRef.current.getSelectedRow();
            let ids = row.map(r => r.id);
            let response = await AxiosApi.deleteData(APIConstants.FLAT_DETAILS_DELETE_BATCH, ids);
            console.log(response.data);
            getDataFromAPI();
            enqueueSnackbar('Record successfully deleted!', { variant: "success" });

        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }
    }

    const linkEvt = () => {
        let row = flatDetailsListViewRef.current.getSelectedRow();
        if (row && row.length == 1) {
            linkObjectRef.current.handleDialog(true, row[0].id);
        } else {
            appDialogRef.current.handleOpen({ title: "Information Dialog", contentText: "Please select one record!" });
        }
        
    }

    const onChangeMore = (value) => {

        if(value === 'SET-LAST-PAYMENT-DATE') {
            let row = flatDetailsListViewRef.current.getSelectedRow();
            if (row && row.length == 1) {
                handleDialogOpen({ title: "Set Last Payment Date", maxWidth: "xs", 
                requiredOKBtn: false,
                requiredCancelBtn: false,
                handleClose: handleDialogClose,
                component: <AddLastPaymentDate handleClose={handleDialogClose} flatId={row[0].id}/>});
            } else {
                appDialogRef.current.handleOpen({ title: "Information Dialog", contentText: "Please select one record!" });
            }
            
        }
    }

    const downLoadCSV = () => {        
        let header = columns.filter(f => !f.hidden).map(m => { return {name: m.dataField, label: m.text} });
        let params = {isSerial: true};
        Utils.downloadCSVFile("Flat Details-"+getFormattedDateTime(), header, data, params);
    }

    const toolBarIcon = [
        { name: "ADD", title: "Add Flat", onClick: addEvt, }, 
        { name: "EDIT", title: "Edit Flat", onClick: editEvt, }, 
        { name: "DELETE", title: "Delete Flat", onClick: deleteEvt, }, 
        { name: "PDF", title: "Export to .pdf file", onClick: () => { }, }, 
        { name: "CSV", title: "Export to .csv file", onClick: downLoadCSV, }, 
        { name: "LINK", title: "Link Object", onClick: linkEvt, },
        {
            name: "MORE", title: "More options", onClick: onChangeMore, options: [
                { value: "SET-LAST-PAYMENT-DATE", text: "Set Last Payment Date" },
            ]
        }
    ];
    
    return <div style={{ padding: 10 }}>
        <AppDialog ref={appDialogRef} maxWidth="xs" />
        <ConfirmDialog ref={confrmDialogRef} clickEvent={deleteData} />
        <PageHeader object={CONSTANSTS.OBJECTS.FLAT_DETAILS} iconName={"fa fa-building"} />
        <ListView ref={flatDetailsListViewRef} object={CONSTANSTS.OBJECTS.FLAT_DETAILS} columns={getColumns(columns)} rows={data} toolBarIcon={toolBarIcon} getListViewData={getDataFromAPI} />
        <LinkObject ref={linkObjectRef} object={CONSTANSTS.OBJECTS.FLAT_DETAILS}/>
    </div>
}

export default FlatDetailsListView;


const getColumns = (cols) => {
    if (cols) {
        let columns = [...cols];
        columns.forEach((col, i) => {
            if (col.dataField == "flatNo") {
                col.formatExtraData = {
                    detailLinkUrl: "/" + CONSTANSTS.OBJECTS.FLAT_DETAILS.toLowerCase() + "/detail_view/"
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
};

const fields = [
    { "name": "flatNo", label: "Flat No", defaultValue: "", "type": "TEXT", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED  },
    { "name": "block", label: "Block", defaultValue: "", "type": "TEXT", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED  },
    { "name": "flatSizeSqft", label: "Square Foot", defaultValue: "", "type": "NUMBER", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED  },
    // { "name": "noOfRooms", label: "No of Room", defaultValue: "", "type": "NUMBER", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED  },
    { "name": "floorNo", label: "Floor No", defaultValue: "", "type": "NUMBER", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED  },
    // { "name": "maintenanceAmount", label: "Maintenance Amount", defaultValue: "", "type": "NUMBER", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED  },
    { "name": "flatType", label: "Type", defaultValue: "", "type": "LIST", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED, 
            options: [{value: "SINGLE", text: "SINGLE"}, {value: "DOUBLE", text: "DOUBLE"}],            
    }
]
const defaultFormProps = {
    title: "Flat Details Registration", 
    contentText: "", 
    maxWidth: "xs", 
    type:"FORM", 
    object: CONSTANSTS.OBJECTS.FLAT_DETAILS, 
    fields: fields, 
}