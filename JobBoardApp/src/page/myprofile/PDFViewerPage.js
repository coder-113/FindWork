import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaDownload } from 'react-icons/fa';
import axios from 'axios';
import PDFViewer from 'pdf-viewer-reactjs';

const PDFViewerPage = () => {
  const { filename } = useParams();
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/certificates/certificate/${filename}`, {
          responseType: 'blob'
        });
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
      } catch (error) {
        console.error('Error fetching PDF:', error);
      }
    };

    fetchPdf();
  }, [filename]);

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div>
          <button onClick={() => navigate(-1)} style={buttonStyle}>
            <FaArrowLeft style={iconStyle} /> Back
          </button>
          <button 
            onClick={() => pdfUrl && window.open(pdfUrl, '_blank')}
            style={buttonStyle}
            disabled={!pdfUrl}
          >
            <FaDownload style={iconStyle} /> Download PDF
          </button>
        </div>
      </header>
      <main style={mainStyle}>
        {pdfUrl && (
          <PDFViewer
            document={{
              url: pdfUrl,
            }}
            navbarOnTop={true}
          />
        )}
      </main>
    </div>
  );
};

// Define your styles
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  alignItems: 'center',
  marginBottom: '20px',
};

const logoStyle = {
  height: '50px',
};

const buttonStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  margin: '0 10px',
  cursor: 'pointer',
  borderRadius: '5px',
  display: 'flex',
  alignItems: 'center',
};

const iconStyle = {
  marginRight: '5px',
};

const mainStyle = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export default PDFViewerPage;
