
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
// import '@szhsin/react-menu/dist/transitions/slide.css';
const AppMenu = () => {
    const navigate = useNavigate();

    return <Menu menuButton={<Button style={{color: "#ffffff"}}>Menu</Button>}>
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
    {getMenuItems(MENU_LIST, navigate)}
</Menu>
}

export default AppMenu;

const getMenuItems = (list, navigate) => {
    return list.map( m => {
        if(m.subMenu) {
            return <SubMenu label={m.label}>{getMenuItems(m.subMenu, navigate)}</SubMenu>
        } else {
            return <MenuItem onClick={()=> navigate(m.url)}>{m.label}</MenuItem>
        }
        
    })
}
