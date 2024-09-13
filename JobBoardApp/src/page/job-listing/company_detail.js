import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import moment from 'moment';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { fetchCompanyThunk } from "../../features/companySlice";
import { fetchJobThunk } from "../../features/jobSlice";
import { fetchCategoryThunk } from "../../features/categorySlice";
import { checkUserReviewThunk, fetchReviewsThunk } from "../../features/reviewSlice"; // Đảm bảo import đúng
import { GlobalLayoutUser } from '../../components/global-layout-user/GlobalLayoutUser';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'reactstrap';
import './company-review.css';
import ReviewComponent from './ReviewComponent';
import DOMPurify from 'dompurify';

export const CompanyDetail = () =>
{
   const { id } = useParams();
   const companyId = parseInt(id ?? '0', 10);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const companies = useSelector((state) => state.company.companies);
   const jobs = useSelector((state) => state.job.jobs);
   const categories = useSelector((state) => state.category.categories);
   const { hasReviewed } = useSelector((state) => state.review);
   const reviews = useSelector((state) => state.review.reviews) ?? [];

   const user = useSelector(state => state.auth.user);
   const userId = user ? user.id : null;
   const jobsPerPage = 5; // Number of jobs per page
   const [currentPage, setCurrentPage] = useState(1);

   const [activeTab, setActiveTab] = useState('overview');

   useEffect(() =>
   {
      if (companyId)
      {
         dispatch(checkUserReviewThunk(companyId));
         dispatch(fetchReviewsThunk(companyId));
      }
      dispatch(fetchCompanyThunk());
      dispatch(fetchJobThunk());
      dispatch(fetchCategoryThunk());
   }, [companyId]);

   const companyData = companies.find(company => company.companyId === companyId);
   const companyJobs = jobs.filter(job => job.companyId === companyId);
   const categoryArray = Array.isArray(categories) ? categories : [];
   // const categoryName = categoryArray.find(category => category.categoryId === id)?.categoryName;

   const cleanHTML = companyData ? DOMPurify.sanitize(companyData.description || '', { USE_PROFILES: { html: true } }) : '';

   const iframeRef = useRef(null);

   useEffect(() =>
   {
      const adjustIframeHeight = () =>
      {
         const iframe = iframeRef.current;
         if (iframe)
         {
            const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
            if (iframeDocument)
            {
               iframe.style.height = `${iframeDocument.body.scrollHeight}px`; // Set height based on content height
            }
         }
      };

      adjustIframeHeight();
      window.addEventListener('resize', adjustIframeHeight);

      const iframe = iframeRef.current;
      if (iframe)
      {
         iframe.addEventListener('load', adjustIframeHeight);
      }

      return () =>
      {
         window.removeEventListener('resize', adjustIframeHeight);
         if (iframe)
         {
            iframe.removeEventListener('load', adjustIframeHeight);
         }
      };
   }, [activeTab, cleanHTML]);

   const handleTabChange = (tab) =>
   {
      setActiveTab(tab);
   };

   const handlePageChange = useCallback((pageNumber) =>
   {
      setCurrentPage(pageNumber);
   }, []);

   const totalPages = Math.ceil(reviews.length / jobsPerPage);
   // Calculate the jobs to display based on the current page
   const indexOfLastJob = currentPage * jobsPerPage;
   const indexOfFirstJob = indexOfLastJob - jobsPerPage;

   const safeReviews = Array.isArray(reviews) ? reviews : [];
   const currentReviews = useMemo(() =>
   {
      const sanitizedReviews = safeReviews.map(review => ({
         ...review,
         description: review.description ? DOMPurify.sanitize(review.description, { USE_PROFILES: { html: true } }) : ''
      }));
      return sanitizedReviews.slice(indexOfFirstJob, indexOfLastJob);
   }, [reviews, indexOfFirstJob, indexOfLastJob]);

   const renderPaginationButtons = () =>
   {
      const pages = [];
      const maxVisiblePages = 10;

      if (totalPages <= maxVisiblePages)
      {
         for (let i = 1; i <= totalPages; i++)
         {
            pages.push(
               <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(i)}>
                     {i}
                  </button>
               </li>
            );
         }
      } else
      {
         pages.push(
            <li key={1} className={`page-item ${currentPage === 1 ? 'active' : ''}`}>
               <button className="page-link" onClick={() => handlePageChange(1)}>
                  1
               </button>
            </li>
         );

         if (currentPage > 3)
         {
            pages.push(<li key="left-ellipsis" className="page-item disabled"><span className="page-link">...</span></li>);
         }

         const startPage = Math.max(2, currentPage - 1);
         const endPage = Math.min(totalPages - 1, currentPage + 1);

         for (let i = startPage; i <= endPage; i++)
         {
            pages.push(
               <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(i)}>
                     {i}
                  </button>
               </li>
            );
         }

         if (currentPage < totalPages - 2)
         {
            pages.push(<li key="right-ellipsis" className="page-item disabled"><span className="page-link">...</span></li>);
         }

         pages.push(
            <li key={totalPages} className={`page-item ${currentPage === totalPages ? 'active' : ''}`}>
               <button className="page-link" onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
               </button>
            </li>
         );
      }
      return pages;
   };

   const getLocation1String = (address) =>
   {
      if (typeof address !== 'string')
      {
         return '';
      }
      const parts = address.split(", ");
      const len = parts.length;
      if (len >= 2)
      {
         return parts.slice(-2).join(", ");
      }
      return address;
   };

   const handleWriteReviewClick = () =>
   {
      if (!userId)
      {
         navigate(`/login`);
      }
      navigate(`/companyDetail/${companyId}/writeReview`);
   };

   const handleCompanyClick = (e, companyId) =>
   {
      e.preventDefault();
      navigate(`/companyDetail/${companyId}`);
   };

   const handleJobDetailClick = (e, jobId, companyId) =>
   {
      e.preventDefault();
      navigate(`/jobDetail/${jobId}/${companyId}`);
   };

   const handleCategoryClick = (e, categoryId) =>
   {
      e.preventDefault();
      navigate(`/jobList/${categoryId}`);
   };

   return (
      <GlobalLayoutUser>
         <>
            <section
               className="section-hero overlay rv_overlay inner-page bg-image"
               style={{
                  backgroundImage: 'url("../../../../assets/images/hero_1.jpg")',
               }}
               id="home-section"
            >
               <div className="container">
                  <div className="row">
                     <div className="col-md-7">
                        <h1 className="text-white font-weight-bold">{companyData?.companyName}</h1>
                     </div>
                  </div>
               </div>
            </section>
            <div className="container-fluid custom-container pt-5 pb-5">
               <div className="row">
                  <div className="col-xl-12 col-lg-10">
                     <div className="row">
                        {/* Tab Navigation */}
                        <div className="col-11 ml-6 mb-0">
                           <ul className="nav nav-tabs">
                              <li className="nav-item">
                                 <button
                                    className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                                    onClick={() => handleTabChange('overview')}
                                    style={{ paddingBottom: "11px", paddingTop: "11px" }}
                                 >
                                    Overview
                                 </button>
                              </li>
                              <li className="nav-item">
                                 <button
                                    className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                                    onClick={() => handleTabChange('reviews')}
                                 >
                                    Reviews
                                    <span className="badge bg-success text-light rounded-pill border border-light p-2 ml-2" style={{ fontSize: "15px" }}>
                                       {reviews.length}
                                    </span>
                                 </button>
                              </li>
                           </ul>
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'overview' && (
                           <div className="row">
                              {/* Left Content */}
                              <div className="col-xl-8 col-lg-8 p-5 mt-5 mr-0">
                                 <div className="card shadow-lg ml-6 p-5 mr-0 text-dark bg-light">
                                    <div className="d-flex align-items-center mb-3">
                                       <img
                                          className="rounded border border-light bg-white shadow-sm mr-3 img-fluid"
                                          src={companyData?.logo}
                                          alt="Company Logo"
                                          style={{ width: '13em', height: '13em', objectFit: 'contain' }}
                                       />
                                       <div className="container">
                                          <div className="row">
                                             <div className="col-12 mb-0">
                                                <h4 className="font-weight-bold" style={{ fontSize: '30px' }}>
                                                   {companyData?.companyName}
                                                </h4>
                                             </div>
                                             <div className="col-12 mr-4 mt-0">
                                                <Button
                                                   className={`btn ${hasReviewed ? "rv_btn-reviewed" : "rv_btn-write"} mr-6 mt-6`}
                                                   onClick={!hasReviewed ? handleWriteReviewClick : undefined}
                                                   disabled={hasReviewed}
                                                >
                                                   {hasReviewed ? "Reviewed" : "Write Review"}
                                                </Button>
                                             </div>
                                          </div>
                                       </div>
                                    </div>

                                    <div>
                                       <iframe
                                          key={activeTab}
                                          ref={iframeRef}
                                          srcDoc={`
                                          <!DOCTYPE html>
                                          <html>
                                          <head>
                                           <meta charset="UTF-8">
                                             <style>
                                                html, body {
                                                font-family: Arial, sans-serif;
                                                word-wrap: break-word;
                                                overflow: hidden; /* Hide internal scrollbars */
                                                height: auto;
                                                width:auto;
                                                box-sizing: border-box;
                                                }
                                             </style>
                                          </head>
                                          <body>
                                             ${cleanHTML}
                                          </body>
                                          </html>`}
                                          style={{ border: 'none', overflow: 'hidden', width: '100%', height: 'auto' }} // Ensure no scrollbars
                                          title="Company Description"
                                       />
                                    </div>
                                 </div>
                              </div>

                              {/* Right Content */}
                              <div className="col-xl-4 col-lg-4 p-6">
                                 <div className="card shadow-sm p-4 bg-light">
                                    <h5 className="card-title">General Information</h5>
                                    <ul className="list-unstyled">
                                       <li className="mb-2 d-flex justify-content-between align-items-start"><strong className='text-secondary'>Company Type:</strong> <span className="text-dark">{companyData?.type}</span></li>
                                       <li className="mb-2 d-flex justify-content-between align-items-start"><strong className='text-secondary'>Company Size:</strong> <span className="text-dark">{companyData?.companySize}</span></li>
                                       <li className="mb-2 d-flex justify-content-between align-items-start"><strong className='text-secondary'>Country:</strong> <span className="text-dark"><i className={`fi fi-${companyData?.countryCode} border border-gray rounded-sm`} style={{ width: '1.4em', lineHeight: '1em' }}></i> {companyData?.country}</span></li>
                                       <li className="mb-2 d-flex justify-content-between align-items-start"><strong className='text-secondary'>Working Days:</strong> <span className="text-dark">{companyData?.workingDays}</span></li>
                                    </ul>
                                 </div>
                                 <div className="card shadow-sm p-4 bg-light">
                                    <h5 className="card-title">Contact Information</h5>
                                    <ul className="list-unstyled">
                                       <li className="mb-2"><strong className='text-secondary'>Website:</strong> <a href={companyData?.websiteLink} className="text-primary" target="_blank" rel="noopener noreferrer">{companyData?.websiteLink}</a></li>
                                       <li className="mb-2 "><strong className='text-secondary'>Office Address</strong><span className="text-dark">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FaMapMarkerAlt className="mr-1" />{companyData?.location}</span></li>
                                    </ul>
                                 </div>
                                 <div className="card shadow-sm p-4 bg-light">
                                    <h5 className="card-title mb-4">Tech Stack</h5>
                                    <div>
                                       {companyData?.keySkills.split(',').map((skill, index) => (
                                          <span key={index} className="text-dark rounded-lg bg-primary border border-gray mr-2 p-1" style={{ marginBottom: '8px', fontSize: '14px', display: 'inline-block' }}>{skill.trim()}</span>
                                       ))}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        )}

                        {activeTab === 'reviews' && (
                           <div className="col-xl-8 col-lg-10 mb-4">
                              <div className="p-4 ml-1">
                                 <div className="row mb-5 justify-content-center">
                                    <div className="col-md-7 text-center">
                                       <h2 className="section-title mb-2" style={{ fontSize: "25px" }}>{reviews.length} employee reviews</h2>
                                    </div>
                                 </div>
                                 <ul className="list-unstyled">
                                    {currentReviews.length === 0 ? (
                                       <li className="text-center">No reviews for this company.</li>
                                    ) : (
                                       currentReviews.map(review => (
                                          // review ? (
                                          <li key={review.id}>
                                             <ReviewComponent
                                                imageUrl={review.imageUrl}
                                                username={review.username}
                                                title={review.title}
                                                rating={review.rating}
                                                description={review.description}
                                             />
                                          </li>
                                          // ) : null
                                       ))
                                    )}
                                 </ul>

                              </div>
                              <div className="d-flex justify-content-center my-4">
                                 <nav>
                                    <ul className="pagination">
                                       {renderPaginationButtons()}
                                    </ul>
                                 </nav>
                              </div>
                           </div>
                        )}

                     </div>
                  </div>
               </div >
            </div >

            <div className="col-xl-8 col-lg-8 mb-4">
               <div className="p-4 ml-5">
                  <div className="row mb-5 justify-content-center">
                     <div className="col-md-4 text-center">
                        <h3 className="mb-2" style={{ fontSize: '25px', fontWeight: 'bold' }}>{companyJobs.length} job openings</h3>
                     </div>
                  </div>
                  <ul className="job-listings">
                     {companyJobs.length === 0 ? (
                        <li className="text-center">No jobs for this company.</li>
                     ) : (
                        companyJobs.map(job =>
                        {
                           const company = companies.find(company => company.companyId === job.companyId);
                           const address = getLocation1String(company?.location);
                           if (company)
                           {
                              return (
                                 <li className="col-12 job-listing d-block d-sm-flex pb-sm-0 mb-3 align-items-center jb_bg-light border border-gray rounded">
                                    <div className="job-listing-logo">
                                       <img
                                          src={company.logo}
                                          alt="Free Website"
                                          className="img-fluid p-0 d-inline-block rounded-sm me-2 bg-white"
                                          onClick={(e) =>
                                          {
                                             handleCompanyClick(e, job.companyId);
                                          }} style={{ width: '7em', height: '7em', objectFit: 'contain', cursor: 'pointer' }}
                                       />
                                    </div>
                                    <div className="job-listing-about d-sm-flex custom-width w-100 justify-content-between mx-4 gap-3 mt-4 mb-4">
                                       <div className="job-listing-position custom-width w-50 mb-3 mb-sm-0">
                                          <h2 className="mb-2" onClick={(e) =>
                                          {
                                             handleJobDetailClick(e, job.id, job.companyId);
                                             console.log(job.companyId);
                                          }} style={{ textDecoration: 'none', cursor: 'pointer' }}>{job.title}</h2>
                                          <strong onClick={(e) =>
                                          {
                                             handleCompanyClick(e, job.companyId);
                                          }} style={{ textDecoration: 'none', cursor: 'pointer' }}>{company.companyName}</strong>
                                          <div className="m-0 mt-3">
                                             {job.categoryId.map((id) =>
                                             {
                                                const categoryName = categoryArray.find(category => category.categoryId === id)?.categoryName;
                                                return categoryName ? (
                                                   <span key={id} onClick={(e) => handleCategoryClick(e, id)} className="jb_text1 bg-white border border-gray p-2 mr-2 rounded-pill text-dark" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                                                      {categoryName}
                                                   </span>
                                                ) : null;
                                             })}
                                          </div>
                                       </div>
                                       <div className="d-flex flex-column flex-sm-row align-items-start flex-grow-1 gap-3">
                                          <div className="justify-content-start me-3">
                                             <span className="icon-room me-2" /> {address}
                                          </div>
                                       </div>
                                       <div className="job-listing-meta ">
                                          <span className="badge bg-danger">{job.contractType}</span>
                                       </div>
                                    </div>

                                 </li>
                              );
                           }
                           return null;
                        })
                     )}
                  </ul>
               </div>
            </div>
         </>
      </GlobalLayoutUser >
   );
};
