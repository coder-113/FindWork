import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useLocation } from 'react-router-dom'
import { Button, Card, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap'
import { useNavigate } from 'react-router-dom' // Import useNavigate
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css' // Import style cho ReactQuill
const schema = yup.object().shape({
  companyName: yup.string().required('Company name is required'),
  websiteLink: yup.string().required('Website link is required'),
  description: yup.string().required('Description is required'),
  location: yup.string().required('Location is required'),
  type: yup.string().required('Type is required'),
  keySkills: yup.string().required('Key skills are required'),
  companySize: yup.string().required('Company size is required'),
  country: yup.string().required('Country is required'),
  countryCode: yup.string().required('Country code is required'),
  workingDays: yup.string().required('Working days are required'),
})

const EditCompany = () => {
  const [logoFile, setLogoFile] = useState(null)
  const [companyId, setCompanyId] = useState(null)
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const success = query.get('success')

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      companyName: '',
      websiteLink: '',
      description: '',
      location: '',
      type: '',
      keySkills: '',
      companySize: '',
      country: '',
      countryCode: '',
      workingDays: '',
    },
  })

  useEffect(() => {
    if (success === 'true') {
      alert('Company created successfully!')
    } else if (success === 'false') {
      alert('Failed to create job.')
    }
  }, [success])

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      const decodedToken = jwtDecode(token)
      const companyId = decodedToken.company
      setCompanyId(companyId)

      axios
        .get(`http://localhost:8080/api/companies/${companyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const company = response.data
          setValue('companyName', company.companyName)
          setValue('websiteLink', company.websiteLink)
          setValue('description', company.description)
          setValue('location', company.location)
          setValue('type', company.type)
          setValue('keySkills', company.keySkills)
          setValue('companySize', company.companySize)
          setValue('country', company.country)
          setValue('countryCode', company.countryCode)
          setValue('workingDays', company.workingDays)
        })
        .catch((error) => console.error('Error fetching company data:', error))
    }
  }, [setValue])

  const handleLogoUpload = (event) => {
    setLogoFile(event.target.files[0])
  }

  const updateCompanyData = async (data) => {
    const token = localStorage.getItem('accessToken')
    try {
      await axios.put(`http://localhost:8080/api/companies/edit/${companyId}`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Company data updated successfully')
    } catch (error) {
      console.error('Error updating company data:', error)
    }
  }

  const handleLogoSubmit = async () => {
    const token = localStorage.getItem('accessToken')
    const formData = new FormData()
    if (logoFile) {
      formData.append('file', logoFile) // Ensure key matches @RequestParam in the backend
    }

    try {
      await axios.post(
        `http://localhost:8080/api/companies/add/${companyId}/upload-logo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      console.log('Logo uploaded successfully')
    } catch (error) {
      console.error('Error uploading logo:', error)
    }
  }
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    await updateCompanyData(data)
    if (logoFile) {
      await handleLogoSubmit()
    }
    navigate('/company?success=true') // Điều hướng sau khi thành công
  }

  return (
    <Row>
      <Col lg={8} md={6} sm={12}>
        <Card className="p-4">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label for="companyName">Company Name</Label>
              <Controller
                name="companyName"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="companyName" placeholder="Enter company name" />
                )}
              />
              {errors.companyName && <p>{errors.companyName.message}</p>}
            </FormGroup>
            <FormGroup>
              <Label for="logo">Logo</Label>
              <Input type="file" id="logo" onChange={handleLogoUpload} />
              {errors.logo && <p>{errors.logo.message}</p>}
            </FormGroup>
            <FormGroup>
              <Label for="websiteLink">Website Link</Label>
              <Controller
                name="websiteLink"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="websiteLink" placeholder="Enter website link" />
                )}
              />
              {errors.websiteLink && <p>{errors.websiteLink.message}</p>}
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <ReactQuill {...field} theme="snow" placeholder="Enter description" />
                )}
              />
              {errors.description && <p>{errors.description.message}</p>}
            </FormGroup>
            <FormGroup>
              <Label for="location">Location</Label>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="location" placeholder="Enter location" />
                )}
              />
              {errors.location && <p>{errors.location.message}</p>}
            </FormGroup>
            <FormGroup>
              <Label for="type">Type</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => <Input {...field} id="type" placeholder="Enter type" />}
              />
              {errors.type && <p>{errors.type.message}</p>}
            </FormGroup>
            <FormGroup>
              <Label for="keySkills">Key Skills</Label>
              <Controller
                name="keySkills"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="keySkills" placeholder="Enter key skills" />
                )}
              />
              {errors.keySkills && <p>{errors.keySkills.message}</p>}
            </FormGroup>
            <FormGroup>
              <Label for="companySize">Company Size</Label>
              <Controller
                name="companySize"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="companySize" placeholder="Enter company size" />
                )}
              />
              {errors.companySize && <p>{errors.companySize.message}</p>}
            </FormGroup>
            <FormGroup>
              <Label for="country">Country</Label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="country" placeholder="Enter country" />
                )}
              />
              {errors.country && <p>{errors.country.message}</p>}
            </FormGroup>
            <FormGroup>
              <Label for="countryCode">Country Code</Label>
              <Controller
                name="countryCode"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="countryCode" placeholder="Enter country code" />
                )}
              />
              {errors.countryCode && <p>{errors.countryCode.message}</p>}
            </FormGroup>
            <FormGroup>
              <Label for="workingDays">Working Days</Label>
              <Controller
                name="workingDays"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="workingDays" placeholder="Enter working days" />
                )}
              />
              {errors.workingDays && <p>{errors.workingDays.message}</p>}
            </FormGroup>
            <Button color="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Card>
      </Col>
    </Row>
  )
}

export default EditCompany
