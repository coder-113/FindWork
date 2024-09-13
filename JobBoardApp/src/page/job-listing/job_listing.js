import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';
import { fetchCategoryThunk } from "../../features/categorySlice";
import { fetchJobThunk } from "../../features/jobSlice";
import { fetchCompanyThunk } from "../../features/companySlice";
import "./job_company.css";
import { NavLink, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { GlobalLayoutUser } from '../../components/global-layout-user/GlobalLayoutUser';
// import Select, { components } from 'react-select';
// import { Select } from 'antd';
import { MenuItem, Checkbox, FormControl, Select, FormGroup, FormControlLabel, InputLabel, OutlinedInput, Chip, ListItemText, TextField, Autocomplete } from '@mui/material';
import axios from 'axios';
import JobMappingFilter from './location_mapping';
import debounce from 'lodash/debounce';

export const JobList = () =>
{
   const { id } = useParams();
   const categoryId = parseInt(id ?? '0', 10);
   const location = useLocation();
   const jobsPerPage = 4; // Number of jobs per page
   // const [jobs, setJobs] = useState([]);
   const [jobCount, setJobCount] = useState(0);
   const [selectedJobId, setSelectedJobId] = useState(null);
   const [categoryName1, setCategoryName] = useState("");
   const [currentPage, setCurrentPage] = useState(1);
   const categories = useSelector((state) => state.category.categories);
   const jobs = useSelector((state) => state.job.jobs);
   const companies = useSelector((state) => state.company.companies);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { searchTerm } = useParams();
   const normalizeString = (str) => str.trim().toLowerCase();
   const { locationMapping } = JobMappingFilter;

   const [searchTerms, setSearchTerms] = useState('');
   const decodedSearchTerm = decodeURIComponent(searchTerms || '');
   const [open, setOpen] = useState(false);

   const [filters, setFilters] = useState({
      title: '',
      // offeredSalary: '',
      location: [],
      position: [],
      jobType: [],
      contractType: [],
      companyType: [],
      categoryNames: []
   });


   useEffect(() =>
   {
      dispatch(fetchCategoryThunk());
      dispatch(fetchCompanyThunk());
      dispatch(fetchJobThunk());
   }, []);

   useEffect(() =>
   {
      const categoryInfo = categories.find(cat => cat.categoryId === categoryId);
      if (categoryInfo) setCategoryName(categoryInfo.categoryName);
      else setCategoryName("");
   }, [categories, categoryId]);

   const applyFilters = useCallback((job) =>
   {
      const { title, offeredSalary, position, location, categoryNames, jobType, contractType, companyType } = filters;

      // const normalizedTitle = normalizeString(title);
      // const titleMatch = normalizedTitle ? normalizeString(job.title).includes(normalizedTitle) : true;

      const normalizedTitle = normalizeString(title);
      const normalizedJobTitle = normalizeString(job.title);
      const titleMatch = normalizedTitle ? normalizedJobTitle.includes(normalizedTitle) : true;

      const jobCategoryNames = job.categoryId.map(id =>
      {
         const category = categories.find(cat => cat.categoryId === id);
         return category ? category.categoryName.toLowerCase() : '';
      });

      const categoryMatch = categoryNames.length === 0 || categoryNames.some(catName =>
         jobCategoryNames.includes(normalizeString(catName))
      );

      const locationMatch = location.length === 0 || location.some(loc =>
      {
         const locationString = normalizeLocation(getLocationString(job.companyId));
         console.log('Location String:', locationString); // Kiểm tra giá trị
         return Object.keys(locationMapping).some(key =>
         {
            const normalizedKey = normalizeLocation(key);
            return locationString.includes(normalizedKey) && locationMapping[normalizedKey] === loc.value;
         });
      });

      const positionMatch = position.length === 0 || position.some(pos => job.position?.toLowerCase().includes(pos.value.toLowerCase()));
      const jobTypeMatch = jobType.length === 0 || jobType.some(tyle => job.jobType?.toLowerCase().includes(tyle.value.toLowerCase()));
      const contractTypeMatch = contractType.length === 0 || contractType.some(tyle => job.contractType?.toLowerCase().includes(tyle.value.toLowerCase()));
      const company = companies.find(company => company.companyId === job.companyId);
      const companyTypeMatch = companyType.length === 0 || companyType.some(type => company.type?.toLowerCase() === type.value.toLowerCase());

      return titleMatch && categoryMatch && locationMatch && positionMatch && jobTypeMatch && contractTypeMatch && companyTypeMatch;
   }, [filters, categories, companies, locationMapping]);

   const handleJobClick = useCallback((jobId) =>
   {
      setSelectedJobId(jobId);
   }, []);

   const handlePageChange = useCallback((pageNumber) =>
   {
      setCurrentPage(pageNumber);
   }, []);

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

   const getLocationString = (companyId) =>
   {
      const company = companies.find(comp => comp.companyId === companyId);
      return company ? company.location : '';
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

   const locations = [
      { value: 'Ho Chi Minh', label: 'Ho Chi Minh' },
      { value: 'Ha Noi', label: 'Ha Noi' },
      { value: 'Da Nang', label: 'Da Nang' }
   ];

   const normalizeLocation = (locationString) =>
   {
      return locationString.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
   };

   const position = [
      { value: 'Intern', label: 'Intern' },
      { value: 'Fresher', label: 'Fresher' },
      { value: 'Junior', label: 'Junior' },
      { value: 'Middle', label: 'Middle' },
      { value: 'Senior', label: 'Senior' },
      { value: 'Leader', label: 'Leader' },
      { value: 'Manager', label: 'Manager' }
   ];

   const jobTypes = [
      { value: 'In Office', label: 'In Office' },
      { value: 'Hybrid', label: 'Hybrid' },
      { value: 'Remote', label: 'Remote' },
      { value: 'Oversea', label: 'Oversea' }
   ];

   const contractTypes = [
      { value: 'Fulltime', label: 'Fulltime' },
      { value: 'Freelance', label: 'Freelance' },
      { value: 'Part-time', label: 'Part-time' }
   ];

   const companyTypes = [
      { value: 'IT Outsourcing', label: 'IT Outsourcing' },
      { value: 'IT Product', label: 'IT Product' },
      { value: 'Headhunt', label: 'Headhunt' },
      { value: 'IT Service and IT Consulting', label: 'IT Service and IT Consulting' },
      { value: 'Non-IT', label: 'Non-IT' }
   ];

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

   const handlePositionChange = (event) =>
   {
      const {
         target: { value }
      } = event;

      setFilters({
         ...filters,
         position: typeof value === 'string' ? value.split(',') : value
      });
   };

   const handlePositionItemClick = (event) =>
   {
      const {
         target: { value },
      } = event;
      setFilters({
         ...filters,
         position: position.filter((level) => value.includes(level.value)),
      });
   };

   const handleJobTypeItemClick = (level) =>
   {
      const newSelection = filters.jobType.some((item) => item.value === level.value)
         ? filters.jobType.filter((item) => item.value !== level.value)
         : [...filters.jobType, level];
      setFilters({ ...filters, jobType: newSelection });
   };

   const handleContractTypeItemClick = (level) =>
   {
      const newSelection = filters.contractType.some((item) => item.value === level.value)
         ? filters.contractType.filter((item) => item.value !== level.value)
         : [...filters.contractType, level];
      setFilters({ ...filters, contractType: newSelection });
   };

   const handleCompanyTypeItemClick = (type) =>
   {
      const newSelection = filters.companyType.some((item) => item.value === type.value)
         ? filters.companyType.filter((item) => item.value !== type.value)
         : [...filters.companyType, type];
      setFilters({ ...filters, companyType: newSelection });
   };

   const handleLocationItemClick = (event, location) =>
   {
      const newSelection = filters.location.some((item) => item.value === location.value)
         ? filters.location.filter((item) => item.value !== location.value)
         : [...filters.location, location];

      setFilters({ ...filters, location: newSelection });
   };

   useEffect(() =>
   {
      if (searchTerm)
      {
         setSearchTerms(decodeURIComponent(searchTerm));
      } else
      {
         setSearchTerms('');
      }
   }, [searchTerm]);

   const filteredJobs = useMemo(() =>
   {
      let updatedFilteredJobs = location.pathname.includes("/viewAllJobs")
         ? jobs
         : jobs.filter(job => Array.isArray(job.categoryId) && job.categoryId.includes(categoryId));

      const searchTermNormalized = normalizeString(searchTerms);

      updatedFilteredJobs = updatedFilteredJobs.filter(job =>
      {
         const jobTitleNormalized = normalizeString(job.title);
         const matchesTitle = jobTitleNormalized.includes(searchTermNormalized);

         const matchesCategory = job.categoryId.some(id =>
         {
            const category = categories.find(cat => cat.categoryId === id);
            return category ? normalizeString(category.categoryName) === searchTermNormalized : false;
         });
         return matchesTitle || matchesCategory;
      });

      updatedFilteredJobs = updatedFilteredJobs.filter(applyFilters);
      setJobCount(updatedFilteredJobs.length);

      return updatedFilteredJobs;
   }, [jobs, categoryId, location.pathname, categories, applyFilters, searchTerms]);

   const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
   // Calculate the jobs to display based on the current page
   const indexOfLastJob = currentPage * jobsPerPage;
   const indexOfFirstJob = indexOfLastJob - jobsPerPage;

   const currentJobs = useMemo(() =>
   {
      return filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
   }, [filteredJobs, currentPage, jobsPerPage]);

   const titleOptions = useMemo(() => [...new Set(jobs.map(job => job.title))], [jobs]);
   const categoryOptions = useMemo(() => [...new Set(categories.map(cat => cat.categoryName))], [categories]);

   const combinedOptions = useMemo(() =>
   {
      return [
         ...titleOptions.map(title => ({ type: 'title', value: title })),
         ...categoryOptions.map(category => ({ type: 'category', value: category }))
      ];
   }, [titleOptions, categoryOptions]);

   const filteredOptions = useMemo(() =>
   {
      if (!searchTerms.trim()) return []; // Không hiển thị gợi ý khi không có giá trị tìm kiếm

      const searchTermNormalized = normalizeString(searchTerms);
      return combinedOptions.filter(option =>
         normalizeString(option.value).includes(searchTermNormalized)
      );
   }, [searchTerms, combinedOptions]);

   // const filteredOptions = useMemo(() =>
   // {
   //    const searchTermNormalized = normalizeString(searchTerms);
   //    return combinedOptions.filter(option =>
   //       normalizeString(option.value).includes(searchTermNormalized)
   //    );
   // }, [searchTerms, combinedOptions]);

   const handleKeyDown = (event) =>
   {
      if (event.key === 'Enter')
      {
         event.preventDefault(); // Ngăn chặn hành vi mặc định của Enter
         handleSearch(); // Thực hiện tìm kiếm
         setOpen(false); // Đóng dropdown sau khi nhấn Enter
      }
   };

   const handleSearch = () =>
   {
      navigate(`/viewAllJobs/${encodeURIComponent(searchTerms.trim())}`);
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
                        <h1 className="text-white font-weight-bold">All jobs</h1>
                     </div>
                  </div>
               </div>
            </section>
            <div className="container mt-6 mb-6">
               <div className="row">
                  <div className="col-md-3 mb-4 text-dark">
                     <div className="border p-3" style={{ borderColor: '#cccccc', fontSize: '14px' }}>
                        <div className="mb-3">
                           <label>Search</label>
                           <Autocomplete
                              freeSolo
                              open={open}
                              onClose={() => setOpen(false)}
                              onInputChange={(event, newInputValue) => setSearchTerms(newInputValue)}
                              inputValue={searchTerms}
                              options={filteredOptions}
                              getOptionLabel={(option) => option.value}
                              filterOptions={(options) => options}
                              renderInput={(params) => (
                                 <TextField
                                    {...params}
                                    label="Search"
                                    onKeyDown={handleKeyDown}
                                 />
                              )}
                              onOpen={() => setOpen(true)}
                           />
                        </div>
                        <br></br>

                        <div className="mb-3">
                           <label>Location</label>
                           <FormGroup>
                              {locations.map((location) => (
                                 <FormControlLabel
                                    key={location.value}
                                    control={
                                       <Checkbox
                                          checked={filters.location.some(item => item.value === location.value)}
                                          // onChange={() => handleLocationItemClick(location)}
                                          onChange={(e) => handleLocationItemClick(e, location)}
                                          name={location.label}
                                       />
                                    }
                                    label={location.label}
                                 />
                              ))}
                           </FormGroup>
                        </div>

                        <div className="mb-3">
                           <FormControl fullWidth variant="outlined">
                              <InputLabel>Levels</InputLabel>
                              <Select
                                 multiple
                                 value={filters.position.map((item) => item.value)}
                                 onChange={handlePositionItemClick}
                                 input={<OutlinedInput label="Levels" />}
                                 renderValue={(selected) => (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                       {selected.map((value) =>
                                       {
                                          const level = position.find((l) => l.value === value);
                                          return level ? (
                                             <Chip key={value} label={level.label} />
                                          ) : null;
                                       })}
                                    </div>
                                 )}
                                 MenuProps={{
                                    PaperProps: {
                                       style: {
                                          maxHeight: 200, // Set a max height for the dropdown menu
                                          overflow: 'auto', // Enable scrolling
                                       },
                                    },
                                 }}
                              >
                                 {position.map((level) => (
                                    <MenuItem key={level.value} value={level.value}>
                                       <Checkbox checked={filters.position.some((item) => item.value === level.value)} />
                                       <ListItemText primary={level.label} />
                                    </MenuItem>
                                 ))}
                              </Select>
                           </FormControl>
                        </div>

                        <div className="mb-3">
                           <label>Job types</label>
                           <FormGroup>
                              {jobTypes.map(jobType => (
                                 <FormControlLabel
                                    key={jobType.value}
                                    control={
                                       <Checkbox
                                          checked={filters.jobType.some(item => item.value === jobType.value)}
                                          onChange={() => handleJobTypeItemClick(jobType)}
                                          name={jobType.label}
                                       />
                                    }
                                    label={jobType.label}
                                 />
                              ))}
                           </FormGroup>
                        </div>

                        <div className="mb-3">
                           <label>Contract types</label>
                           <FormGroup>
                              {contractTypes.map(contract => (
                                 <FormControlLabel
                                    key={contract.value}
                                    control={
                                       <Checkbox
                                          checked={filters.contract?.some(item => item.value === contract.value)}
                                          onChange={() => handleContractTypeItemClick(contract)}
                                          name={contract.label}
                                       />
                                    }
                                    label={contract.label}
                                 />
                              ))}
                           </FormGroup>
                        </div>

                        <div className="mb-3">
                           <label>company types</label>
                           <FormGroup>
                              {companyTypes.map(company => (
                                 <FormControlLabel
                                    key={company.value}
                                    control={
                                       <Checkbox
                                          checked={filters.company?.some(item => item.value === company.value)}
                                          onChange={() => handleCompanyTypeItemClick(company)}
                                          name={company.label}
                                       />
                                    }
                                    label={company.label}
                                 />
                              ))}
                           </FormGroup>
                        </div>
                     </div>

                  </div>

                  <div className="col-md-9">
                     <h3 className="text-center mt-0 mb-4" style={{ fontSize: '25px', fontWeight: 'bold' }}>
                        {jobCount}{" "}
                        {location.pathname === "/viewAllJobs" ? (
                           "IT"
                        ) : (
                           <span className="text-danger">{categoryName1}</span>
                        )}{" "}
                        jobs in Vietnam
                     </h3>
                     {currentJobs.map(job =>
                     {
                        const company = companies.find(company => company.companyId === job.companyId);
                        const categoryArray = Array.isArray(categories) ? categories : [];
                        const address = getLocation1String(company?.location);
                        let timeAgo = job.createdAt ? formatJobPostedTime(job.createdAt) : '';

                        if (company)
                        {
                           return (
                              <div
                                 key={job.id}
                                 className={`col-12 mb-3 mt-4 text-dark border ${selectedJobId === job.id ? 'border-danger' : 'border-light'} rounded-lg p-4 jb_bg-light fs-2`}
                                 onClick={() => handleJobClick(job.id)}
                              >
                                 <div className="text-dark mb-2">{timeAgo}</div>
                                 <a href='' className="h5 mb-3 d-block text-dark" onClick={(e) => handleJobDetailClick(e, job.id, job.companyId)} style={{ textDecoration: 'none', cursor: 'pointer' }}>{job.title}</a>
                                 <div className="d-flex align-items-center mb-3">
                                    <NavLink to={''} target="_blank" rel="noopener noreferrer" onClick={(e) => handleCompanyClick(e, job.companyId)}>
                                       <img src={company.logo} className="img-fluid p-0 d-inline-block rounded-sm border border-gray me-2 bg-white" style={{ width: '4em', height: '4em', objectFit: 'contain' }} />

                                    </NavLink>
                                    <NavLink to={''} className="text-dark ml-2" onClick={(e) => handleCompanyClick(e, job.companyId)} style={{ textDecoration: 'none', cursor: 'pointer' }}>{company.companyName}</NavLink>
                                 </div>
                                 <div className="mb-2">{job.position}</div>
                                 <div className="mb-2">
                                    <FaMapMarkerAlt className="text-dark" /> {address}
                                 </div>
                                 <div className="m-0 mt-3 mb-3">
                                    {job.categoryId.map((id) =>
                                    {
                                       const categoryName = categoryArray.find(category => category.categoryId === id)?.categoryName;
                                       return categoryName ? (
                                          <NavLink key={id} onClick={(e) => handleCategoryClick(e, id)} className="jb_text1 bg-white border border-gray p-2 mr-2 rounded-pill text-dark" to={''}>
                                             {categoryName}
                                          </NavLink>
                                       ) : null;
                                    })}
                                 </div>
                              </div>
                           );
                        }
                        return null;
                     })}
                  </div>
               </div>
               <div className="d-flex justify-content-center my-4">
                  <nav>
                     <ul className="pagination">
                        {renderPaginationButtons()}
                     </ul>
                  </nav>
               </div>
            </div>
         </>
      </GlobalLayoutUser >
   );
}
