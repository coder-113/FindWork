import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button, FormGroup, Label, Input } from 'reactstrap';

const DetailsForm = ({ isOpen, toggle, templateData }) => {
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  useEffect(() => {
    if (templateData) {
      setTemplateName(templateData.templateName);
      setTemplateDescription(templateData.templateDescription);
      setImagePreviewUrl(templateData.templateImageBase64);
    }
  }, [templateData]);

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Template Details</ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label for="templateName">Template Name:</Label>
          <Input
            type="text"
            id="templateName"
            value={templateName}
            readOnly
          />
        </FormGroup>
        <FormGroup>
          <Label for="templateDescription">Template Description:</Label>
          <Input
            type="text"
            id="templateDescription"
            value={templateDescription}
            readOnly
          />
        </FormGroup>
        <FormGroup>
          <Label for="templateImage">Template Image:</Label>
          {imagePreviewUrl && (
            <img src={`data:image/png;base64,${imagePreviewUrl}`} alt="Template Preview" style={{ width: '100%', height: 'auto' }} />
          )}
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>Close</Button>
      </ModalFooter>
    </Modal>
  );
};

export default DetailsForm;
