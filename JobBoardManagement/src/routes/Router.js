import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Login from "../views/Login.js";
import { exact } from "prop-types";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));

/***** Pages ****/

const Starter = lazy(() => import("../views/Starter.js"));
const BlogCategory = lazy(() => import("../views/ui/blog-category/index"));
const JobCategory = lazy(() => import("../views/ui/job-category/index"));
const Blog = lazy(() => import("../views/ui/blog/index"));
const ArchiveBlog = lazy(() => import("../views/ui/archive-blog/index"));
const Forms = lazy(() => import("../views/ui/Forms"));
const Breadcrumbs = lazy(() => import("../views/ui/Breadcrumbs"));
const UserSetting = lazy(() => import("../views/ui/user-setting/index"));
const Quiz = lazy(() => import("../views/ui/quiz/index"));
const User = lazy(() => import("../views/ui/user/index"));
const CvManagement = lazy(() => import("../views/ui/cv-management/index"));
const Contact = lazy(() => import("../views/ui/contact/index"));
const QuizCategory = lazy(() => import("../views/ui/quiz-category/index"));
const Employer = lazy(() => import("../views/ui/employer/index"));
const Job = lazy(() => import("../views/ui/job/index"));
/*****Routes******/
const ThemeRoutes = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/jobportal", element: <Navigate to="/jobportal/starter" /> },
      { path: "/", element: <Navigate to="/jobportal/starter" /> },
      { path: "/jobportal/starter", exact: true, element: <Starter /> },
      { path: "/jobportal/alerts", exact: true, element: <BlogCategory /> },
      { path: "/jobportal/settings", exact: true, element: <UserSetting /> },
      { path: "/jobportal/user", exact: true, element: <User /> },
      { path: "/jobportal/blog", exact: true, element: <Blog /> },
      { path: "/jobportal/forms", exact: true, element: <Forms /> },
      { path: "/jobportal/quiz", exact: true, element: <Quiz /> },
      {
        path: "/jobportal/blog/archive",
        exact: true,
        element: <ArchiveBlog />,
      },
      {
        path: "/jobportal/cv-management",
        exact: true,
        element: <CvManagement />,
      },
      { path: "/jobportal/employer", exact: true, element: <Employer /> },
      {
        path: "/jobportal/contact",
        exact: true,
        element: <Contact />,
      },
      { path: "/jobportal/job", exact: true, element: <Job /> },
      {
        path: "/jobportal/job-category",
        exact: true,
        element: <JobCategory />,
      },
      {
        path: "/jobportal/blog-category",
        exact: true,
        element: <BlogCategory />,
      },
      {
        path: "/jobportal/quiz-category",
        exact: true,
        element: <QuizCategory />,
      },
    ],
  },
  {
    path: "/jobportal/login",
    element: <Login />,
  },
];

export default ThemeRoutes;
