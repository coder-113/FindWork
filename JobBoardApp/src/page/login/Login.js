import React, { useEffect, useState } from "react";
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import
{
  resetMessages,
  resetVerificationMessage,
  signInOAuth2,
} from "../../features/authSlice";
import { useLoginForm } from "../../hooks/useLoginForm";
import { MdErrorOutline } from "react-icons/md";
import { Alert } from "react-bootstrap";
import "./login.css";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { signInOAuth2Async } from "../../services/AuthService";
import showToast from "../../utils/function/showToast";
import { Divider } from "antd";
export const Login = () =>
{
  const { register, handleSubmit, errors, onSubmit } = useLoginForm();
  const error = useSelector((state) => state.auth.error);
  const status = useSelector((state) => state.auth.status);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () =>
  {
    setShowPassword(!showPassword);
  };

  const handleSuccess = async (credentialResponse) =>
  {
    const credential1 = credentialResponse.credential;
    dispatch(signInOAuth2(credential1)).then((res) =>
    {
      if (res.meta.requestStatus === "fulfilled")
      {
        const fullName = res.payload.firstName + " " + res.payload.lastName;
        showToast("You're back, " + fullName, "success");
        navigate("/");
      }
    });
  };

  useEffect(() =>
  {
    dispatch(resetMessages());
  }, [dispatch]);

  if (user) return <Navigate to="/" />;

  return (
    <GlobalLayoutUser>
      <>
        <section
          className="section-hero overlay inner-page bg-image"
          style={{
            backgroundImage: 'url("../../../../assets/images/hero_1.jpg")',
          }}
          id="home-section"
        >
          <div className="container">
            <div className="row">
              <div className="col-md-7">
                <h1 className="text-white font-weight-bold">Login</h1>
                <div className="custom-breadcrumbs">
                  <a href="#">Home</a> <span className="mx-2 slash">/</span>
                  <span className="text-white">Log In</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="site-section section is-medium">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                {error && (
                  <>
                    <Alert variant="danger">
                      <MdErrorOutline size={25} className="mr-2" />
                      {error}
                    </Alert>
                  </>
                )}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="p-4 border rounded"
                >
                  {/* Form fields */}
                  <div className="form-group">
                    <label htmlFor="loginEmail">Username*</label>
                    <input
                      type="text"
                      id="loginEmail"
                      {...register("username")}
                      className="form-control"
                      placeholder="Username"
                      autoFocus
                    />
                    <p className="text-danger">{errors.username?.message}</p>
                  </div>
                  <div className="form-group">
                    <div className="d-flex justify-content-between align-items-center">
                      <label htmlFor="loginPassword">Password*</label>
                      <NavLink to="/ForgotPassword" className="btn btn-link">
                        Forgot Password?
                      </NavLink>
                    </div>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="loginPassword"
                        {...register("password")}
                        className="form-control"
                        placeholder="Password"
                      />
                      <div className="input-group-append">
                        <span
                          className="input-group-text"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                    </div>
                    <p className="text-danger">{errors.password?.message}</p>
                  </div>
                  <div className="form-group">
                    <button
                      type="submit"
                      className="btn px-4 btn-primary text-white w-100"
                      disabled={status === "loading" ? true : false}
                    >
                      Sign in
                    </button>
                  </div>
                  <div className="text-center font-weight-bold">
                    <p>
                      Do not have an account?{" "}
                      <NavLink to="/signup">Register now</NavLink>
                    </p>
                  </div>
                  <Divider className="text-secondary">OR</Divider>
                  <div className="d-flex justify-content-center">
                    <GoogleOAuthProvider
                      clientId={process.env.REACT_APP_GOOGLE_CLIENTID}
                    >
                      <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={(err) =>
                        {
                          console.log(err);
                        }}
                        shape="pill"
                        size="large"
                        text="signin_with"
                        type="standard"
                      />
                    </GoogleOAuthProvider>
                  </div>
                </form>
              </div>
              <div className="col-lg-6 d-none d-lg-block">
                <div className="info-box content">
                  <h4>Welcome Back!</h4>
                  <p>
                    By logging in, you gain access to all the features and
                    benefits of JobBoard, including personalized job
                    recommendations, application tracking, and more.
                  </p>
                  <ul>
                    <li>Personalized job recommendations</li>
                    <li>Track your applications</li>
                    <li>Connect with top employers</li>
                    <li>And much more...</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    </GlobalLayoutUser>
  );
};

export default Login;
