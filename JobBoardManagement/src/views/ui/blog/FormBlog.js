import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  FormText,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Spinner,
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { slugify } from "../../../utils/functions/convertToSlug";
import { createFormData } from "../../../utils/form-data/formDataUtil";
import { IoMdAdd } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { addBlog, editBlog } from "../../../features/blogSlice";
import { fetchBlogCategory } from "../../../features/blogCategorySlice";
import { blogSchema } from "../../../utils/variables/schema";
import Select from "react-select";
import { useDropzone } from "react-dropzone";
import "./FormBlog.css";
import showToast from "../../../utils/functions/showToast";
import { LeftSideBlogForm } from "./LeftSideBlogForm";
import { RightSideBlogForm } from "./RightSideBlogForm";

const FormBlog = ({ isEdit, setIsEdit, isArchive = true }) => {
  const dispatch = useDispatch();
  const categoryList = useSelector((state) => state.blogCategory.blogCategory);
  const blogs = useSelector((state) => state.blogs.blogs);
  const statusSubmit = useSelector((state) => state.blogs.statusSubmit);
  const user = useSelector((state) => state.auth.user);
  const [modal, setModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [tags, setTags] = useState([]);

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    setError,

    formState: { errors, isDirty, isLoading },
  } = useForm({
    resolver: yupResolver(blogSchema(isEdit)),
    defaultValues: {
      title: "",
      content: "",
      categoryIds: [],
      image: null,
      visibility: true,
    },
  });

  const handleChangeTags = (newTags) => {
    setTags(newTags);
    setValue("hashtags", newTags, { shouldDirty: true });
  };

  const toggle = () => {
    setModal(!modal);
    setIsEdit(null);
    setTags([]);
    reset();
  };

  const onSubmit = (data) => {
    const newData = {
      ...data,
      slug: slugify(data.title),
      username: user.sub,
      hashtags: tags,
    };

    if (!newData.image || newData.image.length === 0) {
      delete newData.image;
    }
    const formData = createFormData(newData);
    if (!isEdit) {
      dispatch(addBlog(formData))
        .then((response) => {
          console.log(response);

          if (response.meta.requestStatus === "fulfilled") {
            showToast("Blog added successfully!", "success");
            toggle();
          } else {
            if (
              typeof response.payload === "string" &&
              response.payload === "Title already exists in blog table."
            )
              setError("title", {
                message: response.payload,
              });

            showToast("Failed to add blog", "error");
          }
        })
        .finally(() => {
          setTags([]);
        });
    } else {
      dispatch(editBlog({ newBlog: formData, id: isEdit.id })).then(
        (response) => {
          if (response.meta.requestStatus === "fulfilled") {
            showToast("Blog updated successfully!", "success");
            toggle();
          } else {
            showToast("Failed to update blog", "error");
          }
        }
      );
    }
  };

  useEffect(() => {
    if (isEdit) {
      setModal(true);
      setValue("title", isEdit.title);
      setValue("content", isEdit.content);
      setValue(
        "categoryIds",
        isEdit.categories.map((item) => item.id)
      );
      setValue("visibility", isEdit.visibility);
      setValue("citation", isEdit.citation);

      const tagEdit = isEdit.hashtags.map((item) => item.name);

      setTags(tagEdit);
      setValue("hashtags", tagEdit);
    }
  }, [isEdit, setValue]);

  useEffect(() => {
    const imageFile = watch("image");
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setPreviewUrl(null);
  }, [watch("image")]);

  const defaultValue = isEdit
    ? isEdit.categories.map((category) => ({
        label: category.name,
        value: category.id,
      }))
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    onDrop: (acceptedFiles) => {
      setValue("image", acceptedFiles[0], {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
  });

  return (
    <>
      <div>
        {!isArchive && (
          <Button color="success" onClick={toggle}>
            <IoMdAdd className="me-2" />
            New blog
          </Button>
        )}
      </div>
      <Modal isOpen={modal} toggle={toggle} size="xl">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader
            toggle={toggle}
            tag="h6"
            className="border-bottom p-3 mb-0"
          >
            <i className="bi bi-pencil me-2"> </i>
            Create Blog Post
          </ModalHeader>
          <ModalBody>
            <Row>
              <LeftSideBlogForm
                control={control}
                errors={errors}
                isEdit={isEdit}
                setValue={setValue}
                watch={watch}
              />
              <RightSideBlogForm
                control={control}
                errors={errors}
                isEdit={isEdit}
                previewUrl={previewUrl}
                getRootProps={getRootProps}
                getInputProps={getInputProps}
                categoryList={categoryList}
                defaultValue={defaultValue}
                tags={tags}
                onChangeTags={handleChangeTags}
              />
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              disabled={!isDirty || isLoading}
            >
              {isLoading && <Spinner size="sm" />}{" "}
              {isEdit ? "Update" : "Submit"}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};

export default FormBlog;
