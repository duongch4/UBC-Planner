import {bcsRequirementsRetrieveSuccess} from "../actions/BCSAction";
var requirements  = require("../data/bcs");

export const getRequirements = credentials => dispatch =>
    dispatch(bcsRequirementsRetrieveSuccess(requirements));