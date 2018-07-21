import React from "react";
import { connect } from "react-redux";
import {Header} from "semantic-ui-react"
import Worksheet from "./Worksheet";
import WorksheetProgress from "./WorksheetProgress";
import WorksheetInfo from "./WorksheetInfo";


class WorksheetPage extends React.Component {

    state = {
        inEditMode: null
    }

    handleInfoEdit = item => {
        if (!!this.state.inEditMode && this.state.inEditMode!=item) this.state.inEditMode.onSubmit();
        console.log(this.state.inEditMode);
        this.state.inEditMode = item;
        console.log(item);
    };

    render () {
        const {name, bm, cohort, sid, email} = this.props.student;
        return (
            <div>
                <Header className="worksheet-student-name" as='h1' icon textAlign={'left'}>
                        {name}
                </Header>
                <div class = "student-info-container">
                    <WorksheetInfo
                        isEditMode = {false}
                        onClick = {this.handleInfoEdit.bind(this)}
                        fieldName = {'sid'}
                        fieldValue = {sid}
                        fieldType = {'number'}
                        email = {email}
                    />&nbsp;|&nbsp;
                    <WorksheetInfo
                        isEditMode = {false}
                        onClick = {this.handleInfoEdit.bind(this)}
                        fieldName = {'bm'}
                        fieldValue = {bm}
                        fieldType = {'string'}
                        email = {email}
                    />&nbsp;|&nbsp;
                    <WorksheetInfo
                        isEditMode = {false}
                        onClick = {this.handleInfoEdit.bind(this)}
                        fieldName = {'cohort'}
                        fieldValue = {cohort}
                        fieldType = {'number'}
                        email = {email}
                    />
                </div>
                <WorksheetProgress />
                <Worksheet {...this.props}/>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    student: state.student.info
});

export default connect(
    mapStateToProps
)(WorksheetPage);