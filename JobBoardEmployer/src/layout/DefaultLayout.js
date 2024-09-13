import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const DefaultLayout = () => {
  const user = useSelector(state => state.auth.user)
  console.log('>>>user: ', user)

  if(!user || !user.role.map(item => item.authority).includes("ROLE_EMPLOYER")){
    return <Navigate to='/login' />
  }
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter /> a
      </div>
    </div>
  )
}

export default DefaultLayout
