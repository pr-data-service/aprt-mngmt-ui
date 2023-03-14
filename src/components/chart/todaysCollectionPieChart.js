
import React from "react";
import { PieChart, Pie, Legend, Tooltip } from "recharts";

import AxiosApi from '../../utils/httpRequestHandler';
import APIConstants from '../../utils/apiConatants';
import { useSnackbar } from 'notistack';
import { AppContext } from '../common/context/appContext';

const data01 = [
  { name: "Group A", Amount: 400 },
  { name: "Group B", Amount: 300 },
  { name: "Group C", Amount: 300 },
  { name: "Group D", Amount: 200 },
  { name: "Group E", Amount: 278 },
  { name: "Group F", Amount: 189 }
];

const TodaysCollectionPieChart = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { handleBackDrop, handleDialogOpen, handleDialogClose } = React.useContext(AppContext);
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        getDataFromAPI();
    }, []);

    const getDataFromAPI = async (reqParams) => {
        try {
            
            handleBackDrop(true);
            let response = await AxiosApi.getData(APIConstants.DASHBOARD_MAINTENANCE_TODAYS_GET, reqParams);

            setData(response.data);
            handleBackDrop(false);
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar(error.message, { variant: "error" });
        }

    }

    return <PieChart width={300} height={215}>
    <Pie
      dataKey="Amount"
      isAnimationActive={false}
      data={data}
      cx={150}
      cy={100}
      outerRadius={60}
      fill="#8884d8"
      label
    />
    <Tooltip />
    </PieChart>
}


export default TodaysCollectionPieChart;