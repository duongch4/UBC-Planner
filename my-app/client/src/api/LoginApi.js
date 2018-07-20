import {loginSuccess, logoutSuccess, updateStudentInfoSuccess} from "../actions/LoginActions";
import Auth from '../modules/Auth.js';
var users  = require("../data/test");

export const doLogin = credentials => dispatch => new Promise((resolve, reject)=> {
    console.log("credentails ", credentials);
    const student = users[credentials.email];
    if (!!student) resolve(student);
    //if resolve db.find the the  findOne function TODO
    else reject({
        exists: false,
        error: { message: "User does not exist. Please try again." }
    });
}, Promise.resolve, Promise.reject)
    .then(data => dispatch(loginSuccess(data)));

export const doLogout = () => dispatch =>
    dispatch(logoutSuccess());

export const lostPassword = ({ email }) => {
        return Promise.resolve({
            message: "Password reset email was sent."
        });
    };

export const updateStudentInfo = info => dispatch => new Promise((resolve, reject)=> {
    resolve(info);
}, Promise.resolve, Promise.reject)
    .then(data => dispatch(updateStudentInfoSuccess(data)));

export const doSignup = ({ email, password, name, sid, bm, cohort}) => {
        if (users.hasOwnProperty( email )) {
            return Promise.reject({
                exists: false,
                error: { message: "Email already exists. Please try again." }
            });
        }
        users[email] = {
            info: {
                email: email,
                password: password,
                name: name,
                sid: sid,
                cohort: cohort,
                bm: bm
            },
            courses: {},
            remarks: {
                "PADE": "",
                "ENGL 1XX": "",
                "CPSC 110": "",
                "CPSC 121": "",
                "MATH 180": "",
                "STAT 203": "",
                "Communication": "",
                "CPSC 210": "",
                "CPSC 221": "",
                "CPSC 213": "",
                "CPSC 310": "",
                "CPSC 320": "",
                "CPSC 313": "",
                "CPSC 3X1": "",
                "CPSC 3X2": "",
                "CPSC 4X1": "",
                "CPSC 4X2": "",
                "BM1": "",
                "BM2": "",
                "BM3": "",
                "BM4": ""
            }
        };

        return Promise.resolve({
            message: "Success! Redirecting to the login page."
        });
    };
