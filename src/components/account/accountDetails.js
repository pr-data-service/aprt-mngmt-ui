import { Box, Grid, makeStyles } from '@material-ui/core';
import React from 'react'

const useStyles = makeStyles((theme) => ({
    container: {
        padding: 10
    },
    listContainer: {
        width: "80%"
    },
    row: {
        padding: '5px 10px',
        "&:hover .show-events": {
            display: 'block !important',
        }
    },

}))

const AccountDetails = () => {
    const [data, setData] = React.useState({cashInAccount: '1000', cashInHand: '500'});
    const classes = useStyles();


    return (
        <Box className={classes.container}>
            <Grid className={classes.listContainer}>
                <Grid container className={classes.row}>
                    <Grid item xs={5} style={{backgroundColor: 'blueviolet'}}> djijdidijqjd</Grid>
                    <Grid item xs={3}>djijwidjwjd</Grid>
                    <Grid item xs={3} style={{backgroundColor: 'blueviolet'}}>ndjdijdjjwd</Grid>
                    <Grid item xs={1}>
                        dndijwiwjiji
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}

export default AccountDetails;
