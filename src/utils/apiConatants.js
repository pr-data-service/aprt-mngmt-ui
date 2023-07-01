
const APIConstants =  {
    HOST: "http://localhost:8080",

    APP_LOGIN: "/api/authenticate",

    PROJECT_CREATE_OR_UPDATE: "/api/project/create_or_update",
    PROJECT_GET: "/api/project/get",
    PROJECT_SESSION_LIST_GET: "/api/project/session/list/get",

    APARTMENT_DETAILS_GET: "/api/apartment-details/get",
    APARTMENT_DETAILS_GET_BY_ID: "/api/apartment-details/get/",

    SESSION_DETAILS_CREATE_OR_UPDATE: "/api/session_details/create_or_update",
    SESSION_DETAILS_LIST_GET: "/api/session_details/list/get/",
    SESSION_DETAILS_DELETE: "/api/session_details/delete/",

    USER_LIST_GET: "/api/user/list/get",
    USER_LIST_VIEW_GET: "/api/user/list_view/get",
    USER_GET: "/api/user/get/",
    USER_CREATE_OR_UPDATE: "/api/user/create_or_update",
    USER_DELETE: '/api/user/delete/',
    USER_DELETE_BATCH: '/api/user/delete/batch',
    USER_BY_FLAT_ID_GET: "/api/user/by_flat_id/get/",
    USER_LOGGEDIN_GET: '/api/user/loggedin/get',
    USER_UPDATE_PASSWORD: '/api/user/update_password',
    USER_SIGNATURE_UPLOAD : "/api/user/signature/upload",
    USER_SIGNATURE_GET : "/api/user/signature/get",
    USER_LIST_ONLY_USER : "/api/user/list/only-user",
    USER_UPDATE_ONLY_USER_ROLE : "/api/user/update/only-user-role",
    USER_REMOVE_ROLE: "/api/user/remove/user-role/",

    USER_ROLE_PERMISSION_GET: "/api/user/user-role-permission/get",
    USER_ROLE_PERMISSION_GET_BY_OBJECT_ROLE: "/api/user//user-role-permission/get/",
    USER_ROLE_PERMISSION_CREATE_OR_UPDATE: "/api/user/user-role-permission/create_or_update",
    

    FLAT_DETAILS_LIST_GET: "/api/flat_details/list/get",
    FLAT_DETAILS_LIST_VIEW_GET: "/api/flat_details/list_view/get",
    FLAT_DETAILS_GET: "/api/flat_details/get/",
    FLAT_DETAILS_CREATE_OR_UPDATE: "/api/flat_details/create_or_update",
    FLAT_DETAILS_DELETE: '/api/flat_details/delete/',
    FLAT_DETAILS_DELETE_BATCH: '/api/flat_details/delete/batch',

    COMMON_LINK_OBJECT_SAVE: '/api/common/link/save',
    COMMON_LINK_OBJECT_GET: '/api/common/link/get',

    MAINTANANCE_CREATE_OR_UPDATE: "/api/maintenance/create_or_update",
    MAINTANANCE_LIST_VIEW_GET: "/api/maintenance/list_view/get",
    MAINTANANCE_LIST_GET: "/api/maintenance/list/get/",
    MAINTANANCE_GET: "/api/maintenance/get/",
    MAINTANANCE_DELETE_BATCH: '/api/maintenance/delete/batch',

    MAINTANANCE_MASTER_LIST_VIEW_GET: "/api/maintenance/master/list_view/get",
    MAINTANANCE_MASTER_CREATE_OR_UPDATE: "/api/maintenance/master/create_or_update",
    MAINTANANCE_MASTER_ACTIVE: "/api/maintenance/master/active/",
    MAINTANANCE_MASTER_DELETE_BATCH: '/api/maintenance/master/delete/batch',

    PAYMENT_ADD_PAGE_GET: "/api/payment/add_page/get/",
    PAYMENT_LIST_VIEW_GET: "/api/payment/list_view/get",
    PAYMENT_SAVE: "/api/payment/save",
    PAYMENT_DELETE: '/api/payment/delete/',
    PAYMENT_GET: "/api/payment/get/",
    PAYMENT_DOWNLOAD: "/api/payment/download/",
    PAYMENT_CANCEL: "/api/payment/cancel", 
    PAYMENT_SLIP_BY_MONTHS_GET: "/api/payment/slip_by_months/get",  
    PAYMENT_DOWNLOAD_ZIP: "/api/payment/download_zip/",   


    
    PAYMENT_DETAILS_LIST_VIEW_GET: "/api/payment_details/list_view/get",
    PAYMENT_DETAILS_DUES_LIST_VIEW_GET: "/api/payment_details/list_view/dues/get",
    PAYMENT_DETAILS_LAST_PAYMENT_DATE_SAVE: "/api/payment_details/last_payment_date/save", 
    PAYMENT_DETAILS_ADVANCE_PAYMENT_DUES_GET: "/api/payment_details/advance_payment_dues/get/",

    EMAIL_SETUP_CREATE_OR_UPDATE: "/api/email/setup/create_or_update",
    EMAIL_SETUP_GET: "/api/email/setup/get",
    
    EMAIL_SERVICE_GET: "/api/email/service/get",
    EMAIL_SERVICE_CREATE_OR_UPDATE : "/api/email/service/create_or_update",

    EVENTS_LIST_GET: "/api/events/list/get/",
    EVENTS_LIST_VIEW_GET: "/api/events/list_view/get",
    EVENTS_CREATE_OR_UPDATE: "/api/events/create_or_update",
    EVENTS_GET: "/api/events/get/",
    EVENTS_ACTIVE: "/api/events/active/",
    EVENTS_INACTIVE: "/api/events/inactive/",
    EVENTS_DELETE_BATCH: '/api/events/delete/batch',
    EVENTS_BY_EXPENSE_ID_GET: "/api/events/by_expense_id/get/",

    EXPENSE_HEAD_LIST_GET: "/api/expense-head/list/get/",
    EXPENSE_HEAD_LIST_VIEW_GET: "/api/expense-head/list_view/get",
    EXPENSE_HEAD_CREATE_OR_UPDATE: "/api/expense-head/create_or_update",
    EXPENSE_HEAD_GET: "/api/expense-head/get/",
    EXPENSE_HEAD_DELETE: '/api/expense-head/delete/',

    EXPENSES_LIST_GET: "/api/expenses/list/get/",
    EXPENSES_APPROVED: "/api/expenses/approved",
    EXPENSES_LIST_VIEW_GET: "/api/expenses/list_view/get",
    EXPENSES_CREATE_OR_UPDATE: "/api/expenses/create_or_update",
    EXPENSES_GET: "/api/expenses/get/",
    EXPENSES_DELETE: '/api/expenses/delete/',
    EXPENSES_DOWNLOAD: "/api/expenses/download/",
    EXPENSES_CANCEL: "/api/expenses/cancel",
    EXPENSES_VOUCHER_DOWNLOAD_ZIP: "/api/expenses/voucher/download_zip/", 
    EXPENSES_VOUCHER_BY_MONTH_GET: "/api/expenses/voucher_by_month/get",

    EXPENSES_ITEMS_LIST_VIEW_GET: "/api/expense_items/list_view/get",

    NOTES_VIEW_GET: "/api/notes/view/get",
    NOTES_CREATE_OR_UPDATE: "/api/notes/create_or_update",
    NOTES_GET: "/api/notes/get/",
    NOTES_DELETE: '/api/notes/delete/',
    // NOTES_DELETE_BATCH: '/api/notes/delete/batch',

    DASHBOARD_MAINTENANCE_MONTHLY_GET: "/api/dashboard/maintenance/monthly/get",
    DASHBOARD_EVENTS_REPORT_GET: "/api/dashboard/events/report/get",
    DASHBOARD_MAINTENANCE_TODAYS_GET: "/api/dashboard/maintenance/todays/get",

    ACCOUNT_TRANSACTION_CREATE: "/api/accounts/transaction/create",
    ACCOUNT_TRANSACTION_LIST_GET: "/api/accounts/transaction/list/get/",
    ACCOUNT_TRANSACTION_DELETE: '/api/accounts/transaction/delete/',
    ACCOUNT_OPENING_BALANCE_GET: '/api/accounts/opening-balance/get',
    ACCOUNT_OPENING_BALANCE_CREATE_OR_UPDATE: '/api/accounts/opening-balance/create-or-update',
    ACCOUNT_PAYMENT_INFO_GET: 'api/accounts/payment-info/get',
    ACCOUNT_EXPENSE_INFO_GET: 'api/accounts/expense-info/get',
}

export default APIConstants;