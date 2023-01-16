import React from 'react';
import AppForm from "../components/common/appForm";



const getContent = ({type, object, ...others}) => {
    let content = null;
    if(type == "FORM") {
        content = getForm({object, ...others});
    }

    return content;
}

const getForm = ({object, ...others}) => {
    let { fields } = others;

    return <AppForm key={object} object={object} {...others}/>
}



const AppDialogService = {
    getContent
}

export default AppDialogService;