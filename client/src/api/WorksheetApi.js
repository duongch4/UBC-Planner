import {updateRemarksSuccess} from "../actions/WorksheetAction";
import axios from 'axios';
var requirements  = require("../data/bcs");

export const updateRemarks = data => dispatch =>
axios.post("/api/remarks_update", data, {
    headers: {'Authorization': "bearer " + localStorage.getItem('token')}
})
    .then(res => dispatch(updateRemarksSuccess(data)));

export const emailUserWorksheet = (email, divToPrint) =>
axios.post("/email/user_worksheet", { email: email, divToPrint: divToPrint.innerHTML })

export const emailDirectorWorksheet = (data, divToPrint) =>
axios.post("/email/director_worksheet", { data: data, divToPrint: divToPrint.innerHTML })

// Promise.resolve(data)
// .then(data => dispatch(updateRemarksSuccess(data)));
