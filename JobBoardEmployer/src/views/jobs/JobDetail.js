import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getJobById } from '../../features/JobSlice'
import { CButton, CCol, CContainer, CRow } from '@coreui/react'
import { useParams, useNavigate } from 'react-router-dom'

const JobDetail = () => {
  const { jobId } = useParams() // Lấy jobId từ URL
  const dispatch = useDispatch()
  const navigate = useNavigate() // Khởi tạo useNavigate
  const jobDetails = useSelector((state) => state.jobs.job) // Lấy thông tin công việc từ Redux store
  const jobStatus = useSelector((state) => state.jobs.status)
  const error = useSelector((state) => state.jobs.error)
  const [cvCount, setCvCount] = useState(null)

  useEffect(() => {
    if (!jobDetails || jobDetails.id !== parseInt(jobId, 10)) {
      dispatch(getJobById(jobId))
    }
  }, [dispatch, jobId, jobDetails])

  useEffect(() => {
    if (jobDetails) {
      const token = localStorage.getItem('token') // Lấy token từ localStorage
      fetch(`http://localhost:8080/api/job-applications/count-approved-by-job/${jobId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Sử dụng token từ localStorage
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => setCvCount(data))
        .catch((error) => console.error('Error fetching CV count:', error))
    }
  }, [jobDetails, jobId])

  if (jobStatus === 'loading') {
    return <div>Loading...</div>
  }

  if (jobStatus === 'failed') {
    return <div>Error: {error}</div>
  }

  return (
    <CContainer className="job-detail-container">
      <CRow>
        <CCol lg="12">
          <div className="job-detail-content">
            <h2 className="job-detail-title">{jobDetails.title}</h2>
            <p>
              <strong>Offered Salary:</strong> {jobDetails.offeredSalary}
            </p>
            <p>
              <strong>City:</strong> {jobDetails.city}
            </p>
            <p>
              <strong>Work Schedule:</strong>{' '}
              <span dangerouslySetInnerHTML={{ __html: jobDetails.workSchedule }} />
            </p>
            <p>
              <strong>Position:</strong> {jobDetails.position}
            </p>
            <p>
              <strong>Experience:</strong> {jobDetails.experience}
            </p>
            <p>
              <strong>Description:</strong>{' '}
              <span dangerouslySetInnerHTML={{ __html: jobDetails.description }} />
            </p>
            <p>
              <strong>Expired:</strong> {jobDetails.expired}
            </p>
            <div className="cv-count-container">
              <p className="cv-count-text">
                <strong> number of CVs:</strong> {cvCount !== null ? cvCount : 'Loading...'}
              </p>{' '}
              {/* Hiển thị số lượng CV */}
              <CButton
                color="secondary"
                className="cv-count-button"
                onClick={() => navigate(`/cv`)} // Chuyển hướng đến trang hiển thị số lượng CV
              >
                View CV
              </CButton>
            </div>
            <CButton color="primary" onClick={() => window.history.back()}>
              Back
            </CButton>
          </div>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default JobDetail

const style = document.createElement('style')
style.textContent = `
.job-detail-container {
  margin-top: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.job-detail-content {
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  position: relative; /* Thêm position relative để định dạng vị trí nút */
}

.job-detail-title {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
}

.job-detail-content p {
  font-size: 1rem;
  color: #555;
  margin-bottom: 10px;
}

.job-detail-content strong {
  color: #333;
}

.job-detail-content .btn {
  margin-top: 20px;
  font-size: 1rem;
}

.cv-count-container {
  margin-top: 20px; /* Khoảng cách trên */
  margin-bottom: 20px; /* Khoảng cách dưới */
}

.cv-count-text {
  font-size: 1rem;
  color: #555;
  margin-bottom: 10px;
}

.cv-count-button {
  background-color: #28a745; /* Màu nền xanh lá cây */
  border-color: #28a745; /* Màu viền xanh lá cây */
  color: white; /* Màu chữ trắng */
  margin-top: 10px; /* Khoảng cách trên nút */
}
.cv-count-button:hover {
  background-color: #218838; /* Màu nền xanh lá cây đậm hơn khi hover */
  border-color: #1e7e34; /* Màu viền xanh lá cây đậm hơn khi hover */
}
`
document.head.appendChild(style)
