import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { signUpSchema } from "../../utils/variables/schema";
import { signUp } from "../../features/authSlice";
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import registerImage from "../../assets/images/register.png";
import "./sign_up.css";
import { Navigate, NavLink } from "react-router-dom";
function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });
  const dispatch = useDispatch();
  const signUpSuccess = useSelector((state) => state.auth.signUpSuccess);
  const user = useSelector((state) => state.auth.user);
  const error = useSelector((state) => state.auth.error);
  const [password, setPassword] = useState("");
  const onSubmit = async (data) => {
    console.log(data);
    dispatch(signUp(data));
    console.log("check sign up state: ", signUpSuccess);
    if (signUpSuccess) {
      console.log("DANG KY THANH CONG");
    }
  };

  const passwordValidations = [
    {
      test: password.length >= 6,
      message: "Password must be at least 6 characters",
    },
    {
      test: password.trim() !== "",
      message: "Password cannot be empty",
    },
  ];
  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <GlobalLayoutUser>
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
              <h1 className="text-white font-weight-bold">Sign Up/Login</h1>
              <div className="custom-breadcrumbs">
                <a href="#">Home</a> <span className="mx-2 slash">/</span>
                <span className="text-white">
                  <strong>Sign up</strong>
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
              {signUpSuccess && (
                <div className="alert alert-success" role="alert">
                  Successfully signed up! Verify your account via email.
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
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label className="text-black" htmlFor="firstName">
                      First Name*
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      {...register("firstName")}
                      className="form-control"
                      placeholder="enter your first name..."
                    />
                    <p className="text-danger">{errors.firstName?.message}</p>
                  </div>
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label className="text-black" htmlFor="lastName">
                      Last Name*
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      {...register("lastName")}
                      className="form-control"
                      placeholder="enter your last name..."
                    />
                    <p className="text-danger">{errors.lastName?.message}</p>
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
                      placeholder="enter your username..."
                    />
                    <p className="text-danger">{errors.username?.message}</p>
                  </div>
                </div>
                <div className="row form-group">
                  <div className="col-md-12 mb-3 mb-md-0">
                    <label className="text-black" htmlFor="email">
                      Email*
                    </label>
                    <input
                      type="text"
                      id="email"
                      {...register("email")}
                      className="form-control"
                      placeholder="enter your email address..."
                    />
                    <p className="text-danger">{errors.email?.message}</p>
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
                      placeholder="enter your password..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <ul className="password-requirements">
                      {passwordValidations.map((validation, index) => (
                        <li
                          key={index}
                          className={validation.test ? "valid" : "invalid"}
                        >
                          {validation.test ? (
                            <FaCheck className="text-success" />
                          ) : (
                            <FaTimes className="text-danger" />
                          )}{" "}
                          {validation.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="row form-group mb-4">
                  <div className="col-md-12 mb-3 mb-md-0">
                    <label className="text-black" htmlFor="confirmPassword">
                      Re-Type Password*
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      {...register("confirmPassword")}
                      className="form-control"
                      placeholder="re-type password ..."
                    />
                    <p className="text-danger">
                      {errors.confirmPassword?.message}
                    </p>
                  </div>
                </div>
                <div className="row form-group">
                  <div className="col-md-12 mb-3 mb-md-0">
                    <label className="text-black" htmlFor="gender">
                      Gender*
                    </label>
                    <select
                      id="gender"
                      {...register("gender")}
                      className="form-control"
                    >
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                    <p className="text-danger">{errors.gender?.message}</p>
                  </div>
                </div>
                <div className="row form-group">
                  <div className="col-md-12">
                    <input
                      type="submit"
                      value="Sign Up"
                      className="btn px-4 btn-primary text-white w-100"
                      disabled={!isDirty}
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
              style={{
                height: "auto",
              }}
            >
              <img
                src="https://itviec.com/assets/robby-login-df4a56395486b5cea97ba1754d226059626e6e124b3ea3db0789ba3c39f644f1.png"
                className="d-none d-lg-block"
              />
            </div>
          </div>
        </div>
      </section>
    </GlobalLayoutUser>
  );
}

export default SignUp;
