import React, { PropTypes } from 'react';

const Base = ({ children }) => (
    { /* child component will be rendered here */ }
    {children}

  </div>
);

Base.propTypes = {
  children: PropTypes.object.isRequired
};

export default Base;
