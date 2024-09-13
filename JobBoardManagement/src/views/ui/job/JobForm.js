import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addJob, updateJobById } from "../../../features/jobSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { fetchJobCategory } from "../../../features/jobCategorySlice";
import { format } from 'date-fns';

const jobSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  offeredSalary: yup.string().required("Offered Salary is required"),
  description: yup.string().required("Description is required"),
  responsibilities: yup.string().required("Responsibilities are required"),
  requiredSkills: yup.string().required("Required Skills are required"),
  workSchedule: yup.string().required("Work Schedule is required"),
  keySkills: yup.string().required("Key Skills are required"),
  experience: yup.string().required("Experience is required"),
  qualification: yup.string().required("Qualification is required"),
  benefit: yup.string().required("Benefit is required"),
  createdAt: yup.date().required("Created At is required"),
  slot: yup.number().required("Slot is required").integer(),
  profileApproved: yup.number().required("Profile Approved is required").integer(),
  isSuperHot: yup.boolean().required("Is Super Hot is required"),
  expire: yup.date().required("Expire Date is required"),
  companyId: yup.number().required("Company ID is required"),
  categoryId: yup.array().of(yup.number()).required("Category ID is required"),  
});

const contractTypes = ["Freelance", "Fulltime", "Part-time"];
const positions = ["Intern", "Fresher", "Junior", "Middle", "Senior", "Leader", "Manager"];
const jobTypes = ["In Office", "Hybrid", "Remote", "Oversea"];

export function JobForm({ isEdit, setIsEdit }) {
  const dispatch = useDispatch();
  const [newJobModal, setNewJobModal] = useState(false);
  const categories = useSelector((state) => state.jobCategory.list || []);

  useEffect(() => {
    dispatch(fetchJobCategory());
  }, [dispatch]);

  const toggleNewJobModal = () => {
    setNewJobModal(!newJobModal);
    if (newJobModal) {
      reset();
      setIsEdit(null);
    }
  };

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(jobSchema),
    defaultValues: {
      title: "",
      offeredSalary: "",
      description: "",
      responsibilities: "",
      requiredSkills: "",
      workSchedule: "",
      keySkills: "",
      position: positions[0],
      experience: "",
      qualification: "",
      jobType: jobTypes[0],
      contractType: contractTypes[0],
      benefit: "",
      createdAt: new Date(),
      slot: 1,
      profileApproved: 0,
      isSuperHot: false,
      expire: "",
      companyId: "",
      categoryId: [],
    },
  });

  useEffect(() => {
    if (isEdit) {
      setNewJobModal(true);
      Object.keys(isEdit).forEach((key) => {
        setValue(key, isEdit[key] ?? "");
      });
    }
  }, [isEdit, setValue]);
  const onSubmit = (data) => {
    const { companyId, categoryId, expire, ...jobData } = data;
  
    // Format the expire date to DD/MM/YYYY
    const formattedExpireDate = expire ? format(new Date(expire), 'dd/MM/yyyy') : '';
  
    const categoryIdArray = Array.isArray(categoryId) ? categoryId : [categoryId];
  
    if (isEdit) {
      dispatch(updateJobById({
        jobId: isEdit.id,
        jobData: { ...jobData, companyId, categoryId: categoryIdArray, expire: formattedExpireDate }
      })).then(() => {
        toggleNewJobModal();
      });
    } else {
      dispatch(
        addJob({
          companyId: parseInt(companyId, 10),
          categoryId: categoryIdArray.map(id => parseInt(id, 10)),
          jobData: { ...jobData, expire: formattedExpireDate },
        })
      ).then(() => {
        toggleNewJobModal();
      });
    }
  };
  
  useEffect(() => {
    if (isEdit) {
      setNewJobModal(true);
      Object.keys(isEdit).forEach((key) => {
        if (key === 'expire' && isEdit[key]) {
          setValue(key, format(new Date(isEdit[key]), 'yyyy-MM-dd'));
        } else {
          setValue(key, isEdit[key] ?? "");
        }
      });
    }
  }, [isEdit, setValue]);

  return (
    <>
      <div className="d-flex justify-content-end mb-2">
        <Button color="danger" onClick={toggleNewJobModal}>
          New Job
        </Button>
      </div>
      <Modal isOpen={newJobModal} toggle={toggleNewJobModal}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={toggleNewJobModal}>
            {isEdit ? "Edit Job" : "Create New Job"}
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="title">Job Title</Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="title"
                    placeholder="Enter job title"
                    type="text"
                    invalid={!!errors.title}
                  />
                )}
              />
              {errors.title && (
                <FormText color="danger">{errors.title.message}</FormText>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="offeredSalary">Offered Salary</Label>
              <Controller
                name="offeredSalary"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="offeredSalary"
                    placeholder="Enter offered salary"
                    type="text"
                    invalid={!!errors.offeredSalary}
                  />
                )}
              />
              {errors.offeredSalary && (
                <FormText color="danger">{errors.offeredSalary.message}</FormText>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="description"
                    placeholder="Enter description"
                    type="textarea"
                    invalid={!!errors.description}
                  />
                )}
              />
              {errors.description && (
                <FormText color="danger">{errors.description.message}</FormText>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="responsibilities">Responsibilities</Label>
              <Controller
                name="responsibilities"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="responsibilities"
                    placeholder="Enter responsibilities"
                    type="textarea"
                    invalid={!!errors.responsibilities}
                  />
                )}
              />
              {errors.responsibilities && (
                <FormText color="danger">{errors.responsibilities.message}</FormText>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="requiredSkills">Required Skills</Label>
              <Controller
                name="requiredSkills"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="requiredSkills"
                    placeholder="Enter required skills"
                    type="textarea"
                    invalid={!!errors.requiredSkills}
                  />
                )}
              />
              {errors.requiredSkills && (
                <FormText color="danger">{errors.requiredSkills.message}</FormText>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="workSchedule">Work Schedule</Label>
              <Controller
                name="workSchedule"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="workSchedule"
                    placeholder="Enter work schedule"
                    type="text"
                    invalid={!!errors.workSchedule}
                  />
                )}
              />
              {errors.workSchedule && (
                <FormText color="danger">{errors.workSchedule.message}</FormText>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="keySkills">Key Skills</Label>
              <Controller
                name="keySkills"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="keySkills"
                    placeholder="Enter key skills"
                    type="text"
                    invalid={!!errors.keySkills}
                  />
                )}
              />
              {errors.keySkills && (
                <FormText color="danger">{errors.keySkills.message}</FormText>
              )}
            </FormGroup>
            <FormGroup>
  <Label for="position">Position</Label>
  <Controller
    name="position"
    control={control}
    defaultValue={positions[0]}
    render={({ field }) => (
      <Input
        {...field}
        type="select"
        id="position"
        invalid={!!errors.position}
      >
        {positions.map((position) => (
          <option key={position} value={position}>
            {position}
          </option>
        ))}
      </Input>
    )}
  />
  {errors.position && <FormText color="danger">{errors.position.message}</FormText>}
        </FormGroup>
            <FormGroup>
              <Label for="experience">Experience</Label>
              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="experience"
                    placeholder="Enter experience"
                    type="text"
                    invalid={!!errors.experience}
                  />
                )}
              />
              {errors.experience && (
                <FormText color="danger">{errors.experience.message}</FormText>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="qualification">Qualification</Label>
              <Controller
                name="qualification"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="qualification"
                    placeholder="Enter qualification"
                    type="text"
                    invalid={!!errors.qualification}
                  />
                )}
              />
              {errors.qualification && (
                <FormText color="danger">{errors.qualification.message}</FormText>
              )}
            </FormGroup>
            <FormGroup>
  <Label for="jobType">Job Type</Label>
  <Controller
    name="jobType"
    control={control}
    defaultValue={jobTypes[0]}
    render={({ field }) => (
      <Input
        {...field}
        type="select"
        id="jobType"
        invalid={!!errors.jobType}
      >
        {jobTypes.map((jobType) => (
          <option key={jobType} value={jobType}>
            {jobType}
          </option>
        ))}
      </Input>
    )}
  />
  {errors.jobType && <FormText color="danger">{errors.jobType.message}</FormText>}
</FormGroup>
<FormGroup>
  <Label for="contractType">Contract Type</Label>
  <Controller
    name="contractType"
    control={control}
    defaultValue={contractTypes[0]}
    render={({ field }) => (
      <Input
        {...field}
        type="select"
        id="contractType"
        invalid={!!errors.contractType}
      >
        {contractTypes.map((contractType) => (
          <option key={contractType} value={contractType}>
            {contractType}
          </option>
        ))}
      </Input>
    )}
  />
  {errors.contractType && <FormText color="danger">{errors.contractType.message}</FormText>}
</FormGroup>
            <FormGroup>
              <Label for="benefit">Benefit</Label>
              <Controller
                name="benefit"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="benefit"
                    placeholder="Enter benefit"
                    type="textarea"
                    invalid={!!errors.benefit}
                  />
                )}
              />
              {errors.benefit && (
                <FormText color="danger">{errors.benefit.message}</FormText>
              )}
            </FormGroup>
            <FormGroup>
  <Label for="expire">Expire</Label>
  <Controller
    name="expire"
    control={control}
    render={({ field }) => (
      <Input
        {...field}
        id="expire"
        placeholder="Enter expire date"
        type="date"
        invalid={!!errors.expire}
      />
    )}
  />
  {errors.expire && (
    <FormText color="danger">{errors.expire.message}</FormText>
  )}
</FormGroup>
            <FormGroup>
              <Label for="slot">Slot</Label>
              <Controller
                name="slot"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="slot"
                    placeholder="Enter slot"
                    type="number"
                    invalid={!!errors.slot}
                  />
                )}
              />
              {errors.slot && (
                <FormText color="danger">{errors.slot.message}</FormText>
              )}
            </FormGroup>
       
            <FormGroup>
              <Label for="isSuperHot">Is Super Hot</Label>
              <Controller
                name="isSuperHot"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="checkbox"
                    id="isSuperHot"
                    invalid={!!errors.isSuperHot}
                  />
                )}
              />
              {errors.isSuperHot && (
                <FormText color="danger">{errors.isSuperHot.message}</FormText>
              )}
            </FormGroup>
            <FormGroup>
  <Label for="companyId">Company ID</Label>
  <Controller
    name="companyId"
    control={control}
    render={({ field }) => (
      <Input
        {...field}
        id="companyId"
        placeholder="Enter company ID"
        type="number"
        invalid={!!errors.companyId}
      />
    )}
  />
  {errors.companyId && (
    <FormText color="danger">{errors.companyId.message}</FormText>
  )}
</FormGroup>
<FormGroup>
              <Label for="categoryId">Category</Label>
              {categories.map(category => (
                <div key={category.categoryId} className="form-check">
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id={`category_${category.categoryId}`}
                        type="checkbox"
                        value={category.categoryId}
                        checked={field.value.includes(category.categoryId)}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          const newValue = e.target.checked
                            ? [...field.value, value]
                            : field.value.filter(id => id !== value);
                          field.onChange(newValue);
                        }}
                        className="form-check-input"
                        invalid={!!errors.categoryId}
                      />
                    )}
                  />
                  <Label for={`category_${category.categoryId}`} className="form-check-label">
                    {category.categoryName}
                  </Label>
                </div>
              ))}
              {errors.categoryId && (
                <FormText color="danger">{errors.categoryId.message}</FormText>
              )}
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit">
              {isEdit ? "Update" : "Submit"}
            </Button>
            <Button color="secondary" type="button" onClick={toggleNewJobModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
}