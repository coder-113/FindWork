import React, { useEffect, useState } from 'react';
import axiosRequest from '../../configs/axiosConfig';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './pdf.css';

const ListPdf = () => {
  const [pdfs, setPdfs] = useState([]);
  const userId = useSelector(state => state.auth.user.id);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [pdfsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState('latest');

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const response = await axiosRequest.get(`/templates/list-document/${userId}`);
        const formattedResponse = response.map(pdf => ({
          ...pdf,
          createdAt: new Date(pdf.createdAt).toISOString().split('T')[0]
        }));
        setPdfs(formattedResponse);
      } catch (error) {
        console.error('Error fetching PDFs:', error);
        setError('Failed to load PDFs');
      }
    };

    fetchPdfs();
  }, [userId]);

  const handlePdfClick = (id) => {
    navigate(`/pdf-cv/${id}`);
  };

  const sortPdfs = (pdfs, order) => {
    return [...pdfs].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return order === 'latest' ? dateB - dateA : dateA - dateB;
    });
  };

  const sortedPdfs = sortPdfs(pdfs, sortOrder);
  const indexOfLastPdf = currentPage * pdfsPerPage;
  const indexOfFirstPdf = indexOfLastPdf - pdfsPerPage;
  const currentPdfs = sortedPdfs.slice(indexOfFirstPdf, indexOfLastPdf);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="pdf-list-container">
      <h2 className='pdf-letter-css'>Your PDFs</h2>
      <div className="filter-section">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="sort-select"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
      {currentPdfs.length > 0 ? (
        <>
          <ul className="pdf-list">
            {currentPdfs.map(pdf => (
              <li key={pdf.id} className="pdf-item" onClick={() => handlePdfClick(pdf.id)}>
                <div className="pdf-item-content">
                  <i className="fas fa-file-pdf pdf-icon m-2 pdf-icon-css"></i>
                  <span className="pdf-name">{pdf.fileName}</span>
                </div>
                <span className="pdf-date text-secondary">Created at: {pdf.createdAt}</span>
              </li>
            ))}
          </ul>
          <div className="row pagination-wrap">
            <div className="col-md-6 text-center text-md-left mb-4 mb-md-0">
              <span>Showing {indexOfFirstPdf + 1}-{Math.min(indexOfLastPdf, sortedPdfs.length)} Of {sortedPdfs.length} PDFs</span>
            </div>
            <div className="col-md-6 text-center text-md-right">
              <div className="custom-pagination ml-auto">
                <a href="#" className="prev" onClick={() => paginate(currentPage - 1)} style={{pointerEvents: currentPage === 1 ? 'none' : 'auto', opacity: currentPage === 1 ? 0.5 : 1}}>
                  Prev
                </a>
                <div className="d-inline-block">
                  {[...Array(Math.ceil(sortedPdfs.length / pdfsPerPage))].map((_, index) => (
                    <a
                      href="#"
                      key={index}
                      className={currentPage === index + 1 ? 'active' : ''}
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </a>
                  ))}
                </div>
                <a href="#" className="next" onClick={() => paginate(currentPage + 1)} style={{pointerEvents: currentPage === Math.ceil(sortedPdfs.length / pdfsPerPage) ? 'none' : 'auto', opacity: currentPage === Math.ceil(sortedPdfs.length / pdfsPerPage) ? 0.5 : 1}}>
                  Next
                </a>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className='text-info text-center'>No PDFs found, let's create one!</p>
      )}
    </div>
  );
};

export default ListPdf;
