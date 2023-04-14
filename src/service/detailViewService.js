import APIConstants from "../utils/apiConatants";
import CONSTANSTS from "../utils/constants";
import AxiosApi from '../utils/httpRequestHandler';

const getDataFromAPI = async (object, id) => {
    object = object ? object.toUpperCase() : "";

    let url = "";
    if(object == CONSTANSTS.OBJECTS.FLAT_DETAILS) {
        url = APIConstants.FLAT_DETAILS_GET
    } else if(object == CONSTANSTS.OBJECTS.PAYMENT) {
        url = APIConstants.PAYMENT_GET
    } else if(object == CONSTANSTS.OBJECTS.EXPENSE) {
        url = APIConstants.EXPENSES_GET
    } else if(object == CONSTANSTS.OBJECTS.EVENTS) {
        url = APIConstants.EVENTS_GET
    } else if(object == CONSTANSTS.OBJECTS.OWNERS) {
        url = APIConstants.USER_GET
    }
    if(url && url != "") {
        url +=id; 
    }

    return await AxiosApi.getData(url);
}

const getRightPanelDataFromAPI = async (object, id) => {
    object = object ? object : "";

    let url = "";
    if(object == CONSTANSTS.OBJECTS.OWNERS) {
        url = APIConstants.USER_BY_FLAT_ID_GET;
    } else if(object == CONSTANSTS.OBJECTS.EVENTS) {
        url = APIConstants.EVENTS_BY_EXPENSE_ID_GET;
    }
    if(url && url != "") {
        url +=id; 
    }

    return await AxiosApi.getData(url);
}

const DetailViewService = {
    getDataFromAPI,
    getRightPanelDataFromAPI
}

export default DetailViewService;