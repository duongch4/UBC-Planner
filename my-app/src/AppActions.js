import AppDispatcher from './dispatcher/AppDispatcher.js';

const AppActions = {

  handleClickOpen: function() {
    AppDispatcher.dispatch( {
      actionType: 'open-alert'
    } );
  },

  handleClose: function() {
    AppDispatcher.dispatch( {
      actionType: 'close-alert'
    } );
  }
};

export default AppActions;
