
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

const MENU_LIST = [
    {
        label: "Dashboard", 
        url: "/",
        element: <DashBoard />
    },
    {
        label: "Owners", 
        url: "/owners/listView",
        element: <OwnersListView />     
    },
    {
        label: "Flats", 
        subMenu: [
            {
                label: "List View", 
                url: "/flat/listView",
                element: <FlatDetailsListView/>
            },
            {
                label: "Maintenance", 
                url: "/maintenance",
                element: <MaintenanceListView/>
            },
        ]
    },    
    {
        label: "Events", 
        url: "/events/listView",
        element: <EventsListView/>
    },
    {
        label: "Payment", 
        subMenu: [
            {
                label: "List View", 
                url: "/payment/listView",
                element: <PaymentListView/>
            },
            {
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