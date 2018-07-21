import {UPDATE_REMARKS_SUCCESS} from "../constants/WorksheetConstants";

export const updateRemarksSuccess = remarks => ({
    type: UPDATE_REMARKS_SUCCESS,
    remarks
});