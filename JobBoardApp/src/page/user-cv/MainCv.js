import React, { useState, useEffect } from "react";
import axiosRequest from "../../configs/axiosConfig";
import CreateCv from "./CreateCv";
import CvList from "./CvList";
import ListPdf from "../pdf-management/ListPdf";
import JobManagement from "./JobManagement";
import { useSelector } from "react-redux";
import "./css/main.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

function MainCv() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentAction, setCurrentAction] = useState(
    location.state?.action || "default"
  );
  const user = useSelector((state) => state.auth.user);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (location.state?.action) {
      setCurrentAction(location.state.action);
    }
  }, [location.state]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const renderNotification = () => {
    if (notification) {
      return (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      );
    }
    return null;
  };

  const renderDisplayArea = () => {
    return (
      <>
        {renderNotification()}
        {(() => {
          switch (currentAction) {
            case "create":
              return <CreateCv />;
            case "cvHis":
              return <ListPdf />;
            case "cvDetails":
              return <CvList />;
            case "jobMnt":
              return <JobManagement />;
            default:
              return (
                <div className="default-info">
                  <div className="welcome-overlay">
                    <h2 className="welcome fade-in">
                      Welcome back <i className="userName">{user.lastName}</i> !
                    </h2>
                  </div>
                </div>
              );
          }
        })()}
      </>
    );
  };

  return (
    <div className="main-cv-wrapper">
      <section className="p-4">
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <h1 className="green-text font-weight-bold">CV Management</h1>
              <div className="custom-breadcrumbs">
                <a href="/">Home</a> <span className="mx-2 slash">/</span>
                <span className="text-white font-weight-bold">
                  CV Management
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="main-cv-container">
        <div className="actions-container">
          <h2>Local Actions</h2>
          <div
            className={`action-item ${
              currentAction === "create" ? "active" : ""
            }`}
            onClick={() => {
              setCurrentAction("create");
              navigate("/cv-management", { state: { action: "create" } });
            }}
          >
            <i className="fas fa-plus mr-2"></i> Create CV
          </div>
          <div
            className={`action-item ${
              currentAction === "cvDetails" ? "active" : ""
            }`}
            onClick={() => {
              setCurrentAction("cvDetails");
              navigate("/cv-management", { state: { action: "cvDetails" } });
            }}
          >
            <i className="fas fa-info-circle mr-2"></i> CV Details
          </div>
          <div
            className={`action-item ${
              currentAction === "cvHis" ? "active" : ""
            }`}
            onClick={() => {
              setCurrentAction("cvHis");
              navigate("/cv-management", { state: { action: "cvHis" } });
            }}
          >
            <i className="fas fa-history mr-2"></i> CV History
          </div>
          <div
            className={`action-item ${
              currentAction === "jobMnt" ? "active" : ""
            }`}
            onClick={() => {
              setCurrentAction("jobMnt");
              navigate("/cv-management", { state: { action: "jobMnt" } });
            }}
          >
            <i className="fas fa-box mr-2"></i> Applied Jobs
          </div>

          <hr
            style={{
              backgroundColor: "white",
              width: "100%",
            }}
          />
          <h2 className="mt-3">Global Actions</h2>
          <Link to="/list-template">
            <div className="global-action-item">
              <i className="fas fa-list mr-2"></i> List Template
            </div>
          </Link>
          <Link to="/quiz">
            <div className="global-action-item">
              <i className="fas fa-question-circle mr-2"></i> To Quiz
            </div>
          </Link>
          <Link to="/blogs">
            <div className="global-action-item">
              <i className="fas fa-blog mr-2"></i> To Blog
            </div>
          </Link>
          <Link to="/viewAllJobs">
            <div className="global-action-item">
              <i className="fas fa-list-ul mr-2"></i> To Job List
            </div>
          </Link>
        </div>

        <div className="display-area">{renderDisplayArea()}</div>
      </div>
    </div>
  );
}

export default MainCv;
