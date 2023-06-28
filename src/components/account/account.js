import { Box, makeStyles, Paper } from '@material-ui/core';
import React from 'react'
import { Link } from 'react-router-dom';
import Utils from '../../utils/utils';
import PageHeader from '../common/pageHeader';
import AccountDetails from './accountDetails';
import Transaction from './transactions';
import MonthWisePaymentSlip from '../payment/monthWisePaymentSlip';
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
    centerPanelContent: {
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

const Accounts = () => {

    const classes = useStyles();
    let object = Utils.getObjectNameFromUrl();

    const [link, setLink] = React.useState(linkArr[0]);

    const handleLinkClick = (data) => () => {
        setLink(data)
    }

    let itemIndex = link ? link.id - 1 : -1;

    const modifiedLinkArr = () => {
        let newLinkArr = [...linkArr];
        if (!Utils.isPermission(CONSTANSTS.OBJECTS.ACCOUNT, CONSTANSTS.USER_PERMISSION.VIEW)) {
            newLinkArr = newLinkArr.filter(f => f.object !== CONSTANSTS.OBJECTS.ACCOUNT);
        }
        if (!Utils.isPermission(CONSTANSTS.OBJECTS.ACCOUNT_TRANSACTION, CONSTANSTS.USER_PERMISSION.VIEW)) {
            newLinkArr = newLinkArr.filter(f => f.object !== CONSTANSTS.OBJECTS.ACCOUNT_TRANSACTION);
        }
        if (!Utils.isPermission(CONSTANSTS.OBJECTS.PAYMENT_RECEIPT, CONSTANSTS.USER_PERMISSION.VIEW)) {
            newLinkArr = newLinkArr.filter(f => f.object !== CONSTANSTS.OBJECTS.PAYMENT_RECEIPT);
        }        
        return newLinkArr;
    }

    return (
        <Box className={classes.root}>
            <PageHeader object={object} />
            <Box className={classes.container}>
                <Box className={classes.leftPanel}>
                    <Paper elevation={3} className={classes.leftPanelContent}>
                        <Box></Box>
                        <Box>
                            {modifiedLinkArr().map(m => <LinkElement data={m} onClick={handleLinkClick} selected={itemIndex + 1 === m.id} />)}
                        </Box>
                    </Paper>
                </Box>
                <Box className={classes.panelSpliter}></Box>
                <Box style={{ width: "84%" }}>
                    <Paper elevation={3} className={classes.centerPanelContent}>
                        {itemIndex >= 0 && settingItemss[itemIndex]}
                    </Paper>
                </Box>
            </Box>
        </Box>
    )
}

const LinkElement = ({ data, onClick = () => { }, selected = false }) => {
    const classes = useStyles();


    return <Box className={`${classes.linkStyle} ${selected ? classes.selectedLink : ''}`} title={data.text} onClick={onClick(data)}>
        <Link to={"#"}> {data.text} </Link>
    </Box>
}

const linkArr = [
    { id: 1, object: CONSTANSTS.OBJECTS.ACCOUNT, text: CONSTANSTS.OBJECTS_LABEL[CONSTANSTS.OBJECTS.ACCOUNT] },
    { id: 2, object: CONSTANSTS.OBJECTS.ACCOUNT_TRANSACTION, text: CONSTANSTS.OBJECTS_LABEL[CONSTANSTS.OBJECTS.ACCOUNT_TRANSACTION] },
    { id: 3, object: CONSTANSTS.OBJECTS.PAYMENT_RECEIPT, text: CONSTANSTS.OBJECTS_LABEL[CONSTANSTS.OBJECTS.PAYMENT_RECEIPT] },
];

const settingItemss = [
    <AccountDetails />,
    <Transaction />,
    <MonthWisePaymentSlip />,
]

export default Accounts
