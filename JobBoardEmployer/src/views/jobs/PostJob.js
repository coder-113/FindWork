import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CFormInput,
  CForm,
  CFormLabel,
  CRow,
  CFormSelect,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { addJob } from '../../features/JobSlice'
import { jwtDecode } from 'jwt-decode'
import { Editor } from '@tinymce/tinymce-react'
import { useNavigate } from 'react-router-dom'
import { fetchCategoryThunk } from '../../features/categorySlice'
import Select from 'react-select'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css' // Import CSS for DatePicker

import { format, parse } from 'date-fns'
import { auto } from '@popperjs/core'

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    offeredSalary: '',
    description: '',
    city: '',
    responsibilities: '',
    requiredSkills: '',
    workSchedule: '',
    categoryId: [], // Change to array
    position: '',
    experience: '',
    slot: '',
    qualification: '',
    benefit: '',
    companyId: '',
    expire: '',
    contractType: '',
    jobType: '',
  })

  const [errors, setErrors] = useState({})
  const [provinces, setProvinces] = useState([])
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { categories, state: categoryState } = useSelector((state) => state.categories)

  useEffect(() => {
    dispatch(fetchCategoryThunk())
  }, [dispatch])

  useEffect(() => {
    if (categoryState === 'succeeded') {
      setFormData((prevData) => ({
        ...prevData,
        categoryId: categories.length > 0 ? categories[0].id : '',
      }))
    }
  }, [categories, categoryState])

  console.log(categories)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        setFormData((prevData) => ({
          ...prevData,
          companyId: decodedToken.company, // Set companyId from token
        }))
      } catch (error) {
        console.error('Error decoding token:', error)
      }
    }
  }, [])

  const fetchProvinces = async () => {
    try {
      const response = await fetch('https://open.oapi.vn/location/provinces')
      if (!response.ok) {
        throw new Error('Failed to fetch provinces')
      }
      const data = await response.json()

      if (data.code === 'success') {
        setProvinces(data.data)
      } else {
        throw new Error('Invalid data format from API')
      }
    } catch (error) {
      console.error('Error fetching provinces:', error)
    }
  }

  useEffect(() => {
    fetchProvinces()
  }, [])

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }))
  }
  const handleEditorChange = (field, content) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: content,
    }))
  }

  const handleQuillChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      const token = localStorage.getItem('accessToken')
      if (token) {
        try {
          const decodedToken = jwtDecode(token)
          const userId = decodedToken.id
          const result = await dispatch(addJob({ userId, data: formData }))
          if (addJob.fulfilled.match(result)) {
            navigate('/job?success=true')
          } else {
            console.log('Failed to add job:', result.payload)
          }
        } catch (error) {
          console.error('Error:', error)
        }
      }
    }
  }
  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = format(date, 'dd/MM/yyyy') // Định dạng ngày
      setFormData((prevData) => ({
        ...prevData,
        expire: formattedDate,
      }))
    }
  }
  const validateForm = () => {
    let tempErrors = {}

    const currentDate = new Date()
    const expireDate = formData.expire ? parse(formData.expire, 'dd/MM/yyyy', new Date()) : null
    const tenDaysLater = new Date()
    tenDaysLater.setDate(currentDate.getDate() + 10)

    if (!formData.expire) tempErrors.expire = 'Expire date is required'
    else if (expireDate < tenDaysLater)
      tempErrors.expire = 'Expire date must be at least 10 days from today'

    if (!formData.title) tempErrors.title = 'Title is required'
    else if (formData.title.length > 200)
      tempErrors.title = 'Title must be less than 200 characters'

    if (!formData.offeredSalary) tempErrors.offeredSalary = 'Offered Salary is required'
    else if (formData.offeredSalary <= 100)
      tempErrors.offeredSalary = 'Offered Salary must be greater than 100'
    else if (formData.offeredSalary < 0)
      tempErrors.offeredSalary = 'Offered Salary cannot be negative'

    if (!formData.description) tempErrors.description = 'Description is required'
    if (!formData.workSchedule) tempErrors.workSchedule = 'Work Schedule is required'
    if (!formData.city) tempErrors.city = 'City is required'
    if (!formData.responsibilities) tempErrors.responsibilities = 'Responsibilities are required'
    if (!formData.requiredSkills) tempErrors.requiredSkills = 'Required Skills are required'
    if (!formData.position) tempErrors.position = 'Position is required'
    if (!formData.experience) tempErrors.experience = 'Experience is required'
    if (!formData.contractType) tempErrors.contractType = 'Contract Type is required'
    if (!formData.jobType) tempErrors.jobType = 'Job Type is required'
    if (!formData.qualification) tempErrors.qualification = 'Qualification is required'
    if (!formData.benefit) tempErrors.benefit = 'Benefit is required'
    if (!formData.categoryId.length) tempErrors.categoryId = 'Category is required'
    if (!formData.slot) tempErrors.slot = 'Quantity is required'
    else if (formData.slot < 0) tempErrors.slot = 'Quantity cannot be negative'

    console.log(tempErrors)
    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }
  const handleSelectChange = (selectedOptions, actionMeta) => {
    if (actionMeta.name === 'categoryId') {
      setFormData((prevData) => ({
        ...prevData,
        categoryId: selectedOptions ? selectedOptions.map((option) => option.value) : [],
      }))
    } else {
      setFormData((prevData) => ({
        ...prevData,
        keySkills: selectedOptions ? selectedOptions.map((option) => option.value) : [],
      }))
    }
  }
  const jobOptions = [
    // Your options list here
  ]

  return (
    <>
      <section className="section-hero overlay inner-page bg-image">
        <CContainer>
          <CRow>
            <CCol md={7}>
              <h1 className="font-weight-bold">Post A Job</h1>
              <div className="custom-breadcrumbs">
                <a href="#">Home</a> <span className="mx-2 slash">/</span>
                <a href="/job">Job</a> <span className="mx-2 slash">/</span>
                <span>
                  <strong>Post a Job</strong>
                </span>
              </div>
            </CCol>
          </CRow>
        </CContainer>
      </section>
      <br></br>
      <section className="site-section">
        <CContainer>
          <CRow>
            <CCol lg={8}>
              <CCard>
                <CCardBody>
                  <CForm method="post" onSubmit={handleSubmit}>
                    <CRow>
                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="title" className="form-label">
                            Job Title
                          </CFormLabel>
                          <CFormInput
                            type="text"
                            id="title"
                            placeholder="Enter Job Title"
                            value={formData.title}
                            onChange={handleChange}
                            invalid={!!errors.title}
                          />
                          {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                        </div>
                      </CCol>
                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="offeredSalary" className="form-label">
                            Offered Salary
                          </CFormLabel>
                          <CFormInput
                            type="number"
                            id="offeredSalary"
                            placeholder="Enter Offered Salary"
                            value={formData.offeredSalary}
                            onChange={handleChange}
                            invalid={!!errors.offeredSalary}
                          />
                          {errors.offeredSalary && (
                            <div className="invalid-feedback">{errors.offeredSalary}</div>
                          )}
                        </div>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="workSchedule" className="form-label">
                            WorkSchedule
                          </CFormLabel>
                          <Editor
                            apiKey="6cb07sce109376hijr18r8vibbm3h5qjhh4qa8gc9pw8rvn0"
                            value={formData.workSchedule}
                            init={{
                              height: 200,
                              menubar: false,
                              plugins:
                                'advlist autolink lists link image charmap preview anchor textcolor',
                              toolbar:
                                'undo redo | formatselect | bold italic backcolor | \
                              alignleft aligncenter alignright alignjustify | \
                              bullist numlist outdent indent | removeformat | help',
                            }}
                            onEditorChange={(content) =>
                              handleEditorChange('workSchedule', content)
                            }
                          />
                          {errors.workSchedule && (
                            <div className="invalid-feedback">{errors.workSchedule}</div>
                          )}
                        </div>
                      </CCol>
                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="slot" className="form-label">
                            Quantity
                          </CFormLabel>
                          <CFormInput
                            type="number"
                            id="slot"
                            placeholder="Enter quantity"
                            value={formData.slot}
                            onChange={handleChange}
                            invalid={!!errors.slot}
                          />
                          {errors.slot && <div className="invalid-feedback">{errors.slot}</div>}
                        </div>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="categoryId" className="form-label">
                            Category
                          </CFormLabel>
                          <Select
                            isMulti
                            name="categoryId"
                            options={categories.map((cat) => ({
                              value: cat.categoryId,
                              label: cat.categoryName,
                            }))}
                            onChange={handleSelectChange}
                            value={formData.categoryId
                              .map((id) => {
                                const category = categories.find((cat) => cat.categoryId === id)
                                return category
                                  ? { value: category.categoryId, label: category.categoryName }
                                  : null
                              })
                              .filter(Boolean)}
                          />
                          {errors.categoryId && (
                            <div className="invalid-feedback">{errors.categoryId}</div>
                          )}
                        </div>
                      </CCol>
                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="position" className="form-label">
                            Position
                          </CFormLabel>
                          <CFormSelect
                            id="position"
                            value={formData.position === 'SENIOR' ? 'SENIOR' : formData.position}
                            onChange={handleChange}
                            invalid={!!errors.position}
                          >
                            <option value="">Select position</option>
                            <option value="INTERN">Intern</option>
                            <option value="FRESHER">Fresher</option>
                            <option value="JUNIOR">Junior</option>
                            <option value="MIDDLE">Middle</option>
                            <option value="SENIOR">Senior</option>
                            <option value="LEADER">Leader</option>
                            <option value="MANAGER">Manager</option>
                          </CFormSelect>
                          {errors.position && (
                            <div className="invalid-feedback">{errors.position}</div>
                          )}
                        </div>
                      </CCol>

                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="contractType" className="form-label">
                            Contract Type
                          </CFormLabel>
                          <CFormSelect
                            id="contractType"
                            value={formData.contractType}
                            onChange={handleChange}
                            invalid={!!errors.contractType}
                          >
                            <option value="">Select contract type</option>
                            <option value="FREELANCE">Freelance</option>
                            <option value="FULLTIME">Fulltime</option>
                            <option value="PART_TIME">Part-time</option>
                          </CFormSelect>
                          {errors.contractType && (
                            <div className="invalid-feedback">{errors.contractType}</div>
                          )}
                        </div>
                      </CCol>

                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="jobType" className="form-label">
                            Job Type
                          </CFormLabel>
                          <CFormSelect
                            id="jobType"
                            value={formData.jobType}
                            onChange={handleChange}
                            invalid={!!errors.jobType}
                          >
                            <option value="">Select job type</option>
                            <option value="IN_OFFICE">In Office</option>
                            <option value="HYBRID">Hybrid</option>
                            <option value="REMOTE">Remote</option>
                            <option value="OVERSEA">Oversea</option>
                          </CFormSelect>
                          {errors.jobType && (
                            <div className="invalid-feedback">{errors.jobType}</div>
                          )}
                        </div>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="experience" className="form-label">
                            Experience
                          </CFormLabel>
                          <CFormInput
                            type="text"
                            id="experience"
                            placeholder="Enter experience"
                            value={formData.experience}
                            onChange={handleChange}
                            invalid={!!errors.experience}
                          />
                          {errors.experience && (
                            <div className="invalid-feedback">{errors.experience}</div>
                          )}
                        </div>
                      </CCol>

                      <CRow>
                        <CCol md={6}>
                          <div className="mb-3">
                            <CFormLabel htmlFor="expire" className="form-label">
                              Expire Date
                            </CFormLabel>
                            <DatePicker
                              id="expire"
                              selected={
                                formData.expire
                                  ? parse(formData.expire, 'dd/MM/yyyy', new Date())
                                  : null
                              }
                              onChange={handleDateChange}
                              dateFormat="dd/MM/yyyy"
                              placeholderText="Select expiration date"
                              className="form-control"
                            />
                          </div>
                        </CCol>
                      </CRow>
                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="qualification" className="form-label">
                            Qualification
                          </CFormLabel>
                          <Editor
                            apiKey="6cb07sce109376hijr18r8vibbm3h5qjhh4qa8gc9pw8rvn0"
                            value={formData.qualification}
                            init={{
                              height: 100,
                              width: 200,
                              menubar: false,
                              plugins:
                                'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker',
                              toolbar:
                                'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                            }}
                            onEditorChange={(content) =>
                              handleEditorChange('qualification', content)
                            }
                          />
                          {errors.qualification && (
                            <div className="invalid-feedback">{errors.qualification}</div>
                          )}
                        </div>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol md={12}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="description" className="form-label">
                            Job Description
                          </CFormLabel>
                          <Editor
                            apiKey="6cb07sce109376hijr18r8vibbm3h5qjhh4qa8gc9pw8rvn0"
                            value={formData.description}
                            init={{
                              height: 200,
                              menubar: false,
                              plugins:
                                'advlist autolink lists link image charmap preview anchor textcolor',
                              toolbar:
                                'undo redo | formatselect | bold italic backcolor | \
                              alignleft aligncenter alignright alignjustify | \
                              bullist numlist outdent indent | removeformat | help',
                            }}
                            onEditorChange={(content) => handleEditorChange('description', content)}
                          />
                          {errors.description && (
                            <div className="invalid-feedback">{errors.description}</div>
                          )}
                        </div>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol md={12}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="responsibilities" className="form-label">
                            Responsibilities
                          </CFormLabel>
                          <Editor
                            apiKey="6cb07sce109376hijr18r8vibbm3h5qjhh4qa8gc9pw8rvn0"
                            value={formData.responsibilities}
                            init={{
                              height: 200,
                              menubar: false,
                              plugins:
                                'advlist autolink lists link image charmap preview anchor textcolor',
                              toolbar:
                                'undo redo | formatselect | bold italic backcolor | \
                              alignleft aligncenter alignright alignjustify | \
                              bullist numlist outdent indent | removeformat | help',
                            }}
                            onEditorChange={(content) =>
                              handleEditorChange('responsibilities', content)
                            }
                          />
                          {errors.responsibilities && (
                            <div className="invalid-feedback">{errors.responsibilities}</div>
                          )}
                        </div>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol md={12}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="requiredSkills" className="form-label">
                            Required Skills
                          </CFormLabel>
                          <Editor
                            apiKey="6cb07sce109376hijr18r8vibbm3h5qjhh4qa8gc9pw8rvn0"
                            value={formData.requiredSkills}
                            init={{
                              height: 200,
                              menubar: false,
                              plugins:
                                'advlist autolink lists link image charmap preview anchor textcolor',
                              toolbar:
                                'undo redo | formatselect | bold italic backcolor | \
                              alignleft aligncenter alignright alignjustify | \
                              bullist numlist outdent indent | removeformat | help',
                            }}
                            onEditorChange={(content) =>
                              handleEditorChange('requiredSkills', content)
                            }
                          />
                          {errors.requiredSkills && (
                            <div className="invalid-feedback">{errors.requiredSkills}</div>
                          )}
                        </div>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol md={12}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="benefit" className="form-label">
                            Benefit
                          </CFormLabel>
                          <Editor
                            apiKey="6cb07sce109376hijr18r8vibbm3h5qjhh4qa8gc9pw8rvn0"
                            value={formData.benefit}
                            init={{
                              height: 200,
                              menubar: false,
                              plugins:
                                'advlist autolink lists link image charmap preview anchor textcolor',
                              toolbar:
                                'undo redo | formatselect | bold italic backcolor | \
                              alignleft aligncenter alignright alignjustify | \
                              bullist numlist outdent indent | removeformat | help',
                            }}
                            onEditorChange={(content) => handleEditorChange('benefit', content)}
                          />
                          {errors.benefit && (
                            <div className="invalid-feedback">{errors.benefit}</div>
                          )}
                        </div>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol md={12}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="city" className="form-label">
                            City
                          </CFormLabel>
                          <select
                            className="form-select"
                            id="city"
                            value={formData.city}
                            onChange={handleChange}
                          >
                            {provinces.map((province) => (
                              <option key={province.id} value={province.id}>
                                {province.name}
                              </option>
                            ))}
                          </select>
                          {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                        </div>
                      </CCol>
                    </CRow>
                    <CButton type="submit" color="primary">
                      Submit
                    </CButton>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </section>
    </>
  )
}

export default PostJob

const style = document.createElement('style')
style.textContent = `

.invalid-feedback {
  color: red;
  font-size: 0.875rem;
}


`
