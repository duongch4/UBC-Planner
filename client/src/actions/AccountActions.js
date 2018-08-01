import { ACCOUNT_EDIT, ACCOUNT_EDIT_SUCCESS, ACCOUNT_CHANGE_PASSWORD, ACCOUNT_DELETE } from '../constants/AccountConstants'

export const accountEdit = student => ({
	type: ACCOUNT_EDIT,
	student
}); 

export const accountEditSuccess = student => ({
	type: ACCOUNT_EDIT_SUCCESS,
	student
});

export const accountChangePassword = student => ({
	type: ACCOUNT_CHANGE_PASSWORD,
	student
});

export const accountDelete = student => ({
	type: ACCOUNT_DELETE,
	student
});
