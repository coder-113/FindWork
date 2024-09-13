import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchJobById } from '../../features/JobSlice'
import DataTable from 'react-data-table-component'
import { jwtDecode } from 'jwt-decode'
import { Link, useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { useLocation } from 'react-router-dom'

import { CButton, CCard, CCardBody, CCol, CContainer, CRow, CFormInput } from '@coreui/react'
import { cilAppsSettings } from '@coreui/icons'

const ListJob = () => {
  const dispatch = useDispatch()
  const jobData = useSelector((state) => state.jobs.job)
  const jobStatus = useSelector((state) => state.jobs.status)
  const error = useSelector((state) => state.jobs.error)
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [filteredJobs, setFilteredJobs] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [refreshFlag, setRefreshFlag] = useState(false) // Thêm trạng thái refreshFlag

  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const success = query.get('success')

  useEffect(() => {
    if (success === 'true') {
      alert('Job created successfully!')
    } else if (success === 'false') {
      alert('Failed to create job.')
    }
  }, [success])

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      const decodedToken = jwtDecode(token)
      const userId = decodedToken.id
      dispatch(fetchJobById(userId))
    }
  }, [dispatch, refreshFlag])

  useEffect(() => {
    setFilteredJobs(jobData)

    console.log('Job Data:', jobData) // Log data here
  }, [jobData])

  const handleHide = (id) => {
    if (window.confirm('Are you sure you want to toggle the visibility of this job?')) {
      const token = localStorage.getItem('accessToken')
      fetch(`http://localhost:8080/api/jobs/${id}/hide`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            setRefreshFlag((prevFlag) => !prevFlag)
          } else {
            throw new Error('Failed to toggle job visibility')
          }
        })
        .catch((error) => {
          console.error('Failed to toggle job visibility:', error)
        })
    }
  }

  const handleEdit = (id) => {
    navigate(`/job/edit/${id}`)
  }

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredJobs || [])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Jobs')
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(data, 'jobs.xlsx')
  }

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchText(value)
    if (value === '') {
      setFilteredJobs(jobData)
      setSuggestions([])
    } else {
      const filtered = jobData.filter((job) =>
        job.title.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredJobs(filtered)
      const newSuggestions = jobData
        .filter((job) => job.title.toLowerCase().includes(value.toLowerCase()))
        .map((job) => job.title)
      setSuggestions(newSuggestions)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchText(suggestion)
    const filtered = jobData.filter((job) =>
      job.title.toLowerCase().includes(suggestion.toLowerCase()),
    )
    setFilteredJobs(filtered)
    setSuggestions([])
  }

  const columns = [
    {
      name: 'Title',
      selector: (row) => <Link to={`/job/detail/${row.id}`}>{row.title}</Link>,
      sortable: true,
    },
    { name: 'Offered Salary', selector: (row) => row.offeredSalary, sortable: true },
    {
      name: 'Work Schedule',
      selector: (row) => <div dangerouslySetInnerHTML={{ __html: row.workSchedule }} />,
      sortable: true,
    },
    { name: 'Position', selector: (row) => row.position, sortable: true },
    { name: 'Experience', selector: (row) => row.experience, sortable: true },
    { name: 'Expired', selector: (row) => row.expired, sortable: true },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="job-actions">
          <CButton onClick={() => handleEdit(row.id)} color="info">
            Edit
          </CButton>
          {row.isHidden ? (
            <CButton onClick={() => handleHide(row.id)} className="btn hidden" color="danger">
              Show
            </CButton>
          ) : (
            <CButton onClick={() => handleHide(row.id)} color="danger">
              Hide
            </CButton>
          )}
        </div>
      ),
    },
  ]

  const customStyles = {
    rows: {
      style: {
        fontSize: '1rem',
      },
    },
    headCells: {
      style: {
        fontSize: '1rem',
        fontWeight: 'bold',
      },
    },
  }

  if (jobStatus === 'loading') {
    return <div>Loading...</div>
  }

  if (jobStatus === 'failed') {
    return <div>Error: {error}</div>
  }

  return (
    <CContainer>
      <CRow className="mb-4">
        <CCol lg="6">
          <h4 className="display-4">Job List</h4>
        </CCol>
        <CCol lg="6" className="text-end">
          <div className="search-container">
            <CFormInput
              type="text"
              placeholder="Search jobs"
              value={searchText}
              onChange={handleSearch}
            />
            {suggestions.length > 0 && (
              <div className="auto-complete-suggestions">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="auto-complete-suggestion"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
            <Link to="/job/create">
              <CButton color="primary" className="ms-2">
                Create Job
              </CButton>
            </Link>
            <CButton color="success" className="ms-2" onClick={handleExport}>
              Export to Excel
            </CButton>
          </div>
        </CCol>
      </CRow>
      <CRow>
        <CCol lg="12">
          <CCard className="data-table">
            <CCardBody>
              <DataTable columns={columns} data={filteredJobs || []} customStyles={customStyles} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ListJob

const style = document.createElement('style')
style.textContent = `
/* CSS for the job actions buttons */
/* CSS for the job actions buttons */
.job-actions {
  display: flex;
  gap: 0.5rem;
}

.job-actions .btn {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem; /* Adjusted padding */
  border-radius: 0.25rem;
  transition: background-color 0.3s ease, color 0.3s ease, opacity 0.3s ease;
  min-width: 60px; /* Set a minimum width */
  white-space: nowrap; /* Prevent text wrapping */
  text-align: center; /* Center align text */
}

/* Default styles for buttons */
.job-actions .btn-info {
  background-color: #17a2b8;
  color: #fff;
  border: 1px solid #17a2b8;
}

.job-actions .btn-info:hover {
  background-color: #138496;
  border-color: #117a8b;
}

.job-actions .btn-danger {
  background-color: #dc3545;
  color: #fff;
  border: 1px solid #dc3545;
}

.job-actions .btn-danger:hover {
  background-color: #c82333;
  border-color: #bd2130;
}

/* Styling for hidden jobs */
.job-actions .btn.hidden {
  background-color: #e0e0e0; /* Light gray background */
  color: #a0a0a0; /* Light gray text */
  border: 1px solid #d0d0d0; /* Light gray border */
  cursor: pointer; /* Change cursor to indicate it's clickable */
  opacity: 0.6; /* Make the button look disabled but still clickable */
}

/* CSS for the Create Job and Export to Excel buttons */
.search-container {
  display: flex;
  align-items: center;
  gap: 0.5rem; /* Adjust gap between elements */
  position: relative;
}

.search-container .btn {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.5rem 1rem; /* Adjust padding */
  border-radius: 0.25rem;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.search-container .btn-primary {
  background-color: #007bff;
  color: #fff;
  border: 1px solid #007bff;
}

.search-container .btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}

.search-container .btn-success {
  background-color: #28a745;
  color: #fff;
  border: 1px solid #28a745;
}

.search-container .btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

/* CSS for the search input */
.search-container .form-control {
  font-size: 0.875rem;
  padding: 0.5rem 1rem; /* Adjust padding */
  border-radius: 0.25rem;
  min-width: 200px; /* Set a minimum width */
}

/* CSS for the autocomplete suggestions */
.auto-complete-suggestions {
  position: absolute;
  top: 100%; /* Position below the search input */
  left: 0;
  right: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 200px; /* Set a maximum height */
  overflow-y: auto; /* Enable vertical scrolling */
}

.auto-complete-suggestion {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.auto-complete-suggestion:hover {
  background-color: #f8f9fa;
}

`
document.head.appendChild(style)
