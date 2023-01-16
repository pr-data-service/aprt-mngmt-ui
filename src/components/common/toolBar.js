
import { Box, makeStyles } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import ListViewSearchBox from '../common/listViewSearchBox';
import ToolBarIcon from './toolBarIcon';

const useStyles = makeStyles((theme) => ({
    container: {
        height: 45,
        display: "flex"
    },
    leftPanel: { "width": "60%", display: "flex" },
    rightPanel: { "width": "40%" },
    allToolBtnContainer: {
        display: 'flex',
        margin: "7px 0px"
    },
    rightAlign: {
        float: "right"
    },


    noteHeader: {
        display: "flex",
        background: "#f0f8ff",
        padding: "4px 10px",
        height: 30,
        fontWeight: 600,
        color: "#333333c7"
    },
    noteBody: {
        padding: "0px 10px",
    },
    toolBtnContainer: {
        marginLeft: 5,
        border: "1px solid #83818187",
        borderRadius: 2
    }
}));


const ToolBar = ({ object, icons = [], search, rightElements=[] }) => {
    const classes = useStyles();
    const { columns = [], onSearchEvent = () => { } } = search ? search : {};

    return <Box className={classes.container}>
        <Box className={classes.leftPanel}>
            <Box className={classes.allToolBtnContainer}>
                {icons && icons.map((m) => <ToolBarIcon {...m} />)}
            </Box>
            { (icons && icons.length > 0) && <Box style={{marginLeft: 5}}></Box>}
            {search && <ListViewSearchBox object={object} fields={columns} onSearchEvent={onSearchEvent} />}
        </Box>
        <Box className={classes.rightPanel}>
            <Box className={classes.rightAlign}>
                {rightElements}
            </Box>
        </Box>
    </Box>
}

export default ToolBar;

ToolBar.propTypes = {
    icons: PropTypes.array, //[{ name: "PDF", title: "Export to .pdf file", onClick: () => { }, }, ]
    search: PropTypes.object,    //{ columns: columns, onSearchEvent: onSearchBoxEnterEvent }
    rightElements: PropTypes.array
}