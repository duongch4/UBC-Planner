import AppDispatcher from './dispatcher/AppDispatcher.js';
import { EventEmitter } from 'events';

const CHANGE_EVENT = 'change';

let _alertOpen = false;

class AppStore extends EventEmitter {

  emitChange() {
    this.emit( CHANGE_EVENT );
  }

  addChangeListener( callback ) {
    this.on( CHANGE_EVENT, callback );
  }

  removeChangeListener( callback ) {
    this.removeListener( CHANGE_EVENT, callback );
  }

  getAlertStatus() {
    return _alertOpen;
  }
}

const _appStore = new AppStore();

export default _appStore;

_appStore.dispatchToken = AppDispatcher.register( action => {
  switch ( action.actionType ) {

    case 'open-alert':
      _alertOpen = true;
      _appStore.emitChange();
      break;

    case 'close-alert':
      _alertOpen = false;
      _appStore.emitChange();
      break;

    default:
      break;

  }

  return true;
});
