import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CBadge,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilBell,
  cilMenu,
  cilUser, // Use a different icon if cilLogOut is not available
} from '@coreui/icons';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { AppBreadcrumb } from './index';
import { AppHeaderDropdown } from './header/index';

const AppHeader = () => {
  const headerRef = useRef();
  const [notifications, setNotifications] = useState([]);

  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0);
    });

    // Fetch notifications from API
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const decodedToken = jwtDecode(token);
        const companyId = decodedToken.company;

        const response = await axios.get(`http://localhost:8080/api/job-applications/company/${companyId}/new`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    // Connect to WebSocket
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe('/topic/notifications', (message) => {
        const notification = JSON.parse(message.body);
        setNotifications((prevNotifications) => [...prevNotifications, notification]);
      });
    });

    return () => {
      stompClient.disconnect();
    };
  }, []);

  const handleNotificationClick = async (notificationId) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(`http://localhost:8080/api/job-applications/${notificationId}/mark-as-read`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(notifications.filter((notification) => notification.id !== notificationId));

      // Navigate to the /cv page
      navigate('/cv');
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login'); // Navigate to login page after logout
  };

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="d-none d-md-flex">
          <CNavItem>
            <CNavLink to="/dashboard" as={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Users</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Settings</CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-auto">
          <CNavItem>
            <CDropdown variant="nav-item">
              <CDropdownToggle caret={false}>
                <CIcon icon={cilBell} size="lg" />
                {notifications.length > 0 && (
                  <CBadge color="danger" shape="rounded-pill">
                    {notifications.length}
                  </CBadge>
                )}
              </CDropdownToggle>
              <CDropdownMenu>
                {notifications.length === 0 ? (
                  <CDropdownItem disabled>No new notifications</CDropdownItem>
                ) : (
                  notifications.map((notification) => (
                    <CDropdownItem
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <span>You have just received a CV from the job: {notification.title}. Click to view it now.</span>
                    </CDropdownItem>
                  ))
                )}
              </CDropdownMenu>
            </CDropdown>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              <CIcon icon={cilUser} size="lg" /> {/* Replace with appropriate icon */}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={handleLogout}
              >
                <CIcon className="me-2" icon={cilUser} size="lg" /> Logout
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  );
};

export default AppHeader;
