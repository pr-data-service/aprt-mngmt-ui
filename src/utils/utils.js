
import { useNavigate, useParams, useLocation } from "react-router-dom";
import CONSTANSTS from '../utils/constants';
import APIConstants from '../utils/apiConatants';

const { CHILD_OBJECTS, OBJECTS } = CONSTANSTS;


const getObjectNameFromUrl = () => {
    const { pathname } = useLocation();
    let object = "";
    if (pathname) {
        let arr = pathname.split("/");
        object = arr[1];
    }
    object = object.replace("-", "_");
    return object.toUpperCase();
}

const getChildObjectsByObject = (object) => {
    if (object) {
        let obj = object.toUpperCase();

        return CHILD_OBJECTS[obj];
    }
    return [];
}

const isDetailView = () => {
    const { pathname } = useLocation();
    let index = pathname.split("/").indexOf("detail_view");
    return index >= 0 ? true : false;
}


const downloadCSVFile = (name, headerRow, rows, params) => {

    if (name && name != "" && headerRow && headerRow.length > 0 && rows) {
        let isSerial = params ? params.isSerial : false;
        let additionalRows = params ? params.additionalRows : [];

        if(isSerial) {
            headerRow.unshift({name: "srl", label: "Srl. No."})
        }

        //define the heading for each row of the data  
        //var csv = 'Name,Profession\n';
        //let csv = Object.values(headerRow).join(',');    // comma sepeareted value
        let csv = headerRow.map( m => m.label).join(',');
        csv += "\n";

        //merge the data with CSV  
        rows.map( (obj, index) => {
            let row = [];
            headerRow.map(m => m.name).map( key => {
                if(key === "srl") {
                    row.push(index+1);
                } else {
                    row.push(obj[key]);
                }                
            });
            csv += row.join(',');
            csv += "\n";
        });

        if(additionalRows) {
            csv += "\n";
            csv += additionalRows.join(',');
            csv += "\n";
        }
        
        //display the created CSV data on the web browser   
        //document.write(csv);  


        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';

        //provide the name for the CSV file to be downloaded  
        hiddenElement.download = name+'.csv';
        hiddenElement.click();
    }
}

const getForienKeyFieldName = (params) => {
    let fieldName = "";
    let object = params.object.toUpperCase();
    if(object === OBJECTS.FLAT_DETAILS) {
        fieldName = "flatId"
    } else if(object === OBJECTS.PAYMENT) {
        fieldName = "paymentId";
    } else if(object === OBJECTS.EVENTS) {
        fieldName = "eventId";
    }
    return fieldName;
}

const getGETApiUrl = (object) => {
    if(object.toUpperCase() == OBJECTS.OWNERS) {
        return APIConstants.USER_GET;
    } else if(object.toUpperCase() == OBJECTS.FLAT_DETAILS) {
        return APIConstants.FLAT_DETAILS_GET;;
    } else if(object.toUpperCase() == OBJECTS.MAINTENANCE) {
        return APIConstants.MAINTANANCE_GET;
    } else if(object.toUpperCase() == OBJECTS.EVENTS) {
        return APIConstants.EVENTS_GET;
    } else if(object.toUpperCase() == OBJECTS.PAYMENT) {
        return APIConstants.PAYMENT_GET;
    } else if(object.toUpperCase() == OBJECTS.PAYMENT_DETAILS) {
        
    } else if(object.toUpperCase() == OBJECTS.EXPENSE) {
        return APIConstants.EXPENSES_GET;
    } else if(object.toUpperCase() == OBJECTS.EXPENSE_ITEMS) {
        
    }
}

const getFormPOSTApiUrl = (object) => {
    if(object.toUpperCase() == OBJECTS.OWNERS) {
        return APIConstants.USER_CREATE_OR_UPDATE;
    } else if(object.toUpperCase() == OBJECTS.FLAT_DETAILS) {
        return APIConstants.FLAT_DETAILS_CREATE_OR_UPDATE;;
    } else if(object.toUpperCase() == OBJECTS.MAINTENANCE) {
        return APIConstants.MAINTANANCE_CREATE_OR_UPDATE;
    } else if(object.toUpperCase() == OBJECTS.EVENTS) {
        return APIConstants.EVENTS_CREATE_OR_UPDATE;
    } else if(object.toUpperCase() == OBJECTS.PAYMENT) {
        return APIConstants.PAYMENT_SAVE;
    } else if(object.toUpperCase() == OBJECTS.PAYMENT_DETAILS) {
        
    } else if(object.toUpperCase() == OBJECTS.EXPENSE) {
        return APIConstants.EXPENSES_CREATE_OR_UPDATE;
    } else if(object.toUpperCase() == OBJECTS.EXPENSE_ITEMS) {
        
    } else if(object.toUpperCase() == OBJECTS.ACCOUNT_TRANSACTION) {
        return APIConstants.ACCOUNT_TRANSACTION_CREATE;
    } else if(object.toUpperCase() == OBJECTS.USER) {
        return APIConstants.USER_UPDATE_ONLY_USER_ROLE;
    }
}

const Utils = {
    getObjectNameFromUrl,
    getChildObjectsByObject,
    isDetailView,
    downloadCSVFile,
    getForienKeyFieldName,
    getGETApiUrl,
    getFormPOSTApiUrl,
}

export default Utils;