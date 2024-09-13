import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Row, Col, Card, CardTitle, InputGroup, InputGroupText, Input } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteJobById, fetchJobs, addJob, updateJobById } from "../../../features/jobSlice";
import { JobForm } from "./JobForm";

export function Job(props) {
  const dispatch = useDispatch();
  const list = useSelector((state) => state.jobs.list) || [];
  const jobStatus = useSelector((state) => state.jobs.status);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEdit, setIsEdit] = useState(null);
  const [newJobModal, setNewJobModal] = useState(false);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      dispatch(deleteJobById(id));
    }
  };

  const handleEdit = (id) => {
    const editJob = list.find((item) => item && item.id === id);
    if (editJob) {
      setIsEdit(editJob);
      toggleNewJobModal();
    }
  };

  const toggleNewJobModal = () => {
    setNewJobModal(!newJobModal);
    if (newJobModal) {
      setIsEdit(null); // Reset form when modal is closed
    }
  };

  const handleFormSubmit = (jobData) => {
    if (isEdit) {
      dispatch(updateJobById(jobData));
    } else {
      dispatch(addJob(jobData));
    }
    toggleNewJobModal();
  };

  const columns = [
    {
      name: "Job Title",
      selector: (row) => row.title || 'N/A',
      sortable: true,
    },
    {
      name: "Offered Salary",
      selector: (row) => row.offeredSalary || 'N/A',
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description || 'N/A',
      sortable: true,
    },
    {
      name: "Responsibilities",
      selector: (row) => row.responsibilities || 'N/A',
      sortable: true,
    },
    {
      name: "Required Skills",
      selector: (row) => row.requiredSkills || 'N/A',
      sortable: true,
    },
    {
      name: "Work Schedule",
      selector: (row) => row.workSchedule || 'N/A',
      sortable: true,
    },
    {
      name: "Key Skills",
      selector: (row) => row.keySkills || 'N/A',
      sortable: true,
    },
    {
      name: "Position",
      selector: (row) => row.position || 'N/A',
      sortable: true,
    },
    {
      name: "Experience",
      selector: (row) => row.experience || 'N/A',
      sortable: true,
    },
    {
      name: "Qualification",
      selector: (row) => row.qualification || 'N/A',
      sortable: true,
    },
    {
      name: "Job Type",
      selector: (row) => row.jobType || 'N/A',
      sortable: true,
    },
    {
      name: "Contract Type",
      selector: (row) => row.contractType || 'N/A',
      sortable: true,
    },
    {
      name: "Benefit",
      selector: (row) => row.benefit || 'N/A',
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) => row.createdAt ? new Date(row.createdAt).toLocaleString() : 'N/A',
      sortable: true,
    },
    {
      name: "Slot",
      selector: (row) => row.slot || 'N/A',
      sortable: true,
    },
    {
      name: "Profile Approved",
      selector: (row) => row.profileApproved || 'N/A',
      sortable: true,
    },
    {
      name: "Is Super Hot",
      selector: (row) => row.isSuperHot ? "Yes" : "No",
      sortable: true,
    },
    {
      name: "Expire",
      selector: (row) => row.expire ? row.expire : "No",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex">
          <button onClick={() => handleEdit(row.id)} className="btn btn-info">
            Edit
          </button>
          <button onClick={() => handleDelete(row.id)} className="btn btn-danger">
            Delete
          </button>
        </div>
      ),
    },
  ];

  const filteredData = list.filter((job) => job && job.title && job.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Row>
      <Col lg="12">
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-card-text me-2"></i>
            Job List
          </CardTitle>
          <InputGroup className="mb-3">
            <InputGroupText>Search</InputGroupText>
            <Input
              type="text"
              placeholder="Search by title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          <DataTable
            columns={columns}
            data={filteredData}
          />
          <button onClick={toggleNewJobModal} className="btn btn-primary">
            Add New Job
          </button>
        </Card>
      </Col>
      <JobForm
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        newJobModal={newJobModal}
        toggleNewJobModal={toggleNewJobModal}
        handleFormSubmit={handleFormSubmit}
      />
    </Row>
  );
}

export default Job;