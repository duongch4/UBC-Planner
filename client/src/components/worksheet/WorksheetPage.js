import React from "react";
import { connect } from "react-redux";
import {Header} from "semantic-ui-react"
import Worksheet from "./Worksheet";
import WorksheetProgress from "./WorksheetProgress";
import WorksheetInfo from "./WorksheetInfo";
import { Button } from 'semantic-ui-react';
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import axios from 'axios'
import {emailUserWorksheet} from '../../api/WorksheetApi';
import domtoimage from 'dom-to-image';

class WorksheetPage extends React.Component {

    state = {
        inEditMode: null
    }

    handleEmailUser = () => {
      emailUserWorksheet(this.props.student.email, window.document.getElementById('divToPrint'));
    }

    handleEmailSteve = () => {
    //  emailSteveWorksheetSteve(this.props.student.email, window.document.getElementById('divToPrint'));
    }

    handleSavePdf = () => {
		    domtoimage.toPng(window.document.getElementById('divToPrint'))
		      .then(function (dataUrl) {
            let imgData = new Image();
            imgData.src=dataUrl;

            let pdf = new jsPDF('p', 'mm', 'letter');
            pdf.setFontSize(12);
            pdf.addImage(imgData, 'PNG', 15, 20, 185, 220);
            pdf.save('ubc-planner-worksheet.pdf');
            console.log("pdf save");
		      })
          .catch(function (error) {
            console.error("dom-to-image error");
          });
        };

    handleInfoEdit = item => {
        if (!!this.state.inEditMode && this.state.inEditMode!=item) this.state.inEditMode.onSubmit();
        console.log(this.state.inEditMode);
        this.state.inEditMode = item;
        console.log(item);
    };

    render () {
        const {name, bm, cohort, sid} = this.props.student;
        return (
          <div>
          <div class="button">
            <button class="ui left attached button" onClick= {this.handleEmailUser.bind(this)}>Send to my email</button>
            <button class="ui right attached button" onClick= {this.handleEmailSteve.bind(this)}>Email Steve</button>
          </div>
            <div id='divToPrint'>
                <Header as='h1' icon textAlign={'left'}>
                        {name}

                </Header>
                <div class = "student-info-container">
                    <WorksheetInfo
                        isEditMode = {false}
                        onClick = {this.handleInfoEdit.bind(this)}
                        fieldName = {'sid'}
                        fieldValue = {sid}
                        fieldType = {'number'}
                    />&nbsp;|&nbsp;
                    <WorksheetInfo
                        isEditMode = {false}
                        onClick = {this.handleInfoEdit.bind(this)}
                        fieldName = {'bm'}
                        fieldValue = {bm}
                        fieldType = {'string'}
                    />&nbsp;|&nbsp;
                    <WorksheetInfo
                        isEditMode = {false}
                        onClick = {this.handleInfoEdit.bind(this)}
                        fieldName = {'cohort'}
                        fieldValue = {cohort}
                        fieldType = {'number'}
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
