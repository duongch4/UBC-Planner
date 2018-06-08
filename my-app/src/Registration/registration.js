import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AppStore from '../AppStore.js';
import AppActions from '../AppActions.js';

class Registration extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
    }
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    AppStore.addChangeListener( this._onChange );
  }

  componentWillUnmount() {
    AppStore.removeChangeListener( this._onChange );
  }

  _onChange() {
    this.setState({
      open: AppStore.getAlertStatus()
    });
  }

  _handleClickOpen = () => {
  AppActions.handleClickOpen();
  };

  _handleClose = () => {
    AppActions.handleClose();;
  };


  render() {

    return (
      <div id="Registration">
      <TextField
        id="username"
        label="username"
        floatingLabelText="Username"
        margin="normal"
      />
      <TextField
        id="password"
        label="password"
        margin="normal"
      />

      <div>
       <Button variant="contained"
       color="primary"
       disableRipple
       onClick={this._handleClickOpen}>CREATE ACCOUNT</Button>

     </div>

     <Dialog
       open={this.state.open}
       onClose={this._handleClose}
       aria-labelledby="alert-dialog-title"
       aria-describedby="alert-dialog-description"
     >
       <DialogContent>
         <DialogContentText id="alert-dialog-description">
           Your account has been successfully created. An email has been sent to you with instructions on how to activate it.
         </DialogContentText>
       </DialogContent>
       <DialogActions>
         <Button onClick={this._handleClose} color="primary" autoFocus>
           OK
         </Button>
       </DialogActions>
     </Dialog>
     </div>
    );
  }
}

export default Registration;
