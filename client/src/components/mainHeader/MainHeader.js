import React from 'react';
import PropTypes from "prop-types";
import { withRouter } from 'react-router-dom'
import logo from '../../images/ubc-full-logo-white.png';

const MainHeader = withRouter(({ history }) => (
    <header className="App-header">
        <div // src={logo}
             className="App-logo"
             alt="logo"
             onClick={() => { history.push('/'); }}>&nbsp;</div>
    </header>
));

MainHeader.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
};

export default MainHeader