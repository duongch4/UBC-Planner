import { LOG_IN, LOG_OUT } from '../constants/LoginConstants';
import BaseStore from './BaseStore';
// import jwt_decode from 'jwt-decode';

class LoginStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(() => this._registerToActions.bind(this));
        this._user = null;
        this._jwt = null;
    }

    _registerToActions(action) {
        switch(action.actionType) {
            case LOG_IN:
                this._jwt = action.jwt;
                // this._user = jwt_decode(this._jwt); TODO
                this._user = action.user;
                this.emitChange.call(this, true);
                break;
            case LOG_OUT:
                this._user = null;
                this.emitChange.call(this, false);
                break;
            default:
                break;
        }
    }

    get user() {
        return this._user;
    }

    get jwt() {
        return this._jwt;
    }

    isLoggedIn() {
        return !!this._user;
    }
}

export default new LoginStore();