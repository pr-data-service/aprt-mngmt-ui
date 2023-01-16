import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.modal + 1,
        color: '#fff',
    },
}));
/*
need to use based on component
zIndex: {
    appBar: 1100
    drawer: 1200
    mobileStepper: 1000
    modal: 1300             //used for dialog
    snackbar: 1400
    speedDial: 1050
    tooltip: 1500
}
*/
const AppBackDrop = React.forwardRef(({ }, ref) => {

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    React.useImperativeHandle(ref, () => ({
        handleBackDrop: setOpen,
    }));

    const handleClose = () => {
        setOpen(false);
    };
    const handleToggle = () => {
        setOpen(!open);
    };

    return <div>
        <Backdrop className={classes.backdrop} open={open} onClick={handleClose} invisible={false}>
            <CircularProgress color="inherit" />
        </Backdrop>
    </div>
});

export default AppBackDrop;