import {UPDATE_COURSE_PLANNER_SUCCESS} from "../constants/PlannerConstants";

export const updatePlannerCourseSuccess = data => ({
    type: UPDATE_COURSE_PLANNER_SUCCESS,
    data
});