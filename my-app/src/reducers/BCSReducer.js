import {PROGRAM_REQUIREMENTS_LOADED} from "../constants/BCSConstnats";

const initialState = {
    requirements : []
}

const bcsApp = (state = initialState, action) => {
    switch(action.type) {
        case PROGRAM_REQUIREMENTS_LOADED: {
            console.log(action);
            const { requirements } = action;
            return { ...state, requirements };
        }
        default:
            return state;
    }
};

export default bcsApp;