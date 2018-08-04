import {updateRemarksSuccess, updateRequirementCourseSuccess } from "../actions/WorksheetAction";
import axios from 'axios';
var requirements  = require("../data/bcs");

export const updateRemarks = data => dispatch =>
    axios.post("/api/remarks_update", data, {headers: {'Authorization': "bearer " + localStorage.getItem('token')}})
        .then(res => {
            if (res.status === 200)
                dispatch(updateRemarksSuccess(data))
        });

export const emailUserWorksheet = (email, divToPrint) =>
axios.post("/email/user_worksheet", { email: email, divToPrint: divToPrint.innerHTML })

export const emailDirectorWorksheet = (data, divToPrint) =>
axios.post("/email/director_worksheet", { data: data, divToPrint: divToPrint.innerHTML })

export const updateRequirementCourse = data => dispatch =>
    // axios.post("/api/requirement_course_update", data, {headers: {'Authorization': "bearer " + localStorage.getItem('token')}})
    //     .then(res => {
    //         if (res.status === 200)
    //             dispatch(updateRemarksSuccess(data))
    //     });

    dispatch(updateRequirementCourseSuccess(data))

export const updateCourses = data => dispatch =>
    axios.post("/api/course_update", data, {headers: {'Authorization': "bearer " + localStorage.getItem('token')}})
        .then(res => {
            dispatch(updateRequirementCourseSuccess(data))
        })
        .catch(err=> {
            console.error('caught', err);
        });