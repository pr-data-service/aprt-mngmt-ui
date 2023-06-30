import { Box, IconButton, Paper } from '@material-ui/core';
import React from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import CONSTANSTS from '../../utils/constants';
import PageHeader from './pageHeader';
import Utils from '../../utils/utils';
import { useSnackbar } from 'notistack';
import DetailViewService from '../../service/detailViewService';
import { AppContext } from '../../components/common/context/appContext';
import { VIEW_COLUMNS } from '../../utils/columnConstants';
import DetailViewCenterPanel from './detailViewCenterPanel';
import APIConstants from '../../utils/apiConatants';
import AxiosApi from '../../utils/httpRequestHandler'
import CancelPaymentOrVouchar from '../payment/cancelPaymentOrVouchar';

const { MONTHS_FULL_FORM } = CONSTANSTS;
//const columns = VIEW_COLUMNS[CONSTANSTS.OBJECTS.PAYMENT];

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
    rightPanel: {
        width: "15%"
    },
    rightPanelContent: {
        minHeight: 460,
        height: "100%"
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
    buttonStyle: {
        padding: 7,
        marginTop: -2
    }
}));

const DetailView = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    const { enqueueSnackbar } = useSnackbar();
    const { handleBackDrop, handleDialogOpen, handleDialogClose } = React.useContext(AppContext);
    let object = Utils.getObjectNameFromUrl();
    let leftPanelRef = React.useRef(null);
    let rightPanelRef = React.useRef(null);
    const [data, setData] = React.useState(null);
    const [isSecApprove, setSecApprove] = React.useState(false);
    const [isTrsApprove, setTrsApprove] = React.useState(false);
    const userRole = Utils.getUserRole();

    React.useEffect(() => {
        getDataFromAPI();
        getExpenseApproveList();
    }, [object]);

    const getDataFromAPI = async () => {
        try {
            handleBackDrop(true);
            let response = await DetailViewService.getDataFromAPI(object, params.id);
            setData(response.data);
            handleBackDrop(false);
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }

    }
    const print = (object) => async () => {
        try {
            let url = "";
            if (object === CONSTANSTS.OBJECTS.PAYMENT) {
                url = APIConstants.PAYMENT_DOWNLOAD + params.id;
            } else if (object === CONSTANSTS.OBJECTS.EXPENSE) {
                url = APIConstants.EXPENSES_DOWNLOAD + params.id;
            }
            if (url !== "") {
                let response = await AxiosApi.downloadFile(url);
            } else {
                enqueueSnackbar("Not implemented yet.", { variant: "error" });
            }
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }
    }

    const cancel = (object) => async () => {
        try {
            if (object === CONSTANSTS.OBJECTS.PAYMENT || object === CONSTANSTS.OBJECTS.EXPENSE) {
                let title = "";
                if(object === CONSTANSTS.OBJECTS.PAYMENT) {
                    title = "Cancel Payment";
                } else if(object === CONSTANSTS.OBJECTS.EXPENSE) {
                    title = "Cancel Vouchar";
                }
                handleDialogOpen({
                    title: title, handleClose: handleDialogClose,
                    requiredOKBtn: false,
                    requiredCancelBtn: false,
                    component: <CancelPaymentOrVouchar object={object} id={params.id} refreshData={getDataFromAPI} />
                });
            }
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }
    }

    const getExpenseApproveList = async() => {
        try {
            handleBackDrop(true);
            let response = await AxiosApi.getData(APIConstants.EXPENSES_APPROVE_LIST_GET + params.id);
            response.data.forEach(approvedRole => {
                if (approvedRole === CONSTANSTS.USER_ROLE.SECRETARY) {
                    setSecApprove(true);
                } else if (approvedRole === CONSTANSTS.USER_ROLE.TREASURER) {
                    setTrsApprove(true);
                }
            });
            handleBackDrop(false);
        } catch (error) {
            handleBackDrop(false);
            enqueueSnackbar(console.message, {variant: 'error'});
        }
    }

    const expenseApprove = (role, isApprove) => async() => {
        try {
            if(role === userRole && !isApprove) {
                let obj = {};
                obj.role = role;
                obj.expenseId = params.id;
                handleBackDrop(true);
                let response = await AxiosApi.postData(APIConstants.EXPENSES_APPROVED, obj);
                getExpenseApproveList();
                handleBackDrop(false);
                if(role === CONSTANSTS.USER_ROLE.SECRETARY) {
                    enqueueSnackbar('Secretary approved', {variant: 'success'});
                } else if(role === CONSTANSTS.USER_ROLE.TREASURER)  {
                    enqueueSnackbar('Tresurer approved', {variant: 'success'});
                }
            } else if(isApprove) {
                enqueueSnackbar('Already approved', {variant: 'warning'});
            } else {
                enqueueSnackbar('You are not valid user to approve', {variant: 'warning'});
            }
        } catch (error) {
            handleBackDrop(false);
            console.log(error.message);
            enqueueSnackbar(error.message, {variant: 'error'})
        }
    }

    const getRightElements = () => {
        let arr = [];
        if (object === CONSTANSTS.OBJECTS.EXPENSE) {
            arr.push(<ToolBarIcon name={!isSecApprove? "APPROVE" : "APPROVED"} title={!isSecApprove? "Click here to approve(Secretary)" : "Secretary Approved"} onClick={expenseApprove(CONSTANSTS.USER_ROLE.SECRETARY, isSecApprove)} style={{ fontSize: 20, color: "green" }} />);
            arr.push(<ToolBarIcon name={!isTrsApprove? "APPROVE" : "APPROVED"} title={!isTrsApprove? "Click here to approve(Treasurer)" : "Treasurer Approved"} onClick={expenseApprove(CONSTANSTS.USER_ROLE.TREASURER, isTrsApprove)} style={{ fontSize: 20, color: "blue" }} />);
        }
        if ((object === CONSTANSTS.OBJECTS.PAYMENT || object === CONSTANSTS.OBJECTS.EXPENSE) && (data && !data.isCanceled)) {
            arr.push(<ToolBarIcon name="CANCEL" title="Cancel" onClick={cancel(object)} style={{ fontSize: 20, color: "red" }} />);
        }
        if (object === CONSTANSTS.OBJECTS.PAYMENT || object === CONSTANSTS.OBJECTS.EXPENSE) {
            arr.push(<ToolBarIcon name="PRINT" title="Print" onClick={print(object)} />);
        }
        return arr;
    }

    const isShowRightPanel = (object) => {
        return CONSTANSTS.OBJECTS.FLAT_DETAILS == object.toUpperCase()
        || CONSTANSTS.OBJECTS.PAYMENT == object.toUpperCase()
        || CONSTANSTS.OBJECTS.EXPENSE == object.toUpperCase() ? true : false;
    }

    return <Box className={classes.root}>
        <PageHeader object={object} rightElements={getRightElements()} isDetailView={true} />
        <Box className={classes.container}>
            <Box className={classes.leftPanel}>
                <Paper elevation={3} className={classes.leftPanelContent}>
                    <LeftPanel key={"left-panel"} ref={leftPanelRef} object={object} data={data}/>
                </Paper>
            </Box>
            <Box className={classes.panelSpliter}></Box>
            <Box className={classes.centerPanel} style={{ width: isShowRightPanel(object) ? "68%" : "84%" }}>
                <Paper elevation={3} className={classes.centerPanelContent}>
                    <DetailViewCenterPanel object={object} />
                </Paper>
            </Box>
            {isShowRightPanel(object) && <>
                <Box className={classes.panelSpliter}></Box>
                <Box className={classes.rightPanel}>
                    <Paper elevation={3} className={classes.rightPanelContent}>
                        <RightPanel key={"right-panel"} ref={rightPanelRef} object={object} parentObjData={data}/>
                    </Paper>
                </Box>
            </>}
        </Box>
    </Box>
}

export default DetailView;


const useStylesLeftPanel = makeStyles((theme) => ({
    root: {
        padding: 10
    },
    container: {
        minHeight: 460,
    },
    field: {
        padding: 5
    },
    fieldLabel: {
        padding: "0px 5px 0px 5px",
        backgroundColor: "aliceblue",
        fontWeight: "bold",
        color: "#00000052"
    },
    fieldValue: {
        padding: "0px 5px 0px 5px",
    },
    leftPanel: {
        width: "15%"
    },
    cancelPayment: {
        zIndex: 1,
        width: "70%",
        position: "absolute",
        left: "20%",
        top: 125,
        opacity: 0.5,
        // background: 'aqua',
        // height: "80%",
        fontSize: 60,
        transform: 'rotate(-45deg)',
        color: "red"
    }
}));
const LeftPanel = React.forwardRef(({ object, data }, ref) => {
    const classes = useStylesLeftPanel();
    const params = useParams();

    const { enqueueSnackbar } = useSnackbar();
    const { handleBackDrop } = React.useContext(AppContext);


    React.useImperativeHandle(ref, () => ({
        
    }));




    React.useEffect(() => {
       
    }, []);

    const CanceledPaymentOrVouchar = ({object, data}) => {
        const classes = useStylesLeftPanel();
        if(object && (object === CONSTANSTS.OBJECTS.PAYMENT || object === CONSTANSTS.OBJECTS.EXPENSE) && data && data.isCanceled) {
            return <Box className={classes.cancelPayment}>
                {object === CONSTANSTS.OBJECTS.PAYMENT && "Payment "}
                {object === CONSTANSTS.OBJECTS.EXPENSE && "Expense "}
                 Canceled
                </Box>
        }
        return <></>
    }

    const FieldLabeValue = ({ dataField, text, data }) => {
        let value = data ? data[dataField] : "";
        value = value && value !== "" ? value : "Empty";
        return <Box className={classes.field}>
            <Box className={classes.fieldLabel}>{text}</Box>
            <Box className={classes.fieldValue}>{new String(value)}</Box>
        </Box>
    }

    const columns = VIEW_COLUMNS[object];
    let cols = columns.filter(f => !f.hidden);
    return <Box>
        <CanceledPaymentOrVouchar object={object} data={data}/>
        {data && cols.map(m => <FieldLabeValue {...m} data={data} />)}
    </Box>

});


const useStylesRightPanel = makeStyles((theme) => ({
    field: {
        padding: 5
    },
    fieldLabel: {
        padding: "0px 5px 0px 5px",
        backgroundColor: "aliceblue",
        fontWeight: "bold",
        color: "#00000052"
    },
    fieldValue: {
        padding: "0px 5px 0px 5px",
    },
    header: {
        borderBottom: "1px solid #00000036",
        padding: "3px 12px !important",
        fontWeight: "bold",
        color: "#0000008f"
    }

}));

const RightPanel = React.forwardRef((props, ref) => {
    const classes = useStylesRightPanel();
    const { enqueueSnackbar } = useSnackbar();
    const { handleBackDrop } = React.useContext(AppContext);
    const params = useParams();
    let { object, parentObjData } = props;
    object = getObject(object);
    const objectLabel = CONSTANSTS.OBJECTS_LABEL[object];
    const id = getRightPanelRecordId(props, params);
    const [data, setData] = React.useState(null);

    React.useImperativeHandle(ref, () => ({
        refreshData: getDataFromAPI
    }));




    React.useEffect(() => {
        if(id && id > 0) {
            getDataFromAPI(id);
        }
    }, [id]);

    const getDataFromAPI = async (id) => {
        try {            
            if(id && id > 0) {
                handleBackDrop(true);
                let response = await DetailViewService.getRightPanelDataFromAPI(object, id);
                setData(response.data);
                handleBackDrop(false);
            }
        } catch (error) {
            console.log(error.message);
        }

    }

    const FieldLabeValue = ({ dataField, text, data }) => {
        let value = data ? data[dataField] : "";
        value = value && value !== "" ? value : "Empty";
        return <Box className={classes.field}>
            <Box className={classes.fieldLabel}>{text}</Box>
            <Box className={classes.fieldValue}>{new String(value)}</Box>
        </Box>
    }

    const columns = VIEW_COLUMNS[object];
    let cols = columns.filter(f => !f.hidden);
    return <Box>
        <Box className={classes.header}>{objectLabel} {(objectLabel.includes("Details") ? "" : "Details")} </Box>
        {data && cols.map(m => <FieldLabeValue {...m} data={data} />)}
    </Box>

})

const ToolBarIcon = ({ name, title, onClick = () => { }, ...others }) => {
    const classes = useStyles();

    let props = { style: { fontSize: 20 }, ...others }

    return <div className={classes.toolBtnContainer} onClick={onClick} title={title}>
        <IconButton aria-label={name} className={classes.buttonStyle}>
            <i className={iconClass[name]} aria-hidden="true" {...props}></i>
        </IconButton>
    </div>
}

const iconClass = {
    "PRINT": "fa fa-print",
    "CANCEL": "fa fa-ban",
    "APPROVE": "fa fa-thumbs-o-up",
     "APPROVED": "fa fa-thumbs-up",
}

const getObject = (object) => {
    let obj = object;
    if (object == CONSTANSTS.OBJECTS.FLAT_DETAILS || object == CONSTANSTS.OBJECTS.PAYMENT) {
        obj = CONSTANSTS.OBJECTS.OWNERS;
    } else if (object == CONSTANSTS.OBJECTS.EXPENSE) {
        obj = CONSTANSTS.OBJECTS.EVENTS;
    }
    return obj;
}

const getRightPanelRecordId = ({object, parentObjData}, params) => {
    let id = 0;
    if(object == CONSTANSTS.OBJECTS.FLAT_DETAILS || object == CONSTANSTS.OBJECTS.EXPENSE) {
        id = params.id;
    } else if(object == CONSTANSTS.OBJECTS.PAYMENT) {
        id = parentObjData ? parentObjData.flatId : 0;
    }
    return id;
}