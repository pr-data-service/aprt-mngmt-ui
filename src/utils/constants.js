const OBJECTS = {
    OWNERS: "USER_DETAILS",
    FLAT_DETAILS: "FLAT_DETAILS",
    MAINTENANCE_MASTER: "MAINTENANCE_MASTER",
    MAINTENANCE: "MAINTENANCE",
    PAYMENT: "PAYMENT",
    PAYMENT_DETAILS: "PAYMENT_DETAILS",
    EXPENSE_HEAD: "EXPENSE_HEAD",
    EXPENSE: "EXPENSE",
    EXPENSE_ITEMS: "EXPENSE_ITEMS",
    EVENTS: "EVENTS",
    NOTES: "NOTES",
    ACCOUNTS: "ACCOUNTS",
    ACCOUNT_TRANSACTION: "ACCOUNT_TRANSACTION",

    SETTINGS: "SETTINGS",
}

const OBJECTS_LABEL = {}
OBJECTS_LABEL[OBJECTS.OWNERS] = "Owners";
OBJECTS_LABEL[OBJECTS.FLAT_DETAILS] = "Flat Details";
OBJECTS_LABEL[OBJECTS.PAYMENT] = "Payment";
OBJECTS_LABEL[OBJECTS.PAYMENT_DETAILS] = "Payment Details";
OBJECTS_LABEL[OBJECTS.MAINTENANCE_MASTER] = "Maintenance Master";
OBJECTS_LABEL[OBJECTS.MAINTENANCE] = "Maintenance";
OBJECTS_LABEL[OBJECTS.EXPENSE_HEAD] = "Expense Head";
OBJECTS_LABEL[OBJECTS.EXPENSE] = "Expenses";
OBJECTS_LABEL[OBJECTS.EXPENSE_ITEMS] = "Expense Items";
OBJECTS_LABEL[OBJECTS.EVENTS] = "Events";
OBJECTS_LABEL[OBJECTS.SETTINGS] = "Settings";
OBJECTS_LABEL[OBJECTS.ACCOUNTS] = "Accounts";
OBJECTS_LABEL[OBJECTS.ACCOUNT_TRANSACTION] = "Account Transaction";

const CHILD_OBJECTS = {};
CHILD_OBJECTS[OBJECTS.PAYMENT] = [ OBJECTS.PAYMENT_DETAILS, OBJECTS.FLAT_DETAILS, ];

const ICONS = {
    USER_DETAILS: "fa fa-user",
    FLAT_DETAILS: "fa fa-building",
    PAYMENT: "fa fa-money",
    MAINTENANCE_MASTER: "fa fa-money",
    MAINTENANCE: "fa fa-money",
    PAYMENT_DETAILS: "fa fa-money",
    EXPENSE_HEAD: "fa fa-money",
    EXPENSE: "fa fa-money",
    EXPENSE_ITEMS: "fa fa-money",
    EVENTS: "fa fa-calendar-plus-o",
    SETTINGS: "fa fa-cog",
    ACCOUNTS: "fa fa-book"
}

const FORM_CONSTANTS = {
    VALIDATOR_TYPE_OPTIONAL: "OPTIONAL",
    VALIDATOR_TYPE_REQUIRED: "REQUIRED",
}

const EVENT_TYPES = {
    "ONETIME": "ONETIME",
    // "REGULAR": "REGULAR",
    "SUBEVENT": "SUBEVENT",
}



const MONTHS_FULL_FORM = {
    "1": "January",
    "2": "February",
    "3": "March",
    "4": "April",
    "5": "May",
    "6": "June",
    "7": "July",
    "8": "August",
    "9": "September",
    "10": "October",
    "11": "November",
    "12": "December",
}

const MONTHS_SORT_FORM = {
    "1": "Jan",
    "2": "Feb",
    "3": "Mar",
    "4": "Apr",
    "5": "May",
    "6": "June",
    "7": "July",
    "8": "Aug",
    "9": "Sept",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec",
}

const CONSTANSTS = {
    OBJECTS: OBJECTS,
    OBJECTS_LABEL: OBJECTS_LABEL,
    CHILD_OBJECTS,
    ICONS: ICONS,
    FORM_CONSTANTS: FORM_CONSTANTS,
    MONTHS_SORT_FORM: MONTHS_SORT_FORM,
    MONTHS_FULL_FORM: MONTHS_FULL_FORM,
    EVENT_TYPES
}

export default CONSTANSTS;