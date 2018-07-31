import React from "react";
import { connect } from "react-redux";
import {Header} from "semantic-ui-react"
import AccountInfo from "./AccountInfo";

class AccountPage extends React.Component {
    state = {
        inEditMode: null
    };

    handleInfoEdit = item => {
        if (!!this.state.inEditMode && this.state.inEditMode!=item) this.state.inEditMode.onSubmit();
        console.log(this.state.inEditMode);
        this.state.inEditMode = item;
        console.log(item);
    };
	
    render () {
        const {name, bm, cohort, sid, email} = this.props.student;
        return (
        <p>Testing</p>
        );
	};
}

const mapStateToProps = state => ({
    student: state.student.info
});

export default connect(mapStateToProps)(AccountPage);
