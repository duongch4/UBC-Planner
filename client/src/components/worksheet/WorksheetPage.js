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
import {emailWorksheet} from '../../api/WorksheetApi';

class WorksheetPage extends React.Component {

    state = {
        inEditMode: null,
        message: 'pdf file',
    }

    async handleEmail () {
      const { message } = this.state
      emailWorksheet({message})
    }

    handleSaveExcel = () => {

    }

    handleSavePdf = () => {
      const input = document.getElementById('divToPrint');
          html2canvas(input)
            .then((canvas) => {
              const imgData = canvas.toDataURL('image/png');
              const pdf = new jsPDF();
              pdf.addImage(imgData, 'JPEG', 0, 0);
              pdf.save("ubc-planner-worksheet.pdf");
              console.log("pdf save")
            });
    }

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
