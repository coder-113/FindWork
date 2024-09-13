import React, { useState, useEffect } from 'react';
import { Navigate, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginForm } from '../../../hooks/useLoginForm';
import { resetVerificationMessage, clearAuthError } from '../../../features/authSlice';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';

const Login = () => {
  const { register, handleSubmit, errors, onSubmit } = useLoginForm();
  const verificationMessage = useSelector((state) => state.auth?.verificationMessage);
  const loginError = useSelector((state) => state.auth?.error);
  const user = useSelector((state) => state.auth?.user);
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    console.log('Login component mounted or updated'); // Debugging
    dispatch(resetVerificationMessage());
    return () => {
      console.log('Login component unmounted'); // Debugging
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  if (user) return <Navigate to="/" replace />;

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCard className="p-4">
              <CCardBody>
                <CForm onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded">
                  <h1>Login</h1>
                  <p className="text-body-secondary">Sign In to your account</p>
                  {loginError && <p className="text-danger">{loginError}</p>}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      id="loginEmail"
                      {...register("username")}
                      placeholder="Username"
                      autoComplete="username"
                      autoFocus
                    />
                  </CInputGroup>
                  <p className="text-danger">{errors.username?.message}</p>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type={showPassword ? "text" : "password"}
                      id="loginPassword"
                      {...register("password")}
                      placeholder="Password"
                      autoComplete="current-password"
                    />
                    <div className="input-group-append">
                      <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? "Hide" : "Show"}
                      </span>
                    </div>
                  </CInputGroup>
                  <p className="text-danger">{errors.password?.message}</p>
                  <CRow>
                    <CCol xs={6}>
                      <CButton type="submit" color="primary" className="px-4">
                        Login
                      </CButton>
                    </CCol>
                    <CCol xs={6} className="text-right">
                      <NavLink to="/ForgotPassword" className="btn btn-link px-0">
                        Forgot password?
                      </NavLink>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
