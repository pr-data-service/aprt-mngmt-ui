import CONSTANSTS from "./constants"
import Constants from '../utils/constants';

//columnConstants

const VIEW_COLUMNS = {}
VIEW_COLUMNS[CONSTANSTS.OBJECTS.FLAT_DETAILS] = [
{
    dataField: 'id',
    text: 'ID',
    type: "NUMBER",
    hidden: true,
}, {
    dataField: 'flatNo',
    text: 'Flat Number',
    type: "TEXT",
    sort: true,
    headerAttrs: { title: 'Flat Number' },
    headerStyle: { width: 90, },
    style: { width: 90, }
}, {
    dataField: 'block',
    text: 'Block',
    type: "TEXT",
    sort: true,
    headerAttrs: { title: 'Block' },
    headerStyle: { width: 40, },
    style: { width: 40, }
}, {
    dataField: 'flatSizeSqft',
    text: 'Square Foot',
    type: "NUMBER",
    sort: true,
    headerAttrs: { title: 'Square Foot' },
    headerStyle: { width: 90, },
    style: { width: 90, }
}, {
    dataField: 'floorNo',
    text: 'Floor No',
    type: "NUMBER",
    sort: true,
    headerAttrs: { title: 'Floor No' },
    headerStyle: { width: 70, },
    style: { width: 70, }
},/* {
    dataField: 'noOfRooms',
    text: 'No of Rooms',
    type: "NUMBER",
    sort: true,
    headerAttrs: { title: 'No of Rooms' },
    headerStyle: { width: 150, },
    style: { width: 150, }
}, {
    dataField: 'maintenanceAmount',
    text: 'Maintenance Amount',
    type: "NUMBER",
    sort: true,
    headerAttrs: { title: 'Maintenance Amount' },
    headerStyle: { width: 150, },
    style: { width: 150, }
},*/ {
    dataField: 'flatType',
    text: 'Type',
    type: "TEXT",
    sort: true,
    headerAttrs: { title: 'Type' },
    headerStyle: { width: 60, },
    style: { width: 60, }
}, {
    dataField: 'ownersFirstName',
    text: 'Owners First Name',
    type: "TEXT",
    sort: true,
    headerAttrs: { title: 'Owners First Name' },
    headerStyle: { width: 200, },
    style: { width: 200, }
}, {
    dataField: 'ownersLastName',
    text: 'Owners Last Name',
    type: "TEXT",
    sort: true,
    headerAttrs: { title: 'Owners Last Name' },
    headerStyle: { width: 200, },
    style: { width: 200, }
}, {
    dataField: 'createdDate',
    text: 'Created Date',
    type: "DATE",
    sort: true,
    headerAttrs: { title: 'Created Date' },
    headerStyle: { width: 150, },
    style: { width: 150, }
}, {
    dataField: 'createdByName',
    text: 'Created By',
    type: "TEXT",
    sort: true,
    headerAttrs: { title: 'Created By' },
    headerStyle: { width: 150, },
    style: { width: 150, }
}, {
    dataField: 'modifiedDate',
    text: 'Updated Date',
    type: "DATE",
    sort: true,
    headerAttrs: { title: 'Updated Date' },
    headerStyle: { width: 150, },
    style: { width: 150, }
}, {
    dataField: 'modifiedByName',
    text: 'Modified By',
    type: "TEXT",
    sort: true,
    headerAttrs: { title: 'Modified By' },
    headerStyle: { width: 150, },
    style: { width: 150, }
}];

VIEW_COLUMNS[CONSTANSTS.OBJECTS.PAYMENT] = 
 [{
    dataField: 'id',
    text: 'ID',
    type:"NUMBER",
    hidden: true,
}, {
    dataField: 'billNo',
    text: 'Bill No.',
    type:"TEXT",
    headerStyle: { width: 50, },
    headerAttrs: { title: 'Bill No.' }
}, {
    dataField: 'flatNo',
    text: 'Flat No',
    type:"TEXT",
    headerStyle: { width: 50, },
    headerAttrs: { title: 'Flat No' },
    keyConstraints: "FK"
}, {
    dataField: 'amount',
    text: 'Amount',
    type:"NUMBER",
    headerStyle: { width: 60, },
    headerAttrs: { title: 'Amount' }
}, {
    dataField: 'paymentMode',
    text: 'Payment Mode',
    type:"TEXT",
    sort: true,
    headerStyle: { width: 100, },
    headerAttrs: { title: 'Payment Mode' }
}, {
    dataField: 'paymentModeRef',
    text: 'Payment Mode Ref.',
    type:"TEXT",
    sort: true,
    headerStyle: { width: 130, },
    headerAttrs: { title: 'Payment Mode Ref.' }
}, {
    dataField: 'paymentDate',
    text: 'Payment Date',
    type:"DATE",
    sort: true,
    headerStyle: { width: 100, },
    headerAttrs: { title: 'Payment Date' }
}, {
    dataField: 'remarks',
    text: 'Remarks',
    type:"TEXT",
    sort: true,
    headerStyle: { width: 250, },
    headerAttrs: { title: 'Remarks' }
}, {
    dataField: 'paymentByName',
    text: 'Payment By',
    type:"TEXT",
    sort: true,
    headerStyle: { width: 100, },
    headerAttrs: { title: 'Remarks' }
}, {
    dataField: 'isCanceled',
    text: 'Is Canceled',
    type:"BOOLEAN",
    sort: true,
    headerStyle: { width: 80, },
    headerAttrs: { title: 'Is Canceled' }
}, {
    dataField: 'cancelRemarks',
    text: 'Cancel Remarks',
    type:"TEXT",
    sort: true,
    headerStyle: { width: 150, },
    headerAttrs: { title: 'Cancel Remarks' }
}, {
    dataField: 'createdDate',
    text: 'Created Date',
    type:"DATE",
    sort: true,
    headerStyle: { width: 150, },
    headerAttrs: { title: 'Created Date' }
}, {
    dataField: 'createdByName',
    text: 'Created By',
    type: "TEXT",
    sort: true,
    headerStyle: { width: 100, },
    headerAttrs: { title: 'Created By' },
    keyConstraints: "FK"
}, 
// {
//     dataField: 'modifiedDate',
//     text: 'Modified Date',
//     sort: true,
//     headerStyle: { width: 150, },
//     headerAttrs: { title: 'Modified Date' }
// }, 
// {
//     dataField: 'modifiedByName',
//     text: 'Modified By',
//     type: "TEXT",
//     sort: true,
//     headerStyle: { width: 100, },
//     headerAttrs: { title: 'Modified By' }
// },
];

VIEW_COLUMNS[CONSTANSTS.OBJECTS.EXPENSE] = [{
    dataField: 'id',
    text: 'ID',
    type: "NUMBER",
    hidden: true,
}, {
    dataField: 'voucherNo',
    text: 'Voucher No',
    type: "TEXT",
    sort: true,
    headerAttrs: { title: 'Voucher No' },
    headerStyle: { width: 100, },
}, {
    dataField: 'title',
    text: 'Title',
    type: "TEXT",
    sort: true,
    headerStyle: { width: 20, },
    headerAttrs: { title: 'Title' },
    headerStyle: { width: 150, }
}, {
    dataField: 'amount',
    text: 'Amount',
    type: "TEXT",
    sort: true,
    headerStyle: { width: 20, },
    headerAttrs: { title: 'Amount' },
    headerStyle: { width: 60, }
}, {
    dataField: 'paymentMode',
    text: 'Payment Mode',
    type: "TEXT",
    sort: true,
    headerStyle: { width: 100, },
    headerAttrs: { title: 'Payment Mode' },
}, {
    dataField: 'description',
    text: 'Description',
    type: "TEXT",
    sort: true,
    headerAttrs: { title: 'Description' },
    headerStyle: { width: 250, },
}, {
    dataField: 'expenseDate',
    text: 'Expense Date',
    type: "DATE",
    sort: true,
    headerAttrs: { title: 'Expense Date' },
    headerStyle: { width: 150, },
    style: { width: 150, }
}, {
    dataField: 'eventName',
    text: 'Event Name',
    type: "TEXT",
    sort: true,
    headerAttrs: { title: 'Event Name' },
    headerStyle: { width: 150, },
}, {
    dataField: 'isCanceled',
    text: 'Is Canceled',
    type:"BOOLEAN",
    sort: true,
    headerStyle: { width: 80, },
    headerAttrs: { title: 'Is Canceled' }
}, {
    dataField: 'cancelRemarks',
    text: 'Cancel Remarks',
    type:"TEXT",
    sort: true,
    headerStyle: { width: 150, },
    headerAttrs: { title: 'Cancel Remarks' }
},{
    dataField: 'createdDate',
    text: 'Created Date',
    type: "DATE",
    sort: true,
    headerAttrs: { title: 'Created Date' },
    headerStyle: { width: 150, },
    style: { width: 150, }
}, {
    dataField: 'createdByName',
    text: 'Created By',
    type: "TEXT",
    sort: true,
    headerAttrs: { title: 'Created By' },
    headerStyle: { width: 150, },
    style: { width: 150, }
}, {
    dataField: 'modifiedDate',
    text: 'Modified Date',
    type: "DATE",
    sort: true,
    headerAttrs: { title: 'Modified Date' },
    headerStyle: { width: 150, },
    style: { width: 150, }
}, {
    dataField: 'modifiedByName',
    text: 'Modified By',
    type: "TEXT",
    sort: true,
    headerAttrs: { title: 'Modified By' },
    headerStyle: { width: 150, },
    style: { width: 150, }
}];

VIEW_COLUMNS[CONSTANSTS.OBJECTS.EXPENSE_HEAD] = [{
    dataField: 'id',
    text: 'ID',
    type: "NUMBER",
    hidden: true,
}, {
    dataField: 'title',
    text: 'Title',
    type: "TEXT",
    sort: true,
    headerStyle: { width: 20, },
    headerAttrs: { title: 'Title' },
    headerStyle: { width: 200, },
}, {
    dataField: 'description',
    text: 'Description',
    type: "TEXT",
    sort: true,
    headerAttrs: { title: 'Description' },
    headerStyle: { width: 340, },
}, {
    dataField: 'createdDate',
    text: 'Created Date',
    type: "DATE",
    sort: true,
    headerAttrs: { title: 'Created Date' },
    headerStyle: { width: 150, },
    style: { width: 150, }
}, {
    dataField: 'createdByName',
    text: 'Created By',
    type: "TEXT",
    sort: true,
    headerAttrs: { title: 'Created By' },
    headerStyle: { width: 150, },
    style: { width: 150, }
}, {
    dataField: 'modifiedDate',
    text: 'Modified Date',
    type: "DATE",
    sort: true,
    headerAttrs: { title: 'Modified Date' },
    headerStyle: { width: 150, },
    style: { width: 150, }
}, {
    dataField: 'modifiedByName',
    text: 'Modified By',
    type: "TEXT",
    sort: true,
    headerAttrs: { title: 'Modified By' },
    headerStyle: { width: 150, },
    style: { width: 150, }
}];

VIEW_COLUMNS[CONSTANSTS.OBJECTS.EVENTS] = [
    {
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
        dataField: 'type',
        text: 'Type',
        type: "TEXT",
        sort: true,
        headerAttrs: { title: 'Type' },
        headerStyle: { width: 100, },
        style: { width: 150, }
    }, {
        dataField: 'parentEventName',
        text: 'Parent Event Name',
        type: "TEXT",
        sort: true,
        headerAttrs: { title: 'Parent Event Name' },
        headerStyle: { width: 100, },
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
    }
]

VIEW_COLUMNS[CONSTANSTS.OBJECTS.OWNERS] = [{
    dataField: 'id',
    text: 'ID',
    type: "NUMBER",
    hidden: true,
},
//  {
//     dataField: 'loginId',
//     text: 'Login Id',
//     type: "TEXT",
//     sort: true,
//     headerStyle: { width: 20, },
//     headerAttrs: { title: 'Login Id' },
//     headerStyle: { width: 100, },
//     style: { width: 100, }
// },
 {
    dataField: 'firstName',
    text: 'First Name',
    type: "TEXT",
    sort: true,
    headerAttrs: { title: 'First Name' },
    headerStyle: { width: 142, },
}, {
    dataField: 'lastName',
    text: 'Last Name',
    type: "TEXT",
    sort: true,
    headerAttrs: { title: 'Last Name' },
    headerStyle: { width: 150, },
},
//  {
//     dataField: 'adharCardNo',
//     text: 'Aadhaar Card No.',
//     type: "TEXT",
//     sort: true,
//     headerAttrs: { title: 'Aadhaar Card No.' },
//     headerStyle: { width: 100, },
//     style: { width: 100, }
// }, 
{
    dataField: 'contactNo1',
    text: 'Phone 1',
    type: "TEXT",
    sort: true,
    headerAttrs: { title: 'Phone 1' },
    headerStyle: { width: 100, },
    style: { width: 100, }
}, {
    dataField: 'contactNo2',
    text: 'Phone 2',
    type: "TEXT",
    sort: true,
    headerAttrs: { title: 'Phone 2' },
    headerStyle: { width: 100, },
    style: { width: 100, }
}, {
    dataField: 'emailId',
    text: 'Email',
    type: "TEXT",
    sort: true,
    headerAttrs: { title: 'Email' },
    headerStyle: { width: 100, },
}, {
    dataField: 'userAddress',
    text: 'User Address',
    type: "TEXT",
    sort: true,
    headerAttrs: { title: 'User Address' },
    headerStyle: { width: 100, },
},{
    dataField: 'createdDate',
    text: 'Created Date',
    type: "DATE",
    sort: true,
    headerAttrs: { title: 'Created Date' },
    headerStyle: { width: 120, },
}, {
    dataField: 'modifiedDate',
    text: 'Updated Date',
    type: "DATE",
    sort: true,
    headerAttrs: { title: 'Updated Date' },
    headerStyle: { width: 120, },
}, {
    dataField: 'emptyCol',
    type:'EMPTY',
    text: '',
    headerStyle: { width: 105, },
}];
export {
    VIEW_COLUMNS
}