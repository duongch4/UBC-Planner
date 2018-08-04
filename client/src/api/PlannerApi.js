import axios from 'axios';
import {updatePlannerCourseSuccess} from "../actions/PlannerAction";

export const doUpdatePlannerCourse = data => dispatch =>
    axios.post("/api/planner_course_update", data, {headers: {'Authorization': "bearer " + localStorage.getItem('token')}})
        .then(res => {
            console.log("will dispatch.. res:", res);
            dispatch(updatePlannerCourseSuccess(res.data))
        })
        .catch(err=> {
            console.error('caught', err);
        });