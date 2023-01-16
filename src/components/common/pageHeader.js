
import React from 'react';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CONSTANSTS from '../../utils/constants';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: 5
    },
    iconContainer: {
        border: "1px solid #838181",
        borderRadius: 20,
        width: 35,
        height: 35
    },
    iconOwners: {
        marginLeft: 8,
        marginTop: 3,
        fontSize: 25
    },
    iconFlatDetails: {
        marginLeft: 9,
        marginTop: 6,
    },
    iconMaintenance: {
        marginLeft: 6,
        marginTop: 6,
    },
    iconForAll: {
        marginLeft: 6,
        marginTop: 6,
    },
    container: {
        display: "grid",
        gridTemplateColumns: "auto auto",
        fontSize: 20
    },
    titleContainer: {
        display: "flex",
    },
    bodyContainer: {
        display: "flex",
        justifyContent: "flex-end"
    },
    label: {
        padding: 3,
        fontWeight: "bold",
        marginLeft: 5,
    },
    iconSettings: {
        marginLeft: 8,
        marginTop: 6,
    },
}));



const PageHeader = ({ object, rightElements=[], label, isDetailView=false }) => {
    const classes = useStyles();

    return <Box>
        <Box className={classes.container}>
            <Box className={classes.titleContainer}>
                <Box className={classes.iconContainer}>
                    <i className={`${getClass(object, classes)} ${CONSTANSTS.ICONS[object]}`} aria-hidden="true"></i>
                </Box>
                <Box className={classes.label}>{label ? label : CONSTANSTS.OBJECTS_LABEL[object]} {isDetailView && "Detail View"}</Box>
            </Box>

            <Box className={classes.bodyContainer}>                    
                    {rightElements}
            </Box>
        </Box>
    </Box>
}


export default PageHeader;


const getClass = (object, classes) => {
    if (CONSTANSTS.OBJECTS.OWNERS === object) {
        return classes.iconOwners;
    } else if (CONSTANSTS.OBJECTS.FLAT_DETAILS === object) {
        return classes.iconFlatDetails;
    } else if (CONSTANSTS.OBJECTS.PAYMENT === object || CONSTANSTS.OBJECTS.MAINTENANCE_MASTER === object 
            || CONSTANSTS.OBJECTS.MAINTENANCE === object || CONSTANSTS.OBJECTS.PAYMENT_DETAILS === object) {
        return classes.iconMaintenance;
    } else if(CONSTANSTS.OBJECTS.SETTINGS === object) {
        return classes.iconSettings;
    } else {
        return classes.iconForAll;
    }
}