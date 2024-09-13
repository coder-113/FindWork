import * as yup from "yup";

const forbiddenWords = ["admin", "root", "superuser", "username", "password"];

const containsForbiddenWord = (value) => {
  const lowerCaseValue = value.toLowerCase();
  return forbiddenWords.some((word) => lowerCaseValue.includes(word));
};

// Define validation schema
export const signUpSchema = yup.object().shape({
  firstName: yup
    .string()
    .max(50, "First name cannot exceed 50 characters")
    .required("First name is required"),
  lastName: yup
    .string()
    .max(50, "Last name cannot exceed 50 characters")
    .required("Last name is required"),
  username: yup
    .string()
    .max(50, "Username cannot exceed 50 characters")
    .matches(
      /^[a-zA-Z0-9_]*$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .test(
      "forbidden-words",
      "Username contains forbidden words",
      (value) => !containsForbiddenWord(value)
    )
    .test(
      "no-spaces",
      "Username cannot contain spaces",
      (value) => !/\s/.test(value)
    )
    .required("Username is required"),
  email: yup
    .string()
    .max(50, "Email cannot exceed 50 characters")
    .email("Invalid email")
    .test(
      "forbidden-words",
      "Email contains forbidden words",
      (value) => !containsForbiddenWord(value)
    )
    .required("Email is required"),
  password: yup
    .string()
    .max(120, "Password cannot exceed 120 characters")
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  gender: yup.string().required("Gender is required"),
});
