import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

const ITEM_HEIGHT = 48;

const useStyles = makeStyles((theme) => ({
    allToolBtnContainer: {
        display: 'flex',
        margin: "7px 0px"
    },
    toolBtnContainer: {
        marginRight: 5,
        border: "1px solid #83818187",
        borderRadius: 2
    },
    buttonStyle: {
        padding: 7,
        marginTop: -2
    }
}));
const MoreMenu = React.forwardRef(({ name = "menu", options = [], onClick = () => { }, ...others }, ref) => {
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

    return <div className={classes.toolBtnContainer}>
        <IconButton aria-label={name} className={classes.buttonStyle} onClick={handleOpen}>
            <i className={"fa fa-ellipsis-v"} aria-hidden="true" {...props}></i>
        </IconButton>
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
                    width: '20ch',
                },
            }}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            {options.map((option) => (
                <MenuItem key={option.value} title={option.text} selected={option === 'Pyxis'} onClick={onClickEvt(option.value)}>
                    {option.text}
                </MenuItem>
            ))}
        </Menu>
    </div>
});

export { MoreMenu };