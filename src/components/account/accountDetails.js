import { Box, Divider, Grid, makeStyles } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React from 'react'
import APIConstants from '../../utils/apiConatants';
import AxiosApi from '../../utils/httpRequestHandler';
import ConfirmDialog from '../common/confirmDialog';
import { AppContext } from '../common/context/appContext';


const useStyles = makeStyles((theme) => ({
    container: {
        padding: 10,
    },
    listContainer: {
        width: "50%"
    },
    row: {
        padding: '5px 10px',
        "&:hover .show-events": {
            display: 'block !important',
        }
    },
    openingBalancetitle: {
        fontWeight: 500
    },
    inputStyle: {
        width: "100%",
        height: 20
    },
    openingBalanceContainerElement: {
        paddingLeft: 20
    },
    transactionValue: {
        textAlign: "end",
    },
    value: {
        fontWeight: 500
    },
    editIconContainer: {
        fontSize: 12,
        marginLeft: 10
    },
    divider: {
        width: "74%"
    }
}))

const AccountDetails = () => {
    const [openingBalanceOld, setOpeningBalanceOld] = React.useState({ inBankAccount: 0, cashInHand: 0 });
    const [openingBalance, setOpeningBalance] = React.useState({ inBankAccount: 0, cashInHand: 0 });
    const [transactionAmount, setTransactionAmount] = React.useState({ depositeAmount: 0, withdrawAmount: 0 });
    const [income, setIncome] = React.useState({ total: 0, cash: 0, online: 0, cheque: 0 });
    const [expense, setExpense] = React.useState({ total: 0 })
    const [closingBalance, setClosingBalance] = React.useState({ total: 0, inBank: 0, inCash: 0 });
    const [totalReqCount, setTotalReqCount] = React.useState(0);
    const classes = useStyles();
    const [inputIds, setInputIds] = React.useState({ "biba": false, "cih": false });
    const confirmDiaRef = React.useRef(null);
    const { enqueueSnackbar } = useSnackbar();
    const { handleBackDrop } = React.useContext(AppContext);
    const constants = {
        openingBal: { inBank: "biba", inCash: "cih" },
        transaction: { deposit: "DEPOSIT", withdraw: "WITHDRAW" }
    }

    React.useEffect(() => {
        getOpeningBalance();
        getTransactionAmount();
        getIncome();
        getExpense();
    }, [])

    React.useEffect(() => {
        if (totalReqCount === 4) {
            calculateClosingBalance();
            setTotalReqCount(0);
        }
    }, [totalReqCount])

    const shouInputElement = (id) => () => {
        inputIds[id] = true;
        setInputIds({ ...inputIds });
    }

    const onBlurElement = (elementId) => (ev) => {
        inputIds[elementId] = false;
        setInputIds({ ...inputIds });
        if (openingBalanceOld.inBankAccount != openingBalance.inBankAccount
            || openingBalanceOld.cashInHand != openingBalance.cashInHand) {
                confirmDiaRef.current.handleOpen({ title: "Confirmation Dialog", contentText: "Are you confirm to update the data?" });
        }
    }

    const getOpeningBalance = async () => {
        try {
            handleBackDrop(true);
            let response = await AxiosApi.getData(APIConstants.ACCOUNT_OPENING_BALANCE_GET);
            setTotalReqCount(prev => prev + 1);
            setOpeningBalance(response.data);
            setOpeningBalanceOld(response.data);
            handleBackDrop(false)
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' })
        }
    }

    const getTransactionAmount = async () => {
        try {
            let response = await AxiosApi.getData(APIConstants.ACCOUNT_TRANSACTION_LIST_GET);
            setTotalReqCount(prev => prev + 1);
            response.data.filter((e) => e.type === constants.transaction.deposit).forEach(element => {
                transactionAmount.depositeAmount = transactionAmount.depositeAmount + element.amount;
            });
            response.data.filter((e) => e.type === constants.transaction.withdraw).forEach(element => {
                transactionAmount.withdrawAmount = transactionAmount.withdrawAmount + element.amount;
            });
            // setDepositAmount(prev=> ({...prev, ['depositeAmount']:transactionAmount.depositeAmount, ['withdrawAmount']:transactionAmount.withdrawAmount}));
            setTransactionAmount(transactionAmount);
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' })
        }
    }

    const getIncome = async () => {
        try {
            let response = await AxiosApi.getData(APIConstants.ACCOUNT_PAYMENT_INFO_GET);
            setTotalReqCount(prev => prev + 1);
            setIncome(response.data);
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
        }
    }

    const getExpense = async () => {
        try {
            let response = await AxiosApi.getData(APIConstants.ACCOUNT_EXPENSE_INFO_GET);
            setTotalReqCount(prev => prev + 1);
            setExpense(response.data);
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' })
        }
    }

    const saveOrUpdate = async () => {
        try {
            handleBackDrop(true);
            let response = await AxiosApi.postData(APIConstants.ACCOUNT_OPENING_BALANCE_CREATE_OR_UPDATE, openingBalance);
            handleBackDrop(false);
            setTotalReqCount(3);
            getOpeningBalance();
            enqueueSnackbar("Opening balance updated successfully", { variant: 'success' })
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' })
        }
    }

    const calculateClosingBalance = () => {
        closingBalance.inBank = (parseFloat(openingBalance.inBankAccount) + parseFloat(income.online) + parseFloat(income.cheque) + parseFloat(transactionAmount.depositeAmount)) - parseFloat(transactionAmount.withdrawAmount);
        closingBalance.inCash = (parseFloat(openingBalance.cashInHand) + parseFloat(income.cash) + parseFloat(transactionAmount.withdrawAmount)) - parseFloat(expense.total);
        closingBalance.total = parseFloat(closingBalance.inBank) + parseFloat(closingBalance.inCash);
        setClosingBalance(closingBalance);
    }

    const onInputChange = (event) => {
        if (event.target.id === constants.openingBal.inBank) {
            setOpeningBalance({ ...openingBalance, ['inBankAccount']: event.target.value })
        } else {
            setOpeningBalance({ ...openingBalance, ['cashInHand']: event.target.value })
        }
    }

    const cancelEvent = () => {
        setOpeningBalance(openingBalanceOld);
    }

    const creatorAndModifierName = () => {
        let title = `Created by ${openingBalance.createdByName}` + (openingBalance.modifiedByName ? ` | Modified by ${openingBalance.modifiedByName}` : '');
        return title;
    }

    return (
        <Box className={classes.container}>
            <Box className={classes.listContainer}>
                <Grid container className={classes.row}>
                    <Grid item xs={6} className={classes.openingBalancetitle}> Opening Balance</Grid>
                    <Grid item xs={2} className={`${classes.transactionValue} ${classes.value}`}>₹ {parseFloat(openingBalance.cashInHand) + parseFloat(openingBalance.inBankAccount)}</Grid>
                    <Grid item xs={4}></Grid>
                </Grid>
                <Grid container className={`${classes.row}`}>
                    <Grid item xs={6} className={classes.openingBalanceContainerElement}> Balance in Bank Account</Grid>
                    <Grid item xs={2} className={classes.transactionValue}>
                        {inputIds[constants.openingBal.inBank] && <input id={constants.openingBal.inBank} key={constants.openingBal.inBank} type="text" className={classes.inputStyle} autoFocus={true} value={openingBalance.inBankAccount} onChange={onInputChange} onBlur={onBlurElement(constants.openingBal.inBank)} />}
                        {!inputIds[constants.openingBal.inBank] && <span onDoubleClick={shouInputElement(constants.openingBal.inBank)} title={creatorAndModifierName()}>₹ {openingBalance.inBankAccount}</span>}
                    </Grid>
                    <Grid item xs={4}>{!inputIds[constants.openingBal.inBank] && <Box className={classes.editIconContainer} title="Click here to edit."><i onClick={shouInputElement(constants.openingBal.inBank)} className="fa fa-pencil" aria-hidden="true"/></Box>}</Grid>
                    <Grid item xs={6} className={classes.openingBalanceContainerElement}> Cash in Hand</Grid>
                    <Grid item xs={2} className={classes.transactionValue}>
                        {inputIds[constants.openingBal.inCash] && <input id={constants.openingBal.inCash} key={constants.openingBal.inCash} type="text" className={classes.inputStyle} autoFocus={true} value={openingBalance.cashInHand} onChange={onInputChange} onBlur={onBlurElement(constants.openingBal.inCash)} />}
                        {!inputIds[constants.openingBal.inCash] && <span onDoubleClick={shouInputElement(constants.openingBal.inCash)} title={creatorAndModifierName()}>₹ {openingBalance.cashInHand}</span>}
                    </Grid>
                    <Grid item xs={4}>{!inputIds[constants.openingBal.inCash] && <Box className={classes.editIconContainer} title="Click here to edit."><i onClick={shouInputElement(constants.openingBal.inCash)} className="fa fa-pencil" aria-hidden="true"/></Box>}</Grid>
                </Grid>
                <Divider className={classes.divider}/>
                <Grid container className={`${classes.row}`}>
                    <Grid item xs={6} className={classes.openingBalancetitle}> Deposit In Bank Account</Grid>
                    <Grid item xs={2} className={classes.transactionValue}>₹ {transactionAmount.depositeAmount}</Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={6} className={classes.openingBalancetitle}> Withdraw from Bank Account</Grid>
                    <Grid item xs={2} className={classes.transactionValue}>₹ {transactionAmount.withdrawAmount}</Grid>
                    <Grid item xs={4}></Grid>
                </Grid>
                <Divider className={classes.divider}/>
                <Grid container className={classes.row}>
                    <Grid item xs={6} className={classes.openingBalancetitle}> Income</Grid>
                    <Grid item xs={2} className={`${classes.transactionValue} ${classes.value}`}>
                        <span>₹ {income.total}</span>
                    </Grid>
                    <Grid item xs={4}></Grid>
                </Grid>
                <Grid container className={`${classes.row}`}>
                    <Grid item xs={6} className={classes.openingBalanceContainerElement}> Income in Bank Account</Grid>
                    <Grid item xs={2} className={classes.transactionValue}>
                        <span >₹ {income.online + income.cheque}</span>
                    </Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={6} style={{ paddingLeft: '60px' }}> Online</Grid>
                    <Grid container item xs={2} justifyContent='flex-end'>
                        <span >₹ {income.online}</span>
                    </Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={6} style={{ paddingLeft: '60px' }}> Cheque</Grid>
                    <Grid container item xs={2} justifyContent='flex-end'>
                        <span >₹ {income.cheque}</span>
                    </Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={6} className={classes.openingBalanceContainerElement}> Income in Cash</Grid>
                    <Grid item xs={2} className={classes.transactionValue}>
                        <span>₹ {income.cash}</span>
                    </Grid>
                    <Grid item xs={4}></Grid>
                </Grid>
                <Divider className={classes.divider}/>
                <Grid container className={classes.row}>
                    <Grid item xs={6} className={classes.openingBalancetitle}> Expense</Grid>
                    <Grid item xs={2} className={`${classes.transactionValue} ${classes.value}`}>
                        <span >₹ {expense.total}</span>
                    </Grid>
                    <Grid item xs={4}></Grid>
                </Grid>
                <Divider className={classes.divider}/>
                <Grid container className={classes.row}>
                    <Grid item xs={6} className={classes.openingBalancetitle}> Closing Balance</Grid>
                    <Grid item xs={2} className={`${classes.transactionValue} ${classes.value}`}>
                        <span>₹ {closingBalance.total}</span>
                    </Grid>
                    <Grid item xs={4}></Grid>
                </Grid>
                <Grid container className={`${classes.row} ${classes.openingBalanceContainer}`}>
                    <Grid item xs={6} className={classes.openingBalanceContainerElement}> Balance in Bank Account</Grid>
                    <Grid item xs={2} className={classes.transactionValue}>
                        <span >₹ {closingBalance.inBank}</span>
                    </Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={6} className={classes.openingBalanceContainerElement}> Cash in Hand</Grid>
                    <Grid item xs={2} className={classes.transactionValue}>
                        <span>₹ {closingBalance.inCash}</span>
                    </Grid>
                    <Grid item xs={4}></Grid>
                </Grid>
            </Box>
            <ConfirmDialog ref={confirmDiaRef} clickEvent={saveOrUpdate} cancelEvent={cancelEvent}/>
        </Box>
    )
}

export default AccountDetails;


/**
 * 
 * Closing Balance:
    in Bank Account = (Opening Balance in Bank Account + Income in Bank Account + Deposit In Bank Account) - Withdraw from Bank Account
    Cash In Hand = (Opening balance Cash in Hand + Income in Cash + Withdraw from Bank Account) - Expense
 */