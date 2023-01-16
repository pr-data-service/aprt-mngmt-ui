import { Box, Grid, makeStyles } from '@material-ui/core';
import React from 'react';
// import ChartComponent from './chart/chartComponent';


const useStyles = makeStyles((theme) => ({
    container: {
        padding: 10,
    },
}));

const DashBoard = () => {
    const classes = useStyles();
    return <Box className={classes.container}>
        {/* <ChartComponent /> */}
    </Box>
}

export default DashBoard;



