import React from "react";
import PropTypes from "prop-types";
import GeneralHeader from "../header/GeneralHeader";
import Auth from '../../modules/Auth';
import Dashboard from '../../components/main/Dashboard.jsx';
import Mainpage from '../../components/main/MainPage';



class DashboardPage extends React.Component {
	  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      user: {
        email: '',
        name: '',
        password: '',
        secretData: ''
      }
    };
  }

  componentDidMount() {
    const xhr = new XMLHttpRequest();
    xhr.open('get', '/api/dashboard');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        this.setState({
          secretData: xhr.response.message
        });
      }
    });
    xhr.send();
  }

	  
  /**
   * Render the component.
  */ 
  render() {
    return (
     <div>
      <Mainpage />
        </div>

    );
  }


}

DashboardPage.contextTypes = {
  router: PropTypes.object.isRequired
};

DashboardPage.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired
};

export default DashboardPage;



