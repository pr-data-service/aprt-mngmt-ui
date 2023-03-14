//ref link 
//https://recharts.org/en-US/examples/PieChartWithCustomizedLabel

import React, { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


import AxiosApi from '../../utils/httpRequestHandler';
import APIConstants from '../../utils/apiConatants';
import { useSnackbar } from 'notistack';
import { AppContext } from '../common/context/appContext';

const MonthlyCollectionBarChart = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { handleBackDrop, handleDialogOpen, handleDialogClose } = React.useContext(AppContext);
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        getDataFromAPI();
    }, []);

    const getDataFromAPI = async (reqParams) => {
        try {
            
            handleBackDrop(true);
            let response = await AxiosApi.getData(APIConstants.DASHBOARD_MAINTENANCE_MONTHLY_GET, reqParams);

            if(response.data) {
                response.data.map( m => {
                    m.month = month[m.month];
                })
            }
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
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="Amount" fill="#8884d8" />
    </BarChart>
  </ResponsiveContainer>
}

export default MonthlyCollectionBarChart;

const data = [
    { name: 'Jan', Amount: 4000, },
    { name: 'Feb', Amount: 3000, },
    { name: 'Mar', Amount: 2345, },
    { name: 'Apr', Amount: 4000, },
    { name: 'May', Amount: 1234, },
    { name: 'Jun', Amount: 5432, },
    { name: 'Jul', Amount: 4000, },
    { name: 'Aug', Amount: 2345, },
    { name: 'Sept', Amount: 3215, },
    { name: 'Oct', Amount: 3421, },
    { name: 'Nov', Amount: 4000, },
    { name: 'Dec', Amount: 1234, },
  ];

  
  const month = { 
    0: 'Jan',
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
    6: "Jul",
    7: "Aug",
    8: "Sept",
    9: "Oct",
    10: "Nov",
    11: "Dec"
  }