import axios from 'axios';
import {updatePlannerCourseSuccess} from "../actions/PlannerAction";
import {editTerm} from "../actions/CoursePlannerAction";

export const doUpdatePlannerCourse = data => dispatch =>
    axios.post("/api/planner_course_update", data, {headers: {'Authorization': "bearer " + localStorage.getItem('token')}})
        .then(res => {
            console.log("will dispatch.. res:", res);
            dispatch(updatePlannerCourseSuccess(res.data))
        })
        .catch(err=> {
            console.error('caught', err);
        });


export const doUpdateTerm = data => dispatch =>
    axios.post("/api/planner_update_term", data, {headers: {'Authorization': "bearer " + localStorage.getItem('token')}})
        .then(res => {
            console.log("will dispatch.. res:", res);
            dispatch(editTerm(res.data, data))
        })
        .catch(err=> {
            console.error('caught', err);
        });