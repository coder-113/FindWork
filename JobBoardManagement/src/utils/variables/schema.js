import * as yup from "yup";
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

export const blogSchema = (isEdit) => {
  return yup.object().shape({
    title: yup.string().required("Title is required"),
    content: yup.string().required("Content is required"),
    citation: yup.string().required("Citation is required"),
    categoryIds: yup
      .array()
      .of(yup.string().required("Category ID is required"))
      .min(1, "At least one category is required")
      .required("Category is required"),
    hashtags: yup
      .array()
      .of(yup.string().required("Hashtag is required"))
      .min(1, "At least one hashtag is required")
      .required("Hashtags are required")
      .test("unique", "Hashtags must be unique", (value) => {
        if (value) {
          return new Set(value).size === value.length;
        }
        return true; // If value is undefined or null, no need to validate uniqueness
      }),
    image: isEdit
      ? yup
          .mixed()
          .nullable()
          .test("fileSize", "The file is too large", (file) => {
            if (!file) return true; // Không kiểm tra nếu không có tệp
            return file.size <= 2000000;
          })
          .test("fileFormat", "Unsupported Format", (file) => {
            if (!file) return true; // Không kiểm tra nếu không có tệp
            return SUPPORTED_FORMATS.includes(file.type);
          })
      : yup
          .mixed()
          .test("required", "You need to provide a file", (file) => {
            if (file) return true;
            return false;
          })
          .test("fileSize", "The file is too large", (file) => {
            return file && file.size <= 2000000;
          })
          .test("fileFormat", "Unsupported Format", (file) => {
            console.log(file.type);
            return file && SUPPORTED_FORMATS.includes(file.type);
          }),
  });
};
export const blogCategorySchema = yup.object().shape({
  name: yup.string().required("Name is required"),
});
export const jobCategorySchema = yup.object().shape({
  categoryName: yup.string().required("Name is required"),
});

export const quizSchema = (isEdit) => {
  return yup.object().shape({
    title: yup
      .string()
      .required("Title is required")
      .max(50, "Title must be less than 50 characters."),
    description: yup.string().required("Description is required"),
    imageFile: isEdit
      ? yup.mixed().nullable()
      : yup
          .mixed()
          .test("required", "You need to provide a file", (file) => {
            if (file) return true;
            return false;
          })
          .test("fileSize", "The file is too large", (file) => {
            return file && file.size <= 2000000; // 2MB limit
          }),
  });
};
export const categoryQuizSchema = yup.object().shape({
  name: yup
    .string()
    .required("Category name is required")
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name can't be longer than 50 characters"),
});
