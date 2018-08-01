import { accountEdit, accountEditSuccess, accountChangePassword, accountDelete } from '../actions/AccountActions';
import axios from 'axios';

export const doEditAccount = info => dispatch =>
	axios.post("/api/editaccount", {info: info}, { headers: {'Authorization': "bearer " + localStorage.getItem('token')}})
    .then(res => { 
		console.log(res);
		dispatch(accountEditSuccess(info));
		});

