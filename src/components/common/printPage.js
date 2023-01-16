import { Box } from '@material-ui/core';
import React from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import APIConstants from '../../utils/apiConatants';
import AxiosApi from '../../utils/httpRequestHandler'

const PrintPage = () => {
    const params = useParams();


    React.useEffect(() => {
        getDataFromAPI()
    }, [])

    const getDataFromAPI = async (reqParams) => {
        try {
            //handleBackDrop(true);
            let response = await AxiosApi.downloadFile(APIConstants.PAYMENT_DOWNLOAD, reqParams);
            console.log(response)
            debugger
            //setData(response.data);
            //handleBackDrop(false);
        } catch (error) {
            console.log(error.message);
            //enqueueSnackbar(error.message, { variant: "error" });
        }

    }

    return <Box>
I am print page
    </Box>
}

export default PrintPage;