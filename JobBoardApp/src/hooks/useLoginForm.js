import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { signIn, resetSignInSuccess } from "../features/authSlice";
import showToast from "../utils/function/showToast";

export const useLoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        username: yup.string().required("Username is required"),
        password: yup.string().required("Password is required"),
      })
    ),
  });

  const onSubmit = (data) => {
    dispatch(signIn(data))
      .then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          const fullName = res.payload.firstName + " " + res.payload.lastName;

          navigate("/");
          dispatch(resetSignInSuccess());
          showToast("You're back, " + fullName, "success");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // useEffect(() => {
  //   if (signInSuccess) {
  //     console.log("Login successful");
  //     navigate(-1);
  //     dispatch(resetSignInSuccess()); // Reset signInSuccess to handle future logins
  //   }
  // }, [signInSuccess, navigate, dispatch]);

  // useEffect(() => {
  //   if (signInError) {
  //     console.error("Login failed:", signInError);
  //   }
  // }, [signInError]);

  return { register, handleSubmit, errors, onSubmit };
};
