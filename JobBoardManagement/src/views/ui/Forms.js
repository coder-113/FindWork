// // src/components/Forms.js
// import React, { useEffect, useState } from "react";
// import {
//   Row,
//   Col,
//   Button,
//   Form,
//   FormGroup,
//   Label,
//   Input,
//   FormText,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
// } from "reactstrap";
// import { useForm, Controller } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { slugify } from "../../utils/functions/convertToSlug";
// import { getAllBlogCategories } from "../../services/blog_category_service";
// import { createFormData } from "../../utils/form-data/formDataUtil";
// import { IoMdAdd } from "react-icons/io";
// import { useDispatch } from "react-redux";
// import { addBlog } from "../../features/blogSlice";

// const schema = yup.object().shape({
//   title: yup.string().required("Title is required"),
//   content: yup.string().required("Content is required"),
//   blogCategoryId: yup.string().required("Category is required"),
//   tags: yup.string().required("Tags are required"),
//   image: yup
//     .mixed()
//     .test("required", "You need to provide a file", (file) => {
//       if (file) return true;
//       return false;
//     })
//     .test("fileSize", "The file is too large", (file) => {
//       return file && file.size <= 2000000;
//     }),
// });

// const Forms = (args) => {
//   const [categoryList, setCategoryList] = useState([]);
//   const [modal, setModal] = useState(false);
//   const dispatch = useDispatch();

//   const toggle = () => setModal(!modal);

//   const {
//     handleSubmit,
//     control,
//     setValue,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       title: "",
//       tags: "",
//       content: "",
//       blogCategoryId: "",
//       image: "",
//     },
//   });

//   const onSubmit = (data) => {
//     const newData = {
//       ...data,
//       slug: slugify(data.title),
//       author: "Testttt",
//       status: 1,
//     };

//     const formData = createFormData(newData);
//     dispatch(addBlog(formData)).then(() => {
//       toggle();
//     });
//   };

//   useEffect(() => {
//     getAllBlogCategories().then((data) => {
//       setCategoryList(data);
//     });
//   }, []);

//   return (
//     <>
//       <div className="d-flex justify-content-end mb-2">
//         <Button color="danger" onClick={toggle}>
//           <IoMdAdd className="me-2" />
//           New blog
//         </Button>
//       </div>
//       <Modal isOpen={modal} toggle={toggle} size="lg">
//         <Form onSubmit={handleSubmit(onSubmit)}>
//           <ModalHeader
//             toggle={toggle}
//             tag="h6"
//             className="border-bottom p-3 mb-0"
//           >
//             <i className="bi bi-pencil me-2"> </i>
//             Create Blog Post
//           </ModalHeader>
//           <ModalBody>
//             <Row>
//               <Col md={6}>
//                 <FormGroup>
//                   <Label for="postTitle">Title</Label>
//                   <Controller
//                     name="title"
//                     control={control}
//                     render={({ field }) => (
//                       <Input
//                         {...field}
//                         id="postTitle"
//                         placeholder="Enter the title of the blog post"
//                         type="text"
//                         invalid={!!errors.title}
//                       />
//                     )}
//                   />
//                   {errors.title && (
//                     <FormText color="danger">{errors.title.message}</FormText>
//                   )}
//                 </FormGroup>
//               </Col>
//               <Col md={6}>
//                 <FormGroup>
//                   <Label for="postTags">Tags</Label>
//                   <Controller
//                     name="tags"
//                     control={control}
//                     render={({ field }) => (
//                       <Input
//                         {...field}
//                         id="postTags"
//                         placeholder="Enter tags separated by commas"
//                         type="text"
//                         invalid={!!errors.tags}
//                       />
//                     )}
//                   />
//                   {errors.tags && (
//                     <FormText color="danger">{errors.tags.message}</FormText>
//                   )}
//                 </FormGroup>
//               </Col>
//             </Row>
//             <Row>
//               <Col md={12}>
//                 <FormGroup>
//                   <Editor
//                     apiKey={process.env.REACT_APP_TINYMCE_KEY}
//                     init={{
//                       plugins:
//                         "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
//                       toolbar:
//                         "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
//                     }}
//                     initialValue="Welcome to TinyMCE!"
//                     onEditorChange={(newValue, editor) =>
//                       setValue("content", newValue, { shouldValidate: true })
//                     }
//                   />
//                   {errors.content && (
//                     <FormText color="danger">{errors.content.message}</FormText>
//                   )}
//                 </FormGroup>
//               </Col>
//             </Row>
//             <Row>
//               <Col md={6}>
//                 <FormGroup>
//                   <Label for="postCategory">Category</Label>
//                   <Controller
//                     name="blogCategoryId"
//                     control={control}
//                     render={({ field }) => (
//                       <Input
//                         {...field}
//                         id="postCategory"
//                         type="select"
//                         invalid={!!errors.blogCategoryId}
//                       >
//                         <option disabled value="">
//                           --- Select category ---
//                         </option>
//                         {categoryList.map((category) => (
//                           <option key={category.id} value={category.id}>
//                             {category.name}
//                           </option>
//                         ))}
//                       </Input>
//                     )}
//                   />
//                   {errors.blogCategoryId && (
//                     <FormText color="danger">
//                       {errors.blogCategoryId.message}
//                     </FormText>
//                   )}
//                 </FormGroup>
//               </Col>
//               <Col md={6}>
//                 <FormGroup>
//                   <Label for="postImage">Upload Image</Label>
//                   <Input
//                     id="postImage"
//                     type="file"
//                     onChange={(e) => {
//                       setValue("image", e.target.files[0], {
//                         shouldValidate: true,
//                       });
//                     }}
//                     invalid={!!errors.image}
//                   />
//                   {errors.image && (
//                     <FormText color="danger">{errors.image.message}</FormText>
//                   )}
//                 </FormGroup>
//               </Col>
//             </Row>
//           </ModalBody>
//           <ModalFooter>
//             <Button color="primary" type="submit">
//               Submit
//             </Button>
//             <Button color="secondary" type="button" onClick={toggle}>
//               Cancel
//             </Button>
//           </ModalFooter>
//         </Form>
//       </Modal>
//     </>
//   );
// };

// export default Forms;
