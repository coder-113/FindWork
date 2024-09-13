import React, { useState, useEffect } from 'react';
import '../../assets/css/create-cv.css';
import axiosRequest from "../../configs/axiosConfig";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const CreateCV = () => {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const [cvTitle, setCvTitle] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [userDetails, setUserDetails] = useState([{ fullName: '', address: '', email: '', phone: '', summary: '', profileImage: '', dob: '' }]);
    const [userEducations, setUserEducations] = useState([{ institution: '', degree: '', description: '', startDate: '', endDate: '' }]);
    const [userExperiences, setUserExperiences] = useState([{ jobTitle: '', company: '', description: '', startDate: '', endDate: '' }]);
    const [userLanguages, setUserLanguages] = useState([{ languageName: '', proficiency: '' }]);
    const [userProjects, setUserProjects] = useState([{ projectName: '', description: '', startDate: '', endDate: '' }]);
    const [userSkills, setUserSkills] = useState([{ skillName: '', proficiency: '' }]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const user = useSelector(state => state.auth.user)
    const [existingCVs, setExistingCVs] = useState([]);
    const [errors, setErrors] = useState({
        userDetails: [],
        userEducations: [],
        userExperiences: [],
        userLanguages: [],
        userProjects: [],
        userSkills: [],
        cvTitle: '',
    });

    useEffect(() => {
        const fetchExistingCVs = async () => {
            try {
                const response = await axiosRequest.get(`/usercv/list-cvs/${user.id}`);
                setExistingCVs(response);
            } catch (error) {
                console.error('Error fetching existing CVs:', error);
            }
        };

        fetchExistingCVs();
        const fetchUserDetails = async () => {
            try {
                const response = await axiosRequest.get(`/user/${user.sub}`);
                setUserDetails([{
                    ...userDetails[0],
                    fullName: response.firstName || '',
                    email: response.email || ''
                }]);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, [user.id, user.sub]);

    const handleInputChange = (e, index, field, section) => {
        const { value } = e.target;
        const updateState = (prevState) => {
            const newState = [...prevState];
            newState[index][field] = value;
            return newState;
        };

        switch (section) {
            case 'userDetails':
                setUserDetails(updateState);
                break;
            case 'userEducations':
                setUserEducations(updateState);
                break;
            case 'userExperiences':
                setUserExperiences(updateState);
                break;
            case 'userLanguages':
                setUserLanguages(updateState);
                break;
            case 'userProjects':
                setUserProjects(updateState);
                break;
            case 'userSkills':
                setUserSkills(updateState);
                break;
            default:
                break;
        }
    };

    const handleCloneCV = async (e) => {
        const selectedCVId = e.target.value;
        console.log('Selected CV ID:', selectedCVId);

        if (selectedCVId) {
            try {
                const response = await axiosRequest.get(`/usercv/${selectedCVId}`);
                const formattedResponse = {
                    ...response,
                    userDetails: response.userDetails.map(detail => ({
                        ...detail,
                        dob: detail.dob ? new Date(detail.dob).toISOString().split('T')[0] : ''
                    }))
                };
                const cvData = formattedResponse;
                console.log('Cloned CV Data:', cvData);

                setCvTitle(cvData.cvTitle ? cvData.cvTitle + ' (Copy)' : 'Cloned CV');
                setUserDetails(cvData.userDetails.map(detail => ({
                    ...detail,
                    dob: detail.dob || '', // Keep the date as a string in 'YYYY-MM-DD' format
                    profileImage: null,
                    profileImageUrl: detail.profileImageBase64,
                    profileImageBase64: detail.profileImageBase64
                })));

                setUserEducations(Array.isArray(cvData.userEducations) ? cvData.userEducations : []);
                setUserExperiences(Array.isArray(cvData.userExperiences) ? cvData.userExperiences : []);
                setUserLanguages(Array.isArray(cvData.userLanguages) ? cvData.userLanguages : []);
                setUserProjects(Array.isArray(cvData.userProjects) ? cvData.userProjects : []);
                setUserSkills(Array.isArray(cvData.userSkills) ? cvData.userSkills : []);

                // Set image preview if available
                if (cvData.userDetails[0].profileImageUrl) {
                    setImagePreview(cvData.userDetails[0].profileImageUrl);
                }

                // Reset the select element
                e.target.value = '';

                console.log('CV cloned successfully');
            } catch (error) {
                console.error('Error cloning CV:', error);
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setUserDetails(prevDetails => [{
                    ...prevDetails[0],
                    profileImage: file,
                    profileImageBase64: null
                }]);
            };
            reader.readAsDataURL(file);
        } else {
            // If no new file is selected, retain the existing image
            setImagePreview(null);
            setUserDetails(prevDetails => [{
                ...prevDetails[0],
                profileImage: null,
                profileImageBase64: prevDetails[0].profileImageBase64
            }]);
        }
    };


    const is18OrOlder = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= 18;
    };


    const SuccessModal = ({ show, onClose, onTemplate }) => {
        const [countdown, setCountdown] = useState(10);

        useEffect(() => {
            if (show) {
                const timer = setInterval(() => {
                    setCountdown((prevCount) => {
                        if (prevCount === 1) {
                            clearInterval(timer);
                            onClose();
                        }
                        return prevCount - 1;
                    });
                }, 1000);

                return () => clearInterval(timer);
            }
        }, [show, onClose]);

        if (!show) return null;

        return (
            <div className="custom-modal">
                <div className="modal-content">
                    <h2>CV Created Successfully!</h2>
                    <p>Choose "View Templates" to select a CV template and print it to PDF, or stay on this page.</p>
                    <div className="modal-buttons">
                        <button onClick={() => {
                            onClose();
                            window.location.reload();
                        }}>Stay here</button>

                        <button onClick={onTemplate}>View Templates</button>
                    </div>
                    <div className="countdown">
                        Closing in <i className='text-danger'>{countdown}</i> seconds
                    </div>
                </div>
            </div>
        );
    };

    const addNewEntry = (section) => {
        const isValid = validateFields(section, cvTitle, userDetails, userEducations, userExperiences, userLanguages, userProjects, userSkills);
        if (isValid) {
            switch (section) {
                case 'userEducations':
                    setUserEducations((prevEducations) => [...prevEducations, { institution: '', degree: '', description: '', startDate: '', endDate: '' }]);
                    break;
                case 'userExperiences':
                    setUserExperiences((prevExperiences) => [...prevExperiences, { jobTitle: '', company: '', description: '', startDate: '', endDate: '' }]);
                    break;
                case 'userLanguages':
                    setUserLanguages((prevLanguages) => [...prevLanguages, { languageName: '', proficiency: '' }]);
                    break;
                case 'userProjects':
                    setUserProjects((prevProjects) => [...prevProjects, { projectName: '', description: '', startDate: '', endDate: '' }]);
                    break;
                case 'userSkills':
                    setUserSkills((prevSkills) => [...prevSkills, { skillName: '', proficiency: '' }]);
                    break;
                default:
                    break;
            }
        }
    };


    const removeEntry = (index, section) => {
        switch (section) {
            case 'userEducations':
                setUserEducations((prevEducations) => prevEducations.filter((_, i) => i !== index));
                break;
            case 'userExperiences':
                setUserExperiences((prevExperiences) => prevExperiences.filter((_, i) => i !== index));
                break;
            case 'userLanguages':
                setUserLanguages((prevLanguages) => prevLanguages.filter((_, i) => i !== index));
                break;
            case 'userProjects':
                setUserProjects((prevProjects) => prevProjects.filter((_, i) => i !== index));
                break;
            case 'userSkills':
                setUserSkills((prevSkills) => prevSkills.filter((_, i) => i !== index));
                break;
            default:
                break;
        }
    };

    const validateFields = (section, cvTitle, userDetails, userEducations, userExperiences, userLanguages, userProjects, userSkills) => {
        let sectionErrors = [];

        switch (section) {
            case 'cvTitle':
                if (!cvTitle || cvTitle.trim().length === 0) {
                    sectionErrors.push('CV Title is required');
                } else if (cvTitle.length < 3) {
                    sectionErrors.push('CV Title must be at least 3 characters long');
                }
                break;
            case 'userDetails':
                userDetails.forEach((detail, index) => {
                    let detailErrors = {};

                    if (!detail.fullName) detailErrors.fullName = "Full Name is required";
                    if (!detail.address) detailErrors.address = "Address is required";
                    if (!detail.dob) {
                        detailErrors.dob = "Date of Birth is required";
                    } else if (!is18OrOlder(detail.dob)) {
                        detailErrors.dob = "User must be 18 years or older";
                    }
                    if (!detail.summary) detailErrors.summary = "Summary is required";

                    if (!detail.email) {
                        detailErrors.email = "Email is required";
                    } else if (!/\S+@\S+\.\S+/.test(detail.email)) {
                        detailErrors.email = "Email format is invalid. Please use a valid email address.";
                    }

                    if (!detail.phone) {
                        detailErrors.phone = "Phone number is required";
                    } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(detail.phone)) {
                        detailErrors.phone = "Phone number format is invalid. Use format: (123) 456-7890 or 123-456-7890";
                    }

                    if (!detail.profileImage && !detail.profileImageBase64) {
                        detailErrors.profileImage = "Profile image is required";
                    }

                    if (Object.keys(detailErrors).length > 0) {
                        sectionErrors[index] = detailErrors;
                    }
                });
                break;
            case 'userEducations':
                userEducations.forEach((education, index) => {
                    let educationErrors = {};
                    if (!education.institution) educationErrors.institution = "Institution is required";
                    if (!education.degree) educationErrors.degree = "Degree is required";
                    if (!education.description) educationErrors.description = "Description is required";
                    if (!education.startDate) educationErrors.startDate = "Start date is required";
                    if (!education.endDate) educationErrors.endDate = "End date is required";

                    if (education.startDate && education.endDate) {
                        const startDate = new Date(education.startDate);
                        const endDate = new Date(education.endDate);
                        if (startDate > endDate) {
                            educationErrors.dateRange = "Start date must be earlier than end date";
                        }
                    }

                    if (Object.keys(educationErrors).length > 0) {
                        sectionErrors[index] = educationErrors;
                    }
                });
                break;

            case 'userExperiences':
                userExperiences.forEach((experience, index) => {
                    let experienceErrors = {};
                    if (!experience.jobTitle) experienceErrors.jobTitle = "Job title is required";
                    if (!experience.company) experienceErrors.company = "Company is required";
                    if (!experience.description) experienceErrors.description = "Description is required";
                    if (!experience.startDate) experienceErrors.startDate = "Start date is required";
                    if (!experience.endDate) experienceErrors.endDate = "End date is required";

                    if (experience.startDate && experience.endDate) {
                        const startDate = new Date(experience.startDate);
                        const endDate = new Date(experience.endDate);
                        if (startDate > endDate) {
                            experienceErrors.dateRange = "Start date must be earlier than end date";
                        }
                    }

                    if (Object.keys(experienceErrors).length > 0) {
                        sectionErrors[index] = experienceErrors;
                    }
                });
                break;

            case 'userLanguages':
                userLanguages.forEach((language, index) => {
                    let languageErrors = {};
                    if (!language.languageName) languageErrors.languageName = "Language name is required";
                    if (!language.proficiency) languageErrors.proficiency = "Proficiency is required";

                    if (Object.keys(languageErrors).length > 0) {
                        sectionErrors[index] = languageErrors;
                    }
                });
                break;

            case 'userProjects':
                userProjects.forEach((project, index) => {
                    let projectErrors = {};
                    if (!project.projectName) projectErrors.projectName = "Project name is required";
                    if (!project.description) projectErrors.description = "Description is required";
                    if (!project.startDate) projectErrors.startDate = "Start date is required";
                    if (!project.endDate) projectErrors.endDate = "End date is required";

                    if (project.startDate && project.endDate) {
                        const startDate = new Date(project.startDate);
                        const endDate = new Date(project.endDate);
                        if (startDate > endDate) {
                            projectErrors.dateRange = "Start date must be earlier than end date";
                        }
                    }

                    if (Object.keys(projectErrors).length > 0) {
                        sectionErrors[index] = projectErrors;
                    }
                });
                break;

            case 'userSkills':
                userSkills.forEach((skill, index) => {
                    let skillErrors = {};
                    if (!skill.skillName) skillErrors.skillName = "Skill name is required";
                    if (!skill.proficiency) skillErrors.proficiency = "Proficiency is required";

                    if (Object.keys(skillErrors).length > 0) {
                        sectionErrors[index] = skillErrors;
                    }
                });
                break;

            default:
                break;

        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [section]: sectionErrors,
        }));

        return sectionErrors.length === 0;
    };

    const handleContinue = () => {
        const currentSection = step === 1 ? 'cvTitle' : step === 2 ? 'userDetails' : step === 3 ? 'userEducations' : step === 4 ? 'userExperiences' : step === 5 ? 'userLanguages' : step === 6 ? 'userProjects' : step === 7 ? 'userSkills' : null;
        const isValid = validateFields(currentSection, cvTitle, userDetails, userEducations, userExperiences, userLanguages, userProjects, userSkills);

        if (isValid) {
            setStep(step + 1);
        }
    };

    const handleGoBack = () => {
        setStep(step - 1);
    };


    // console.log(user)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const params = new FormData();
            params.append('cvTitle', cvTitle);
            params.append('user.id', user.id);

            // User Details
            userDetails.forEach((detail, index) => {
                const prefix = `userDetails[${index}]`;
                params.append(`${prefix}.fullName`, detail.fullName);
                params.append(`${prefix}.address`, detail.address);
                params.append(`${prefix}.email`, detail.email);
                params.append(`${prefix}.phone`, detail.phone);
                params.append(`${prefix}.summary`, detail.summary);

                if (detail.dob) {
                    const dobTimestamp = new Date(detail.dob).getTime();
                    params.append('dob', dobTimestamp.toString());
                }

                if (detail.profileImage instanceof File) {
                    params.append('profileImage', detail.profileImage);
                } else if (detail.profileImageBase64) {
                    const byteCharacters = atob(detail.profileImageBase64);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: 'image/jpeg' });
                    params.append('profileImage', blob, 'profile.jpg');
                }
            });


            userEducations.forEach((education, index) => {
                const prefix = `userEducations[${index}]`;
                params.append(`${prefix}.institution`, education.institution);
                params.append(`${prefix}.degree`, education.degree);
                params.append(`${prefix}.description`, education.description);
                params.append(`${prefix}.startDate`, education.startDate);
                params.append(`${prefix}.endDate`, education.endDate);
            });
            userExperiences.forEach((experience, index) => {
                const prefix = `userExperiences[${index}]`;
                params.append(`${prefix}.jobTitle`, experience.jobTitle);
                params.append(`${prefix}.company`, experience.company);
                params.append(`${prefix}.description`, experience.description);
                params.append(`${prefix}.startDate`, experience.startDate);
                params.append(`${prefix}.endDate`, experience.endDate);
            });
            userLanguages.forEach((language, index) => {
                const prefix = `userLanguages[${index}]`;
                params.append(`${prefix}.languageName`, language.languageName);
                params.append(`${prefix}.proficiency`, language.proficiency);
            });
            userProjects.forEach((project, index) => {
                const prefix = `userProjects[${index}]`;
                params.append(`${prefix}.projectName`, project.projectName);
                params.append(`${prefix}.description`, project.description);
                params.append(`${prefix}.startDate`, project.startDate);
                params.append(`${prefix}.endDate`, project.endDate);
            });
            userSkills.forEach((skill, index) => {
                const prefix = `userSkills[${index}]`;
                params.append(`${prefix}.skillName`, skill.skillName);
                params.append(`${prefix}.proficiency`, skill.proficiency);
            });
            for (var pair of params.entries()) {
                console.log(pair[0] + ', ' + pair[1]);
            }
            const response = await axiosRequest.post('/usercv/submit-cv', params, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            setShowSuccessModal(true); // Handle success response
        } catch (error) {
            console.error(error); // Handle error
        }
    };

    return (
        <div className="container py-5">
            <SuccessModal
                show={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                onTemplate={() => navigate('/list-template')}
            />
            <div className="step-indicator">
                <div className={`step ${step >= 1 ? 'active' : ''}`}>
                    <span className="circle"></span>
                    <div className='text-indicator'>CV Title</div>
                </div>
                <div className={`step ${step >= 2 ? 'active' : ''}`}>
                    <span className="circle"></span>
                    <div className='text-indicator'>User Details</div>
                </div>
                <div className={`step ${step >= 3 ? 'active' : ''}`}>
                    <span className="circle"></span>
                    <div className='text-indicator'>Education</div>
                </div>
                <div className={`step ${step >= 4 ? 'active' : ''}`}>
                    <span className="circle"></span>
                    <div className='text-indicator'>Experiences</div>
                </div>
                <div className={`step ${step >= 5 ? 'active' : ''}`}>
                    <span className="circle"></span>
                    <div className='text-indicator'>Languages</div>
                </div>
                <div className={`step ${step >= 6 ? 'active' : ''}`}>
                    <span className="circle"></span>
                    <div className='text-indicator'>Projects</div>
                </div>
                <div className={`step ${step >= 7 ? 'active' : ''}`}>
                    <span className="circle"></span>
                    <div className='text-indicator'>Skills</div>
                </div>
            </div>
            <div className='cv-bg'>
                <h2 className='text-center'>
                    <span className='text-effect-css-create' style={{ '--animation-order': 0 }}>Please</span>{' '}
                    <span className='text-effect-css-create' style={{ '--animation-order': 1 }}>fill</span>{' '}
                    <span className='text-effect-css-create' style={{ '--animation-order': 2 }}>out</span>{' '}
                    <span className='text-effect-css-create' style={{ '--animation-order': 3 }}>these</span>{' '}
                    <span className='text-effect-css-create' style={{ '--animation-order': 4 }}>form</span>{' '}
                    <span className='text-effect-css-create' style={{ '--animation-order': 5 }}>before</span>{' '}
                    <span className='text-effect-css-create' style={{ '--animation-order': 6 }}>choose</span>{' '}
                    <span className='text-effect-css-create' style={{ '--animation-order': 7 }}>a</span>{' '}
                    <span className='text-effect-css-create' style={{ '--animation-order': 8 }}>CV</span>{' '}
                    <span className='text-effect-css-create' style={{ '--animation-order': 9 }}>template</span>
                </h2>

                <form onSubmit={handleSubmit} className="cv-form">
                    {/* Clone CV Dropdown */}
                    <div className="clone-cv-section">
                        <label htmlFor="cloneCV" className="clone-cv-label">
                            <i className="icon-copy i-cp-css"></i> <i>Clone existing CV:</i>
                        </label>

                        <select
                            id="cloneCV"
                            onChange={handleCloneCV}
                            className="clone-cv-select"
                        >
                            <option value="">Select a CV to clone</option>
                            {existingCVs.map(cv => (
                                <option key={cv.cvId} value={cv.cvId}>{cv.cvTitle}</option>
                            ))}
                        </select>
                    </div>

                    {/* CV Title */}
                    {step === 1 && (
                        <>
                            <h1 className="cv-section-title-create-css
                            ">Section 1: CV Title</h1>
                            <div className="cv-section">
                                <label htmlFor="cvTitle" className="cv-label">CV Title:</label>
                                <input
                                    type="text"
                                    id="cvTitle"
                                    value={cvTitle}
                                    onChange={(e) => setCvTitle(e.target.value)}
                                    required
                                    className="cv-input"
                                />
                                {errors.cvTitle && <div className="cv-error-message text-danger">{errors.cvTitle.join(', ')}</div>}
                            </div>
                            <div className="cv-button-group">
                                <button type="button" onClick={handleContinue} className="cv-continue-btn">
                                    Continue
                                </button>
                            </div>
                        </>
                    )}

                    {/* User Details */}
                    {step === 2 && (
                        <>

                            <h2 className="cv-section-title-create-css">Section 2: User Details</h2>
                            {userDetails.map((detail, index) => (
                                <div key={index} className="cv-entry">
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={detail.fullName}
                                        onChange={(e) => handleInputChange(e, index, 'fullName', 'userDetails')}
                                        required
                                        className="cv-input"
                                    />
                                    {errors.userDetails[index]?.fullName && <div className="cv-error-message text-danger">{errors.userDetails[index].fullName}</div>}

                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={detail.email}
                                        onChange={(e) => handleInputChange(e, index, 'email', 'userDetails')}
                                        required
                                        className="cv-input"
                                    />
                                    {errors.userDetails[index]?.email && <div className="cv-error-message text-danger">{errors.userDetails[index].email}</div>}

                                    <input
                                        type="text"
                                        placeholder="Address"
                                        value={detail.address}
                                        onChange={(e) => handleInputChange(e, index, 'address', 'userDetails')}
                                        required
                                        className="cv-input"
                                    />
                                    {errors.userDetails[index]?.address && <div className="cv-error-message text-danger">{errors.userDetails[index].address}</div>}

                                    <input
                                        type="date"
                                        placeholder="Date of Birth"
                                        value={detail.dob}
                                        onChange={(e) => handleInputChange(e, index, 'dob', 'userDetails')}
                                        required
                                        className="cv-input"
                                    />
                                    {errors.userDetails[index]?.dob && <div className="cv-error-message text-danger">{errors.userDetails[index].dob}</div>}

                                    <input
                                        type="tel"
                                        placeholder="Phone (Accept format: (123) 456-7890 || 123-456-7890 || 123.456.7890 || 1234567890)"
                                        value={detail.phone}
                                        onChange={(e) => handleInputChange(e, index, 'phone', 'userDetails')}
                                        required
                                        className="cv-input"
                                    />
                                    {errors.userDetails[index]?.phone && <div className="cv-error-message text-danger">{errors.userDetails[index].phone}</div>}

                                    <textarea
                                        rows="5" cols="55"
                                        type="text"
                                        placeholder="Summary"
                                        value={detail.summary}
                                        onChange={(e) => handleInputChange(e, index, 'summary', 'userDetails')}
                                        required
                                        className="cv-input"
                                    />
                                    {errors.userDetails[index]?.summary && <div className="cv-error-message text-danger">{errors.userDetails[index].summary}</div>}

                                    <label htmlFor={`profileImage-${index}`} className="cv-label">
                                        Profile Image
                                    </label>
                                    <div className="cv-image-preview">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Profile Preview" className="cv-preview-image" width={300} height={200} />
                                        ) : detail.profileImageBase64 ? (
                                            <img src={`data:image/jpeg;base64,${detail.profileImageBase64}`} alt="Current Profile" className="cv-preview-image" width={300} height={300} />
                                        ) : (
                                            <p>No image uploaded</p>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="cv-file-input"
                                    />
                                    {errors.userDetails[index]?.profileImage && <div className="cv-error-message text-danger">{errors.userDetails[index].profileImage}</div>}

                                    {userDetails.length > 1 && (
                                        <button type="button" onClick={() => removeEntry(index, 'userDetails')} className="cv-remove-btn">
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}

                            <div className="cv-button-group">
                                <button type="button" onClick={handleGoBack} className="cv-back-btn">
                                    Go Back
                                </button>
                                <button type="button" onClick={handleContinue} className="cv-continue-btn">
                                    Continue
                                </button>
                            </div>

                        </>
                    )}

                    {/* Education Section */}
                    {step === 3 && (
                        <>
                            <h2 className="cv-section-title-create-css">Section 3: Education</h2>
                            {userEducations.map((education, index) => (
                                <div key={index} className="cv-entry">
                                    <input
                                        type="text"
                                        placeholder="Institution"
                                        value={education.institution}
                                        onChange={(e) => handleInputChange(e, index, 'institution', 'userEducations')}
                                        required
                                        className="cv-input"
                                    />
                                    {errors.userEducations[index]?.institution && (
                                        <div className="cv-error-message text-danger">{errors.userEducations[index].institution}</div>
                                    )}

                                    <input
                                        type="text"
                                        placeholder="Degree"
                                        value={education.degree}
                                        onChange={(e) => handleInputChange(e, index, 'degree', 'userEducations')}
                                        required
                                        className="cv-input"
                                    />
                                    {errors.userEducations[index]?.degree && (
                                        <div className="cv-error-message text-danger">{errors.userEducations[index].degree}</div>
                                    )}

                                    <textarea
                                        rows="5" cols="55"
                                        placeholder="Description"
                                        value={education.description}
                                        onChange={(e) => handleInputChange(e, index, 'description', 'userEducations')}
                                        required
                                        className="cv-input"
                                    />
                                    {errors.userEducations[index]?.description && (
                                        <div className="cv-error-message text-danger">{errors.userEducations[index].description}</div>
                                    )}

                                    <input
                                        type="date"
                                        placeholder="Start Date"
                                        value={education.startDate}
                                        onChange={(e) => handleInputChange(e, index, 'startDate', 'userEducations')}
                                        required
                                        className="cv-input"
                                    />
                                    {errors.userEducations[index]?.startDate && (
                                        <div className="cv-error-message text-danger">{errors.userEducations[index].startDate}</div>
                                    )}

                                    <input
                                        type="date"
                                        placeholder="End Date"
                                        value={education.endDate}
                                        onChange={(e) => handleInputChange(e, index, 'endDate', 'userEducations')}
                                        required
                                        className="cv-input"
                                    />
                                    {errors.userEducations[index]?.endDate && (
                                        <div className="cv-error-message text-danger">{errors.userEducations[index].endDate}</div>
                                    )}

                                    {errors.userEducations[index]?.dateRange && (
                                        <div className="cv-error-message text-danger">{errors.userEducations[index].dateRange}</div>
                                    )}

                                    {userEducations.length > 1 && (
                                        <button type="button" onClick={() => removeEntry(index, 'userEducations')} className="cv-remove-btn">
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={() => addNewEntry('userEducations')} className="cv-add-btn">
                                Add More
                            </button>
                            <div className="cv-button-group">
                                <button type="button" onClick={handleGoBack} className="cv-back-btn">
                                    Go Back
                                </button>
                                <button type="button" onClick={handleContinue} className="cv-continue-btn">
                                    Continue
                                </button>
                            </div>
                        </>
                    )}

                    {/* Experience Section */}
                    {step === 4 && (
                        <>
                            <h2 className="cv-section-title-create-css">Section 4: Experience</h2>
                            {userExperiences.map((experience, index) => (
                                <div key={index} className="cv-entry">
                                    <input
                                        type="text"
                                        placeholder="Job Title"
                                        value={experience.jobTitle}
                                        onChange={(e) => handleInputChange(e, index, 'jobTitle', 'userExperiences')}
                                        required
                                        className="cv-input"
                                    />
                                    {errors.userExperiences[index]?.jobTitle && (
                                        <div className="cv-error-message text-danger">{errors.userExperiences[index].jobTitle}</div>
                                    )}

                                    <input
                                        type="text"
                                        placeholder="Company"
                                        value={experience.company}
                                        onChange={(e) => handleInputChange(e, index, 'company', 'userExperiences')}
                                        required
                                        className="cv-input"
                                    />
                                    {errors.userExperiences[index]?.company && (
                                        <div className="cv-error-message text-danger">{errors.userExperiences[index].company}</div>
                                    )}

                                    <textarea
                                        rows="5" cols="55"
                                        placeholder="Description"
                                        value={experience.description}
                                        onChange={(e) => handleInputChange(e, index, 'description', 'userExperiences')}
                                        required
                                        className="cv-input"
                                    />
                                    {errors.userExperiences[index]?.description && (
                                        <div className="cv-error-message text-danger">{errors.userExperiences[index].description}</div>
                                    )}

                                    <input
                                        type="date"
                                        placeholder="Start Date"
                                        value={experience.startDate}
                                        onChange={(e) => handleInputChange(e, index, 'startDate', 'userExperiences')}
                                        required
                                        className="cv-input"
                                    />
                                    {errors.userExperiences[index]?.startDate && (
                                        <div className="cv-error-message text-danger">{errors.userExperiences[index].startDate}</div>
                                    )}

                                    <input
                                        type="date"
                                        placeholder="End Date"
                                        value={experience.endDate}
                                        onChange={(e) => handleInputChange(e, index, 'endDate', 'userExperiences')}
                                        required
                                        className="cv-input"
                                    />
                                    {errors.userExperiences[index]?.endDate && (
                                        <div className="cv-error-message text-danger">{errors.userExperiences[index].endDate}</div>
                                    )}

                                    {errors.userExperiences[index]?.dateRange && (
                                        <div className="cv-error-message text-danger">{errors.userExperiences[index].dateRange}</div>
                                    )}

                                    {userExperiences.length > 1 && (
                                        <button type="button" onClick={() => removeEntry(index, 'userExperiences')} className="cv-remove-btn">
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={() => addNewEntry('userExperiences')} className="cv-add-btn">
                                Add More
                            </button>
                            <div className="cv-button-group">
                                <button type="button" onClick={handleGoBack} className="cv-back-btn">
                                    Go Back
                                </button>
                                <button type="button" onClick={handleContinue} className="cv-continue-btn">
                                    Continue
                                </button>
                            </div>
                        </>
                    )}


                    {/* Language Section */}
                    {step === 5 && (
                        <>
                            <h2 className="cv-section-title-create-css">Section 5: Languages</h2>
                            {userLanguages.map((language, index) => (
                                <div key={index} className="cv-entry">
                                    <input
                                        type="text"
                                        placeholder="Language Name"
                                        value={language.languageName}
                                        onChange={(e) => handleInputChange(e, index, 'languageName', 'userLanguages')}
                                        required
                                        className="cv-input"
                                    />
                                    {errors.userLanguages[index]?.languageName && (
                                        <div className="cv-error-message text-danger">{errors.userLanguages[index].languageName}</div>
                                    )}
                                    <input
                                        type="text"
                                        placeholder="Proficiency Level"
                                        value={language.proficiency}
                                        onChange={(e) => handleInputChange(e, index, 'proficiency', 'userLanguages')}
                                        required
                                        className="cv-input"
                                    />
                                    {errors.userLanguages[index]?.proficiency && (
                                        <div className="cv-error-message text-danger">{errors.userLanguages[index].proficiency}</div>
                                    )}
                                    {userLanguages.length > 1 && (
                                        <button type="button" onClick={() => removeEntry(index, 'userLanguages')} className="cv-remove-btn">
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={() => addNewEntry('userLanguages')} className="cv-add-btn">
                                Add More
                            </button>
                            <div className="cv-button-group">
                                <button type="button" onClick={handleGoBack} className="cv-back-btn">
                                    Go Back
                                </button>
                                <button type="button" onClick={handleContinue} className="cv-continue-btn">
                                    Continue
                                </button>
                            </div>
                        </>
                    )}

                    {/* Project Section */}
                    {step === 6 && (
                        <>
                            <h2 className="cv-section-title-create-css">Section 6: Projects</h2>
                            {userProjects.map((project, index) => (
                                <div key={index} className="cv-entry">
                                    <input
                                        type="text"
                                        placeholder="Project Name"
                                        value={project.projectName}
                                        onChange={(e) => handleInputChange(e, index, 'projectName', 'userProjects')}
                                        required
                                        className="cv-input"
                                    />
                                    {errors.userProjects[index]?.projectName && (
                                        <div className="cv-error-message text-danger">{errors.userProjects[index].projectName}</div>
                                    )}
                                    <textarea
                                        rows="5" cols="55"
                                        placeholder="Description"
                                        value={project.description}
                                        onChange={(e) => handleInputChange(e, index, 'description', 'userProjects')}
                                        required
                                        className="cv-input"
                                    />
                                    {errors.userProjects[index]?.description && (
                                        <div className="cv-error-message text-danger">{errors.userProjects[index].description}</div>
                                    )}
                                    <input
                                        type="date"
                                        placeholder="Start Date"
                                        value={project.startDate}
                                        onChange={(e) => handleInputChange(e, index, 'startDate', 'userProjects')}
                                        required
                                        className="cv-input"
                                    />
                                    {errors.userProjects[index]?.startDate && (
                                        <div className="cv-error-message text-danger">{errors.userProjects[index].startDate}</div>
                                    )}
                                    <input
                                        type="date"
                                        placeholder="End Date"
                                        value={project.endDate}
                                        onChange={(e) => handleInputChange(e, index, 'endDate', 'userProjects')}
                                        required
                                        className="cv-input"
                                    />
                                    {errors.userProjects[index]?.endDate && (
                                        <div className="cv-error-message text-danger">{errors.userProjects[index].endDate}</div>
                                    )}
                                    {errors.userProjects[index]?.dateRange && (
                                        <div className="cv-error-message text-danger">{errors.userProjects[index].dateRange}</div>
                                    )}
                                    {userProjects.length > 1 && (
                                        <button type="button" onClick={() => removeEntry(index, 'userProjects')} className="cv-remove-btn">
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={() => addNewEntry('userProjects')} className="cv-add-btn">
                                Add More
                            </button>
                            <div className="cv-button-group">
                                <button type="button" onClick={handleGoBack} className="cv-back-btn">
                                    Go Back
                                </button>
                                <button type="button" onClick={handleContinue} className="cv-continue-btn">
                                    Continue
                                </button>
                            </div>
                        </>
                    )}

                    {/* Skill Section */}
                    {step === 7 && (
                        <>
                            <h2 className="cv-section-title-create-css">Section 7: Skills</h2>
                            {userSkills.map((skill, index) => (
                                <div key={index} className="cv-entry">
                                    <input
                                        type="text"
                                        placeholder="Skill Name"
                                        value={skill.skillName}
                                        onChange={(e) => handleInputChange(e, index, 'skillName', 'userSkills')}
                                        required
                                        className="cv-input"
                                    />
                                    {errors.userSkills[index]?.skillName && (
                                        <div className="cv-error-message text-danger">{errors.userSkills[index].skillName}</div>
                                    )}
                                    <input
                                        type="text"
                                        placeholder="Example: HTML, CSS, JavaScript"
                                        value={skill.proficiency}
                                        onChange={(e) => handleInputChange(e, index, 'proficiency', 'userSkills')}
                                        required
                                        className="cv-input"
                                    />
                                    {errors.userSkills[index]?.proficiency && (
                                        <div className="cv-error-message text-danger">{errors.userSkills[index].proficiency}</div>
                                    )}
                                    {userSkills.length > 1 && (
                                        <button type="button" onClick={() => removeEntry(index, 'userSkills')} className="cv-remove-btn">
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={() => addNewEntry('userSkills')} className="cv-add-btn">
                                Add More
                            </button>
                            <button type="submit" className="cv-submit-btn">Submit CV</button>
                            <div className="cv-button-group">
                                <button type="button" onClick={handleGoBack} className="cv-back-btn">
                                    Go Back
                                </button>
                            </div>
                        </>
                    )}

                </form>
            </div>
        </div>


    );
};

export default CreateCV;