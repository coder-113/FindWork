import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { createCVAsync, uploadCVAsync } from '../../../features/cvSlice';

const CreateForm = ({ toggle, isOpen, setSuccessMessage }) => {
  const dispatch = useDispatch();

  const [uploadTemplateName, setUploadTemplateName] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [createTemplateName, setCreateTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateFilePath, setTemplateFilePath] = useState('');
  const [templateImage, setTemplateImage] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [uploadFormDisabled, setUploadFormDisabled] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [createButtonDisabled, setCreateButtonDisabled] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setCreateTemplateName(uploadTemplateName);
  }, [uploadTemplateName]);

  const validateUploadForm = () => {
    const newErrors = {};
    if (!uploadTemplateName.trim()) newErrors.uploadTemplateName = "Template name is required";
    if (!uploadFile) newErrors.uploadFile = "HTML file is required";
    if (uploadFile && !uploadFile.name.endsWith('.html')) newErrors.uploadFile = "Only HTML files are allowed";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCreateForm = () => {
    const newErrors = {};
    if (!createTemplateName.trim()) newErrors.createTemplateName = "Template name is required";
    if (!templateDescription.trim()) newErrors.templateDescription = "Template description is required";
    if (!templateFilePath.trim()) newErrors.templateFilePath = "Template file path is required";
    if (!templateImage) newErrors.templateImage = "Template image is required";
    if (templateImage && !templateImage.type.startsWith('image/')) newErrors.templateImage = "Only image files are allowed";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChangeUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.html')) {
      setUploadFile(file);
      setErrors({ ...errors, uploadFile: null });
    } else {
      setUploadFile(null);
      setErrors({ ...errors, uploadFile: "Only HTML files are allowed" });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setTemplateImage(file);
      setErrors({ ...errors, templateImage: null });
    } else {
      setTemplateImage(null);
      setErrors({ ...errors, templateImage: "Only image files are allowed" });
    }
  };

  const handleUpload = async () => {
    if (!validateUploadForm()) return;
    setLoadingUpload(true);

    try {
      const result = await dispatch(uploadCVAsync({ file: uploadFile, templateName: uploadTemplateName })).unwrap();

      setUploadMessage('Template uploaded successfully');
      setLoadingUpload(false);

      setCreateButtonDisabled(false);
      setTemplateFilePath(`http://localhost:8080/api/templates/${uploadTemplateName}`);

      setUploadFormDisabled(true);
    } catch (error) {
      console.error('Error uploading template:', error);
      setUploadMessage('Error uploading template: ' + error.message);
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleCreate = async () => {
    if (!validateCreateForm()) return;
    setLoadingCreate(true);

    try {
      const formData = new FormData();
      formData.append('templateName', createTemplateName);
      formData.append('templateDescription', templateDescription);
      formData.append('templateFilePath', templateFilePath);
      formData.append('templateImage', templateImage);

      await dispatch(createCVAsync(formData)).unwrap();

      setUploadTemplateName('');
      setTemplateDescription('');
      setTemplateFilePath('');
      setTemplateImage(null);

      setCreateButtonDisabled(true);
      setSuccessMessage('CV created successfully');
      setTimeout(() => setSuccessMessage(""), 3000);
      toggle();
    } catch (error) {
      console.error('Error creating template:', error);
    } finally {
      setLoadingCreate(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Combined CV Actions</ModalHeader>
      <ModalBody>
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title">Upload CV File</h5>
          </div>
          <div className="card-body">
            {uploadMessage && <div className="alert alert-info">{uploadMessage}</div>}
            <Form>
              <FormGroup>
                <Label for="templateNameUpload">Template Name:</Label>
                <Input
                  type="text"
                  id="templateNameUpload"
                  value={uploadTemplateName}
                  onChange={(e) => setUploadTemplateName(e.target.value)}
                  required
                  disabled={uploadFormDisabled}
                />
                {errors.uploadTemplateName && <div className="text-danger">{errors.uploadTemplateName}</div>}
              </FormGroup>
              <FormGroup>
                <Label for="fileUpload">Upload HTML File:</Label>
                <Input
                  type="file"
                  id="fileUpload"
                  onChange={handleFileChangeUpload}
                  accept=".html"
                  required
                  disabled={uploadFormDisabled}
                />
                {errors.uploadFile && <div className="text-danger">{errors.uploadFile}</div>}
              </FormGroup>
              <Button color="primary" onClick={handleUpload} disabled={loadingUpload || uploadFormDisabled}>
                {loadingUpload ? 'Uploading...' : 'Upload Template'}
              </Button>
            </Form>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Create New CV</h5>
          </div>
          <div className="card-body">
            <Form>
              <FormGroup>
                <Label for="templateDescription">Template Description:</Label>
                <Input
                  type="text"
                  id="templateDescription"
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                />
                {errors.templateDescription && <div className="text-danger">{errors.templateDescription}</div>}
              </FormGroup>
              <FormGroup>
                <Label for="templateFilePath">Template File Path (URL):</Label>
                <Input
                  type="text"
                  id="templateFilePath"
                  value={templateFilePath || `http://localhost:8080/api/templates/${createTemplateName}`}
                  onChange={(e) => setTemplateFilePath(e.target.value)}
                  required
                  readOnly
                />
                {errors.templateFilePath && <div className="text-danger">{errors.templateFilePath}</div>}
              </FormGroup>
              <FormGroup>
                <Label for="templateImage">Upload Template Image:</Label>
                <Input
                  type="file"
                  id="templateImage"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                />
                {errors.templateImage && <div className="text-danger">{errors.templateImage}</div>}
              </FormGroup>
              <Button color="primary" onClick={handleCreate} disabled={loadingCreate || createButtonDisabled}>
                {loadingCreate ? 'Creating...' : 'Create Template'}
              </Button>
            </Form>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateForm;
