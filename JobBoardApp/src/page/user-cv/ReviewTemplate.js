import React, { useEffect, useState, useRef } from "react";
import axiosRequest from "../../configs/axiosConfig";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import ReviewBox from "../../components/dialog-box/ReviewBox";
import WaveLoader from "../../components/loading-spinner/LoadingSpinner";
import "../../assets/css/review-template.css";
import Ads from "../../components/dialog-box/Ads.js";
const CVSelector = ({ cvs, currentCvId, onCVChange }) => (
  <div className="text-center">
    <h3 className="text-review-css">Click to change cv details</h3>
    <div className="action-item-rv cv-selector-item">
      <div className="cv-selector-container text-dark">
        <select
          value={currentCvId}
          onChange={(e) => onCVChange(e.target.value)}
          className="cv-selector"
        >
          <option value="" disabled selected>
            Select a CV
          </option>
          {cvs.map((cv) => (
            <option key={cv.cvId} value={cv.cvId} className="text-dark">
              {cv.cvTitle}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>
);

const TemplateViewer = () => {
  const { templateName: key, cvId, templateId } = useParams();
  const [templateContent, setTemplateContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const userId = useSelector((state) => state.auth.user.id);
  const navigate = useNavigate();
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const templatePreviewRef = useRef(null);
  const [showDialog, setShowDialog] = useState(false);
  const [userCVs, setUserCVs] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(10);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [hasWatchedAd, setHasWatchedAd] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const fetchTemplate = async () => {
    try {
      setIsLoading(true);
      const response = await axiosRequest.get(
        `/templates/review-template/${key}/${userId}/${cvId}/${templateId}`
      );
      setTemplateContent(response);
    } catch (error) {
      console.error("Error fetching template:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWatchAd = () => {
    setShowPrintDialog(false);
    setShowAd(true);
    setHasWatchedAd(true);
  };

  const handleCloseAd = () => {
    setShowAd(false);
    handlePrintToPdf().then(() => {
      setHasWatchedAd(false);
    });
  };

  const fetchUserCVs = async () => {
    try {
      const response = await axiosRequest.get(`/usercv/list-cvs/${userId}`);
      setUserCVs(response);
    } catch (error) {
      console.error("Error fetching user CVs:", error);
    }
  };

  const handlePrintToPdf = async () => {
    if (isPrinting) return; // Prevent multiple clicks

    try {
      setIsPrinting(true); // Start loading

      if (!hasWatchedAd) {
        const countResponse = await axiosRequest.get(
          `/templates/count/${userId}`
        );
        const pdfCount = countResponse;

        if (pdfCount >= 1) {
          setShowPrintDialog(true);
          setIsPrinting(false); // End loading if showing dialog
          return;
        }
      }
      const cvTitle =
        userCVs.find((cv) => cv.cvId === parseInt(cvId))?.cvTitle ||
        "cv_template";

      const response = await axiosRequest.get(
        `/templates/generate/${userId}/${cvId}`,
        {
          responseType: "blob",
        }
      );

      if (!(response instanceof Blob)) {
        throw new Error("Invalid response: expected Blob");
      }

      const pdfUrl = URL.createObjectURL(response);
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `${cvTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const pdfData = await response.arrayBuffer();
      const byteArray = new Uint8Array(pdfData);

      const formData = new FormData();
      formData.append("name", `${cvTitle}.pdf`);
      formData.append(
        "fileData",
        new Blob([byteArray], { type: "application/pdf" })
      );

      await axiosRequest.post(
        `/templates/pdf-document/save/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccessMessage("PDF generated and saved successfully!");
      startCountdown();
    } catch (error) {
      console.error("Error generating or saving PDF:", error);
      alert(`Error generating or saving PDF: ${error.message}`);
    } finally {
      setIsPrinting(false); // End loading
    }
  };

  const startCountdown = () => {
    let count = 5;
    const timer = setInterval(() => {
      setCountdown(count);
      count--;
      if (count < 0) {
        clearInterval(timer);
        navigate("/cv-management", { state: { action: "cvHis" } });
      }
    }, 1000);
  };

  const handleUpdateCV = () => {
    navigate(`/cv-management`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  useEffect(() => {
    setShowDialog(true);
    fetchTemplate();
    fetchUserCVs();
    setHasWatchedAd(false);
  }, [key, userId, cvId]);

  const handleCVChange = async (newCvId) => {
    try {
      setIsLoading(true);
      const response = await axiosRequest.get(
        `/templates/review-template/${key}/${userId}/${newCvId}/${templateId}`
      );
      setTemplateContent(response);
      await axiosRequest.put("/templates/select-template", null, {
        params: {
          userId: userId,
          cvId: newCvId,
          templateId: templateId,
        },
      });
      navigate(`/review-template/${key}/${userId}/${newCvId}/${templateId}`, {
        replace: true,
      });
    } catch (error) {
      console.error("Error changing CV:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = templatePreviewRef.current.scrollTop;
      setShowScrollToTop(scrollHeight > 300);
    };

    const templatePreviewElement = templatePreviewRef.current;
    if (templatePreviewElement) {
      templatePreviewElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (templatePreviewElement) {
        templatePreviewElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const scrollToTop = () => {
    const templatePreviewElement = templatePreviewRef.current;
    if (templatePreviewElement) {
      templatePreviewElement.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="container-fluid">
      <div className="container-fluid">
        <ReviewBox isOpen={showDialog} onClose={handleCloseDialog} />
      </div>
      <div className="row">
        <div className="col-md-3">
          <div className="actions-container-rv">
            <div className="actions-title text-center">Actions</div>
            <hr className="hr-review-css m-2" />
            <div className="action-items-rv d-flex flex-column">
              <div className="action-item-rv cv-selector-item">
                <CVSelector
                  cvs={userCVs}
                  currentCvId={cvId}
                  onCVChange={handleCVChange}
                />
              </div>
              <div
                className={`action-item-rv ${isPrinting ? "disabled" : ""}`}
                onClick={handlePrintToPdf}
              >
                <span className="icon">
                  {isPrinting ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fas fa-print"></i>
                  )}
                </span>
                {isPrinting ? "Printing..." : "Print to PDF"}
              </div>
              <div className="action-item-rv" onClick={handleUpdateCV}>
                <span className="icon">
                  <i className="fas fa-edit"></i>
                </span>
                Update CV
              </div>
              <div className="action-item-rv" onClick={handleGoBack}>
                <span className="icon">
                  <i className="fas fa-arrow-left"></i>
                </span>
                Go Back
              </div>
              <div className="action-item-rv" onClick={scrollToTop}>
                <span className="icon">
                  <i className="fas fa-arrow-up"></i>
                </span>
                ScrollTop
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-9">
          {isLoading ? (
            <WaveLoader />
          ) : (
            <div className="template-preview" ref={templatePreviewRef}>
              <div dangerouslySetInnerHTML={{ __html: templateContent }} />
            </div>
          )}
          {successMessage && (
            <div className="success-dialog-overlay">
              <div className="success-dialog">
                <p>{successMessage}</p>
                <p>
                  Redirecting in <i className="text-danger">{countdown}</i>{" "}
                  seconds...
                </p>
              </div>
            </div>
          )}
          {showScrollToTop && (
            <button className="scroll-to-top-button" onClick={scrollToTop}>
              <i className="fas fa-arrow-up"></i>
            </button>
          )}
          {showPrintDialog && (
            <div className="dialog-overlay-ad">
              <div className="dialog-box-ad">
                <p>
                  You have exceeded your free print limit. Please watch an ad to
                  continue.
                </p>
                <div className="ad-container">
                  <h6>Ads content goes here.</h6>
                  <button
                    className="button-ad button-watch-ad m-2"
                    onClick={handleWatchAd}
                  >
                    Watch Ad
                  </button>
                  <button
                    className="button-ad button-cancel-ad m-2"
                    onClick={() => setShowPrintDialog(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {showAd && <Ads onClose={handleCloseAd} />}
        </div>
      </div>
    </div>
  );
};

export default TemplateViewer;
