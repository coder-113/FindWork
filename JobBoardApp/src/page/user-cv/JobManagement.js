import React, { useState, useEffect } from "react";
import axiosRequest from "../../configs/axiosConfig";
import "./css/job-management.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const JobManagement = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(2);
  const userId = useSelector((state) => state.auth.user.id);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const response = await axiosRequest.get(`/application/user/${userId}`);
        setAppliedJobs(response);
        console.log("data", response);
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      }
    };
    fetchAppliedJobs();
  }, [userId]);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = appliedJobs.slice(indexOfFirstJob, indexOfLastJob);

  const handleJobClick = (jobId, companyId) => {
    navigate(`/jobDetail/${jobId}/${companyId}`);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="job-management">
      <h2 className="applied-letter-css">Applied Jobs</h2>
      {appliedJobs.length === 0 ? (
        <p className="text-center text-info">
          You haven't applied to any jobs yet.
        </p>
      ) : (
        <>
          <ul className="applied-jobs-list">
            {currentJobs.map((application) => (
              <li
                key={application.id}
                className="applied-job-item"
                onClick={() =>
                  handleJobClick(
                    application.jobDTO.id,
                    application.companyDTO.companyId
                  )
                }
              >
                <div className="job-header">
                  <div className="job-title">{application.jobDTO.title}</div>
                  <div
                    className={`job-status-tag ${
                      application.approved ? "approved" : "not-approved"
                    }`}
                  >
                    <i
                      className={`fas ${
                        application.approved
                          ? "fa-check-circle"
                          : "fa-times-circle"
                      }`}
                      style={{ marginRight: "5px" }}
                    ></i>
                    {application.approved ? "Viewed" : "unViewed"}
                  </div>
                </div>
                <div className="company-logo-name">
                  <img
                    src={application.companyDTO.logo}
                    alt={`${application.companyDTO.companyName} logo`}
                    className="company-logo"
                  />
                  <span className="company-name">
                    {application.companyDTO.companyName}
                  </span>
                  <div className="mt-1">
                    <i className="fas fa-dollar-sign text-secondary"></i>{" "}
                    Offered Salary: {application.jobDTO.offeredSalary}
                  </div>
                </div>
                <hr className="hr-css-job" />
                <div className="job-details">
                  <span className="detail-item">
                    <i className="fas fa-briefcase text-secondary"></i>{" "}
                    {application.jobDTO.jobType}
                  </span>
                </div>
                <div className="job-details">
                  <span className="detail-item">
                    <i className="fas fa-map-marker-alt text-secondary"></i>{" "}
                    {application.companyDTO.location}
                  </span>
                </div>
                <div className="job-tags">
                  <span className="tag">{application.jobDTO.position}</span>
                </div>
              </li>
            ))}
          </ul>
          <Pagination
            jobsPerPage={jobsPerPage}
            totalJobs={appliedJobs.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </>
      )}
    </div>
  );
};

const Pagination = ({ jobsPerPage, totalJobs, paginate, currentPage }) => {
  const totalPages = Math.ceil(totalJobs / jobsPerPage);

  return (
    <nav>
      <ul className="custom-pagination">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <a
            onClick={() => paginate(currentPage - 1)}
            href="#!"
            className="page-link prev"
          >
            Prev
          </a>
        </li>
        <li className="page-item current">
          <span className="page-link">
            {currentPage}/{totalPages}
          </span>
        </li>
        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <a
            onClick={() => paginate(currentPage + 1)}
            href="#!"
            className="page-link next"
          >
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default JobManagement;
