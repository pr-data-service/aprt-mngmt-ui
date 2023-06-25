import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import { Link, Outlet, } from "react-router-dom";
import AppMenu from './appMenu';
import { Box } from '@material-ui/core';
import { useNavigate, useLocation } from "react-router-dom";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import APIConstants from '../utils/apiConatants';
import { AppContext } from './common/context/appContext';
import AxiosApi from '../utils/httpRequestHandler';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  headerContainer: {
    height: 40
  },
  appTitle: {
    padding: 8,
    maxWidth: 200,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  headerRow: {
    display: "flex"
  },
  menuContainer: {
    padding: 8
  },
  userProfileContainer: {
    display: "flex",
    marginLeft: "auto",
  },
  userProfile: {
    width: 30,
    border: "2px solid #ffffff",
    height: 30,
    borderRadius: 20,
    marginRight: 15,
    marginTop: 5,
    cursor: "pointer"
  }, 
  profileIcon: {
    fontSize: 20,
    marginTop: 2,
    marginLeft: 6.5
  }
}));

const AppLayout = () => {
  const classes = useStyles();

  return <div className={classes.root} >
    <AppHeader />
    <Outlet />
  </div>
}

export default AppLayout;

const AppHeader = () => {
  const classes = useStyles();
  const {handleBackDrop} = React.useContext(AppContext);
  const navigate = useNavigate();
  let location = useLocation();
  const [data, setData] = React.useState({apartmentDetails: null, sessionDetails: null});
  const { apartmentDetails, sessionDetails} = data;

  console.log(location)
  let token = localStorage.getItem("token");

  React.useEffect(() => {
    if (!token && allowsPath.indexOf(location.pathname) < 0) {
      navigate("/login");
    }

    if(token) {
      getDataFromAPI();
    }
    
  }, [])

  const getDataFromAPI = async () => {
    try {
        handleBackDrop(true);
        let response = await AxiosApi.getData(APIConstants.PROJECT_GET);
        setData(response.data);      
        handleBackDrop(false);
    } catch (error) {
        console.error(error.message);      
        handleBackDrop(false);
    }        
}

  const onClick = (value) => {
    if(value == "logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("session-id");
      localStorage.removeItem("session");
      navigate("/login");
    } else if(value == "settings") {
      navigate("/settings");
    } else if(value == "accounts") {
      navigate("/accounts");
    }
  }

  let aprtNm = apartmentDetails ? apartmentDetails.name: "Empty";
  let sessNm = sessionDetails ? sessionDetails.name: "Empty";

  return <AppBar position="static" className={classes.headerContainer}>
    {token && <Box className={classes.headerRow}>
      <Box className={classes.appTitle} title={"Apartment Name: "+aprtNm}>{aprtNm}</Box>
      <Box className={classes.menuContainer}><AppMenu /></Box>
      <Box className={classes.userProfileContainer}>
        <Box className={classes.appTitle} title={"Current Session: "+sessNm}>{sessNm}</Box>
        <ProfileMenu onClick={onClick} options={[
          {value: "settings", text: "Settings"},
          {value: "accounts", text: "Accounts"},
          {value: "logout", text: "Logout"},]}/>
      </Box>
    </Box>}
    {!token && <Box className={classes.headerRow}>
      <Box className={classes.appTitle}>Apartment Management System</Box>
    </Box>}
  </AppBar>
}

const allowsPath = ["/register"];


const ITEM_HEIGHT = 48;
const ProfileMenu = React.forwardRef(({ name = "profile-menu", options = [], onClick = () => { }, ...others }, ref) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  React.useImperativeHandle(ref, () => ({
      handleOpen: handleOpen
  }));

  const handleOpen = (event) => {
      setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
      setAnchorEl(null);
  };

  const onClickEvt = (value) => (event) => {
      handleClose();
      onClick(value)
  }

  let props = { style: { fontSize: 20 }, ...others }

  return <>
      <Box className={classes.userProfile} onClick={handleOpen}>
        <i className={`fa fa-user ${classes.profileIcon}`} aria-hidden="true" {...props}></i>
        </Box>
      <Menu
          id={name + "-id"}
          key={name + "-key"}
          name={name}
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          PaperProps={{
              style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  minWidth: '10ch',
                  maxWidth: '20ch'
              },
          }}
          anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
          }}
          transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
          }}
      >
          {options.map((option) => (
              <MenuItem key={option.value} title={option.text} selected={option === 'Pyxis'} onClick={onClickEvt(option.value)}>
                  {option.text}
              </MenuItem>
          ))}
      </Menu>
  </>
});

