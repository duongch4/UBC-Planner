import React from 'react';
import { Link, IndexLink } from 'react-router';
import Auth from '../modules/Auth';
import PropTypes from "prop-types";


const Base = ({ children }) => (
	<div>
    { /* child component will be rendered here */ }
    {children}

  </div>
);

Base.propTypes = {
  children: PropTypes.object.isRequired
};

export default Base;
