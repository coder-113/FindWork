import React, { useEffect, useState } from 'react';
import axiosRequest from '../../configs/axiosConfig';
import "./job_company.css";
import moment from 'moment';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { fetchCategoryThunk } from "../../features/categorySlice";
import { fetchJobThunk } from "../../features/jobSlice";
import { useDispatch, useSelector } from 'react-redux';
import { GlobalLayoutUser } from '../../components/global-layout-user/GlobalLayoutUser';
import ApplyBox from '../../components/dialog-box/Applybox';

export const SavedJobs = () =>
{
    const { jobId } = useParams();
    const dispatch = useDispatch();
    const [savedJobs, setSavedJobs] = useState([]);
    const [favoriteJobs, setFavoriteJobs] = useState([]);
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user);
    const userId = user ? user.id : null;
    const jobs = useSelector((state) => state.job.jobs);
    const categories = useSelector((state) => state.category.categories);

    useEffect(() =>
    {
        if (!userId)
        {
            navigate(`/login`);
        }
        dispatch(fetchCategoryThunk());
        dispatch(fetchJobThunk());
        fetchSavedJobs();
    }, [userId]);

    const fetchSavedJobs = async () =>
    {
        try
        {
            const data = await axiosRequest.get('/favorite-jobs/list');
            if (Array.isArray(data))
            {
                setSavedJobs(data);
                setFavoriteJobs(new Set(data.map(job => job.favoriteId)));
            } else
            {
                console.error('Expected an array but got:', data);
                setSavedJobs([]);
            }
        } catch (error)
        {
            console.error("Error fetching saved jobs:", error);
            setSavedJobs([]);
        }
    };

    const handleSaveJob = async (e, favoriteId) =>
    {
        e.preventDefault();
        try
        {
            await axiosRequest.delete(`/favorite-jobs/delete/${favoriteId}`);
            setSavedJobs(prev => prev.filter(job => job.favoriteId !== favoriteId))
        } catch (error)
        {
            console.error("Error saving/removing job:", error);
            alert("Failed to save/remove job.");
        }
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

    const formatJobPostedTime = (date) =>
    {
        const now = moment();
        const createdAt = moment(date);

        const monthsAgo = now.diff(createdAt, 'months');
        const weeksAgo = now.diff(createdAt, 'weeks');
        const daysAgo = now.diff(createdAt, 'days');
        const hoursAgo = now.diff(createdAt, 'hours');
        const minutesAgo = now.diff(createdAt, 'minutes');
        const secondsAgo = now.diff(createdAt, 'seconds');

        if (monthsAgo >= 1)
        {
            return `Posted ${monthsAgo} month${monthsAgo > 1 ? 's' : ''} ago`;
        }

        if (weeksAgo >= 1)
        {
            return `Posted ${weeksAgo} week${weeksAgo > 1 ? 's' : ''} ago`;
        }

        if (daysAgo >= 1)
        {
            return `Posted ${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
        }

        if (hoursAgo >= 1)
        {
            return `Posted ${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
        }

        if (minutesAgo >= 1)
        {
            return `Posted ${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
        }

        return `Posted ${secondsAgo} second${secondsAgo > 1 ? 's' : ''} ago`;
    };

    const handleCategoryClick = (e, categoryId) =>
    {
        e.preventDefault();
        navigate(`/jobList/${categoryId}`);
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
                                <h1 className="text-white font-weight-bold">Saved Jobs</h1>
                            </div>
                        </div>
                    </div>
                </section>
                <div>
                    <div className="container mt-4 mb-5">
                        <h4 className='p-4 text-dark' style={{ fontSize: '23px', fontWeight: 'bold' }}>Saved Jobs ({savedJobs.length})</h4>
                        <div className="row">
                            {savedJobs.map((job) =>
                            {
                                const address = getLocation1String(job?.location);
                                let timeAgo = job.createdAt ? formatJobPostedTime(job.createdAt) : '';
                                const categoryMap = categories.reduce((map, category) =>

                                    {
    
                                        map[category.categoryId] = category.categoryName;
    
                                        return map;
    
                                    }, {});
    

                                return (
                                    <div key={job.favoriteId} className="col-md-4 mb-4">
                                        <div className="border rounded-lg p-3 jb_bg-light h-100 d-flex flex-column">
                                            <div className="text-dark mb-2">{timeAgo}</div>
                                            <a href='' className="h5 mb-3 d-block text-dark" onClick={(e) => handleJobDetailClick(e, job.jobId, job.companyId)} style={{ textDecoration: 'none', cursor: 'pointer' }}>{job.jobTitle}</a>
                                            <div className="d-flex align-items-center mb-3">
                                                <NavLink to='' onClick={(e) => handleCompanyClick(e, job.companyId)}>
                                                    <img src={job.companyLogo} className="img-fluid p-0 d-inline-block rounded-sm border border-gray me-2 bg-white" style={{ width: '4em', height: '4em', objectFit: 'contain' }} />
                                                </NavLink>
                                                <NavLink to='' className="text-dark ml-2" onClick={(e) => handleCompanyClick(e, job.companyId)} style={{ textDecoration: 'none', cursor: 'pointer' }}>{job.companyName}</NavLink>
                                            </div>
                                            <div className="mb-2">{job.position}</div>
                                            <div className="mb-2">
                                                <FaMapMarkerAlt className="text-dark" /> {address}
                                            </div>
                                            <div className="m-0 mt-3 mb-4">
                                                {job.categoryId && Array.isArray(job.categoryId) && job.categoryId.map((categoryId) =>
                                                {
                                                    const categoryName = categoryMap[categoryId];
                                                    return categoryName ? (
                                                        <NavLink
                                                            key={categoryId}
                                                            onClick={(e) => handleCategoryClick(e, categoryId)}
                                                            className="jb_text1 bg-white border border-gray p-2 mr-2 rounded-pill text-dark"
                                                            to={''}
                                                        >
                                                            {categoryName}
                                                        </NavLink>
                                                    ) : null;
                                                })}
                                            </div>

                                            <div className="d-flex justify-content-end align-items-center mt-auto mb-2">
                                                <a
                                                    href='#'
                                                    className='d-flex align-items-center justify-content-center'
                                                    onClick={(e) =>

                                                        handleSaveJob(e, job.favoriteId)
                                                    }
                                                    style={{ textDecoration: 'none', fontSize: '1.5em', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                                >
                                                    <span className={`${favoriteJobs.has(job.favoriteId) ? 'icon-heart text-danger' : 'icon-heart-o text-danger'}`} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </>
        </GlobalLayoutUser >
    );
};
