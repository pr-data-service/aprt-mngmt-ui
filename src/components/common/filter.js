import { Box, Button, Grid, makeStyles, Popover } from '@material-ui/core';
import React from 'react';
import { getDateForDatePicker, convertDatePickerDateToAPIDate } from '../../utils/dateHandler';
import { TextField } from './fields';
import Utils from '../../utils/utils';
import CONSTANSTS from '../../utils/constants';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: 5,
        width: 500,
        padding: 20
    },
    field: {
        width: "100%"
    },
    select: {
        width: "100%",
        height: 33,
        border: "1px solid #83818187",
        borderWidth: 1,
        borderRadius: 4,
        '&:focus': {
            outline: "none",
            borderColor: "#3f51b5",
            borderWidth: 2,
            borderRadius: 4
        },
    },
    actionContainer: {
        justifyContent: "end",
        display: "flex"
    },
    header: {
        borderBottom: "1px solid #00000036",
        padding: "3px 12px !important"
    }
}));

const Filter = React.forwardRef(({
    anchorEl = null,
    handleClose = () => { },
    object="",
    fields = [],
    onSearchEvent = () => { },
}, ref) => {
    const classes = useStyles();
    const objectLabel = CONSTANSTS.OBJECTS_LABEL[object.toUpperCase()];
    
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    let fieldValue = "";

    
    const [field, setField] = React.useState(getInitField(fields));
    const [fieldValues, setFieldValues] = React.useState(getFieldValue(fields, field));


    const handleSelect = (fieldName) => {
        let fld = fields.find(f => f.dataField == fieldName);
        setField(fld);

        setFieldValues(getFieldValue(fields, fld));
    }

    const handleSearch = () => {
        let arr = Object.values(fieldValues);
        arr.map( m => {
            if(m.type === "DATE") {
                m.value = convertDatePickerDateToAPIDate(getFromDate(m.value)) + " 00:00:00@@##" + convertDatePickerDateToAPIDate(getToDate(m.value)) + " 11:59:59";
            }
        })
        onSearchEvent(arr);
    }

    const setFieldValue = (fieldName) => (value) => {
        let fld = fields.find(f => f.dataField == fieldName);
        fieldValues[fieldName] = { dataField: fld.dataField, type: fld.type, value: value };
        setFieldValues(fieldValues);
    }
    
    return <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => handleClose(null)}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        style={{ marginLeft: -84, marginTop: 10 }}
    >
        <Box className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12} className={classes.header}>{objectLabel} Filter</Grid>
                <Grid item xs={4} >
                    <select className={classes.select} onChange={e => handleSelect(e.currentTarget.value)} title={fieldValue ? fieldValue : ""}>
                        {fields && fields.map(m => <option value={m.dataField} title={m.text}>{m.text}</option>)}
                    </select>
                </Grid>
                <Grid item xs={8} >
                    {(field && field.type == 'DATE') && <DateField field={field} onChange={setFieldValue(field.dataField)} value={fieldValues[field.dataField].value} />}
                </Grid>
                <Grid item xs={12} className={classes.actionContainer}>
                    <Button onClick={handleSearch} color="primary" variant='outlined'> Search </Button>
                </Grid>
            </Grid>
        </Box>
    </Popover>
});


export default Filter;


const DateField = ({ field, value, onChange }) => {
    const [fromDate, setFromDate] = React.useState(getDateForDatePicker(getFromDate(value)));
    const [toDate, setToDate] = React.useState(getDateForDatePicker(getToDate(value)));

    const [fieldValue, setFieldValue] = React.useState(value);

    const handleDate = (fieldName) => (event) => {
        let fromDate = getFromDate(fieldValue);
        let toDate = getToDate(fieldValue);

        let date = event.target.value;
        if (fieldName == "fromDate") {
            fromDate = event.target.value;
            setFromDate(fromDate);
        } else if (fieldName == "toDate") {
            toDate = event.target.value;
            setToDate(toDate);
        }

        date = fromDate + "@@##" + toDate;
        setFieldValue(date);

        onChange(date);
    }



    return <Box style={{ display: "flex", justifyContent: "end", }}>
        <TextField name="fromDate" label="From Date" size="small" type="date" defaultValue={fromDate} onChange={handleDate("fromDate")} style={{ width: "100%" }} />
        <Box style={{ width: 20 }} />
        <TextField name="toDate" label="To Date" size="small" type="date" defaultValue={toDate} onChange={handleDate("toDate")} style={{ width: "100%" }} />
    </Box>

}

const getInitField = (fields) => {
    let initField = fields.length > 0 ? fields[0] : null;
    if(initField) {
        initField = { dataField: initField.dataField, type: initField.type };
        return initField;
    }
    return null;
}

const getFieldValue = (fields, field) => {
    if(fields && field) {
        let value = getDateForDatePicker() + "@@##" + getDateForDatePicker();

        let fieldValues = {};
        fieldValues[field.dataField] = { dataField: field.dataField, type: field.type, value: value };
        return fieldValues;
    }
    return null;
}

const getFromDate = (value) => {
    let arr = value.split("@@##");
    let fromDate = arr[0];
    return fromDate;
}

const getToDate = (value) => {
    let arr = value.split("@@##");
    let toDate = arr.length > 1 ? arr[1] : "";
    return toDate;
}