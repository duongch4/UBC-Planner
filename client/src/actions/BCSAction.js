import {PROGRAM_REQUIREMENTS_LOADED} from "../constants/BCSConstnats";

export const bcsRequirementsRetrieveSuccess = requirements => ({
    type: PROGRAM_REQUIREMENTS_LOADED,
    requirements
});