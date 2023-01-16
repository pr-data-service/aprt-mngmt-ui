import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import AppDialogService from '../../service/appDialogService';


const useStyles = makeStyles((theme) => ({
  root: {
    width: 500,
  },
}));

const AppDialog = React.forwardRef(({
  children,
  maxWidth,
  requiredCancelBtn = false,
  requiredOKBtn = true,
  actions = []
}, ref) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  // const [contentText, setContentText] = React.useState("");
  // const [title, setTitle] = React.useState("");

  const defaultProps = { title: null, contentText: null, component: null, maxWidth: "xs", type };
  const [data, setData] = React.useState(defaultProps);
  const { title, contentText, component, type } = data;

  React.useImperativeHandle(ref, () => ({
    handleOpen: handleOpen,
    handleClose: handleClose
  }));

  const handleOpen = ({ title, contentText, component, ...props }) => {
    // if(title) setTitle(title);
    // if(contentText) setContentText(contentText);
    setOpen(true);
    setData({ ...data, title, contentText, component, ...props });
  };

  const handleClose = () => {
    setOpen(false);
    setData(defaultProps);
  };

  const getActions = () => {
    let arr = [];

    let needCancelBtn = false;
    if (data && data.hasOwnProperty("requiredCancelBtn")) {
      if (data.requiredCancelBtn) {
        needCancelBtn = true;
      }
    } else if (requiredCancelBtn) {
      needCancelBtn = true;
    }

    if (needCancelBtn) {
      arr.push(<Button onClick={handleClose} color="primary" variant="outlined">    Cancel    </Button>);
    }


    let needOkBtn = false;
    if (data && data.hasOwnProperty("requiredOKBtn")) {
      if (data.requiredOKBtn) {
        needOkBtn = true;
      }
    } else if (requiredOKBtn) {
      needOkBtn = true;
    }

    if (needOkBtn) {
      arr.push(<Button onClick={handleClose} color="primary" variant="outlined"> OK </Button>);
    }

    return arr;
  }

  return <div>
    {open && <Dialog open={open} onClose={() => { }} aria-labelledby="form-dialog-title" maxWidth={maxWidth} fullWidth={true}>
      {title && <DialogTitle id="form-dialog-title">{title}</DialogTitle>}
      {(children || contentText || component || type == "FORM") && <DialogContent>
        {contentText && <DialogContentText> {contentText} </DialogContentText>}
        {children}
        {component && component}
        {type == "FORM" && AppDialogService.getContent(data)}
      </DialogContent>}
      {type != "FORM" && <DialogActions>
        {getActions()}
        {actions}
      </DialogActions>}
    </Dialog>}
  </div>
});


export default AppDialog;


