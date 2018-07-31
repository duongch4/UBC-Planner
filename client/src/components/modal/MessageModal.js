import React from 'react'
import './Modal.css';
import { Button, Modal, Header, Form } from 'semantic-ui-react';

class EmailModal extends React.Component {


  render() {
      return (
        <div className="Message-modal-page-container">
        <Modal size="tiny" trigger={<Button>Message</Button>} closeIcon>
        <Modal.Header>Success</Modal.Header>
        <Modal.Content>
        <p>Email sent to your account.</p>
        </Modal.Content>
        </Modal>
        </div>
      );
  }
}

export default EmailModal;
