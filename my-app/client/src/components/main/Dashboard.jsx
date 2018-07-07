import React from 'react';
import { Card } from 'semantic-ui-react';
import PropTypes from "prop-types";


const Dashboard = ({ secretData }) => (
	<div>
    <Card>
    <Card.Content>
      <Card.Header>"Dashboard: only after auth"</Card.Header>
      {secretData && <Card.Description style={{ fontSize: '16px', color: 'green' }}>{secretData}</Card.Description>}
    </Card.Content>
    </Card>

    
  </div>
);

Dashboard.propTypes = {
  secretData: PropTypes.string.isRequired
};


export default Dashboard;
