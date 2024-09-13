import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { jobCategorySchema } from "../../../utils/variables/schema";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { IoMdAdd } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  addJobCategory,
  updateJobCategory,
} from "../../../features/jobCategorySlice";

export function JobCategoryForm({ isEdit, setIsEdit }) {
  const dispatch = useDispatch();
  const [newCategoryModal, setNewCategoryModal] = useState(false);
  const list = useSelector((state) => state.jobCategory.list) || [];

  const {
    handleSubmit,
    control,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(jobCategorySchema),
    defaultValues: {
      categoryName: "",
    },
  });

  const toggleNewCategoryModal = () => {
    if (newCategoryModal) {
      reset({ categoryName: "" });
      setIsEdit(null); // Reset isEdit state when modal is closing
    }
    setNewCategoryModal(!newCategoryModal);
  };

  useEffect(() => {
    if (isEdit) {
      setValue("categoryName", isEdit.categoryName); // Set the default value when isEdit changes
      setNewCategoryModal(true); // Open the modal if isEdit is set
    }
  }, [isEdit, setValue]);

  const onSubmit = (data) => {
    const checkExistName = list.some(
      (item) => item.categoryName === data.categoryName
    );
    if (checkExistName) {
      setError("categoryName", {
        message: "Name already exists!",
      });
      return;
    }
    if (isEdit) {
      dispatch(updateJobCategory({ data, categoryId: isEdit.categoryId })).then(
        () => {
          toggleNewCategoryModal();
        }
      );
    } else {
      dispatch(addJobCategory(data)).then(() => {
        toggleNewCategoryModal();
      });
    }
  };

  return (
    <>
      <div className="d-flex justify-content-end mb-2">
        <Button color="danger" onClick={toggleNewCategoryModal}>
          <IoMdAdd className="me-2" />
          New blog category
        </Button>
      </div>
      <Modal isOpen={newCategoryModal} toggle={toggleNewCategoryModal}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={toggleNewCategoryModal}>
            {isEdit ? "Edit Category" : "Create New Category"}
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="categoryName">Category Name</Label>
              <Controller
                name="categoryName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="categoryName"
                    placeholder="Enter category name"
                    type="text"
                    invalid={!!errors.categoryName}
                  />
                )}
              />
              {errors.categoryName && (
                <FormText color="danger">
                  {errors.categoryName.message}
                </FormText>
              )}
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit">
              {isEdit ? "Update" : "Submit"}
            </Button>
            <Button
              color="secondary"
              type="button"
              onClick={toggleNewCategoryModal}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
}
