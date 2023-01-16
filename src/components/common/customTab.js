import { Box } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
      // marginTop: 10
    },
  }));

  
const CustomTab = React.forwardRef(({ tabList=[] }, ref) => {
    const classes = useStyles();
    const [value, setValue] = React.useState('1');

  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    // React.useImperativeHandle(ref, () => ({

    // }));

    // React.useEffect(()=> {
    //   setValue('1');
    // }, [])

    const Tabs = () => {
      return tabList.map( m => <Tab {...m} key={"tab"+m.value} />)
    }

    const TabPanels = () => {
      return tabList.map( m => <TabPanel key={"tab-panel"+m.value} value={m.value}> {m.children}</TabPanel>);
    }

    return <Box className={`${classes.root} cust-tab`}>
        <TabContext value={value} style={{height: 30}}>
        <AppBar position="static">
          <TabList onChange={handleChange} aria-label="simple tabs example">
            {/* <Tab label="Item One" value="1" />
            <Tab label="Item Two" value="2" />
            <Tab label="Item Three" value="3" /> */}
            {tabList.map( m => <Tab {...m} key={"tab-"+m.object+"-"+m.value} />)}
          </TabList>
        </AppBar>
        {/* <TabPanel value="1">Item One</TabPanel>
        <TabPanel value="2">Item Two</TabPanel>
        <TabPanel value="3">Item Three</TabPanel> */}
        {tabList.map( m => <TabPanel key={"tab-panel"+m.value} value={m.value}> {m.children}</TabPanel>)}
      </TabContext>
    </Box>

});

export default CustomTab;