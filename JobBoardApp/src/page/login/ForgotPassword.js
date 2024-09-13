import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import { forgotPassword, resetMessages } from "../../features/authSlice";
import { Navigate } from "react-router-dom";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const { successMessage, errorMessage } = useSelector((state) => state.auth);

  const onSubmit = (data) => {
    dispatch(forgotPassword(data.email));
  };

  useEffect(() => {
    dispatch(resetMessages());
  }, [dispatch]);
  if (user) return <Navigate to="/" replace={true} />;

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
                  <strong>Log In</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section is-medium">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <h2 className="mb-4">Forgot Password</h2>
              {successMessage && (
                <p className="text-success">{successMessage}</p>
              )}
              {errorMessage && <p className="text-danger">{errorMessage}</p>}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-4 border rounded"
              >
                <div className="form-group">
                  <input
                    type="text"
                    id="forgotPasswordEmail"
                    {...register("email", { required: "Email is required" })}
                    className="form-control"
                    placeholder="Email address"
                  />
                  <p className="text-danger">{errors.email?.message}</p>
                </div>
                <div className="form-group">
                  <input
                    type="submit"
                    value="Submit"
                    className="btn px-4 btn-primary text-white"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </GlobalLayoutUser>
  );
};

export default ForgotPassword;
