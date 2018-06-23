import {updateRemarksSuccess} from "../actions/WorksheetAction";
var requirements  = require("../data/bcs");

export const updateRemarks = data => dispatch => Promise.resolve(data)
.then(data => dispatch(updateRemarksSuccess(data)));