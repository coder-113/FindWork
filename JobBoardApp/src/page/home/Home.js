import React, { useEffect, useMemo, useState } from "react";
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import { JobBoardStats } from "../../components/job-board-stats/JobBoardStats";
import { JobFilter } from "../../components/job-filter/JobFIlter";
import { fetchJobThunk } from "../../features/jobSlice";
import { fetchCompanyThunk } from "../../features/companySlice";
import { fetchCategoryThunk } from "../../features/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import "../job-listing/listSkillAll";

export const Home = () =>
{
  const location = useLocation();
  const navigate = useNavigate(); // Correct usage of useNavigate
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  // const jobs = useSelector((state) => state.job.jobs);
  const companies = useSelector((state) => state.company.companies);
  const categories = useSelector((state) => state.category.categories);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() =>
  {
    dispatch(fetchCategoryThunk());
    if (companies.length === 0)
    {
      dispatch(fetchCompanyThunk());
    }
  }, [dispatch, companies.length]);

  useEffect(() =>
  {
    const fetchJobs = async () =>
    {
      try
      {
        const response = await fetch('http://localhost:8080/api/jobs/super-hot');
        if (!response.ok)
        {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setJobs(data);
      } catch (error)
      {
        setError(error.message);
      } finally
      {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const getLocation1String = (address) =>
  {
    if (typeof address !== "string")
    {
      return "";
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

  const handleJobClick = (e, jobId, companyId) =>
  {
    e.preventDefault();
    navigate(`/jobDetail/${jobId}/${companyId}`);
  };

  return (
    <GlobalLayoutUser>
      <>
        {message && (
          <div
            className="alert alert-success custom-alert"
            role="alert"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              width: "100%",
              zIndex: 1000,
              padding: "10px 20px",
              fontSize: "14px",
              textAlign: "center",
              marginBottom: "0",
              backgroundColor: "#d4edda",
              color: "#155724",
              borderColor: "#c3e6cb",
            }}
          >
            {message}
          </div>
        )}
        <section
          className="home-section section-hero overlay bg-image"
          style={{
            backgroundImage: 'url("../../../assets/images/hero_1.jpg")',
          }}
          id="home-section"
        >
          <JobFilter />
          <a href="#next" className="scroll-button smoothscroll">
            <span className=" icon-keyboard_arrow_down" />
          </a>
        </section>
        <JobBoardStats />
        <section className="site-section">
          <div className="container">
            <div className="row mb-5 justify-content-center">
              <div className="col-md-7 text-center">
                <h2 className="section-title mb-2">Super Hot Jobs Today</h2>
              </div>
            </div>
            <ul className="job-listings mb-5">
              {jobs.map((job) =>
              {
                const company = companies.find(
                  (company) => company.companyId === job.companyId
                );
                const categoryArray = Array.isArray(categories)
                  ? categories
                  : [];
                const address = getLocation1String(company?.location);
                if (company)
                {
                  return (
                    <li key={job.id} className="col-12 job-listing d-block d-sm-flex pb-3 pb-sm-0 align-items-center mb-3 jb_bg-light border border-gray rounded">
                      {/* <a href={`/jobDetail/${job.id}`} /> */}
                      <div className="job-listing-logo">
                        <img
                          src={company.logo}
                          alt="Free Website Template"
                          className="img-fluid p-0 d-inline-block rounded-sm bg-white"
                          onClick={(e) =>
                          {
                            handleCompanyClick(e, job.companyId);
                          }}
                          style={{
                            width: "7em",
                            height: "7em",
                            objectFit: "contain",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                      <div className="job-listing-about d-sm-flex custom-width w-100 justify-content-between mx-4 gap-3 mt-4 mb-4">
                        <div className="job-listing-position custom-width w-50 mb-3 mb-sm-0">
                          <h2
                            className="mb-2"
                            onClick={(e) =>
                            {
                              handleJobClick(e, job.id, job.companyId);
                            }}
                            style={{
                              textDecoration: "none",
                              cursor: "pointer",
                            }}
                          >
                            {job.title}
                          </h2>
                          <strong
                            onClick={(e) =>
                            {
                              handleCompanyClick(e, job.companyId);
                            }}
                            style={{
                              textDecoration: "none",
                              cursor: "pointer",
                            }}
                          >
                            {company.companyName}
                          </strong>
                          <div className="m-0 mt-3">
                            {job.categoryId.map((id) =>
                            {
                              const categoryName = categoryArray.find(
                                (category) => category.categoryId === id
                              )?.categoryName;
                              return categoryName ? (
                                <span
                                  key={id}
                                  onClick={(e) => handleCategoryClick(e, id)}
                                  className="jb_text1 bg-white border border-gray p-2 mr-2 rounded-pill text-dark"
                                  style={{ cursor: 'pointer' }}
                                >
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
                          <span className="badge bg-danger">
                            {job.contractType}
                          </span>
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
        <section
          className="py-5 bg-image overlay-primary fixed overlay"
          style={{
            backgroundImage: 'url("../../../assets/images/hero_1.jpg")',
          }}
        >
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h2 className="text-white">Looking For A Job?</h2>
                <p className="mb-0 text-white lead">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit
                  tempora adipisci impedit.
                </p>
              </div>
              <div className="col-md-3 ml-auto">
                <NavLink
                  to="/signup"
                  className="btn btn-warning btn-block btn-lg"
                >
                  Sign Up
                </NavLink>
              </div>
            </div>
          </div>
        </section>
        <section className="site-section py-4">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-12 text-center mt-4 mb-5">
                <div className="row justify-content-center">
                  <div className="col-md-7">
                    <h2 className="section-title mb-2">Company We've Helped</h2>
                    <p className="lead">
                      Porro error reiciendis commodi beatae omnis similique
                      voluptate rerum ipsam fugit mollitia ipsum facilis
                      expedita tempora suscipit iste
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-6 col-lg-3 col-md-6 text-center">
                <img
                  src="../../../assets/images/logo_mailchimp.svg"
                  alt="Image"
                  className="img-fluid logo-1"
                />
              </div>
              <div className="col-6 col-lg-3 col-md-6 text-center">
                <img
                  src="../../../assets/images/logo_paypal.svg"
                  alt="Image"
                  className="img-fluid logo-2"
                />
              </div>
              <div className="col-6 col-lg-3 col-md-6 text-center">
                <img
                  src="../../../assets/images/logo_stripe.svg"
                  alt="Image"
                  className="img-fluid logo-3"
                />
              </div>
              <div className="col-6 col-lg-3 col-md-6 text-center">
                <img
                  src="../../../assets/images/logo_visa.svg"
                  alt="Image"
                  className="img-fluid logo-4"
                />
              </div>
              <div className="col-6 col-lg-3 col-md-6 text-center">
                <img
                  src="../../../assets/images/logo_apple.svg"
                  alt="Image"
                  className="img-fluid logo-5"
                />
              </div>
              <div className="col-6 col-lg-3 col-md-6 text-center">
                <img
                  src="../../../assets/images/logo_tinder.svg"
                  alt="Image"
                  className="img-fluid logo-6"
                />
              </div>
              <div className="col-6 col-lg-3 col-md-6 text-center">
                <img
                  src="../../../assets/images/logo_sony.svg"
                  alt="Image"
                  className="img-fluid logo-7"
                />
              </div>
              <div className="col-6 col-lg-3 col-md-6 text-center">
                <img
                  src="../../../assets/images/logo_airbnb.svg"
                  alt="Image"
                  className="img-fluid logo-8"
                />
              </div>
            </div>
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
                    src="../../../assets/images/person_transparent_2.png"
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
                    src="../../../assets/images/person_transparent.png"
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
            backgroundImage: 'url("../../../assets/images/hero_1.jpg")',
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
                  src="../../../assets/images/apps.png"
                  alt="Free Website Template by Free-Template.co"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </section>
      </>
    </GlobalLayoutUser>
  );
};

export default Home;
