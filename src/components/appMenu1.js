import React from 'react';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    paper: {
        marginRight: theme.spacing(2),
    },
    buttonStyle: {
        color: "#ffffff"
    }
}));

const AppMenu = () => {

    const classes = useStyles();
    const [openMasterMenu, setOpenMasterMenu] = React.useState(false);
    const anchorRefMasterMenu = React.useRef(null);

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRefMasterMenu.current && anchorRefMasterMenu.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRefMasterMenu.current.focus();
        }

        prevOpen.current = open;
    }, [open]);


    return <>
        <Button
            key="btn_master_menu"
            ref={anchorRefMasterMenu}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            className={classes.buttonStyle}
        >
            Master Menu
        </Button>
        <Popper key="popper_master_menu" open={open} anchorEl={anchorRefMasterMenu.current} role={undefined} transition disablePortal style={{zIndex: 9999999}}>
            {({ TransitionProps, placement }) => (
                <Grow
                    {...TransitionProps}
                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                >
                    <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                            <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                <MenuItem>
                                    <Link to="/" variant="body2">Dashboard</Link>
                                </MenuItem>
                                <MenuItem>
                                    <Link to="/owners-listView" variant="body2">Owners</Link>
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <Link to="/flat-listView" variant="body2">Flat</Link>
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <Link to="/maintenance" variant="body2">Maintenance</Link>
                                </MenuItem>                               
                                {/* <MenuItem onClick={handleClose}>
                                    <Link to="/maintenance-master" variant="body2">Maintenance Master</Link>
                                </MenuItem> */}
                                <MenuItem onClick={handleClose}>
                                    <Link to="/events/listView" variant="body2">Events</Link>
                                </MenuItem> 
                                <MenuItem onClick={handleClose}>
                                    <Link to="/payment/listView" variant="body2">Payment</Link>
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <Link to="/payment-details/listView" variant="body2">Payment Details</Link>
                                </MenuItem>
                                {/* <MenuItem onClick={handleClose}>
                                    <Link to="/expenses-head/listView" variant="body2">Expenses Head</Link>
                                </MenuItem> */}
                                <MenuItem onClick={handleClose}>
                                    <Link to="/expenses/listView" variant="body2">Expenses</Link>
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <Link to="/expense-items/listView" variant="body2">Expense Items</Link>
                                </MenuItem>
                            </MenuList>
                        </ClickAwayListener>
                    </Paper>
                </Grow>
            )}
        </Popper>
        {/* <Button
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            className={classes.buttonStyle}

        >
            Menu
        </Button>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal style={{zIndex: 9999999}}>
            {({ TransitionProps, placement }) => (
                <Grow
                    {...TransitionProps}
                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                >
                    <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                            <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                <MenuItem>
                                    <Link to="/" variant="body2">Dashboard</Link>
                                </MenuItem>
                                <MenuItem>
                                    <Link to="/owners-listView" variant="body2">Owners</Link>
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <Link to="/flat-listView" variant="body2">Flat</Link>
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <Link to="/maintenance-listView" variant="body2">Maintenance</Link>
                                </MenuItem>
                            </MenuList>
                        </ClickAwayListener>
                    </Paper>
                </Grow>
            )}
        </Popper> */}
    </>
}


export default AppMenu;