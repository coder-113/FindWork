import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosRequest from "../../configs/axiosConfig";
import PDFViewer from "pdf-viewer-reactjs";
import "./pdf-viewer.css";

const PdfDetail = () => {
  const { id } = useParams();
  const [pdf, setPdf] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };
  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await axiosRequest.get(`/templates/document/${id}`);
        setPdf(response); // Assuming response contains data
      } catch (error) {
        console.error("Error fetching PDF:", error);
        setError("Failed to load PDF");
      }
    };

    fetchPdf();
  }, [id]);

  return (
    <div className="pdf-detail-container">
      <h2>CV Viewer</h2>
      <button className="back-to-list" onClick={handleGoBack}>
        Go Back
      </button>
      {pdf ? (
        <div className="pdf-viewer-container">
          <PDFViewer
            document={{
              base64: pdf.pdfContent,
            }}
            css="customViewer"
            scale={1.5} // Adjust scale if needed
          />
        </div>
      ) : (
        <p>{error || "Loading PDF..."}</p>
      )}
    </div>
  );
};

export default PdfDetail;
