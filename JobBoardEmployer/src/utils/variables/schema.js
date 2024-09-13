import * as yup from "yup";

const forbiddenWords = ["admin", "root", "superuser", "username", "password"];

const containsForbiddenWord = (value) => {
  const lowerCaseValue = value.toLowerCase();
  return forbiddenWords.some((word) => lowerCaseValue.includes(word));
};

// Define validation schema
export const signUpSchema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    username: yup.string()
      .test('forbidden-words', 'Username contains forbidden words', value => !containsForbiddenWord(value))
      .required('Username is required'),
    email: yup.string()
      .email('Invalid email')
      .test('forbidden-words', 'Email contains forbidden words', value => !containsForbiddenWord(value))
      .required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
    gender: yup.string().required('Gender is required'),
  });
