import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import moment from 'moment';
import './job_company.css';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import ApplyBox from '../../components/dialog-box/Applybox';
import { fetchJobThunk } from "../../features/jobSlice";
import { fetchCompanyThunk } from "../../features/companySlice";
import { fetchCategoryThunk } from "../../features/categorySlice";
// import jobData1 from './job_data.json';
// import companyData1 from './company_data.json';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import 'flag-icons/css/flag-icons.min.css';
import parse from 'html-react-parser';
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle } from 'react-bootstrap-icons';
import axiosRequest from '../../configs/axiosConfig';
import tagMapping from './tagMapping';
import DOMPurify from 'dompurify';
import ReactDOMServer from 'react-dom/server';

export const JobSingle = () =>
{
   const { id } = useParams();
   const jobId = parseInt(id ?? '0', 10);
   // const [jobs, setJobs] = useState([]);
   const dispatch = useDispatch();
   const jobs = useSelector((state) => state.job.jobs);

   const user = useSelector(state => state.auth.user);
   const userId = user ? user.id : null;

   const companies = useSelector((state) => state.company.companies);
   const categories = useSelector((state) => state.category.categories);

   const [showApplyBox, setShowApplyBox] = useState(false);
   const [hasApplied, setHasApplied] = useState(false);
   const [isSaved, setIsSaved] = useState(false);
   const navigate = useNavigate();
   const [favoriteId, setFavoriteId] = useState(null);

   const checkIfApplied = async () =>
   {
      try
      {
         const response = await axiosRequest.get(`/application/user/${userId}/job/${jobId}`);
         setHasApplied(response === true); // Ensure `response.data` is boolean
      } catch (error)
      {
         console.error('Error checking application status', error);
      }
   };

   useEffect(() =>
   {
      dispatch(fetchCategoryThunk());
      if (companies.length === 0)
      {
         dispatch(fetchCompanyThunk());
      }
      if (jobs.length === 0)
      {
         dispatch(fetchJobThunk());
      }
      if (userId)
      {
         checkIfApplied();
      }
   }, [jobs.length, companies.length, userId, jobId]);

   useEffect(() =>
   {
      const jobData = jobs.find(job => job.id === jobId);
      if (jobData)
      {
         axiosRequest.get(`/favorite-jobs/list`)
            .then(data =>
            {
               const favorites = data;
               const found = favorites.find(fav => fav.jobId === jobId);
               if (found)
               {
                  setIsSaved(true);
                  setFavoriteId(found.favoriteId);
               }
            })
            .catch(error =>
            {
               console.error("Error checking job save status:", error);
            });
      }
   }, [jobId, jobs]);

   const jobData = jobs.find(job => job.id === jobId);
   console.log(jobData);
   const companyData = companies.find(company => company.companyId === jobData?.companyId);


   if (!jobData || !companyData)
   {
      return <div>Loading...</div>; // Hoặc bạn có thể chuyển hướng đến trang lỗi
   }
   const handleApplyClick = (e) =>
   {
      e.preventDefault();
      if (!userId)
      {
         navigate(`/login`);  // Redirect to login if user is not logged in
         return;  // Exit the function to prevent further actions
      }
      setShowApplyBox(true);
   };
   const handleCloseApplyBox = () =>
   {
      setShowApplyBox(false);
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

   const handleCompanyClick = (e, companyId) =>
   {
      e.preventDefault();
      navigate(`/companyDetail/${companyId}`);
   };

   const handleCategoryClick = (e, categoryId) =>
   {
      e.preventDefault();
      navigate(`/jobList/${categoryId}`);
   };

   const handleJobDetailClick = (e, jobId, companyId) =>
   {
      e.preventDefault();
      navigate(`/jobDetail/${jobId}/${companyId}`);
   };

   const addIconsToListItems = (htmlString) =>
   {
      return parse(htmlString, {
         replace: (domNode) =>
         {
            return parseChildNode(domNode);
         },
      });
   };

   const parseChildNode = (domNode) =>
   {
      if (domNode.type === 'text')
      {
         return domNode.data;
      }

      if (domNode.name === 'li')
      {
         return (
            <li className="d-flex align-items-start mb-2 trf">
               <span className="icon-check_circle mr-2 text-muted" />
               <span>{domNode.children.map((child, index) => (
                  <React.Fragment key={index}>{parseChildNode(child)}</React.Fragment>
               ))}</span>
            </li>
         );
      }

      if (domNode.type === 'tag')
      {
         const Tag = tagMapping[domNode.name] || domNode.name;
         return (
            <Tag {...domNode.attribs} style={{ color: 'black' }}>
               {domNode.children.map((child, index) => (
                  <React.Fragment key={index}>{parseChildNode(child)}</React.Fragment>
               ))}
            </Tag>
         );
      }
      return null;
   };

   const categoryArray = Array.isArray(categories) ? categories : [];

   const categoryIds = Array.isArray(jobData.categoryId) ? jobData.categoryId : [];
   const currentJobCategoryIds = new Set(categoryIds);

   const relatedJobs = jobs.filter(job =>
   {
      if (!Array.isArray(job.categoryId))
      {
         console.error("categoryId in job is not an array");
         return false;
      }

      // Loại bỏ job hiện tại
      if (job.id === jobId)
      {
         return false;
      }

      const jobCategoryIds = new Set(job.categoryId);

      for (const id of jobCategoryIds)
      {
         if (currentJobCategoryIds.has(id))
         {
            return true;
         }
      }
      return false;
   });

   const handleSaveJob = async (e) =>
   {
      e.preventDefault();
      try
      {
         if (isSaved)
         {
            // Remove job from favorites
            await axiosRequest.delete(`/favorite-jobs/delete/${favoriteId}`);
            setIsSaved(false);
            setFavoriteId(null);
         } else
         {
            // Save job
            const data = await axiosRequest.post('/favorite-jobs/add', { jobId });
            if (data && data.favoriteId)
            {
               setFavoriteId(data.favoriteId);
               setIsSaved(true);
            } else
            {
               console.error('Response does not contain favoriteId:', data);
               alert('Failed to save job.');
            }
         }
      } catch (error)
      {
         console.error("Error saving/removing job:", error);
         navigate(`/login`);
         // alert("Failed to save/remove job.");
      }
   };

   return (
      <GlobalLayoutUser>
         <>
            <section
               className="section-hero overlay inner-page bg-image"
               style={{
                  backgroundImage: 'url("../../../../assets/images/hero_1.jpg")',
               }}
               id="home-section"
            >
               <div className="container">
                  <div className="row">
                     <div className="col-md-7">
                        <h1 className="text-white font-weight-bold">
                           {jobData?.title}
                        </h1>
                        <div className="custom-breadcrumbs">
                           <a href="/">Home</a> <span className="mx-2 slash">/</span>
                           <NavLink to={'/viewAllJobs'}>Job</NavLink> <span className="mx-2 slash">/</span>
                           <span className="text-white">
                              <strong>{jobData?.title}</strong>
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
            <section className="site-section jb_content0">
               <div className="container-fluid jb_content1">
                  <div className="row align-items-center mb-5">
                     <div className="col-lg-8 mb-4 mb-lg-0">
                        <div className="d-flex align-items-center">
                           <div>
                              <h2 style={{ fontSize: '25px', fontWeight: 'bold' }}>{jobData?.title}</h2>
                              <div className="m-0 mt-3">
                                 <span className="icon-room" style={{ fontSize: '23px', marginLeft: '-3px' }} />
                                 <span className="text-dark ml-1">{companyData?.location}</span>
                              </div>
                              <div className="m-0 mt-3">
                                 {jobData.categoryId.map((id) =>
                                 {
                                    const categoryName = categoryArray.find(category => category.categoryId === id)?.categoryName;
                                    return categoryName ? (
                                       <NavLink key={id} onClick={(e) => handleCategoryClick(e, id)} className="jb_text1 bg-white border border-gray p-2 mr-2 rounded-pill text-dark" to={""}>
                                          {categoryName}
                                       </NavLink>
                                    ) : null;
                                 })}
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="col-lg-4">
                        <div className="row">
                           <div className="col-6">
                              <button
                                 // className="btn btn-block btn-light btn-md"
                                 className={`btn btn-block ${isSaved ? 'btn_saved_job' : 'btn-light'} btn-md`}
                                 onClick={(e) => handleSaveJob(e)}
                              >
                                 <span className="icon-heart-o mr-2 text-danger" />
                                 {isSaved ? 'Saved Job' : 'Save Job'}
                              </button>
                           </div>
                           <div className="col-6 jb-overview-content__apply-btn apply-btn">
                              {hasApplied ? (
                                 <button className="jb-apply-btn__btn btn bg-secondary text-light" disabled>
                                    Applied!
                                 </button>
                              ) : (
                                 <a
                                    href="#"
                                    className="jb-apply-btn__btn btn bg-primary text-light"
                                    onClick={handleApplyClick}>
                                    Apply Now
                                 </a>
                              )}
                           </div>
                           {showApplyBox && <ApplyBox company={jobData} jobId={jobId} userId={userId} onClose={handleCloseApplyBox} />}
                        </div>
                     </div>
                  </div>
                  <div className="row">
                     <div className="col-lg-8 text-dark">
                        <div className="mb-5">
                           <h3 className="h5 d-flex align-items-center mb-4 text-primary">
                              <span className="icon-align-left mr-3" />
                              Job description
                           </h3>
                           {addIconsToListItems(jobData?.description)}
                        </div>
                        <div className="mb-5">
                           <h3 className="h5 d-flex align-items-center mb-4 text-primary">
                              <span className="icon-align-left mr-3" />
                              Work schedule
                           </h3>
                           <ul className="list-unstyled m-0 p-0">
                              {addIconsToListItems(jobData?.workSchedule)}
                           </ul>
                        </div>
                        <div className="mb-5">
                           <h3 className="h5 d-flex align-items-center mb-4 text-primary">
                              <span className="icon-rocket mr-3" />
                              Your responsibilities
                           </h3>
                           <ul className="list-unstyled m-0 p-0">
                              {addIconsToListItems(jobData?.responsibilities)}
                           </ul>
                        </div>
                        <div className="mb-5">
                           <h3 className="h5 d-flex align-items-center mb-4 text-primary">
                              <span className="icon-book mr-3" />
                              Your skills and qualifications
                           </h3>
                           <ul className="list-unstyled m-0 p-0 ">
                              {addIconsToListItems(jobData?.qualification)}
                           </ul>
                           <ul className="list-unstyled m-0 p-0">
                              {addIconsToListItems(jobData?.requiredSkills)}
                           </ul>
                        </div>
                        <div className="mb-5">
                           <h3 className="h5 d-flex align-items-center mb-4 text-primary">
                              <span className="icon-turned_in mr-3" />
                              Benefits for you
                           </h3>
                           <ul className="list-unstyled m-0 p-0 trf1">
                              {addIconsToListItems(jobData?.benefit)}
                           </ul>
                        </div>
                     </div>
                     <div className="col-lg-4">
                        <div className="bg-light p-3 border rounded mb-4">
                           <h3 className="text-primary  mt-3 h5 pl-3 mb-3 ">
                              Job Summary
                           </h3>
                           <ul className="list-unstyled pl-3 mb-0">
                              <li className="d-flex justify-content-between mb-2">
                                 <strong className="text-black">Experience</strong>
                                 <span>{jobData?.experience}</span>
                              </li>
                              <li className="d-flex justify-content-between mb-2">
                                 <strong className="text-black">Level</strong>
                                 <span>{jobData?.position}</span>
                              </li>
                              <li className="d-flex justify-content-between mb-2">
                                 <strong className="text-black">Job type</strong>{" "}
                                 <span>{jobData?.jobType}</span>
                              </li>
                              <li className="d-flex justify-content-between mb-2">
                                 <strong className="text-black">Contract type</strong>
                                 <span>{jobData?.contractType}</span>
                              </li>
                              <li className="d-flex justify-content-between mb-2">
                                 <strong className="text-black">Number of recruits</strong>
                                 <span>{jobData?.slot} people</span>
                              </li>
                              <li className="d-flex justify-content-between mb-2">
                                 <strong className="text-black">Salary</strong>
                                 <span>{jobData?.offeredSalary}</span>
                              </li>
                              <li className="d-flex justify-content-between mb-2">
                                 <strong className="text-black">Application Deadline</strong>
                                 <span>{jobData?.expire}</span>
                              </li>
                           </ul>
                        </div>
                        <div className="bg-light p-3 border rounded">
                           <h3 className="text-primary  mt-3 h5 pl-3 mb-3 ">Company Information</h3>
                           <div className="px-3">
                              <div className="d-flex align-items-center">
                                 <img
                                    src={companyData?.logo}
                                    alt="Image"
                                    className="img-fluid border p-0 d-inline-block mr-3 rounded-sm bg-white"
                                    style={{ width: '8em', height: '8em', objectFit: 'contain' }}
                                 />
                                 <NavLink to={`/companyDetail/${jobData?.companyId}`} className="pt-3 pb-3 pr-3 pl-0" onClick={(e) => handleCompanyClick(e, jobData?.companyId)}>
                                    {companyData?.companyName}
                                 </NavLink>
                              </div>
                              <br />
                              <ul className="list-unstyled mb-0">
                                 <li className="d-flex justify-content-between mb-2">
                                    <strong className="text-black">Company type</strong>{" "}
                                    <span>{companyData?.type}</span>
                                 </li>
                                 <li className="d-flex justify-content-between mb-2">
                                    <strong className="text-black">Company size</strong>
                                    <span>{companyData?.companySize}</span>
                                 </li>
                                 <li className="d-flex justify-content-between mb-2">
                                    <strong className="text-black">Country</strong>
                                    <span><i className={`fi fi-${companyData?.countryCode} border border-gray rounded-sm`} style={{ width: '1.4em', lineHeight: '1em' }}></i>&nbsp;&nbsp;{companyData?.country}</span>
                                 </li>
                                 <li className="d-flex justify-content-between mb-2">
                                    <strong className="text-black">Working days</strong>{" "}
                                    <span>{companyData?.workingDays}</span>
                                 </li>
                              </ul>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
            <section className="site-section jb_content0" id="next">
               <div className="container-fluid">
                  <div className="row mb-5 justify-content-center">
                     <div className="col-md-7 text-center">
                        <h2 className="section-title mb-2">More jobs for you</h2>
                     </div>
                  </div>
                  <ul className="job-listings mb-5">
                     {relatedJobs.map(job =>
                     {
                        const company = companies.find(company => company.companyId === job.companyId);
                        const address = getLocation1String(company?.location);
                        if (company)
                        {
                           return (
                              <li className="col-12 job-listing d-block d-sm-flex pb-0 pb-sm-0 align-items-center mb-3 jb_bg-light border border-gray rounded">
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
                                                <span key={id} onClick={(e) => handleCategoryClick(e, id)} className="jb_text1 bg-white border border-gray p-2 mr-2 rounded-pill text-dark">
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
                     })}
                  </ul>
               </div>
            </section>
            <section className="bg-light pt-5 testimony-full">
               <div className="owl-carousel single-carousel">
                  <div className="container">
                     <div className="row">
                        <div className="col-lg-6 align-self-center text-center text-lg-left">
                           <blockquote>
                              <p>
                                 “Soluta quasi cum delectus eum facilis recusandae nesciunt
                                 molestias accusantium libero dolores repellat id in
                                 dolorem laborum ad modi qui at quas dolorum voluptatem
                                 voluptatum repudiandae.”
                              </p>
                              <p>
                                 <cite> — Corey Woods, @Dribbble</cite>
                              </p>
                           </blockquote>
                        </div>
                        <div className="col-lg-6 align-self-end text-center text-lg-right">
                           <img
                              src="../../../../assets/images/person_transparent_2.png"
                              alt="Image"
                              className="img-fluid mb-0"
                           />
                        </div>
                     </div>
                  </div>
                  <div className="container">
                     <div className="row">
                        <div className="col-lg-6 align-self-center text-center text-lg-left">
                           <blockquote>
                              <p>
                                 “Soluta quasi cum delectus eum facilis recusandae nesciunt
                                 molestias accusantium libero dolores repellat id in
                                 dolorem laborum ad modi qui at quas dolorum voluptatem
                                 voluptatum repudiandae.”
                              </p>
                              <p>
                                 <cite> — Chris Peters, @Google</cite>
                              </p>
                           </blockquote>
                        </div>
                        <div className="col-lg-6 align-self-end text-center text-lg-right">
                           <img
                              src="../../../../assets/images/person_transparent.png"
                              alt="Image"
                              className="img-fluid mb-0"
                           />
                        </div>
                     </div>
                  </div>
               </div>
            </section>
            <section
               className="pt-5 bg-image overlay-primary fixed overlay"
               style={{
                  backgroundImage: 'url("../../../../assets/images/hero_1.jpg")',
               }}
            >
               <div className="container">
                  <div className="row">
                     <div className="col-md-6 align-self-center text-center text-md-left mb-5 mb-md-0">
                        <h2 className="text-white">Get The Mobile Apps</h2>
                        <p className="mb-5 lead text-white">
                           Lorem ipsum dolor sit amet consectetur adipisicing elit
                           tempora adipisci impedit.
                        </p>
                        <p className="mb-0">
                           <a
                              href="#"
                              className="btn btn-dark btn-md px-4 border-width-2"
                           >
                              <span className="icon-apple mr-3" />
                              App Store
                           </a>
                           <a
                              href="#"
                              className="btn btn-dark btn-md px-4 border-width-2"
                           >
                              <span className="icon-android mr-3" />
                              Play Store
                           </a>
                        </p>
                     </div>
                     <div className="col-md-6 ml-auto align-self-end">
                        <img
                           src="../../../../assets/images/apps.png"
                           alt="Image"
                           className="img-fluid"
                        />
                     </div>
                  </div>
               </div>
            </section>
         </>
      </GlobalLayoutUser >
   );
};
export default JobSingle;
