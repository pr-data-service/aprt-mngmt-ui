//ref link 
//https://recharts.org/en-US/examples/PieChartWithCustomizedLabel

import React, { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import AxiosApi from '../../utils/httpRequestHandler';
import APIConstants from '../../utils/apiConatants';
import { useSnackbar } from 'notistack';
import { AppContext } from '../common/context/appContext';

const EventsReportBarChart = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { handleBackDrop, handleDialogOpen, handleDialogClose } = React.useContext(AppContext);
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        getDataFromAPI();
    }, []);

    const getDataFromAPI = async (reqParams) => {
        try {
            
            handleBackDrop(true);
            let response = await AxiosApi.getData(APIConstants.DASHBOARD_EVENTS_REPORT_GET, reqParams);

            setData(response.data);
            handleBackDrop(false);
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }

    }


    return <ResponsiveContainer width={'99%'} height={215}>
        <BarChart
            width={500}
            height={220}
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="expense" fill="#8884d8" />
            <Bar dataKey="collection" fill="#82ca9d" />
            <Bar dataKey="dues" fill="#FF8042" />
        </BarChart>
    </ResponsiveContainer>
}


export default EventsReportBarChart;

const data = [
    { name: 'Event 1', expense: 5000, collection: 3050, dues: 2000 },
    { name: 'Event 2', expense: 4000, collection: 3500, dues: 1200},
]