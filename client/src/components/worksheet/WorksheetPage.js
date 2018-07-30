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
import ReactDOM from 'react-dom';
import domtoimage from 'dom-to-image';

class WorksheetPage extends React.Component {

    state = {
        inEditMode: null,
        name: 'user',
        message: 'pdf file',
        email: 'angeli_corpin@hotmail.com'
    }

    async handleEmail () {
      const { name, email, message } = this.state
      console.log("handleEmail")
      const form = await axios.post('/email/worksheet', {
        name,
        message,
        email
      })
    }

    handleSaveExcel = () => {
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

                <div class="ui small basic icon buttons">
                  <button class="ui button" onClick= {this.handleEmail.bind(this)}><i class="mail icon"></i></button>
                  <button class="ui button" onClick= {this.handleEmail.bind(this)}><i class="save icon"></i></button>
                  <button class="ui button" onClick= {this.handleSavePdf.bind(this)}><i class="download icon"></i></button>
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
