import { IconButton, makeStyles } from '@material-ui/core';
import React from 'react';
import { MoreMenu } from './custMenu';


const useStyles = makeStyles((theme) => ({
    buttonStyle: {
        padding: 7,
        marginTop: -2
    },
    toolBtnContainer: {
        marginLeft: 5,
        border: "1px solid #83818187",
        borderRadius: 2
    }
}));

const ToolBarIcon = ({ name, ...others }) => {
    const classes = useStyles();

    let props = { style: { fontSize: 20 }, ...others }
    if (name === "MORE") {
        let { options = [], onClick = () => { } } = props;
        return <MoreMenu onClick={onClick} options={options} />
    }
    return <div className={classes.toolBtnContainer}>
        <IconButton aria-label={name} className={classes.buttonStyle}>
            <i className={iconClass[name]} aria-hidden="true" {...props}></i>
        </IconButton>
    </div>
}

export default ToolBarIcon;

const iconClass = {
    "ADD": "fa fa-plus",
    "EDIT": "fa fa-pencil",
    "DELETE": "fa fa-trash-o",
    "EXCEL": "fa fa-file-excel-o",
    "CSV": "fa fa-file-excel-o",
    "PDF": "fa fa-file-pdf-o",
    "LINK": "fa fa-link",
    "REFRESH": "fa fa-refresh",
    "PRINT": "fa fa-print",
}
