
import React from 'react';
import DashBoard from '../components/dashBoard';
import EventsListView from '../components/events/eventsListView';
import ExpensesListView from '../components/expenses/expensesListView';
import FlatDetailsListView from '../components/flat-details/flatDetailsListView';
import OwnersListView from '../components/flat-owners/ownersListView';
import MaintenanceListView from '../components/maintenance/maintenanceListView';
import MaintenanceDuesListView from '../components/payment/maintenanceDuesListView';
import PaymentDetailsListView from '../components/payment/paymentDetailsListView';
import PaymentListView from '../components/payment/paymentListView';
import ExpenseItemsListView from '../components/expenses/expenseItemsListView';
import CONSTANSTS from '../utils/constants';

const MENU_LIST = [
    {
        object: CONSTANSTS.OBJECTS.DASHBOARD,
        label: "Dashboard", 
        url: "/",
        element: <DashBoard />
    },
    {
        object: CONSTANSTS.OBJECTS.OWNERS,
        label: "Owners", 
        url: "/owners/listView",
        element: <OwnersListView />     
    },
    {
        object: CONSTANSTS.OBJECTS.FLAT_DETAILS,
        label: "Flats", 
        subMenu: [
            {
                object: CONSTANSTS.OBJECTS.FLAT_DETAILS,
                label: "List View", 
                url: "/flat/listView",
                element: <FlatDetailsListView/>
            },
            {
                object: CONSTANSTS.OBJECTS.MAINTENANCE,
                label: "Maintenance", 
                url: "/maintenance",
                element: <MaintenanceListView/>
            },
        ]
    },    
    {
        object: CONSTANSTS.OBJECTS.EVENTS,
        label: "Events", 
        url: "/events/listView",
        element: <EventsListView/>
    },
    {
        object: CONSTANSTS.OBJECTS.PAYMENT,
        label: "Payment", 
        subMenu: [
            {
                object: CONSTANSTS.OBJECTS.PAYMENT,
                label: "List View", 
                url: "/payment/listView",
                element: <PaymentListView/>
            },
            {
                object: CONSTANSTS.OBJECTS.PAYMENT_DETAILS,
                label: "Details List View", 
                url: "/payment-details/listView",
                element: <PaymentDetailsListView/>
            },
            {
                label: "Dues List View", 
                url: "/payment-details/listView/dues",
                element: <MaintenanceDuesListView/>
            },
        ]
    },
    {
        object: CONSTANSTS.OBJECTS.EXPENSE,
        label: "Expense", 
        subMenu: [
            {
                label: "List View", 
                url: "/expenses/listView",
                element: <ExpensesListView/>
            },
            {
                label: "Items List View", 
                url: "/expense-items/listView",
                element: <ExpenseItemsListView/>
            },
        ]
    },
];

export default MENU_LIST;