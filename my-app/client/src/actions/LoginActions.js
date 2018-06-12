import AppDispatcher from '../dispatcher/AppDispatcher.js';
import { LOG_IN, LOG_OUT } from '../constants/LoginConstants';

export default {
    login: (user) => {
        AppDispatcher.dispatch({
            actionType: LOG_IN,
            jwt: user.email, // TODO token
            user: user
        });

        localStorage.setItem('jwt', user);
    },

    logout: () => {
        // makes an API call here as well
        // dispatch action playload for login
        localStorage.removeItem('jwt');
        AppDispatcher.dispatch({
            actionType: LOG_OUT
        });
    }
};