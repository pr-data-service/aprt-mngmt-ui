import React from 'react';

import TextBox from '@material-ui/core/TextField';

import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { useForm, FormProvider, Controller } from "react-hook-form";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";

const TextField = ({ ...props }) => {

    let { id, select, options = [], onLoadEvent } = props;

    let fieldProps = {};
    if (select) {
        fieldProps.children = options.map((option) => (
            <option key={option.value} value={option.value}>
                {option.text}
            </option>
        ))
    }

    React.useEffect(() => {
        if (onLoadEvent) {
            onLoadEvent();
        }
    }, [])

    React.useEffect(() => {

    }, [options])


    return <TextBox
        key={"root-outlined-size-normal-"+props.name+(options ? options.length : 0)}
        label="Size"
        id="outlined-size-normal"
        //defaultValue="Normal"
        variant="outlined"
        {...props}
        {...fieldProps}
    />
}

const SelectField = ({ options = [], ...props }) => {

    let { name, label, className, variant = "outlined", size = "small", ...props1 } = props;
    
    return <FormControl variant={variant} size={size} className={className} key={options.length}>
        <InputLabel htmlFor={"outlined-native-"+name}>{label}</InputLabel>
        <Select
            native
            //value={state.age}
            //onChange={handleChange}
            IconComponent={() => <ArrowDropDown style={{ display: "block" }} />}
            inputProps={{
                name: name,
                id: 'outlined-native-'+name,
                readOnly: true
            }}
            {...props1}
        >
            {options && options.map(m => <option key={m.value} value={m.value}>{m.text}</option>)}
        </Select>
    </FormControl>
}

const CheckBox1 = (field) => {
    const { name, label, className, ...props } = field;
    return <FormControlLabel
        label={label}
        name={name}
        className={className}
        control={<Checkbox
        //checked={expenseOnEvent}
        //onChange={handleCheckBox}

        />}
    />
}
const CheckBox = (fieldProps) => {
    const { name, label, control, className, inputProps, ...props } = fieldProps;
    debugger
    return <Controller
        control={control}
        //rules={{ required: true }}
        name={name}
        label={label}
        // {...props}
        render={({
            field: { onChange, onBlur, value, name, ref },
            fieldState: { invalid, isTouched, isDirty, error },
            formState,
          }) => <div><FormControlLabel
            label={label}
            className={className}
            control={<input type="checkbox" {...inputProps} style={{margin: "0px 10px 0px 13px"}}/>}
        /></div>}/>
}

export {
    TextField,
    SelectField,
    CheckBox
}