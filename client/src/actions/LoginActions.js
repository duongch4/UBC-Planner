import { LOG_IN, LOG_OUT, UPDATE_INFO_SUCCESS } from '../constants/LoginConstants';

export const loginSuccess = student => ({
    type: LOG_IN,
    student
});

export const logoutSuccess = () => ({
    type: LOG_OUT
});

export const updateStudentInfoSuccess = student => ({
   type: UPDATE_INFO_SUCCESS,
    student
});