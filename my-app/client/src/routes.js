import Base from './components/Base.jsx';
import LoginPage from './components/login/LoginPage.js';
import SignUpPage from './components/signup/SignupPage.js';
import Auth from './modules/Auth.js';
import DashboardPage from './components/main/MainPage.js';


const routes = {
  // base component (wrapper for the whole application).
  component: Base,
  childRoutes: [

    {//NEEDS TO BE REPLACED
      path: '/',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, DashboardPage);
        } else {
          callback(null, LoginPage);
        }
      }
    },
	
    {
      path: '/login',
      component: LoginPage
    },

    {
      path: '/signup',
      component: SignUpPage
    },
   

    {
      path: '/logout',
      onEnter: (nextState, replace) => {
        Auth.deauthenticateUser();

        // change the current URL to /
        replace('/');
      }
    }

  ]
};

export default routes;
