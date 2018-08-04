import React from 'react'
import './Modal.css';
import { Button, Modal, Header, Form , Icon} from 'semantic-ui-react';
import EmailModalForm from './EmailModalForm'

class EmailModal extends React.Component {

  render() {
      return (

        <Modal class="modal" trigger={<Button size='mini'>Email to Director</Button>} closeIcon>
        <Modal.Header>Send Email</Modal.Header>
        <Modal.Content>
        <Modal.Description>
        <EmailModalForm submit = { this.handleSubmit } />
        </Modal.Description>
        </Modal.Content>
        </Modal>

      );
  }
}

export default EmailModal;
