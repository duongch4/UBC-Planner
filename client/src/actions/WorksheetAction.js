import {UPDATE_REMARKS_SUCCESS, UPDATE_COURSE_REQUIREMENT_SUCCESS} from "../constants/WorksheetConstants";

export const updateRemarksSuccess = remarks => ({
    type: UPDATE_REMARKS_SUCCESS,
    remarks
});

export const updateRequirementCourseSuccess = data => ({
    ...data,
   type: UPDATE_COURSE_REQUIREMENT_SUCCESS,
});