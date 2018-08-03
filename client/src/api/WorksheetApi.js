import {updateRemarksSuccess, updateRequirementCourseSuccess } from "../actions/WorksheetAction";
import axios from 'axios';
var requirements  = require("../data/bcs");

export const updateRemarks = data => dispatch =>
    axios.post("/api/remarks_update", data, {headers: {'Authorization': "bearer " + localStorage.getItem('token')}})
        .then(res => {
            if (res.status === 200)
                dispatch(updateRemarksSuccess(data))
        });

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

            console.log("will dispatch");
            dispatch(updateRequirementCourseSuccess(data))
        })
        .catch(err=> {
            console.error('caught', err);
        });