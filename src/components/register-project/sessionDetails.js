import React from 'react';
import { Box, Button, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FormBuilder from '../common/formBuilder';
import CONSTANSTS from '../../utils/constants';

const { VALIDATOR_TYPE_REQUIRED, VALIDATOR_TYPE_OPTIONAL } = CONSTANSTS.FORM_CONSTANTS;

const useStyles = makeStyles((theme) => ({
    container: {
        // top: "50%",
        // left: "47%",
        // position: "fixed",
        // marginTop: "-11em",
        // marginLeft: "-15em",
    },
    subContainer: {
        // width: 500,
        height: 450,
        margin: "20px 430px",
    },
    titleContainer: {
        width: "100%",
        height: 40,
        textAlign: "center",
        background: "aliceblue",
        fontSize: 26
    },
    subTitleContainer: {
        width: "100%",
        height: 35,
        fontSize: 20
    },
    itemContainer: {
        padding: "5px 20px"
    },    
    backButtonContainer: {
        marginTop: -33,
        paddingLeft: 5
    }
}));

const SessionDetails = ({setData, data, setIndex, onSubmit}) => {
    const classes = useStyles();

    return <Box className={classes.itemContainer}>
        <Grid container>
            <Grid item xs={12}>
                <Box className={classes.subTitleContainer}>
                    <Box>Session Details</Box>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <FormBuilder fields={fields} data={data} gridItemXS={12}  onSubmit={onSubmit} submitButton={<Button type="submit" color="primary" variant='outlined'> Subscribe </Button>} />
            </Grid>
            <Grid item xs={12} className={classes.backButtonContainer}>
                <Button color="primary" variant='outlined' onClick={() => setIndex(1)}> Back </Button>
            </Grid>
        </Grid>
    </Box>
}

export default SessionDetails;

const fields = [
    { "name": "name", label: "Name", defaultValue: "", "type": "TEXT", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    { "name": "fromDate", label: "From Date", defaultValue: "", "type": "DATE", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED },
    { "name": "toDate", label: "To Date", defaultValue: "", "type": "DATE", "isHeaden": false, validationType: VALIDATOR_TYPE_REQUIRED }, 
]