import React, { memo, useState } from "react";
import { Button, Nav, NavItem, Collapse } from "reactstrap";
import Logo from "./Logo";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { navigation } from "../utils/variables/navigation";

const Sidebar = memo(() => {
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const roles = user?.role.map((item) => item.authority) || [];
  const permissions = user?.permission.map((item) => item.name) || [];
  const isModerator = roles.includes("ROLE_MODERATOR");
  const hasPermission = (requiredPermission) => {
    return permissions.includes(requiredPermission);
  };
  const [collapseStates, setCollapseStates] = useState({});

  const toggleCollapse = (index) => {
    setCollapseStates((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const renderNavItems = (items, parentIndex = "") => {
    return items.map((item, index) => {
      const currentIndex = `${parentIndex}${index}`;

      // Conditionally render blog link
      if (
        (item.title === "Blog" &&
          isModerator &&
          !hasPermission("MANAGE_BLOG")) ||
        (item.title === "User" &&
          isModerator &&
          !hasPermission("MANAGE_USER")) ||
        (item.title === "Job" && isModerator && !hasPermission("MANAGE_JOB")) ||
        (item.title === "Company" &&
          isModerator &&
          !hasPermission("MANAGE_COMPANY"))
      ) {
        return null;
      }

      if (item.children) {
        return (
          <NavItem key={currentIndex} className="sidenav-bg">
            <div
              className="nav-link text-secondary py-3 d-flex align-items-center justify-content-between"
              onClick={() => toggleCollapse(currentIndex)}
            >
              <div className="d-flex align-items-center">
                <i className={item.icon}></i>
                <span className="ms-3 d-inline-block">{item.title}</span>
              </div>
              {collapseStates[currentIndex] ? (
                <FaChevronUp />
              ) : (
                <FaChevronDown />
              )}
            </div>
            <Collapse isOpen={collapseStates[currentIndex]}>
              <Nav
                className="nested-sidebarNav"
                style={{ marginLeft: "10px" }}
                vertical
              >
                {renderNavItems(item.children, `${currentIndex}-`)}
              </Nav>
            </Collapse>
          </NavItem>
        );
      } else {
        return (
          <NavItem key={currentIndex} className="sidenav-bg">
            <Link
              to={item.href}
              className={
                location.pathname === item.href
                  ? "text-primary nav-link py-3 d-flex align-items-center"
                  : "nav-link text-secondary py-3 d-flex align-items-center"
              }
            >
              <i className={item.icon}></i>
              <span className="ms-3 d-inline-block">{item.title}</span>
            </Link>
          </NavItem>
        );
      }
    });
  };

  return (
    <div className="p-3">
      <div className="d-flex align-items-center">
        <Logo />
        <span className="ms-auto d-lg-none">
          <Button
            close
            size="sm"
            className="ms-auto d-lg-none"
            onClick={() => showMobilemenu()}
          ></Button>
        </span>
      </div>
      <div className="pt-4 mt-2">
        <Nav vertical className="sidebarNav">
          {renderNavItems(navigation)}
        </Nav>
      </div>
    </div>
  );
});

export default Sidebar;
