import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { CheckBox, SelectField, TextField } from './fields'//'@material-ui/core/TextField';
import { ErrorMessage } from "@hookform/error-message";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { useSnackbar } from 'notistack';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import AxiosApi from '../../utils/httpRequestHandler';
import { AppContext } from '../../components/common/context/appContext';

import { DATE_TIME_FORMAT, getDateForDatePicker } from '../../utils/dateHandler';
import CONSTANSTS from '../../utils/constants';
import { Box } from '@material-ui/core';

const { VALIDATOR_TYPE_REQUIRED, VALIDATOR_TYPE_OPTIONAL } = CONSTANSTS.FORM_CONSTANTS;

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: 5
    },
    field: {
        width: "100%"
    }
}));

const FormBuilder = React.forwardRef(({
    onSubmit,
    cancelEvent,
    fields = [],
    submitButton=<Button type="submit" color="primary" variant="outlined"> Submit </Button>,
    data,
    gridItemXS = 6,
    externalComponent = null}, ref) => {

    const classes = useStyles();
    const methods = useForm({
        criteriaMode: "all"
    });

    const {
        formState: { errors },
        handleSubmit,
        setValue,
        getValues,
        setFocus,
        watch,
        reset 
    } = methods;

    const { handleBackDrop, enqueueSnackbar } = React.useContext(AppContext);
    //const { enqueueSnackbar } = useSnackbar();
    const [formFields, setFormFields] = React.useState(JSON.parse(JSON.stringify(fields)));

    React.useImperativeHandle(ref, () => ({
        // getSelectedRow: () => selectedRow,
    }));

    // Callback version of watch.  It's your responsibility to unsubscribe when done.
    React.useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            console.log(value, name, type)
            processWatchFields({value, name, type, formFields, setFormFields, ...methods});
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    // React.useEffect(() => {
    //     if (formFields && formFields.length > 0) {
    //         setFocus(formFields[0].name);
    //     }
    // }, [setFocus]);


    React.useEffect(() => {
        if (data && formFields && formFields.length > 0) {
            reset({...data});
            // formFields.map((m, i) => {
            //     setValue(m.name, data[m.name]);
            // });
        }
    }, [data])

    const onLoadEvent = (field) => async () => {
        try {
            const { apiUrl, reqParams, } = field.onLoadEventProps ? field.onLoadEventProps : {};
            if (apiUrl && apiUrl !== "") {
                handleBackDrop(true);
                let response = await AxiosApi.getData(apiUrl, reqParams);
                setOptionsOnField(field, response.data);
                handleBackDrop(false);
            } else {
                console.log("API url not found");
                enqueueSnackbar("API url not found", { variant: "error" });
            }

        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }

    }

    const setOptionsOnField = (field, data) => {
        const { fieldNames = [] } = field.onLoadEventProps ? field.onLoadEventProps : {};
        let arr = [...formFields];
        let tempField = arr.find(f => f.name === field.name);
        if (tempField && data) {
            if(tempField.options && tempField.options instanceof Array && tempField.options.length > 0) {
                tempField.options.unshift({ value: "-99999", text: "-----SELECT-----" });
            } else {
                tempField.options = [];
                tempField.options.unshift({ value: "-99999", text: "-----SELECT-----" });
            }
            data.map(m => {
                tempField.options.push({ value: m[fieldNames[0]], text: m[fieldNames[1]] }); 
            });
            
            //tempField.defaultValue = "";
            setFormFields(arr);
        }
    }
    
    return <div className={classes.root}>
        <FormProvider {...methods} >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container className={classes.formBuilderContainer}>
                    <Grid container spacing={3}>
                        {formFields.filter(f => !f.isHeaden).map((m, i) => <Grid key={m.name} item xs={gridItemXS}>{m.name !== "empty" && <Field field={m} errors={errors} setValue={setValue} getValues={getValues} onLoadEvent={onLoadEvent} autoFocus={i == 0 ? true : false} />}</Grid>)}

                    </Grid>
                    {externalComponent}
                    <Grid container spacing={3} style={{ marginTop: 10 }}>
                        <Grid item xs={8} />
                        <Grid item xs={4} style={{ textAlign: "right", display: "grid", columnGap: 10, gridTemplateColumns: "auto auto" }}>
                            {cancelEvent && <Button color="primary" variant="outlined" onClick={cancelEvent}> Cancel </Button>}
                            {submitButton}
                        </Grid>
                    </Grid>


                </Grid>

                {/* <input type="submit" /> */}


            </form>
        </FormProvider>
    </div>
})

export default FormBuilder;


const Field = ({ errors, field, setValue, getValues, onLoadEvent, autoFocus }) => {
    const classes = useStyles();
    const { register } = useFormContext(); // retrieve all hook methods
    const { control } = useForm();
    
    let fieldProps = { autoFocus };
    if (field.type == "DATE") {
        fieldProps.type = "date";
        fieldProps.defaultValue = getDateForDatePicker();
    } else if (field.type == "LIST") {
        fieldProps.select = true;
        fieldProps.SelectProps = { native: true, };
        if (field.onLoadEventProps) {
            fieldProps.onLoadEvent = onLoadEvent(field);
        }
        fieldProps.options = field.options ? field.options : [];

        let defaultVal = field.defaultValue; // $$INDEX-0$$
        if (defaultVal.indexOf("$$INDEX-") >= 0 && field.options) {
            defaultVal = defaultVal.replaceAll('$$INDEX-', '');
            let index = defaultVal.replaceAll('$$', '');
            index = parseInt(index);
            fieldProps.defaultValue = field.options[index].value;
        }

    } else if (field.type == "LONG_TEXT") {
        fieldProps.multiline = true;
        fieldProps.minRows = 5;
    } else if (field.type == "PASSWORD") {
        fieldProps.InputProps = {type: "password"};
    }

    return <>
        {(field.type == "NUMBER" || field.type == "TEXT" || field.type == "PHONE"
            || field.type == "EMAIL" || field.type == "LONG_TEXT" || field.type == "PASSWORD"
            || field.type == "LIST"
            || field.type == "DATE") &&
            <TextField
                key={"outlined-size-small-" + field.name}
                id={"outlined-size-small-" + field.name}
                name={field.name}
                label={field.label}
                defaultValue={field.defaultValue}
                variant="outlined"
                size="small"
                className={classes.field}
                inputProps={register(field.name, getValidationProps(field))}
                {...fieldProps}
            />
        }

        {field.type == "CHECK_BOX" && <CheckBox 
            key={"outlined-size-small" + field.name}
            id={"outlined-size-small" + field.name}
            name={"outlined-size-small" + field.name}
            label={field.label}
            className={classes.field}
            control={control}
            inputProps={register(field.name, getValidationProps(field))}
            {...fieldProps}
            /> }

        <ErrorMessage
            errors={errors}
            name={field.name}
            render={({ messages, message }) => {
                console.log("errors", errors)
                console.log("messages", messages);
                
                return <>
                    {messages
                        ? Object.entries(messages).map(([type, message]) => (
                            <div key={type} style={{ color: "red" }}>{message}</div>
                        ))
                        : null}
                    {/* {errors[field.name] && <CustomErrorComponent errors={errors} messages={messages} field={field} />} */}
                </>;
            }}
        />
    </>

}

const CustomErrorComponent = ({ errors, field, messages }) => {
    
    let msgFldNm;
    if (errors[field.name].type === "required") {
        msgFldNm = "required";
    }
    if (errors[field.name].type === "pattern") {
        msgFldNm = "pattern";
    }
        
    return msgFldNm ? <div key={errors[field.name].type} style={{ color: "red" }}>{messages[msgFldNm]}</div> : <></>
}

const getValidationProps = ({ type, validationType }) => {
    let validObj = {};
    

    if (type == "NUMBER") {
        validObj = validationProps.number;
    } else if (type == "TEXT") {
        validObj = validationProps.text;
    } else if (type == "PHONE") {
        validObj = validationProps.phone;
    } else if (type == "EMAIL") {
        validObj = validationProps.email;
    } else if(type == "CHECK_BOX") { 
        validObj = { required: "This input is required 111." }
    
    } else {
        validObj = validationProps.text;
    }

    validObj = {...validObj};

    if (validationType !== VALIDATOR_TYPE_REQUIRED) {
        delete validObj.required;
    }
    return validObj;
}

const validationProps = {
    text: {
        required: "This input is required.",
        // minLength: {
        //     value: 11,
        //     message: "This input must exceed 10 characters"
        // }


        // validate: {
        //     isBlank: value => {
        //         return value && (typeof value === 'number' || value.trim() !== "")
        //     },
        // },
    },
    number: {
        required: "This input is required.",
        pattern: {
            value: /^[0-9\b]+$/,
            message: "This input is number only."
        },
    },
    phone: {
        required: "This input is required.",
        pattern: {
            value: /^[0-9\b]+$/, //  /\d+/,
            message: "This input is number only."
        },
        minLength: {
            value: 10,
            message: "This input min 10 characters"
        },
        maxLength: {
            value: 10,
            message: "This input max 10 characters"
        }
    },
    email: {
        required: "This input is required.",
        pattern: {
            value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            message: "This input is email only."
        },
    }
};

/*
{...register("multipleErrorInput", {
    required: "This input is required.",
    pattern: {
      value: /\d+/,
      message: "This input is number only."
    },
    minLength: {
      value: 11,
      message: "This input must exceed 10 characters"
    }
  })}

  */

const getWatchFieldNames = (fields) => {
    if (fields) {
        return fields.filter(f => f.watch).map(m => m.name);
    }
    return [];
}

const processWatchFields = (props) => {
    const { value, name, type, formFields, } = props;    
    const watchFieldNames = getWatchFieldNames(formFields);
    if(watchFieldNames.indexOf(name) > -1) {
        let field = formFields.find(f => f.name == name);
        if(field) {
            field.watch.callback({field, ...props, value: value[name]});
        }
    }
}