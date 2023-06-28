
//https://github.com/szhsin/react-menu

import React from 'react';
import {
    Menu,
    MenuItem,
    MenuButton,
    SubMenu
} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import { Button } from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom';
import MENU_LIST from '../utils/menuConstants';
import CONSTANSTS from '../utils/constants';
import Utils from "../utils/utils";
// import '@szhsin/react-menu/dist/transitions/slide.css';
const AppMenu = () => {
    const navigate = useNavigate();



    return <Menu key={"app-menu-root"} menuButton={<Button style={{color: "#ffffff"}}>Menu</Button>}>
    {/* <MenuItem>New File</MenuItem>
    <SubMenu label="Open">
        <MenuItem>index.html</MenuItem>
        <MenuItem>example.js</MenuItem>
        <SubMenu label="Styles">
            <MenuItem>about.css</MenuItem>
            <MenuItem>home.css</MenuItem>
            <MenuItem>index.css</MenuItem>
        </SubMenu>
    </SubMenu>
    <MenuItem onClick={()=> navigate("/tab")}>Tab</MenuItem> */}
    {getMenuItems(getMenuList(), navigate)}
</Menu>
}

export default AppMenu;

const getMenuItems = (list, navigate) => {
    return list.map( m => {
        if(m.subMenu) {
            return <SubMenu key={m.object-"submenu"} label={m.label}>{getMenuItems(m.subMenu, navigate)}</SubMenu>
        } else {
            return <MenuItem key={m.object} onClick={()=> navigate(m.url)}>{m.label}</MenuItem>
        }
        
    })
}


const getMenuList = () => {
    let list = [...MENU_LIST];

    if(!Utils.isPermission(CONSTANSTS.OBJECTS.OWNERS, CONSTANSTS.USER_PERMISSION.VIEW)) {
        list = list.filter( f => f.object !== CONSTANSTS.OBJECTS.OWNERS);
    }

    if(!Utils.isPermission(CONSTANSTS.OBJECTS.FLAT_DETAILS, CONSTANSTS.USER_PERMISSION.VIEW)) {
        list = list.filter( f => f.object !== CONSTANSTS.OBJECTS.FLAT_DETAILS);
    } else {
        if(!Utils.isPermission(CONSTANSTS.OBJECTS.MAINTENANCE, CONSTANSTS.USER_PERMISSION.VIEW)) {            
            let flatDetails = list.find( f => f.object === CONSTANSTS.OBJECTS.FLAT_DETAILS );
            flatDetails.subMenu = flatDetails.subMenu.filter(f => f.object !== CONSTANSTS.OBJECTS.MAINTENANCE);
        }
    }

    if(!Utils.isPermission(CONSTANSTS.OBJECTS.EVENTS, CONSTANSTS.USER_PERMISSION.VIEW)) {
        list = list.filter( f => f.object !== CONSTANSTS.OBJECTS.EVENTS);
    }

    if(!Utils.isPermission(CONSTANSTS.OBJECTS.PAYMENT, CONSTANSTS.USER_PERMISSION.VIEW)) {
        list = list.filter( f => f.object !== CONSTANSTS.OBJECTS.PAYMENT);
    } else {
        if(!Utils.isPermission(CONSTANSTS.OBJECTS.PAYMENT_DETAILS, CONSTANSTS.USER_PERMISSION.VIEW)) {            
            let paymentDetails = list.find( f => f.object === CONSTANSTS.OBJECTS.PAYMENT );
            paymentDetails.subMenu = paymentDetails.subMenu.filter(f => f.object !== CONSTANSTS.OBJECTS.PAYMENT_DETAILS);
        }
    }
    
    if(!Utils.isPermission(CONSTANSTS.OBJECTS.EXPENSE, CONSTANSTS.USER_PERMISSION.VIEW)) {
        list = list.filter( f => f.object !== CONSTANSTS.OBJECTS.EXPENSE);
    }


    
    return list;
}