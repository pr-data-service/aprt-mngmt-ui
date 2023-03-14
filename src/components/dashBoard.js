import { Box, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';
// import ChartComponent from './chart/chartComponent';
//import BarChartExample from './chart/barChart';
import MonthlyCollectionBarChart from './chart/monthlyCollectionBarChart';
import EventsReportBarChart from './chart/eventsReportBarChart';
import TodaysCollectionPieChart from './chart/todaysCollectionPieChart';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: 10,
    },
    cardTitleContainer: {
        margin: 5,
        textAlign: "center"
    },
    cardTitle: {
        margin: 5,
        fontWeight: "bold",
        fontSize: 14
    }
}));

const DashBoard = () => {
    const classes = useStyles();
    return <Box className={classes.container}>
        {/* <ChartComponent /> */}

        
        <Grid container spacing={1}>
            <CardContainer title="Monthly Maintenance Colection"> <MonthlyCollectionBarChart /> </CardContainer>
            <CardContainer title="Events Report"> <EventsReportBarChart /> </CardContainer>
            <CardContainer title="Today's Collection" size={3}> <TodaysCollectionPieChart /> </CardContainer>
        </Grid>
    </Box>
}

export default DashBoard;


const CardContainer = ({ size=6, title, children }) => {
    const classes = useStyles();
    return <Grid item xs={size}>
        <Paper elevation={5} >
            <Box className={classes.cardTitleContainer}>
                <Typography component="span" className={classes.cardTitle}> {title}</Typography>
            </Box>
            <Box>{children}</Box>
        </Paper>
    </Grid>
}

