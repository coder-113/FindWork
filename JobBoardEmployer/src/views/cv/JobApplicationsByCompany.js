import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode' // Correct import for jwt-decode
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CRow,
  CSpinner,
  CAlert,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'

const JobApplicationsByCompany = () => {
  const [jobApplications, setJobApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const applicationsPerPage = 3

  useEffect(() => {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      setError('No token found')
      setLoading(false)
      return
    }

    // Decode token to get companyId and userId
    try {
      const decodedToken = jwtDecode(token)
      const companyId = decodedToken.company // Assuming companyId is in the token
      const userIdFromJwt = decodedToken.id // Assuming userId is in the token

      axios
        .get(`http://localhost:8080/api/job-applications/company/${companyId}/${userIdFromJwt}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setJobApplications(response.data)
          setLoading(false)
        })
        .catch((err) => {
          setError(err.message)
          setLoading(false)
        })
    } catch (decodeError) {
      setError('Failed to decode token')
      setLoading(false)
    }
  }, [])

  // Calculate current applications
  const indexOfLastApplication = currentPage * applicationsPerPage
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage
  const currentApplications = jobApplications.slice(indexOfFirstApplication, indexOfLastApplication)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const handleApprove = (applicationId) => {
    const token = localStorage.getItem('accessToken')

    axios
      .put(
        `http://localhost:8080/api/job-applications/approve/${applicationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        // Update job application status
        setJobApplications((prevState) =>
          prevState.map((application) =>
            application.id === applicationId ? { ...application, approved: true } : application,
          ),
        )
        alert('Application approved successfully')
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  const downloadPdf = async (applicationId) => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(
        `http://localhost:8080/api/application/download-pdf/${applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
        },
      )

      // Create a blob URL and trigger a download
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'cv.pdf')
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      setError('Error downloading PDF')
    }
  }

  if (loading)
    return (
      <CContainer
        className="d-flex justify-content-center align-items-center"
        style={{ height: '100vh' }}
      >
        <CSpinner color="primary" />
      </CContainer>
    )

  if (error)
    return (
      <CContainer
        className="d-flex justify-content-center align-items-center"
        style={{ height: '100vh' }}
      >
        <CAlert color="danger">{error}</CAlert>
      </CContainer>
    )

  return (
    <CContainer className="container">
      <CRow className="mb-4">
        <CCol>
          <CCard>
            <CCardBody>
              <h1>Job Applications for Company</h1>
              <CListGroup>
                {currentApplications.length > 0 ? (
                  currentApplications.map((application) => {
                    const isMissingCVDetails = !application.email || !application.name

                    return (
                      <CListGroupItem key={application.id} className="mb-2 card-body">
                        <CCard>
                          <CCardBody>
                            <h4 className="card-title">{application.employeeName}</h4>
                            <p>
                              <strong>Job Title:</strong> {application.title}
                            </p>
                            <p>
                              <strong>Job Description:</strong> {application.description}
                            </p>
                            <p>
                              <strong>Cover Letter:</strong> {application.coverLetter}
                            </p>
                            <p>
                              <strong>CV File:</strong>
                              <CButton color="primary" onClick={() => downloadPdf(application.id)}>
                                Download CV
                              </CButton>
                            </p>
                            {isMissingCVDetails ? (
                              <CAlert color="warning">
                                CV details are not available. Please{' '}
                                <Link to="/buy">purchase a full CV package</Link> to view full
                                details.
                              </CAlert>
                            ) : (
                              <>
                                <p>
                                  <strong>Email:</strong> {application.email}
                                </p>
                                <p>
                                  <strong>Name:</strong> {application.name}
                                </p>
                              </>
                            )}
                            <CButton
                              color="success"
                              onClick={() => handleApprove(application.id)}
                              disabled={application.approved === true}
                            >
                              {application.approved === false ? 'Approved' : 'Approve'}
                            </CButton>
                          </CCardBody>
                        </CCard>
                      </CListGroupItem>
                    )
                  })
                ) : (
                  <CAlert color="info">No job applications found.</CAlert>
                )}
              </CListGroup>
              <div className="pagination">
                {Array.from(
                  { length: Math.ceil(jobApplications.length / applicationsPerPage) },
                  (_, index) => (
                    <button
                      key={index}
                      onClick={() => paginate(index + 1)}
                      disabled={currentPage === index + 1}
                    >
                      {index + 1}
                    </button>
                  ),
                )}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default JobApplicationsByCompany

const style = document.createElement('style')
style.textContent = `
/* JobApplicationsByCompany.css */
.container {
  margin-top: 20px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.card-body {
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 5px;
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
`
document.head.append(style)
