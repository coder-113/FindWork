import React from 'react'
import EditCompany from './views/user/company';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const ListJobs = React.lazy(() => import('./views/jobs/listJob'));
const postJobs = React.lazy(() => import('./views/jobs/PostJob'));
const jobDetails = React.lazy(() => import('./views/jobs/JobDetail'));

const editJob = React.lazy(() => import('./views/jobs/EditJob'));
const pay = React.lazy(() => import('./views/payment/BuyService'));
const ListTransaction = React.lazy(() => import('./views/payment/ListTransaction'));
const chatbot = React.lazy(() => import('./views/chatbot/Chatbox'));
const user = React.lazy(() => import('./views/user/user'));
const cv = React.lazy(() => import('./views/cv/JobApplicationsByCompany'));
const company = React.lazy(() => import('./views/user/company'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/job', name: 'Job', element:ListJobs},
  { path: '/job/create', name: 'Create_Job', element:postJobs},
  { path: '/job/edit/:jobId', name: 'editJob', element:editJob},
  { path: '/job/detail/:jobId', name: 'jobdetail', element:jobDetails},
  { path: '/buy', name: 'pay', element:pay},
  { path: '/transcation', name: 'ListTransaction', element:ListTransaction},
  { path: '/chatbot', name: 'chatbot', element:chatbot},
  { path: '/user', name: 'user', element:user},
  { path: '/cv', name: '  ', element:cv},
  { path: '/company', name: 'company', element:EditCompany},

]

export default routes
