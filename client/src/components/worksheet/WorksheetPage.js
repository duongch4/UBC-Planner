import React from "react";
import { connect } from "react-redux";
import {Header} from "semantic-ui-react"
import Worksheet from "./Worksheet";
import WorksheetProgress from "./WorksheetProgress";
import WorksheetInfo from "./WorksheetInfo";
import { Button, Modal, Image, Form} from 'semantic-ui-react';
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import axios from 'axios'
import {emailUserWorksheet} from '../../api/WorksheetApi';
import EmailModal from '../modal/EmailModal';
import ConfirmModal from '../modal/ConfirmModal';
import domtoimage from 'dom-to-image';

class WorksheetPage extends React.Component {

    state = {
        inEditMode: null
    }

    handleInfoEdit = item => {
        if (!!this.state.inEditMode && this.state.inEditMode!=item)
            this.state.inEditMode.onSubmit();
        console.log(this.state.inEditMode);
        this.state.inEditMode = item;
        console.log(item);
    };

    render () {
        const {name, bm, cohort, sid, email} = this.props.student;
        return (
          <div>

                <Header as='h1' icon textAlign={'left'}>
                <div className="h-left">
                {name}
                </div>
                <div className="button h-right">
                <ConfirmModal />
                  <EmailModal />

                </div>

                </Header>

<div id='divToPrint'>

                <div className = "student-info-container">
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
