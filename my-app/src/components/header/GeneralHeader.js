import './GeneralHeader.css';
import React from "react";
import PropTypes from "prop-types";
import { Header, Icon } from "semantic-ui-react";

const GeneralHeader = props => (
    <Header as = 'h2' className = "General-header">
        <Icon name={props.iconName} />
        <Header.Content>
            {props.headerText}
            <Header.Subheader>{props.subHeaderText}</Header.Subheader>
        </Header.Content>
    </Header>
);

GeneralHeader.propTypes = {
    iconName: PropTypes.string.isRequired,
    headerText: PropTypes.string.isRequired,
    subHeaderText: PropTypes.string.isRequired
};

GeneralHeader.defaultProps = {
    iconName: "graduation",
    headerText: "",
    subHeaderText: ""
};

export default GeneralHeader;