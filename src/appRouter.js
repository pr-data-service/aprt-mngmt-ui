import React from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Blogs from "./pages/Blogs";
import NoPages from './pages/NoPage';
import AppLayout from './components/appLayout';
import HomePageComponent from "./components/HomePageComponent";
import ListView from './components/common/listView';
import OwnersListView from './components/flat-owners/ownersListView';
import FlatDetailsListView from './components/flat-details/flatDetailsListView';
import DashBoard from './components/dashBoard';
import MaintenanceMasterListView from './components/payment/maintenanceMasterListView';
import PaymentDetailsListView from './components/payment/paymentDetailsListView';
import CustomTab from './components/common/customTab';
import DetailView from './components/common/detailView';
import PaymentListView from './components/payment/paymentListView';
import EventsListView from './components/events/eventsListView';
import ExpensesListView from './components/expenses/expensesListView';
import ExpenseItemsListView from './components/expenses/expenseItemsListView';
import PrintPage from './components/common/printPage';
import Login from './components/login';
import RegisterProject from './components/register-project/registerProject';
import MaintenanceListView from './components/maintenance/maintenanceListView';
import ExpensesHeadListView from './components/expenses/expenseHeadListView';
import MaintenanceDuesListView from './components/payment/maintenanceDuesListView';
import MENU_LIST from './utils/menuConstants';
import SettingsComponent from './components/settings/settingsComponent';
import Accounts from './components/Accounts/accounts';


const AppRouter = () => {
  let arr = [...MENU_LIST];

  const getRoutes = (menus=[], routes=[]) => {
    
    if(routes.length == 0) {
      const root = menus.find(f => f.url === "/");
      routes.push(<Route index element={root.element}/>);
    }

    menus.filter(f => f.url !== "/").map( m => {
      routes.push(<Route path={m.url} element={m.element}/>);
      if(m.subMenu) {
        routes.concat(getRoutes(m.subMenu, routes));
      }
    });
    
    return routes;
  }


  return <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          {/* <Route index element={<DashBoard />} />
          <Route path="/owners/listView" element={<OwnersListView />} />
          <Route path="flat/listView" element={<FlatDetailsListView />} />
          <Route path="maintenance" element={<MaintenanceListView />} />
          <Route path="maintenance-master" element={<MaintenanceMasterListView />} />
          <Route path="payment/listView" element={<PaymentListView />} />
          <Route path=":object/detail_view/:id" element={<DetailView />} />
          <Route path="payment-details/listView" element={<PaymentDetailsListView />} />
          <Route path="payment-details/listView/dues" element={<MaintenanceDuesListView />} />
          <Route path="events/listView" element={<EventsListView />} />
          <Route path="expenses-head/listView" element={<ExpensesHeadListView />} />
          <Route path="expenses/listView" element={<ExpensesListView />} />
          <Route path="expense-items/listView" element={<ExpenseItemsListView />} /> */}
          {getRoutes(arr)}
          <Route path=":object/detail_view/:id" element={<DetailView />} />
          <Route path=":object/print/:id" element={<PrintPage />} />
          <Route path="/settings" element={<SettingsComponent />} />
          <Route path="tab" element={<CustomTab />} />
          <Route path='accounts' element={<Accounts/>}/>
          <Route path="*" element={<NoPages />} />

          <Route path="register" element={<RegisterProject />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </>
}

export default AppRouter;