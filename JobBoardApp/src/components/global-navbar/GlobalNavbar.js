import React, { useState, useEffect, useCallback } from "react";
import { NavLink, useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, signOut } from "../../features/authSlice";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { FaBell, FaChevronRight, FaUserCircle } from "react-icons/fa";
import "./global_navbar.css";
import { fetchCategoryThunk } from "../../features/categorySlice";
import { fetchCompanyThunk } from "../../features/companySlice";
import {
  deleteNotificationThunk,
  markNotificationAsRead,
  readNotificationThunk,
} from "../../features/notificationSlice";
import { fetchAllCategories } from "../../features/blogSlice";
import { debounce } from "@mui/material";
import { MdDelete, MdMessage } from "react-icons/md";
import { Link } from "react-scroll";
import Swal from "sweetalert2";
import defaultAvatar from "../../assets/default_avatar.png";

export function GlobalNavbar() {
  const [searchParams] = useSearchParams();
  // const [categories, setCategories] = useState([]);
  // const [companies, setCompanies] = useState([]);
  const [isSkillsDropdownVisible, setSkillsDropdownVisible] = useState(false);
  const [isCompanyDropdownVisible, setCompanyDropdownVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const categories = useSelector((state) => state.category.categories);
  const companies = useSelector((state) => state.company.companies);

  const handleLogout = () => {
    dispatch(signOut()).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        navigate("/login");
      }
    });
  };

  const handleCvManagementClick = () => {
    navigate("/cv-management");
  };
  const handleSavedJobClick = () => {
    navigate("/savedJob");
  };
  const handleMyProfileClick = () => {
    navigate("/managementprofile");
  };
  const notifications = useSelector((state) => state.notification.list);
  const user = useSelector((state) => state.auth.user);
  const roles = useSelector((state) => state.auth.roles);
  const dispatch = useDispatch();
  const blogCategory = useSelector((state) => state.blogs.categories);
  const unreadCount = useSelector((state) => state.notification.unreadCount);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      categories.length === 0 ||
      companies.length === 0 ||
      blogCategory.length === 0
    ) {
      dispatch(fetchCategoryThunk());
      dispatch(fetchCompanyThunk());
      dispatch(fetchAllCategories());
    }
  }, []);

  const handleCategoryClick = (e, categoryId) => {
    e.preventDefault();
    navigate(`/jobList/${categoryId}`);
  };

  const handleCompanyClick = (e, companyId) => {
    e.preventDefault();
    navigate(`/companyDetail/${companyId}`);
  };

  const handleMarkNotification = useCallback(
    debounce((id) => {
      dispatch(readNotificationThunk(id));
    }, 500),
    [dispatch]
  );

  const handleDeleteNotification = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteNotificationThunk(id));
        Swal.fire("Deleted!", "Your notification has been deleted.", "success");
      }
    });
  };

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const toggleNotification = () =>
    setNotificationOpen((prevState) => !prevState); // Toggle dropdown thông báo

  return (
    <header className="site-navbar mt-3">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="site-logo col-6">
            <NavLink to="/">ITGrove</NavLink>
          </div>

          <nav className="mx-auto site-navigation">
            <ul className="site-menu  d-none d-xl-block ml-0 pl-0">
              <li>
                <NavLink to="/" className="nav-link">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/about">About</NavLink>
              </li>
              <li className="has-children">
                <NavLink to="/viewAllJobs">Job Listings</NavLink>
                <ul className="dropdown">
                  <li
                    className="dropdown-item"
                    onMouseEnter={() => setSkillsDropdownVisible(true)}
                    onMouseLeave={() => setSkillsDropdownVisible(false)}
                  >
                    <NavLink to="/viewAllSkill">
                      Job By Skills <FaChevronRight className="jb_icon" />
                    </NavLink>
                    {isSkillsDropdownVisible && (
                      <div className="skills-dropdown">
                        <div className="dropdown-columns">
                          {Array.from({ length: 3 }).map((_, colIndex) => (
                            <ul key={colIndex} className="sub-dropdown">
                              {categories
                                .slice(colIndex * 12, colIndex * 3 + 12)
                                .map((category) => (
                                  <li
                                    key={category.categoryId}
                                    onClick={(e) =>
                                      handleCategoryClick(
                                        e,
                                        category.categoryId
                                      )
                                    }
                                  >
                                    {category.categoryName}
                                  </li>
                                ))}
                              {(colIndex + 1) * 15 <= categories.length && (
                                <li
                                  className="view-all"
                                  onClick={() => navigate("/viewAllSkill")}
                                >
                                  View All Jobs by Skill{" "}
                                  <FaChevronRight className="icon2" />
                                </li>
                              )}
                            </ul>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                  <li
                    className="dropdown-item"
                    onMouseEnter={() => setCompanyDropdownVisible(true)}
                    onMouseLeave={() => setCompanyDropdownVisible(false)}
                  >
                    <NavLink to="/viewAllCompany">
                      Job By Company
                      <FaChevronRight className="jb_icon3" />
                    </NavLink>
                    {isCompanyDropdownVisible && (
                      <div className="skills-dropdown">
                        <div className="dropdown-columns">
                          {Array.from({ length: 3 }).map((_, colIndex) => (
                            <ul key={colIndex} className="sub-dropdown">
                              {companies
                                .slice(colIndex * 12, colIndex * 3 + 12)
                                .map((company) => (
                                  <li
                                    key={company.companyId}
                                    onClick={(e) =>
                                      handleCompanyClick(e, company.companyId)
                                    }
                                  >
                                    {company.companyName}
                                  </li>
                                ))}
                              {(colIndex + 1) * 15 <= companies.length && (
                                <li
                                  className="view-all"
                                  onClick={() => navigate("/viewAllCompany")}
                                >
                                  View All Jobs by Company{" "}
                                  <FaChevronRight className="icon4" />
                                </li>
                              )}
                            </ul>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                </ul>
              </li>

              <li className="has-children">
                <NavLink to="/blogs">Blog</NavLink>
                <ul className="dropdown">
                  {blogCategory.map((item) => (
                    <li key={item.id}>
                      <NavLink
                        to={`/blogs?type=${encodeURIComponent(item.name)}`}
                        className={({ isActive }) =>
                          isActive && searchParams.get("type") === item.name
                            ? "active"
                            : ""
                        }
                      >
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>

              <li>
                <NavLink to="/contact">Contact</NavLink>
              </li>
              <li>
                <NavLink to="/quiz">Quiz</NavLink>
              </li>
              {!roles.includes("ROLE_EMPLOYER") && (
                <li>
                  <NavLink to="/EmployerSignUp">For Employer</NavLink>
                </li>
              )}

              <li className="d-lg-none">
                <NavLink to="/post-job">
                  <span className="mr-2">+</span> Post a Job
                </NavLink>
              </li>

              <li className="d-lg-none">
                <NavLink to="/login">Log In</NavLink>
              </li>
              <li className="d-lg-none">
                <NavLink to="/signup">Sign Up</NavLink>
              </li>
            </ul>
          </nav>

          <div className="right-cta-menu text-right d-flex align-items-center col-6">
            <div className="ml-auto d-flex align-items-center">
              {user && roles.includes("ROLE_EMPLOYER") && (
                <NavLink
                  to="/post-job"
                  className="btn btn-outline-white border-width-2 d-none d-lg-inline-block"
                >
                  <span className="mr-2 icon-add"></span>Post a Job
                </NavLink>
              )}
              {user && (
                <div className="icon-notification" onClick={toggleNotification}>
                  <FaBell size={30} color="white" />
                  {unreadCount > 0 && (
                    <span
                      className="badge"
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "-10px",
                        backgroundColor: "#ff0000",
                        color: "#fff",
                        padding: "5px 7px",
                        borderRadius: "50%",
                        fontSize: "12px",
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </div>
              )}
              {notificationOpen && (
                <div className="notifications text-left" id="box">
                  <h2>Notifications</h2>
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="notification-container"
                      >
                        <div
                          className="notifications-item"
                          onClick={
                            !notification.read
                              ? () => {
                                  handleMarkNotification(notification.id);
                                  navigate(notification.url);
                                }
                              : () => {
                                  navigate(notification.url);
                                }
                          }
                        >
                          <div className="avatar-container">
                            <img
                              src={
                                notification.sender.imageUrl ?? defaultAvatar
                              }
                              alt="img"
                            />
                            {notification.type === "COMMENT" && (
                              <div className="icon-container">
                                <MdMessage className="message-icon" />
                              </div>
                            )}
                          </div>
                          <div className="text">
                            <h4
                              className={`${
                                notification.read ? "" : "font-weight-bold"
                              }`}
                            >
                              {notification.sender.firstName}{" "}
                              {notification.sender.lastName}
                            </h4>
                            <p
                              className={`${
                                notification.read ? "" : "font-weight-bold"
                              }`}
                            >
                              {notification.message}
                            </p>
                          </div>
                        </div>
                        <button
                          className="delete-button"
                          onClick={(e) => {
                            handleDeleteNotification(notification.id);
                          }}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center">
                      <img
                        src="https://static.topcv.vn/v4/image/toppy-notification-empty.png"
                        alt="No notifications"
                      />
                      <p>You don't have any notifications yet.</p>
                    </div>
                  )}
                </div>
              )}

              <Dropdown
                isOpen={dropdownOpen}
                toggle={toggleDropdown}
                direction="down"
              >
                <DropdownToggle nav caret>
                  <FaUserCircle size={30} color="white" />
                </DropdownToggle>
                <DropdownMenu className="custom-dropdown-menu">
                  {user ? (
                    <>
                      <DropdownItem
                        header
                        className="text-uppercase font-weight-bold"
                      >
                        {user.firstName} {user.lastName}
                      </DropdownItem>
                      <DropdownItem
                        onClick={handleMyProfileClick}
                        className="dropdown-item-main"
                      >
                        My Profile
                      </DropdownItem>
                      <DropdownItem
                        onClick={handleCvManagementClick}
                        className="dropdown-item-main"
                      >
                        CV Management
                      </DropdownItem>
                      <DropdownItem
                        onClick={handleSavedJobClick}
                        className="dropdown-item-main"
                      >
                        Saved Jobs
                      </DropdownItem>
                      <DropdownItem
                        onClick={handleLogout}
                        className="dropdown-item-main"
                      >
                        Log out
                      </DropdownItem>
                    </>
                  ) : (
                    <>
                      <NavLink to="/login" className="dropdown-item">
                        <span className="mr-2 icon-lock_outline"></span>Log In
                      </NavLink>
                      <NavLink to="/signup" className="dropdown-item">
                        <span className="mr-2 icon-lock_outline"></span>Sign Up
                      </NavLink>
                    </>
                  )}
                </DropdownMenu>
              </Dropdown>

              <NavLink
                to="#"
                className="site-menu-toggle js-menu-toggle d-inline-block d-xl-none mt-lg-2 ml-3"
              >
                <span className="icon-menu h3 m-0 p-0 mt-2"></span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default GlobalNavbar;
