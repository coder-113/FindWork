import { AboutUs } from "../../page/about-us/AboutUs";
import { BlogSingle } from "../../page/blog-single/BlogSingle";
import Blog from "../../page/blog/Blog";
import { Contact } from "../../page/contact/Contact";
import { Faq } from "../../page/faq/Faq";
import { Home } from "../../page/home/Home";
import { Portfolio } from "../../page/portfolio/Portfolio";
import { PortfolioSingle } from "../../page/portfolio-single/PortfolioSingle";
import { JobList } from "../../page/job-listing/job_listing";
import { ViewAllSkill } from "../../page/job-listing/listSkillAll";
import { PostJob } from "../../page/post-job/PostJob";
import { Login } from "../../page/login/Login";
import SignUp from "../../page/signup/SignUp";
import ForgotPassword from "../../page/login/ForgotPassword";
import { Gallery } from "../../page/gallery/Gallery";
import { ResetPassword } from "../../page/login/ResetPassword";
import { JobSingle } from "../../page/job-listing/JobSingle";
import { JobSingle1 } from "../../page/job-single/JobSingle";
import EmployerSignUp from "../../page/signup/EmployerSignUp";
import ListTemplate from "../../page/list-template/ListTemplate";
import ReviewTemplate from "../../page/user-cv/ReviewTemplate";
import MainCv from "../../page/user-cv/MainCv";
import ListPdf from "../../page/pdf-management/ListPdf";
import PdfDetail from "../../page/pdf-management/PdfDetail";
import MyProfile from "../../page/myprofile/myprofile";

import SetupCredentials from "../../page/signup/SetupCredentials";
import { Quiz } from "../../page/quiz/quiz";
import QuizResult from "../../page/quiz/QuizResult";
import QuizQuestions from "../../page/quiz/QuizQuestions";
import { CompanyDetail } from "../../page/job-listing/company_detail";
import { ViewAllCompany } from "../../page/job-listing/listCompanyAll";
import { ReviewPage } from "../../page/job-listing/company_review_write";
import { SavedJobs } from "../../page/job-listing/saved_job";
import UpdateCv from "../../page/user-cv/UpdateCv";
import ManagementProfile from "../../page/myprofile/UserProfileManagement";
import PDFViewerPage from "../../page/myprofile/PDFViewerPage";
import React from "react";

export const routes = [
  { path: "/", component: <Home /> },
  { path: "/about", component: <AboutUs /> },
  { path: "/blogs", component: <Blog /> },
  { path: "/blog/:id", component: <BlogSingle /> },
  { path: "/contact", component: <Contact /> },
  { path: "/post-job", component: <PostJob /> },
  { path: "/portfolio", component: <Portfolio /> },
  { path: "/portfolio/:id", component: <PortfolioSingle /> },
  // { path: "/jobSkillList/:id", component: <JobList /> },
  { path: "/jobList/:id", component: <JobList /> },
  { path: "/jobDetail/:id/:companyId", component: <JobSingle /> },
  { path: "/viewAllJobs/:searchTerm?", component: <JobList /> },
  { path: "/viewAllJobs", component: <JobList /> },
  { path: "/viewAllSkill", component: <ViewAllSkill /> },
  { path: "/login", component: <Login /> },
  { path: "/signup", component: <SignUp /> },
  { path: "/cv-management", component: <MainCv /> },
  { path: "/list-template", component: <ListTemplate /> },
  { path: "/list-pdf", component: <ListPdf /> },
  { path: "/pdf-cv/:id", component: <PdfDetail /> },
  { path: "/review-template/:templateName/:userId/:cvId/:templateId", component: <ReviewTemplate /> },
  { path: "/ResetPassword", component: <ResetPassword /> },
  { path: "/ForgotPassword", component: <ForgotPassword /> },
  { path: "/job", component: <JobSingle1 /> },
  { path: "/gallery", component: <Gallery /> },
  { path: "/EmployerSignUp", component: <EmployerSignUp /> },
  { path: "/SetupCredentials", component: <SetupCredentials /> },
  { path: "/quiz", component: <Quiz /> },
  { path: "/quiz/:quizId", component: <QuizQuestions /> },
  { path: "/quiz/:quizId/result", component: <QuizResult /> },
  { path: "/companyDetail/:id", component: <CompanyDetail /> },
  { path: "/viewAllCompany", component: <ViewAllCompany /> },
  { path: "/companyDetail/:id/writeReview", component: <ReviewPage /> },
  { path: "/savedJob", component: <SavedJobs /> },
  { path: "/myprofile", component: <MyProfile /> },
  { path: "/managementprofile", component: <ManagementProfile /> },
  {path:"/view-pdf/:filename", component:<PDFViewerPage/>},
];
