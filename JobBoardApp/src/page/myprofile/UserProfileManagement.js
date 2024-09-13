import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaCalendar, FaMapMarkerAlt, FaLink, FaPlus, FaExternalLinkAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { fetchUserThunk, fetchEducationThunk, fetchSkillsThunk, fetchProjectsThunk, fetchLanguageThunk, fetchExperienceThunk } from "../../features/userSlice";
import { fetchCertificatesByUserIdThunk, createCertificateThunk, updateCertificateThunk, deleteCertificateThunk } from "../../features/certificateSlice";
import MyProfile from './myprofile';
import { jwtDecode } from 'jwt-decode';
import PDFViewer from 'pdf-viewer-reactjs';
import axiosRequest from '../../configs/axiosConfig';
import axios from 'axios';
import "./pdf-viewer.css";
import { Margin, Padding } from '@mui/icons-material';
const UserProfileManagement = () =>
{
  const [activeTab, setActiveTab] = useState('profile');
  const [showAddCertificateModal, setShowAddCertificateModal] = useState(false);
  const [showEditCertificateModal, setShowEditCertificateModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [pdfLink, setPdfLink] = useState('');
  const [showPdfModal, setShowPdfModal] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const [loggedIn, setLoggedIn] = useState(false);

  const [newCertificate, setNewCertificate] = useState({
    name: '',
    organization: '',
    issueDate: '',
    link: '',
    description: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const certificates = useSelector((state) => state.certificates.certificates) || [];
  const education = useSelector((state) => state.user.education) || [];
  const skills = useSelector((state) => state.user.skills) || [];
  const projects = useSelector((state) => state.user.projects) || [];
  const languages = useSelector((state) => state.user.languages) || [];
  const experiences = useSelector((state) => state.user.experiences) || [];
  const loading = useSelector((state) => state.certificates.loading);
  const error = useSelector((state) => state.certificates.error);
  const educationLoading = useSelector((state) => state.user.educationStatus) === 'loading';
  const educationError = useSelector((state) => state.user.educationError);
  const skillsLoading = useSelector((state) => state.user.skillsStatus) === 'loading';
  const skillsError = useSelector((state) => state.user.skillsError);
  const projectLoading = useSelector((state) => state.user.projectsStatus) === 'loading';
  const projectError = useSelector((state) => state.user.projectsError);
  const languageLoading = useSelector((state) => state.user.languageStatus) === 'loading';
  const languageError = useSelector((state) => state.user.languageError);
  const experienceLoading = useSelector((state) => state.user.experienceStatus) === 'loading';
  const experienceError = useSelector((state) => state.user.experienceError);
  const [pdfContent, setPdfContent] = useState(null);
  const [pdfError, setPdfError] = useState(null);

  useEffect(() =>
  {
    const token = localStorage.getItem("accessToken");
    if (!token)
    {
      navigate("/login");
    } else
    {
      const decodedToken = jwtDecode(token);
      const username = decodedToken.sub;
      setLoggedIn(true);
      dispatch(fetchUserThunk({ username, token }));
    }
  }, [dispatch, navigate]);


  useEffect(() =>
  {
    if (user?.id)
    {
      dispatch(fetchCertificatesByUserIdThunk(user.id));
      dispatch(fetchEducationThunk(user.id));
      dispatch(fetchSkillsThunk(user.id));
      dispatch(fetchProjectsThunk(user.id));
      dispatch(fetchLanguageThunk(user.id));
      dispatch(fetchExperienceThunk(user.id));

    }
  }, [dispatch, user?.id]);

  useEffect(() =>
  {
    console.log('Languages:', languages);
  }, [languages]);

  const handleManageCVClick = () =>
  {
    navigate('/list-template');
  };

  const handleMyprofile = () =>
  {
    navigate('/myprofile');
  };

  const handleAddCertificate = () =>
  {
    dispatch(createCertificateThunk({ ...newCertificate, userId: user.id }));
    setNewCertificate({ name: '', organization: '', issueDate: '', link: '', description: '' });
    setShowAddCertificateModal(false);
  };

  const handleUpdateCertificate = () =>
  {
    if (selectedCertificate)
    {
      dispatch(updateCertificateThunk({ id: selectedCertificate.id, certificateDTO: newCertificate }));
      setSelectedCertificate(null);
      setNewCertificate({ name: '', organization: '', issueDate: '', link: '', description: '' });
      setShowEditCertificateModal(false);
    }
  };

  const handleDeleteCertificate = (id) =>
  {
    dispatch(deleteCertificateThunk(id));
  };

  const handleModalChange = (e) =>
  {
    setNewCertificate({
      ...newCertificate,
      [e.target.name]: e.target.value,
    });
  };
  const handleViewPdf = (filename) =>
  {
    navigate(`/view-pdf/${filename}`);
  };



  useEffect(() =>
  {
    return () =>
    {
      if (pdfLink)
      {
        URL.revokeObjectURL(pdfLink);
      }
    };
  }, [pdfLink]);

  return (
    <Container fluid>
      {/* Breadcrumb Navigation */}
      <Row className="mt-3">
        <Col>
          <nav aria-label="breadcrumb" className="main-breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item active" aria-current="page">User</li>
            </ol>
          </nav>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col md={3}>
          <Card className="profile-summary-card">
            <Card.Body>
              <div className="text-center">
                <div className="profile-image-container">
                  <img
                    src={user?.imageUrl || "https://bootdey.com/img/Content/avatar/avatar6.png"}
                    alt="Profile"
                    className="profile-image"
                  />
                </div>
                <h5 className="mt-3">{`${user?.firstName || ''} ${user?.lastName || ''}`}</h5>
                <p className="text-muted">{user?.bio || "No bio available"}</p>
              </div>
            </Card.Body>
          </Card>

          <Card className="mt-3">
            <Card.Body>
              <h5>Select a CV template and download</h5>
              <Button variant="danger" className="w-100" onClick={handleManageCVClick}>View and Download CV</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={9}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>{activeTab === 'profile' ? 'Personal Information' : 'Manage CV'}</h4>
                <div>
                  <Button
                    variant="outline-success"
                    className="me-2"
                    active={activeTab === 'profile'}
                    onClick={() => setActiveTab('profile')}
                  >
                    Profile
                  </Button>
                  <Button
                    variant="outline-success"
                    active={activeTab === 'manage'}
                    onClick={() =>
                    {
                      setActiveTab('manage');
                      handleMyprofile(); // Trigger navigation
                    }}
                  >
                    Manage Profile
                  </Button>
                </div>
              </div>

              {activeTab === 'profile' ? (
                <Form>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}><FaUser /> Full Name</Form.Label>
                    <Col sm={9}>
                      <Form.Control type="text" value={`${user?.firstName || ''} ${user?.lastName || ''}`} readOnly />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}><FaEnvelope /> Email</Form.Label>
                    <Col sm={9}>
                      <Form.Control type="email" value={user?.email || ''} readOnly />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}><FaCalendar /> Date of Birth</Form.Label>
                    <Col sm={9}>
                      <Form.Control type="date" value={user?.dateOfBirth || ''} readOnly />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}><FaMapMarkerAlt /> Current Address</Form.Label>
                    <Col sm={9}>
                      <Form.Control type="text" value={user?.currentAddress || ''} readOnly />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}><FaLink /> Personal Link</Form.Label>
                    <Col sm={9}>
                      <Form.Control type="text" value={user?.facebook || ''} readOnly />
                    </Col>
                  </Form.Group>
                </Form>
              ) : (
                <MyProfile />
              )}
            </Card.Body>
          </Card>

          {/* Certificate Management */}
          <Card className="mt-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Certificates</h4>
                <Button variant="outline-primary" onClick={() => setShowAddCertificateModal(true)}>
                  <FaPlus /> Add Certificate
                </Button>
              </div>
              {loading && <p>Loading certificates...</p>}
              {error && <p>Error fetching certificates: {error}</p>}
              {certificates.length === 0 ? (
                <p>No certificates found</p>
              ) : (
                <ul className="list-unstyled">
                  {certificates.map((certificate) => (
                    <li key={certificate.id} className="mb-3">
                      <Card>
                        <Card.Body>
                          <h5>{certificate.name}</h5>
                          <p>Organization: {certificate.organization}</p>
                          <p>Issue Date: {new Date(certificate.issueDate).toLocaleDateString()}</p>
                          <p>
                            {certificate.source === 'quiz' ? (
                              <>
                                <Button
                                  variant="outline-info"
                                  onClick={() => handleViewPdf(certificate.link)}
                                  aria-label={`View PDF of ${certificate.name}`}
                                >
                                  View PDF
                                </Button>
                              </>
                            ) : (
                              <>
                                Link:
                                <a
                                  href={certificate.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`View Certificate ${certificate.name}`}
                                >
                                  {certificate.link}
                                </a>
                              </>
                            )}
                          </p>
                          <p>Description: {certificate.description}</p>
                          <Button
                            variant="outline-success"
                            className="me-2"
                            onClick={() =>
                            {
                              setSelectedCertificate(certificate);
                              setShowEditCertificateModal(true);
                            }}
                            aria-label={`Edit ${certificate.name}`}
                          >
                            <FaEdit /> Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            onClick={() => handleDeleteCertificate(certificate.id)}
                            aria-label={`Delete ${certificate.name}`}
                          >
                            <FaTrash /> Delete
                          </Button>
                        </Card.Body>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>

          {/* Languages Section */}
          <Card className="mt-3">
            <Card.Body>
              <h4>Languages</h4>
              {languageLoading && <p>Loading Languages...</p>}
              {languageError && <p>Error fetching Languages: {languageError}</p>}
              {languages.length === 0 ? (
                <p>No language records found</p>
              ) : (
                <ul className="list-unstyled">
                  {languages.map((language) => (
                    <li key={language.languageId} className="mb-3">
                      <Card>
                        <Card.Body>
                          <h5>{language.languageName}</h5>
                          <p>Proficiency: {language.proficiency}</p>
                        </Card.Body>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>

          {/* Education Section */}
          <Card className="mt-3">
            <Card.Body>
              <h4>Education</h4>
              {educationLoading && <p>Loading Education...</p>}
              {educationError && <p>Error fetching Education: {educationError}</p>}
              {education.length === 0 ? (
                <p>No education records found</p>
              ) : (
                <ul className="list-unstyled">
                  {education.map((edu) => (
                    <li key={edu.id} className="mb-3">
                      <Card>
                        <Card.Body>
                          <h5>{edu.institutionName}</h5>
                          <p>Degree: {edu.degree}</p>
                          <p>School: {edu.institution}</p>
                          <p>Description: {edu.description}</p>
                          <p>Start Date: {new Date(edu.startDate).toLocaleDateString()}</p>
                          <p>End Date: {new Date(edu.endDate).toLocaleDateString()}</p>

                        </Card.Body>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>

          {/* Skills Section */}
          <Card className="mt-3">
            <Card.Body>
              <h4>Skills</h4>
              {skillsLoading && <p>Loading Skills...</p>}
              {skillsError && <p>Error fetching Skills: {skillsError}</p>}
              {skills.length === 0 ? (
                <p>No skill records found</p>
              ) : (
                <ul className="list-unstyled">
                  {skills.map((skill) => (
                    <li key={skill.id} className="mb-3">
                      <Card>
                        <Card.Body>
                          <h5>{skill.skillName}</h5>
                          <p>Proficiency: {skill.proficiency}</p>
                        </Card.Body>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>

          {/* Projects Section */}
          <Card className="mt-3">
            <Card.Body>
              <h4>Projects</h4>
              {projectLoading && <p>Loading Projects...</p>}
              {projectError && <p>Error fetching Projects: {projectError}</p>}
              {projects.length === 0 ? (
                <p>No project records found</p>
              ) : (
                <ul className="list-unstyled">
                  {projects.map((project) => (
                    <li key={project.id} className="mb-3">
                      <Card>
                        <Card.Body>
                          <h5>{project.projectName}</h5>
                          <p>Description: {project.description}</p>
                          <p>Link: <a href={project.link} target="_blank" rel="noopener noreferrer">{project.link}</a></p>
                        </Card.Body>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>

          <Card className="mt-3">
            <Card.Body>
              <h4>Experience</h4>
              {experienceLoading && <p>Loading experience...</p>}
              {experienceError && <p>Error fetching experience: {experienceError}</p>}
              {experiences.length === 0 ? (
                <p>No experience records found</p>
              ) : (
                <ul className="list-unstyled">
                  {experiences.map((experience) => (
                    <li key={experience.id} className="mb-3">
                      <Card>
                        <Card.Body>
                          <h5>{experience.jobTitle}</h5>
                          <p>Company: {experience.company}</p>
                          <p>Description: {experience.description}</p>
                          <p>Start Date: {new Date(experience.startDate).toLocaleDateString()}</p>
                          <p>End Date: {new Date(experience.endDate).toLocaleDateString()}</p>
                        </Card.Body>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>


      {/* Add Certificate Modal */}
      <Modal show={showAddCertificateModal} onHide={() => setShowAddCertificateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Certificate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="certificateName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newCertificate.name}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group controlId="certificateOrganization" className="mt-3">
              <Form.Label>Organization</Form.Label>
              <Form.Control
                type="text"
                name="organization"
                value={newCertificate.organization}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group controlId="certificateIssueDate" className="mt-3">
              <Form.Label>Issue Date</Form.Label>
              <Form.Control
                type="date"
                name="issueDate"
                value={newCertificate.issueDate}
                onChange={handleModalChange}
                max={today}
              />
            </Form.Group>
            <Form.Group controlId="certificateLink" className="mt-3">
              <Form.Label>Link</Form.Label>
              <Form.Control
                type="text"
                name="link"
                value={newCertificate.link}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group controlId="certificateDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newCertificate.description}
                onChange={handleModalChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddCertificateModal(false)}>Close</Button>
          <Button variant="primary" onClick={() => handleAddCertificate(newCertificate)}>Add Certificate</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Certificate Modal */}
      <Modal show={showEditCertificateModal} onHide={() => setShowEditCertificateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Certificate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editCertificateName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newCertificate.name}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group controlId="editCertificateOrganization" className="mt-3">
              <Form.Label>Organization</Form.Label>
              <Form.Control
                type="text"
                name="organization"
                value={newCertificate.organization}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group controlId="editCertificateIssueDate" className="mt-3">
              <Form.Label>Issue Date</Form.Label>
              <Form.Control
                type="date"
                name="issueDate"
                value={newCertificate.issueDate}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group controlId="editCertificateLink" className="mt-3">
              <Form.Label>Link</Form.Label>
              <Form.Control
                type="text"
                name="link"
                value={newCertificate.link}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group controlId="editCertificateDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newCertificate.description}
                onChange={handleModalChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditCertificateModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleUpdateCertificate}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showPdfModal}
        onHide={() => setShowPdfModal(false)}
        dialogClassName="modal-100w"
        contentClassName="h-100"
      >
        <Modal.Body className="p-0">
          {pdfError ? (
            <p>{pdfError}</p>
          ) : (
            <PDFViewer
              document={{ url: pdfLink }}
              scale={1.5}
              css={{
                width: '100%',
                height: '100vh',
                maxHeight: '100vh',
                display: 'flex',
                flexDirection: 'column'
              }}
            />
          )}
        </Modal.Body>
      </Modal>

    </Container>
  );
};

export default UserProfileManagement;
