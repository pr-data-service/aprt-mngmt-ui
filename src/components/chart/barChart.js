import React, { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


//ref link 
//https://recharts.org/en-US/examples/PieChartWithCustomizedLabel
const data1 = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    sr: 3000,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    sr: 3000,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    sr: 3000,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    sr: 3000,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    sr: 3000,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    sr: 3000,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    sr: 3000,
    amt: 2100,
  },
];

const BarChartExample = () => {

  
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
          <Bar dataKey="uv" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
}
export default BarChartExample;

const data = [
    { name: 'Jan', uv: 4000, },
    { name: 'Feb', uv: 3000, },
    { name: 'Mar', uv: 2345, },
    { name: 'Apr', uv: 4000, },
    { name: 'May', uv: 1234, },
    { name: 'Jun', uv: 5432, },
    { name: 'Jul', uv: 4000, },
    { name: 'Aug', uv: 2345, },
    { name: 'Sept', uv: 3215, },
    { name: 'Oct', uv: 3421, },
    { name: 'Nov', uv: 4000, },
    { name: 'Dec', uv: 1234, },
  ];
