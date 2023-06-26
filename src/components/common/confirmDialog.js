import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  root: {
      width: 500,
  },
}));

const ConfirmDialog = React.forwardRef(({ clickEvent, cancelEvent = () => {} }, ref) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [dialogProps, setDialogProps] = React.useState({title:"", contentText:"", event: ()=> {}});
  const {title, contentText, event} = dialogProps;
  React.useImperativeHandle(ref, () => ({
    handleOpen: handleOpen,
  }));

  const handleOpen = ({title, contentText, callback}) => {
    setDialogProps({title, contentText, event: callback})
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    cancelEvent();
  };

  const onClickEvt = () => {
    clickEvent && clickEvent();
    event && event();
    handleClose();
  }

  return <div>
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth={"xs"} fullWidth={true}>
      {title && <DialogTitle id="form-dialog-title">{title}</DialogTitle>}
      { <DialogContent>
        {contentText && <DialogContentText> {contentText} </DialogContentText>}
      </DialogContent>}
      <DialogActions>
         <Button onClick={handleClose} color="primary">    Cancel    </Button>
        <Button onClick={onClickEvt} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  </div>
});


export default ConfirmDialog;