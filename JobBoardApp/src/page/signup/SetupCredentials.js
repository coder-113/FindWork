import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { setupCredentials, resetSignUpSuccess } from "../../features/authSlice";
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import { NavLink, useNavigate } from "react-router-dom";
import "./sign_up.css";

const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  code: yup.string().required("Verification code is required"),
});

function SetupCredentials() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const setupSuccess = useSelector((state) => state.auth.setupSuccess);
  const error = useSelector((state) => state.auth.error);
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const onSubmit = (data) => {
    dispatch(setupCredentials(data));
  };

  useEffect(() => {
    if (setupSuccess) {
      setShowSuccessMessage(true);
      dispatch(resetSignUpSuccess());
      setTimeout(() => {
        navigate("/login");
      }, 3000); // Redirect after 3 seconds
    }
  }, [setupSuccess, dispatch, navigate]);

  return (
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
              <h1 className="text-white font-weight-bold">
                Set Up Credentials
              </h1>
              <div className="custom-breadcrumbs">
                <a href="#">Home</a> <span className="mx-2 slash">/</span>
                <span className="text-white">
                  <strong>Set Up Credentials</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="site-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mb-5">
              <h2 className="mb-4">Register an account</h2>
              {showSuccessMessage && (
                <div className="alert alert-success" role="alert">
                  Successfully set up! Verify your account via email.
                </div>
              )}
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-4 border rounded"
              >
                <div className="row form-group">
                  <div className="col-md-12 mb-3 mb-md-0">
                    <label className="text-black" htmlFor="code">
                      Verification Code*
                    </label>
                    <input
                      type="text"
                      id="code"
                      {...register("code")}
                      className="form-control"
                      placeholder="Enter your verification code..."
                    />
                    <p className="text-danger">{errors.code?.message}</p>
                  </div>
                </div>
                <div className="row form-group">
                  <div className="col-md-12 mb-3 mb-md-0">
                    <label className="text-black" htmlFor="username">
                      Username*
                    </label>
                    <input
                      type="text"
                      id="username"
                      {...register("username")}
                      className="form-control"
                      placeholder="Enter your username..."
                    />
                    <p className="text-danger">{errors.username?.message}</p>
                  </div>
                </div>
                <div className="row form-group">
                  <div className="col-md-12 mb-3 mb-md-0">
                    <label className="text-black" htmlFor="password">
                      Password*
                    </label>
                    <input
                      type="password"
                      id="password"
                      {...register("password")}
                      className="form-control"
                      placeholder="Enter your password..."
                    />
                    <p className="text-danger">{errors.password?.message}</p>
                  </div>
                </div>
                <div className="row form-group">
                  <div className="col-md-12 mb-3 mb-md-0">
                    <label className="text-black" htmlFor="confirmPassword">
                      Confirm Password*
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      {...register("confirmPassword")}
                      className="form-control"
                      placeholder="Confirm your password..."
                    />
                    <p className="text-danger">
                      {errors.confirmPassword?.message}
                    </p>
                  </div>
                </div>
                <div className="row form-group">
                  <div className="col-md-12">
                    <input
                      type="submit"
                      value="Set Up"
                      className="btn px-4 btn-primary text-white w-100"
                    />
                  </div>
                </div>
                <div className="text-center font-weight-bold">
                  <p>
                    You already have an account?{" "}
                    <NavLink to="/login">Log in now</NavLink>
                  </p>
                </div>
              </form>
            </div>
            <div
              className="col-lg-6 d-flex justify-content-end align-items-center"
              style={{ height: "auto" }}
            >
              <img
                src="https://itviec.com/assets/robby-login-df4a56395486b5cea97ba1754d226059626e6e124b3ea3db0789ba3c39f644f1.png"
                alt="Register"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SetupCredentials;
