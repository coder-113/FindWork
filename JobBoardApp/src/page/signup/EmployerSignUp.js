import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import { signUpEmployer, resetSignUpSuccess } from "../../features/authSlice";
import registerImage from "../../assets/images/register.png";
import "./sign_up.css";

const employerSignUpSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  title: yup.string().required("Title is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  companyName: yup.string().required("Company name is required"),
  companyAddress: yup.string().required("Company address is required"),
  companyWebsite: yup
    .string()
    .url("Invalid URL")
    .required("Company website is required"),
});

function EmployerSignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(employerSignUpSchema),
  });

  const dispatch = useDispatch();
  const signUpSuccess = useSelector((state) => state.auth.signUpSuccess);
  const signUpError = useSelector((state) => state.auth.error);
  const navigate = useNavigate();

  // State to manage the visibility of the success message
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const onSubmit = (data) => {
    console.log("Form Submitted", data);
    dispatch(signUpEmployer(data));
  };

  useEffect(() => {
    if (signUpSuccess) {
      console.log("Employer registration successful!");
      setShowSuccessMessage(true); // Show success message
      dispatch(resetSignUpSuccess());
      setTimeout(() => {
        navigate("/login");
      }, 3000); // Redirect after 3 seconds
    }
  }, [signUpSuccess, dispatch, navigate]);

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
              <h1 className="text-white font-weight-bold">Employer Sign Up</h1>
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
              <h2 className="mb-4">Register as an Employer</h2>
              {showSuccessMessage && (
                <div className="alert alert-success" role="alert">
                  Successfully signed up! Verify your account via email.
                </div>
              )}
              {signUpError && (
                <div className="alert alert-danger" role="alert">
                  {typeof signUpError === "object"
                    ? signUpError.message
                    : signUpError}
                </div>
              )}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-4 border rounded"
              >
                <div className="row form-group">
                  <div className="col-md-12">
                    <label className="text-black" htmlFor="name">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register("name")}
                      className={`form-control ${
                        errors.name ? "is-invalid" : ""
                      }`}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">
                        {errors.name.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row form-group">
                  <div className="col-md-12">
                    <label className="text-black" htmlFor="title">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      {...register("title")}
                      className={`form-control ${
                        errors.title ? "is-invalid" : ""
                      }`}
                    />
                    {errors.title && (
                      <div className="invalid-feedback">
                        {errors.title.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row form-group">
                  <div className="col-md-12">
                    <label className="text-black" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register("email")}
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">
                        {errors.email.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row form-group">
                  <div className="col-md-12">
                    <label className="text-black" htmlFor="phoneNumber">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="phoneNumber"
                      {...register("phoneNumber")}
                      className={`form-control ${
                        errors.phoneNumber ? "is-invalid" : ""
                      }`}
                    />
                    {errors.phoneNumber && (
                      <div className="invalid-feedback">
                        {errors.phoneNumber.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row form-group">
                  <div className="col-md-12">
                    <label className="text-black" htmlFor="companyName">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      {...register("companyName")}
                      className={`form-control ${
                        errors.companyName ? "is-invalid" : ""
                      }`}
                    />
                    {errors.companyName && (
                      <div className="invalid-feedback">
                        {errors.companyName.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row form-group">
                  <div className="col-md-12">
                    <label className="text-black" htmlFor="companyAddress">
                      Company Address
                    </label>
                    <input
                      type="text"
                      id="companyAddress"
                      {...register("companyAddress")}
                      className={`form-control ${
                        errors.companyAddress ? "is-invalid" : ""
                      }`}
                    />
                    {errors.companyAddress && (
                      <div className="invalid-feedback">
                        {errors.companyAddress.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row form-group">
                  <div className="col-md-12">
                    <label className="text-black" htmlFor="companyWebsite">
                      Company Website
                    </label>
                    <input
                      type="url"
                      id="companyWebsite"
                      {...register("companyWebsite")}
                      className={`form-control ${
                        errors.companyWebsite ? "is-invalid" : ""
                      }`}
                    />
                    {errors.companyWebsite && (
                      <div className="invalid-feedback">
                        {errors.companyWebsite.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row form-group">
                  <div className="col-md-12">
                    <button type="submit" className="btn btn-primary">
                      Sign Up
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-lg-6">
              <img src={registerImage} alt="Register" className="img-fluid" />
            </div>
          </div>
        </div>
      </section>
    </GlobalLayoutUser>
  );
}

export default EmployerSignUp;
