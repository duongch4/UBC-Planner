import {
    ON_AUTOCOMPLETE_SELECT, ON_AUTOCOMPLETE_SUCCESS, ON_QUERY, ON_QUERY_SUCCESS, ON_AUTOCOMPLETE_FAIL,
    ON_RESET
} from "../constants/CourseSearchConstants";

export const courseAutocompleteFail = () => ({
    type: ON_AUTOCOMPLETE_FAIL
    });

export const courseAutocompleteSuccess = result => ({
    type: ON_AUTOCOMPLETE_SUCCESS,
        result
    });

export const courseAutocompleteSelect = result => ({
    type: ON_AUTOCOMPLETE_SELECT,
    result
});

export const courseSearchSuccess = result => ({
    type: ON_QUERY_SUCCESS,
    result
});

export const reset = () => ({
    type: "",
});
