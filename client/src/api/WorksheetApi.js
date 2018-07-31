import {updateRemarksSuccess} from "../actions/WorksheetAction";
import axios from 'axios';
var requirements  = require("../data/bcs");

export const updateRemarks = data => dispatch =>
axios.post("/api/remarks_update", data, {
    headers: {'Authorization': "bearer " + localStorage.getItem('token')}
})
    .then(res => dispatch(updateRemarksSuccess(data)));

export const emailUserWorksheet = (email, data) => {
  console.log(data.innerHTML)
  axios.post("/email/worksheet", { email: email, data: data.innerHTML })
}

// Promise.resolve(data)
// .then(data => dispatch(updateRemarksSuccess(data)));
