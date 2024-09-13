// import { lazy } from "react";
// import { Navigate } from "react-router-dom";

// /****Layouts*****/
// const GlobalLayoutUser = lazy(() =>
//   import("../components/global-layout-user/GlobalLayoutUser")
// );

// /***** Pages ****/
// const AboutUs = lazy(() => import("../page/about-us/AboutUs"));
// const BlogSingle = lazy(() => import("../page/blog-single/BlogSingle"));
// const Blog = lazy(() => import("../page/blog/Blog"));
// const Contact = lazy(() => import("../page/contact/Contact"));
// const Faq = lazy(() => import("../page/faq/Faq"));
// const Home = lazy(() => import("../page/home/Home"));
// const Portfolio = lazy(() => import("../page/portfolio/Portfolio"));
// const PortfolioSingle = lazy(() =>
//   import("../page/portfolio-single/PortfolioSingle")
// );
// const JobListing = lazy(() => import("../page/job-listing/JobListing"));
// const PostJob = lazy(() => import("../page/post-job/PostJob"));
// const Login = lazy(() => import("../page/login/Login"));
// const SignUp = lazy(() => import("../page/signup/SignUp"));
// const ForgotPassword = lazy(() => import("../page/login/ForgotPassword"));
// const Gallery = lazy(() => import("../page/gallery/Gallery"));
// const ResetPassword = lazy(() => import("../page/login/ResetPassword"));
// const JobSingle = lazy(() => import("../page/job-single/JobSingle"));
// const EmployerSignUp = lazy(() => import("../page/signup/EmployerSignUp"));
// const SetupCredentials = lazy(() => import("../page/signup/SetupCredentials"));
// const Quiz = lazy(() => import("../page/quiz/quiz"));
// const QuizResult = lazy(() => import("../page/quiz/QuizResult"));
// const QuizQuestions = lazy(() => import("../page/quiz/QuizQuestions"));

// /***** Routes ******/
// export const ThemeRoutes = [
//   {
//     path: "/",
//     element: <GlobalLayoutUser />,
//     children: [
//       { path: "/", exact: true, element: <Navigate to="/home" /> },
//       { path: "/home", exact: true, element: <Home /> },
//       { path: "/about", exact: true, element: <AboutUs /> },
//       { path: "/blogs", exact: true, element: <Blog /> },
//       { path: "/blog/:id", exact: true, element: <BlogSingle /> },
//       { path: "/contact", exact: true, element: <Contact /> },
//       { path: "/post-job", exact: true, element: <PostJob /> },
//       { path: "/portfolio", exact: true, element: <Portfolio /> },
//       { path: "/portfolio/:id", exact: true, element: <PortfolioSingle /> },
//       { path: "/job-listing", exact: true, element: <JobListing /> },
//       { path: "/login", exact: true, element: <Login /> },
//       { path: "/signup", exact: true, element: <SignUp /> },
//       { path: "/ResetPassword", exact: true, element: <ResetPassword /> },
//       { path: "/ForgotPassword", exact: true, element: <ForgotPassword /> },
//       { path: "/job-listings", exact: true, element: <JobListing /> },
//       { path: "/job/:id", exact: true, element: <JobSingle /> },
//       { path: "/gallery", exact: true, element: <Gallery /> },
//       { path: "/EmployerSignUp", exact: true, element: <EmployerSignUp /> },
//       { path: "/SetupCredentials", exact: true, element: <SetupCredentials /> },
//       { path: "/quiz", exact: true, element: <Quiz /> },
//       { path: "/quiz/:quizId", exact: true, element: <QuizQuestions /> },
//       { path: "/quiz/:quizId/result", exact: true, element: <QuizResult /> },
//       { path: "/login", exact: true, element: <Login /> },
//     ],
//   },
// ];

// export default ThemeRoutes;
