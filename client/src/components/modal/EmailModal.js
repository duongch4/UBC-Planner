import React from 'react'
import './Modal.css';
import { Button, Modal, Header, Form } from 'semantic-ui-react';
import EmailModalForm from './EmailModalForm'

class EmailModal extends React.Component {

  render() {
      return (
        <div className="Email-modal-page-container">
        <Modal trigger={<Button>Email Steve</Button>} closeIcon>
        <Modal.Header>Send Email</Modal.Header>
        <Modal.Content>
        <Modal.Description>
        <EmailModalForm submit = { this.handleSubmit } />
        </Modal.Description>
        </Modal.Content>
        </Modal>
        </div>
      );
  }
}

export default EmailModal;
