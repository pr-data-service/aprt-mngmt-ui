import React from 'react';
import APIConstants from '../../utils/apiConatants';
import AxiosApi from '../../utils/httpRequestHandler';
import GetAppIcon from '@material-ui/icons/GetApp';
import { Box, Grid, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: 10
    },
    headerContainer: {
        height: 40
    },
    row: {
        padding: '5px 10px',
        "&:hover .show-events": {
            display: 'block !important',
        },
    },
    header: {
        color: "#0a0b0b85",
        fontWeight: "bold",
        fontSize: 20
    },
    listContainer: {
        width: "60%"
    }
}));

const MonthWisePaymentSlip = () => {
    const classes = useStyles();
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        getDataFromAPI();
    }, []);

    const getDataFromAPI = async () => {
        try {
            const response = await AxiosApi.getData(APIConstants.PAYMENT_SLIP_BY_MONTHS_GET);
            setData(response.data);
        }
        catch (error) {
            console.log(error.message);
        }
    }

    const downloadZip= (folderName) => async () => {
        console.log("clicked", folderName);
        try {
            let response = await AxiosApi.downloadZipFile(APIConstants.PAYMENT_DOWNLOAD_ZIP + folderName);
        }
        catch (error) {
            console.log(error.message);
        }
    }

    return <Box className={classes.container}>
        <Grid container className={classes.headerContainer}>
            <Grid item xs={12} className={classes.header}>Payment Receipt's on Server</Grid>
        </Grid>
        <Box className={classes.listContainer}>
        {data && data.map( (m, index) => <>
            <Grid container className={classes.row} style={  (index%2 == 0) ? {background: '#e5e5e563'} : {}}>
            <Grid item xs={1}>{index + 1 + "."}</Grid>
            <Grid item xs={5}>
                <span style={{marginRight: 10}}>
                    <i className="fa fa-file-archive-o" aria-hidden="true"></i>
                </span>
                {m.folderName}
            </Grid>
            <Grid item xs={5}></Grid>
            <Grid item xs={1}>
                <span className={"show-events"} style={{cursor: "pointer", display: "none"}} title="Click here to download." onClick={downloadZip(m.folderName)}>
                    <i className="fa fa-download" aria-hidden="true"></i>
                </span>
            </Grid>
            </Grid>
        </>)}
        
        </Box>
    </Box>

}

export default MonthWisePaymentSlip;