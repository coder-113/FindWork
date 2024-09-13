import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Container, Breadcrumb, BreadcrumbItem } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import jwtDecode from "jwt-decode";
import {
  getUserByIDThunk,
  logout,
  setLocationState,
  signOut,
  updateRoles,
  updateToken,
  updateUserAndRoles,
} from "../features/authSlice";
import "nprogress/nprogress.css"; // Import the CSS file
import { fetchBlogs } from "../features/blogSlice";
import { fetchBlogCategory } from "../features/blogCategorySlice";
import showToast from "../utils/functions/showToast";
import axios from "axios";

const FullLayout = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    dispatch(signOut());
    navigate("/jobportal/login");
  };

  useEffect(() => {
    dispatch(setLocationState(location.pathname));
  }, [location, dispatch]);

  useEffect(() => {
    console.log("---------REFRESH TOKEN---------");
    console.log(">>>user: ", user);

    const refreshAuthToken = (user, dispatch, navigate) => {
      const expiresIn = user?.exp || 0;
      const nowInSeconds = Math.floor(Date.now() / 1000);
      const remainingTime = expiresIn - nowInSeconds;
      const refreshTime = Math.max(0, remainingTime - 5);

      const refreshTokenTimeout = setTimeout(async () => {
        try {
          const refreshToken = localStorage.getItem("refreshToken");

          if (refreshToken) {
            console.log(">>>user: ", user);
            const response = await axios.post(
              "http://localhost:8080/api/auth/refreshtoken",
              {
                refreshToken,
              }
            );

            if (response.status === 200) {
              const newAccessToken = response.data.accessToken;

              dispatch(updateToken(newAccessToken));
            }
          }
        } catch (error) {
          const status = error.response.status;
          console.log(">>>status: ", status);
          if (status === 403) {
            showToast(
              "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!",
              "error"
            );
          }
          dispatch(signOut());
          navigate("/jobportal/login");
        }
      }, refreshTime * 1000);

      return () => {
        clearTimeout(refreshTokenTimeout);
      };
    };

    if (user) {
      refreshAuthToken(user, dispatch, navigate);
    }
  }, [dispatch, localStorage.getItem("accessToken")]);

  useEffect(() => {
    if (user) {
      dispatch(getUserByIDThunk(user.sub));
    }
  }, [dispatch, user]);

  const hasAdminOrModeratorRole = user?.role.some(
    (role) =>
      role.authority === "ROLE_ADMIN" || role.authority === "ROLE_MODERATOR"
  );

  if (!hasAdminOrModeratorRole) {
    return <Navigate to="/jobportal/login" />;
  }
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  // Helper function to generate breadcrumb items
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    return pathnames.map((value, index) => {
      const last = index === pathnames.length - 1;
      const to = `/${pathnames.slice(0, index + 1).join("/")}`;
      return last ? (
        <BreadcrumbItem key={to} active>
          {capitalizeFirstLetter(value)}
        </BreadcrumbItem>
      ) : (
        <BreadcrumbItem key={to}>
          <Link to={to}>
            {value === "jobportal" ? "Home" : capitalizeFirstLetter(value)}
          </Link>
        </BreadcrumbItem>
      );
    });
  };

  return (
    <main>
      <div className="pageWrapper d-lg-flex">
        <aside className="sidebarArea shadow" id="sidebarArea">
          <Sidebar />
        </aside>

        <div className="contentArea">
          <Header handleLogout={handleLogout} />
          <Container className="p-4 wrapper" fluid>
            <Breadcrumb>{generateBreadcrumbs()}</Breadcrumb>
            <Outlet />
          </Container>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;
