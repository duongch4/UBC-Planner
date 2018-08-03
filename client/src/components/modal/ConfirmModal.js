import React from 'react'
import { Button, Header, Icon, Modal , Message} from 'semantic-ui-react'
import {emailUserWorksheet} from '../../api/WorksheetApi';
import { connect } from "react-redux";
import './Modal.css';



class ConfirmModal extends React.Component {

  state = {
      emailError: "",
      emailSuccess: "",
      show: true
  };

  handleEmailUser = () => {
    emailUserWorksheet(this.props.student.email, window.document.getElementById('divToPrint'))
    .then((result) => {
        this.setState({ emailSuccess : result.data.message  });
        this.setState({ show : false  });
    })
    .catch(function (e) {
        this.setState({ emailError : e.response.data.error});
    }.bind(this));
  }

  render() {
      const {emailError, emailSuccess, show} = this.state;
      return (

  <Modal class="modal" trigger={<Button size='mini'>Email to Me</Button>} closeIcon>
    <Header content='Send Email' />
<Modal.Content>
    {emailError && <Message error>{emailError}</Message>}
    {emailSuccess && <Message positive>{emailSuccess}</Message>}
 <Modal.Description>

  { show ? <div>
    <p>
        Are you sure you want to send a copy of your graduation checklist to your email?
      </p>
    <Modal.Actions>
      <Button onClick= {this.handleEmailUser.bind(this)} className='Email-button' id='Email-button' fluid> Submit </Button>
    </Modal.Actions>
    </div> : null}
    </Modal.Description>
    </Modal.Content>

  </Modal>
);
}
}

const mapStateToProps = state => ({
    student: state.student.info
});


export default connect(
    mapStateToProps
)(ConfirmModal);
