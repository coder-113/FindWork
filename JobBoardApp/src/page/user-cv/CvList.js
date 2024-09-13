import React, { useState, useEffect } from 'react';
import axiosRequest from '../../configs/axiosConfig';
import { useSelector } from 'react-redux';
import './css/user-cv-list.css';
import DefaultImage from '../../assets/images/doc-bg.jpeg';
import DetailsCv from './DetailsCv';
import UpdateCv from './UpdateCv';
import DeleteCv from './DeleteCv';

const CvCard = ({ cv, onView, onUpdate, onDelete }) => {
    const [showIcons, setShowIcons] = useState(false);
    return (
        <div
            className="cv-card"
            onMouseEnter={() => setShowIcons(true)}
            onMouseLeave={() => setShowIcons(false)}
        >
            <img
                src={DefaultImage}
                alt={cv.cvTitle}
                className="cv-card-image"
            />
            <div className="cv-card-content">
                <h3 className='cv-card-title'>{cv.cvTitle}</h3>
                <p>Created: {new Date(cv.createdAt).toLocaleDateString()}</p>
                <p>Updated: {new Date(cv.updatedAt).toLocaleDateString()}</p>
            </div>
            {showIcons && (
                <div className="cv-card-actions">
                    <button onClick={() => onView(cv)} title="View">
                        <i className="cv-icon-1 fas fa-eye"></i>
                    </button>
                    <button onClick={() => onUpdate(cv)} title="Edit">
                        <i className="cv-icon-2 fas fa-edit"></i>
                    </button>
                    <button onClick={() => onDelete(cv)} title="Delete">
                        <i className="cv-icon-3 fas fa-trash-alt"></i>
                    </button>
                </div>
            )}
        </div>
    );
};

const Dialog = ({ children }) => (
    <div className="dialog-overlay">
        <div className="dialog-content">
            {children}
        </div>
    </div>
);

const CvList = () => {
    const [cvs, setCvs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = useSelector(state => state.auth.user.id);
    const [showUpdateCv, setShowUpdateCv] = useState(false);
    const [showDeleteCv, setShowDeleteCv] = useState(false);
    const [showDetailsCv, setShowDetailsCv] = useState(false);
    const [selectedCv, setSelectedCv] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [sortOrder, setSortOrder] = useState('latest');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [cvsPerPage] = useState(5);

    useEffect(() => {
        const fetchCvs = async () => {
            try {
                const response = await axiosRequest.get(`/usercv/list-cvs/${userId}`);
                setCvs(response);
                setLoading(false);
            } catch (err) {
                setError('No CVs found. Please create a CV.');
                setLoading(false);
            }
        };

        fetchCvs();
    }, [userId, refreshTrigger]);

    const refreshList = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleView = async (cv) => {
        try {
            const response = await axiosRequest.get(`/usercv/view-cv/${cv.cvId}`);
            setSelectedCv(response);
            setShowDetailsCv(true);
            setShowDialog(true);
        } catch (error) {
            console.error('Error fetching CV details', error);
            setError('Error fetching CV details. Please try again.');
        }
    };

    const handleUpdate = (cv) => {
        setSelectedCv(cv);
        setShowUpdateCv(true);
        setShowDialog(true);
    };

    const handleDelete = (cv) => {
        setSelectedCv(cv);
        setShowDeleteCv(true);
        setShowDialog(true);
    };

    const sortCvs = (cvs, order) => {
        return [...cvs].sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return order === 'latest' ? dateB - dateA : dateA - dateB;
        });
    };

    const sortedCvs = sortCvs(cvs, sortOrder);

    // Get current CVs
    const indexOfLastCv = currentPage * cvsPerPage;
    const indexOfFirstCv = indexOfLastCv - cvsPerPage;
    const currentCvs = sortedCvs.slice(indexOfFirstCv, indexOfLastCv);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <div>Loading...</div>;
    if (error) return <h1 style={{ fontWeight: 'bolder', color: 'red', textAlign: 'center', fontSize: '1.5rem', marginTop: '20px' }}>{error}</h1>;

    return (
        <div className="cv-list-container">
              <h2 className='list-letter-css'>Cv Documents</h2>
            <div className="filter-section-list">
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="sort-select-list"
                >
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                </select>
            </div>
            <div className="cv-list">
                {currentCvs && currentCvs.length > 0 ? (
                    currentCvs.map((cv) => (
                        <CvCard
                            key={cv.cvId}
                            cv={cv}
                            onView={handleView}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                        />
                    ))
                ) : (
                    <p>No CVs available</p>
                )}
            </div>
            {sortedCvs.length > cvsPerPage && (
                <div className="row pagination-wrap">
                    <div className="col-md-6 text-center text-md-left mb-4 mb-md-0">
                        <span>Showing {indexOfFirstCv + 1}-{Math.min(indexOfLastCv, sortedCvs.length)} Of {sortedCvs.length} CVs</span>
                    </div>
                    <div className="col-md-6 text-center text-md-right">
                        <div className="custom-pagination ml-auto">
                            <a href="#" className="prev" onClick={() => paginate(currentPage - 1)} style={{ pointerEvents: currentPage === 1 ? 'none' : 'auto', opacity: currentPage === 1 ? 0.5 : 1 }}>
                                Prev
                            </a>
                            <div className="d-inline-block">
                                {[...Array(Math.ceil(sortedCvs.length / cvsPerPage))].map((_, index) => (
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
                            <a href="#" className="next" onClick={() => paginate(currentPage + 1)} style={{ pointerEvents: currentPage === Math.ceil(sortedCvs.length / cvsPerPage) ? 'none' : 'auto', opacity: currentPage === Math.ceil(sortedCvs.length / cvsPerPage) ? 0.5 : 1 }}>
                                Next
                            </a>
                        </div>
                    </div>
                </div>
            )}
            {showDialog && (
                <Dialog>
                    {showDetailsCv && <DetailsCv cv={selectedCv} onClose={() => { setShowDetailsCv(false); setShowDialog(false); }} />}
                    {showUpdateCv && <UpdateCv userId={userId} cvId={selectedCv.cvId} onClose={() => { setShowUpdateCv(false); setShowDialog(false); refreshList(); }} />}
                    {showDeleteCv && (
                        <DeleteCv
                            userId={userId}
                            cv={selectedCv}
                            cvId={selectedCv.cvId}
                            onDelete={() => {
                                setShowDeleteCv(false);
                                setShowDialog(false);
                                refreshList();
                            }}
                            onCancel={() => { setShowDeleteCv(false); setShowDialog(false); }}
                        />
                    )}
                </Dialog>
            )}
        </div>
    );
};

export default CvList;
