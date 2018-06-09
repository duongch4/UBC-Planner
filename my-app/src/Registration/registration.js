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
import './style.css';

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

  _handleClickOpen() {
  AppActions.handleClickOpen();
  }

  _handleClose() {
    AppActions.handleClose();;
  }


  render() {

    return (

      <div id="Registration">
      <div class="form-box">
        <div class="head">Hello user</div>
          <form id="registration-form">
            <div class="form-group">
            <TextField
              id="email"
              label="email"
              floatingLabelText="Username"
              margin="normal"
            />
            </div>

            <div class="form-group">
            <TextField
              id="password"
              label="password"
              margin="normal"
            />
            </div>

            <div class="form-group">
             <Button variant="contained"
             color="primary"
             disableRipple
             onClick={this._handleClickOpen}>CREATE ACCOUNT</Button>
             </div>
            </form>
          </div>

      <Dialog
        open={this.state.open}
        onClose={this._handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your account has been created. A confirmation email has been sent.
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
