import React, { useState } from "react";
import { MdExpandMore } from "react-icons/md";
import { NavLink } from "react-router-dom";

export function GlobalSiteMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Hàm xử lý sự kiện mở hoặc đóng dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="site-mobile-menu site-navbar-target">
      <div className="site-mobile-menu-header">
        <div className="site-mobile-menu-close mt-3">
          <span className="icon-close2 js-menu-toggle"></span>
        </div>
      </div>
      <div className="site-mobile-menu-body">
        <ul className="site-nav-wrap">
          <li>
            <NavLink to="/" onClick={toggleDropdown}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" onClick={toggleDropdown}>
              About
            </NavLink>
          </li>
          <li className="has-children">
            <span
              className="arrow-collapse collapsed"
              onClick={toggleDropdown}
            ></span>
            <NavLink to="/blogs" onClick={toggleDropdown}>
              Pages
            </NavLink>
            {/* Hiển thị dropdown khi isOpen là true */}
            {isOpen && (
              <ul className="dropdown">
                <li>
                  <NavLink to="/services">Services</NavLink>
                </li>
                <li>
                  <NavLink to="/service-single">Service Single</NavLink>
                </li>
                <li>
                  <NavLink to="/blog-single">Blog Single</NavLink>
                </li>
                <li>
                  <NavLink to="/portfolio">Portfolio</NavLink>
                </li>
                <li>
                  <NavLink to="/portfolio-single">Portfolio Single</NavLink>
                </li>
                <li>
                  <NavLink to="/testimonials">Testimonials</NavLink>
                </li>
                <li>
                  <NavLink to="/faq">Frequently Ask Questions</NavLink>
                </li>
                <li>
                  <NavLink to="/gallery" className="active">
                    Gallery
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
          <li>
            <NavLink to="/blogs">Blog</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact</NavLink>
          </li>

          <li>
            <NavLink to="/login">Log In</NavLink>
          </li>
          <li>
            <NavLink to="/signup">Sign Up</NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}
