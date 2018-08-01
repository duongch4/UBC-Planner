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
import MessageModal from '../modal/MessageModal';
import domtoimage from 'dom-to-image';

class WorksheetPage extends React.Component {

    state = {
        inEditMode: null,
        messageModalOpen: false,
        messageModal: "",
        messageModalHeader: ""
    }

    handleEmailUser = () => {
      emailUserWorksheet(this.props.student.email, window.document.getElementById('divToPrint'))
      .then((result) => {
          this.setState({ messageModalOpen : true,
            messageModal : result.data.message,
            messageModalHeader: "Success"  });
      })
      .catch(function (e) {
          this.setState({ messageModalOpen : true,
            messageModal : e.response.data.error,
            messageModalHeader: "Error"});
      }.bind(this));
    }

    hideMessageModal = () => {
          this.setState({messageModalOpen: false,
            messageModal: "",
            messageModalHeader: ""})
    }

    handleSavePdf = () => {
		    domtoimage.toPng(window.document.getElementById('divToPrint'))
		      .then((dataUrl) => {
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
            <MessageModal messageModalOpen={this.state.messageModalOpen} messageModal={this.state.messageModal} messageModalHeader={this.state.messageModalHeader}/>
            <EmailModal />
            <div class="button">
              <button class="ui left attached button" onClick= {this.handleEmailUser.bind(this)}>Send to my email</button>
              <button class="ui right attached button" onClick= {this.handleSavePdf.bind(this)}>Save as PDF</button>
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
