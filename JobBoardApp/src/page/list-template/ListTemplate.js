import React, { useEffect, useState } from 'react';
import { GlobalLayoutUser } from '../../components/global-layout-user/GlobalLayoutUser';
import axiosRequest from '../../configs/axiosConfig';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/list-template.css';
import DialogBox from '../../components/dialog-box/Dialogbox';
import CVSelectionDialog from '../../components/dialog-box/CvSelectionDialog';

const ListTemplate = () => {
  const [templates, setTemplates] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userCVs, setUserCVs] = useState([]);
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [showCVSelectionDialog, setShowCVSelectionDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const templatesPerPage = 6;

  const fetchTemplates = async () => {
    try {
      const response = await axiosRequest.get('/templates/list-template');
      setTemplates(response);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const fetchUserCVs = async () => {
    try {
      const response = await axiosRequest.get(`/usercv/list-cvs/${user.id}`);
      setUserCVs(response);
    } catch (error) {
      console.error('Error fetching user CVs:', error);
      setUserCVs([]);
    }
  };

  useEffect(() => {
    fetchTemplates();
    if (user) {
      fetchUserCVs();
    }
  }, [user]);

  const sortTemplates = (order) => {
    const sortedTemplates = [...templates].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setTemplates(sortedTemplates);
    setSortOrder(order);
  };

  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
  };
  const filteredTemplates = templates.filter((template) =>
    template.templateName.toLowerCase().includes(searchQuery.toLowerCase()) && !template.disabled
  );
  const indexOfLastTemplate = currentPage * templatesPerPage;
  const indexOfFirstTemplate = indexOfLastTemplate - templatesPerPage;
  const currentTemplates = filteredTemplates.slice(indexOfFirstTemplate, indexOfLastTemplate);

  const totalPages = Math.ceil(filteredTemplates.length / templatesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handleTemplateClick = async (templateId, templateName, disabled) => {
    if (disabled) {
      alert('This template is expired and cannot be used.');
      return;
    }

    if (!user) {
      setShowDialog(true);
      return;
    }

    if (userCVs.length === 0) {
      alert('Please create a CV before choosing a template');
      return;
    }

    if (userCVs.length === 1) {
      selectTemplateAndNavigate(templateId, templateName, userCVs[0].cvId);
    } else {
      setSelectedTemplate({ templateId, templateName });
      setShowCVSelectionDialog(true);
    }
  };

  const selectTemplateAndNavigate = async (templateId, templateName, cvId) => {
    try {
      await axiosRequest.put('/templates/select-template', null, {
        params: {
          userId: user.id,
          cvId: cvId,
          templateId: templateId,
        }
      });
     navigate(`/review-template/${templateName}/${user.id}/${cvId}/${templateId}`);
    } catch (error) {
      console.error('Error selecting template:', error);
    }
  };

  const handleCVSelection = (cvId) => {
    setShowCVSelectionDialog(false);
    if (selectedTemplate) {
      selectTemplateAndNavigate(selectedTemplate.templateId, selectedTemplate.templateName, cvId);
    }
  };

   

  return (
    <GlobalLayoutUser>
      <section
        className="section-hero overlay inner-page bg-image"
        style={{ backgroundImage: 'url("../../../assets/images/hero_1.jpg")' }}
        id="createCv-section"
      >
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <h1 className="text-white font-weight-bold">List Template</h1>
              <div className="custom-breadcrumbs">
                <a href="#">Home</a> <span className="mx-2 slash">/</span>
                <span className="text-white">
                  <strong>List Template</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-5 bg-image overlay-primary fixed overlay"
        style={{
          backgroundImage: 'url("../../../assets/images/hero_1.jpg")',
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h2 className="text-white">You are struggling with prepare a CV?</h2>
              <p className="mb-0 text-white lead">
                Scroll down and fill up the form below to create your CV.
              </p>
            </div>
            <div className="col-md-3 ml-auto">
              <a href="#" className="btn btn-warning btn-block btn-lg">
                Or sign up for free
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="template-section">
        <div className="container">
          <div className="row border-css">
            <div className="col-md-12 mb-4">
              <h3 className="text-css">Choose your template</h3>
              <div className="filter-toggle" onClick={handleFilterToggle}>
                <i className="fas fa-filter filter-icon"></i> Filters
              </div>
              {showFilters && (
                <div className="filter-dropdown">
                  <div className="sort-buttons">
                    <button
                      className={`btn ${sortOrder === 'asc' ? 'active' : ''}`}
                      onClick={() => sortTemplates('asc')}
                    >
                      Oldest First
                    </button>
                    <button
                      className={`btn ${sortOrder === 'desc' ? 'active' : ''}`}
                      onClick={() => sortTemplates('desc')}
                    >
                      Latest First
                    </button>
                  </div>
                  <div className="search-bar">
                    <input
                      type="text"
                      placeholder="Search templates..."
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                  </div>
                </div>
              )}
            </div>
            {currentTemplates.length > 0 ? (
              currentTemplates.map((template) => (
                <div key={template.templateId} className="col-md-4 mb-4">
                  <div
                    className="template-card"
                    onClick={() => handleTemplateClick(template.templateId, template.templateName, template.disabled)}
                  >
                    {template.templateImageBase64 ? (
                      <>
                        <img
                          className="template-image"
                          src={`data:image/${template.fileExtension};base64,${template.templateImageBase64}`}
                          alt={template.templateName}
                        />
                        <div className="template-details">
                          <span className="template-title">{template.templateName}</span>
                          <span className="template-date"> <strong>Created: {new Date(template.createdAt).toLocaleDateString()}</strong>
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="placeholder-image">No Image Available</div>
                    )}
                  </div>

                </div>
              ))
            ) : (
              <div className="text-center">No templates found</div>
            )}
            </div>
          <div className="pagination">
              <button onClick={handlePrevious} className="page-link" disabled={currentPage === 1}>
                Previous
              </button>
              <span className="page-number">
                {currentPage}/{totalPages}
              </span>
              <button onClick={handleNext} className="page-link" disabled={currentPage === totalPages}>
                Next
              </button>
            </div>
        </div>
      </section>
      <DialogBox isOpen={showDialog} onClose={handleDialogClose} />
      <CVSelectionDialog
        isOpen={showCVSelectionDialog}
        onClose={() => setShowCVSelectionDialog(false)}
        cvs={userCVs}
        onSelect={handleCVSelection}
      />
    </GlobalLayoutUser>
  );
};

export default ListTemplate;
