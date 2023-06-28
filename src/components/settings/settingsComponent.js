import { Box, Grid, makeStyles, Paper } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import Utils from '../../utils/utils';
import PageHeader from '../common/pageHeader';
import EmailSetup from './emailSetup';
import SessiononListView from './sessionListView';
import UserProfile from './userProfile';
import Users from '../settings/users';
import UserRolePermission from '../settings/userRolePermission'
import CONSTANSTS from '../../utils/constants';


const useStyles = makeStyles((theme) => ({
    root: {
        padding: 10
    },
    container: {
        display: 'flex',
        margin: "7px 0px"
    },
    leftPanel: {
        width: "15%"
    },
    leftPanelContent: {
        minHeight: 460,
    },


    panelSpliter: {
        width: "1%"
    },
    centerPanel: {

    },
    centerPanelContent: {
        //minHeight: 460,
        height: "100%"
    },
    button: {
        margin: theme.spacing(1),
    },
    toolBtnContainer: {
        marginLeft: 5,
        border: "1px solid #83818187",
        borderRadius: 2
    }
    ,
    linkStyle: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: "inherit",
        padding: '5px 10px',
    },
    selectedLink: {
        background: "#0000001a"
    }
}));

const SettingsComponent = () => {
    const classes = useStyles();
    let object = Utils.getObjectNameFromUrl();

    const [link, setLink] = React.useState(linkArr[0]);

    const handleLinkClick = (data) => () => {
        setLink(data)
    }


    const getObjectsForLink = () => {
        let newLinkArr = [...linkArr];
        if (!Utils.isPermission(CONSTANSTS.OBJECTS.SESSION, CONSTANSTS.USER_PERMISSION.VIEW)) {
            newLinkArr = newLinkArr.filter(f => f.object !== CONSTANSTS.OBJECTS.SESSION);
        }
        if (!Utils.isPermission(CONSTANSTS.OBJECTS.PROFILE, CONSTANSTS.USER_PERMISSION.VIEW)) {
            newLinkArr = newLinkArr.filter(f => f.object !== CONSTANSTS.OBJECTS.PROFILE);
        }
        if (!Utils.isPermission(CONSTANSTS.OBJECTS.EMAIL_SETUP, CONSTANSTS.USER_PERMISSION.VIEW)) {
            newLinkArr = newLinkArr.filter(f => f.object !== CONSTANSTS.OBJECTS.EMAIL_SETUP);
        }
        if (!Utils.isPermission(CONSTANSTS.OBJECTS.USER, CONSTANSTS.USER_PERMISSION.VIEW)) {
            newLinkArr = newLinkArr.filter(f => f.object !== CONSTANSTS.OBJECTS.USER);
        }
        if (!Utils.isPermission(CONSTANSTS.OBJECTS.USER_ROLE_PERMISSION, CONSTANSTS.USER_PERMISSION.VIEW)) {
            newLinkArr = newLinkArr.filter(f => f.object !== CONSTANSTS.OBJECTS.USER_ROLE_PERMISSION);
        }    
        return newLinkArr;
    }



    let itemIndex = link ? link.id - 1 : -1;

    return <Box className={classes.root}>
        <PageHeader object={object} />
        <Box className={classes.container}>
            <Box className={classes.leftPanel}>
                <Paper elevation={3} className={classes.leftPanelContent}>
                    <Box></Box>
                    <Box>
                    {getObjectsForLink().map( m => <LinkElement data={m} onClick={handleLinkClick} selected={itemIndex+1 === m.id}/>)}
                    </Box>
                </Paper>
            </Box>
            <Box className={classes.panelSpliter}></Box>
            <Box className={classes.centerPanel} style={{ width: "84%" }}>
                <Paper elevation={3} className={classes.centerPanelContent}>
                    {itemIndex >= 0 && settingItemss[itemIndex]}
                </Paper>
            </Box>
        </Box>
    </Box>
}

export default SettingsComponent;

const LinkElement = ({ data, onClick=()=>{}, selected=false }) => {
    const classes = useStyles();


    return <Box className={`${classes.linkStyle} ${selected ? classes.selectedLink : ''}`} title={data.text} onClick={onClick(data)}>
        <Link to={"#"}> {data.text} </Link>
    </Box>
}

const linkArr = [
    {id: 1, object: CONSTANSTS.OBJECTS.SESSION, text: CONSTANSTS.OBJECTS_LABEL[CONSTANSTS.OBJECTS.SESSION]},
    {id: 2, object: CONSTANSTS.OBJECTS.PROFILE, text: CONSTANSTS.OBJECTS_LABEL[CONSTANSTS.OBJECTS.PROFILE]},
    {id: 3, object: CONSTANSTS.OBJECTS.EMAIL_SETUP, text: CONSTANSTS.OBJECTS_LABEL[CONSTANSTS.OBJECTS.EMAIL_SETUP]},
    {id: 4, object: CONSTANSTS.OBJECTS.USER, text: CONSTANSTS.OBJECTS_LABEL[CONSTANSTS.OBJECTS.USER]},
    {id: 5, object: CONSTANSTS.OBJECTS.USER_ROLE_PERMISSION, text: CONSTANSTS.OBJECTS_LABEL[CONSTANSTS.OBJECTS.USER_ROLE_PERMISSION]},
];

const settingItemss = [
    <SessiononListView />,
    <UserProfile />,
    <EmailSetup/>,
    <Users/>,
    <UserRolePermission/>
]