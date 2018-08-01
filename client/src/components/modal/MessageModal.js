import React from 'react'
import './Modal.css';
import { Button, Modal, Header, Form } from 'semantic-ui-react';

class EmailModal extends React.Component {

  render() {
      return (
        <div className="Message-modal-page-container">
        <Modal size="tiny" open={this.props.messageModalOpen} closeIcon>
        <Modal.Header>{this.props.messageModalHeader}</Modal.Header>
        <Modal.Content>
        <p>{this.props.messageModal}</p>
        </Modal.Content>
        </Modal>
        </div>
      );
  }
}

export default EmailModal;
