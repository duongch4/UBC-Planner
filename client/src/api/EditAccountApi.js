import { accountEdit, accountEditSuccess, accountChangePassword, accountDelete } from '../actions/AccountActions';
import axios from 'axios';

export const doEditAccount = data => dispatch =>
	axios.post("/api/editaccount", data, { headers: {'Authorization': "bearer " + localStorage.getItem('token')}})
    .then(res => { 
		console.log(res);
		dispatch(accountEdit(data));
		});
		
export const doEditPassword = data => dispatch =>
	axios.post("/api/editpassword", data, { headers: {'Authorization': "bearer " + localStorage.getItem('token')}})
	.then(res => {
		console.log(res);
		dispatch(accountChangePassword(data));
	});

