import {loginSuccess, logoutSuccess, updateStudentInfoSuccess} from "../actions/LoginActions";
import axios from 'axios';
var users  = require("../data/test");

export const doLogin = credentials => dispatch =>
axios.post("/auth/login", credentials)
    .then(res => {
        if (res) {
            // res.data.user.token = res.data.token;
            localStorage.setItem('token', res.data.token);
        }
        dispatch(loginSuccess(res.data.user));
    });
// .catch(error=>console.log(error));

export const doLogout = () => dispatch =>
    dispatch(logoutSuccess());

export const lostPassword = ({ email }) => {
        return Promise.resolve({
            message: "Password reset email was sent."
        });
    };

export const updateStudentInfo = info => dispatch =>
axios.post("/api/info_update", {info:info},  { headers: {'Authorization': "bearer " + localStorage.getItem('token')}})
    .then(res => { console.log(res);});

export const doSignup = userData =>
axios.post("/auth/signup", userData)
    .then(res => {
});