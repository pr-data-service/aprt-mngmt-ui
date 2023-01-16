import { Box, Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import { Bar } from 'react-chartjs-2';
// import faker from 'faker';



export const options = {
    plugins: {
      title: {
        display: true,
        text: "Users Gained between 2016-2020"
      },
      legend: {
        display: false
      }
    }
  };

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const data = [
    {
      id: 1,
      year: 2016,
      userGain: 80000,
      userLost: 823
    },
    {
      id: 2,
      year: 2017,
      userGain: 45677,
      userLost: 345
    },
    {
      id: 3,
      year: 2018,
      userGain: 78888,
      userLost: 555
    },
    {
      id: 4,
      year: 2019,
      userGain: 90000,
      userLost: 4555
    },
    {
      id: 5,
      year: 2020,
      userGain: 4300,
      userLost: 234
    }
  ];
  

const chartData = {
    labels: data.map((data) => data.year), 
    datasets: [
      {
        label: "Users Gained ",
        data: data.map((data) => data.userGain),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0"
        ],
        borderColor: "black",
        borderWidth: 2
      }
    ]
  };

const useStyles = makeStyles((theme) => ({
    container: {
        padding: 10,
    },
}));

const ChartComponent = () => {
    const classes = useStyles();
    return <Grid container>
        <BarChart options={options} chartData={chartData} />;
    </Grid>
}

export default ChartComponent;


class PaymentCollection extends React.Component {


    render() {
        return <Grid item xs={4}>
            <BarChart options={options} chartData={chartData} />;
        </Grid>
    }

}

const BarChart = ({ options, chartData }) => {
    return (
      <div className="chart-container">
        <h2 style={{ textAlign: "center" }}>Bar Chart</h2>
        <Bar
          data={chartData}
          options={options}
        />
      </div>
    );
  };
  