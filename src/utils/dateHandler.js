//https://javascript.info/date

const ALL_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DEFAULT_DATE_TIME_FORMAT = "dd-mm-yyyy HH:mm:ss";
const DEFAULT_DATE_FORMAT = "dd-mm-yyyy";
const DEFAULT_TIME_FORMAT = "HH:mm:ss";

const DATE_PICKER_DATE_FORMAT = "yyyy-mm-dd";
const DATE_PICKER_TIME_FORMAT = "HH:mm:ss";

const DATE_TIME_FORMAT = {
    DEFAULT_DATE_TIME_FORMAT,

    DEFAULT_DATE_FORMAT,
    DATE_FORMAT_MMM_COMMA_YYYY: "mmm, yyyy",
    DATE_FORMAT_MM_COMMA_YYYY: "mm, yyyy",
    DATE_FORMAT_MMM_HEIGHPHEN_YYYY: "mmm-yyyy",
    DATE_FORMAT_MM_HEIGHPHEN_YYYY: "mm-yyyy",


    DEFAULT_TIME_FORMAT,
}



const getFormattedDate = (format, dateInput) => {

    if (!format || format === "") {
        format = DEFAULT_DATE_FORMAT;
    }

    let date = dateInput ? dateInput : new Date();
    let day = date.getDate();
    day = day.toString().length == 1 ? +0 + "" + day : day;
    let month = date.getMonth() + 1;
    month = month.toString().length == 1 ? +0 + "" + month : month;
    let year = date.getFullYear();

    let rtnDate = format;
    if (format.search("dd") >= 0) {
        rtnDate = rtnDate.replace("dd", day);
    }

    if (format.search("mm") >= 0) {
        rtnDate = rtnDate.replace("mm", month);
    }

    if (format.search("yyyy") >= 0) {
        rtnDate = rtnDate.replace("yyyy", year);
    }
    return rtnDate;
}

const getFormattedTime = (format, dateInput) => {

    if (!format || format === "") {
        format = DEFAULT_TIME_FORMAT;
    }

    let date = dateInput ? dateInput : new Date();
    let hours = date.getHours();
    hours = hours.toString().length == 1 ? +0 + "" + hours : hours;
    let minutes = date.getMinutes();
    minutes = minutes.toString().length == 1 ? +0 + "" + minutes : minutes;
    let seconds = date.getSeconds();
    seconds = seconds.toString().length == 1 ? +0 + "" + seconds : seconds;

    let rtnDate = format;
    if (format.search("HH") >= 0) {
        rtnDate = rtnDate.replace("HH", hours);
    }

    if (format.search("mm") >= 0) {
        rtnDate = rtnDate.replace("mm", minutes);
    }

    if (format.search("ss") >= 0) {
        rtnDate = rtnDate.replace("ss", seconds);
    }
    return rtnDate;
}

const getFormattedDateTime = (date, format) => {
    let strDateTime = getFormattedDate() + " " + getFormattedTime();
    return strDateTime;
}

const getDateForDatePicker = (value) => {

    if (!value || value === "") {
        return getFormattedDate(DATE_PICKER_DATE_FORMAT);
    }
    return value;
}

const formatStringDDMMYYYYDate = (date, format) => {
    if (date) {
        let arr = [];
        if(date.search(",") >= 0) {
            arr = date.split(',');
        } else if(date.search("-") >= 0) {
            arr = date.split("-");
        } else if(date.search(" ") >= 0) {
            arr = date.split(" ");
        }


        if (format) {
            let rtnDate = format;
            
            if (format.search("dd") >= 0) {
                rtnDate = rtnDate.replace("dd", arr[0]);
            }

            if (format.search("mmm") >= 0) {
                rtnDate = rtnDate.replace("mmm", ALL_MONTHS[parseInt(arr[1])]);
            } else if (format.search("mm") >= 0) {
                rtnDate = rtnDate.replace("mm", parseInt(arr[1]));
            }

            if (format.search("yyyy") >= 0) {
                rtnDate = rtnDate.replace("yyyy", arr[2]);
            }
            return rtnDate;
        }        
    }
    return "";
}

const convertAPIDateToDatePickerDate = (strDate) => {
    let cnvrtDt = null;
    if(strDate && strDate !== "") {
        let arr = strDate.split("-");
        let date = new Date(arr[2]+"-"+arr[1]+"-"+arr[0]);
        cnvrtDt = getFormattedDate(DATE_PICKER_DATE_FORMAT, date);
    }
    return cnvrtDt;
}

const parseAPIDate = (strDate) => {
    let date = null;
    if(strDate && strDate !== "") {
        let arr = strDate.split("-");
        date = new Date(arr[2]+"-"+arr[1]+"-"+arr[0]);
    }
    return date;
}

const convertDatePickerDateToAPIDate = (strDate) => {
    let date = null;
    if(strDate && strDate !== "") {
        let arr = strDate.split("-");
        date = new Date(strDate);
        date = getFormattedDate("", date);
    }
    return date;
}

export {
    DATE_TIME_FORMAT,
    getFormattedDate,
    getFormattedTime,
    getFormattedDateTime,
    getDateForDatePicker,
    formatStringDDMMYYYYDate,
    convertAPIDateToDatePickerDate,
    parseAPIDate,
    convertDatePickerDateToAPIDate
}