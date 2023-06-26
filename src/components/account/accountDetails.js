import { Box, Grid, makeStyles } from '@material-ui/core';
import React from 'react'

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
    openingBalanceContainer: {
        //paddingLeft: 40
    },
    inputStyle: {
        width: "100%",
        height: 20
    },
    openingBalanceContainerElement: {
        paddingLeft: 20
    },
    transaction: {
        marginTop: 20
    },
    transactionValue: {
        textAlign: "end"
    }
}))

const AccountDetails = () => {
    const [data, setData] = React.useState({cashInAccount: '1000', cashInHand: '500'});
    const classes = useStyles();
    const [inputIds, setInputIds] = React.useState({"biba": false, "cih": false });

    const shouInputElement = (id) => () => {
        inputIds[id] = true;
        setInputIds({...inputIds});
    }

    const onBlurElement = (elementId) => (ev) => {
        inputIds[elementId] = false;
        setInputIds({...inputIds});
        saveOrUpdate(elementId, ev.currentTarget.value);
    }

    const saveOrUpdate = (elementId, value) => {
        //alert(value)
    }

    return (
        <Box className={classes.container}>
            <Box className={classes.listContainer}>
                <Grid container className={classes.row}>
                    <Grid item xs={12} className={classes.openingBalancetitle}> Opening Balance</Grid>                   
                </Grid>
                <Grid container className={`${classes.row} ${classes.openingBalanceContainer}`}>
                    <Grid item xs={8} className={classes.openingBalanceContainerElement}> Balance in Bank Account</Grid> 
                    <Grid item xs={4} className={classes.transactionValue}> 
                        {inputIds["biba"] && <input id="biba" key="biba" type="text" className={classes.inputStyle} autoFocus={true} onBlur={onBlurElement("biba")}/>}
                        {!inputIds["biba"] && <span onDoubleClick={shouInputElement("biba")}>120000</span>}
                    </Grid> 
                    <Grid item xs={8} className={classes.openingBalanceContainerElement}> Cash in Hand</Grid>
                    <Grid item xs={4} className={classes.transactionValue}> 
                        {inputIds["cih"] && <input id="cih" key="cih" type="text" className={classes.inputStyle} value={129333} autoFocus={true} onBlur={onBlurElement("cih")}/>}
                        {!inputIds["cih"] && <span onDoubleClick={shouInputElement("cih")}>60000</span>}
                    </Grid>
                </Grid>
                <Grid container className={`${classes.row} ${classes.transaction}`}>
                    <Grid item xs={7} className={classes.openingBalancetitle}> Deposit In Bank Account</Grid>
                    <Grid item xs={5} className={classes.transactionValue}> $ 70000</Grid>
                    <Grid item xs={7} className={classes.openingBalancetitle}> Withdraw from Bank Account</Grid>
                    <Grid item xs={5} className={classes.transactionValue}> $ 30000</Grid>
                </Grid>
                <Grid container className={classes.row}>
                    <Grid item xs={12} className={classes.openingBalancetitle}> Closing Balance</Grid>                   
                </Grid>
                <Grid container className={`${classes.row} ${classes.openingBalanceContainer}`}>
                    <Grid item xs={8} className={classes.openingBalanceContainerElement}> Balance in Bank Account</Grid> 
                    <Grid item xs={4} className={classes.transactionValue}> 
                        <span >120000</span>
                    </Grid> 
                    <Grid item xs={8} className={classes.openingBalanceContainerElement}> Cash in Hand</Grid>
                    <Grid item xs={4} className={classes.transactionValue}> 
                        <span>60000</span>
                    </Grid>
                </Grid>
            </Box>
            
        </Box>
    )
}

export default AccountDetails;
