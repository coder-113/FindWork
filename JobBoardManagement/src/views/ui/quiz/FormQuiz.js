import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
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
} from 'reactstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import { quizSchema } from '../../../utils/variables/schema';
import { createNewQuiz, modifyQuiz } from '../../../features/quizSlice';
import { fetchCategoryQuiz } from '../../../features/quizCategorySlice';

const FormQuiz = ({ isEdit, setIsEdit }) => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categoryQuiz.categoryQuiz || []);

  const [newQuizModal, setNewQuizModal] = useState(false);
  const setError = useState(false)[1];

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(quizSchema(false)),
    defaultValues: {
      title: '',
      description: '',
      categoryId: '',
      imageFile: null,
    },
  });

  const toggleNewQuizModal = () => {
    if (newQuizModal) {
      reset({ title: '', description: '', categoryId: '', imageFile: null });
      setIsEdit(null);
    }
    setNewQuizModal(!newQuizModal);
  };

  useEffect(() => {
    if (isEdit) {
      setValue('title', isEdit.title);
      setValue('description', isEdit.description);
      setValue('categoryId', isEdit.categoryId);
      setNewQuizModal(true);
    }
  }, [isEdit, setValue]);

  useEffect(() => {
    dispatch(fetchCategoryQuiz());
  }, [dispatch]);

  const onSubmit = (formData) => {
    if (isEdit) {
      dispatch(modifyQuiz({ id: isEdit.id, data: formData, imageFile: formData.imageFile })).then(
        () => {
          toggleNewQuizModal();
        }
      );
    } else {
      dispatch(createNewQuiz(formData)).then(() => {
        toggleNewQuizModal();
      });
    }
  };

  return (
    <>
      <div className="d-flex justify-content-end mb-2">
        <Button color="danger" onClick={toggleNewQuizModal}>
          {isEdit ? 'Update Quiz' : 'New Quiz'}
        </Button>
      </div>
      <Modal isOpen={newQuizModal} toggle={toggleNewQuizModal}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={toggleNewQuizModal}>
            {isEdit ? 'Edit Quiz' : 'Create New Quiz'}
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="title">Title</Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="title"
                    placeholder="Enter quiz title"
                    type="text"
                    invalid={!!errors.title}
                  />
                )}
              />
              {errors.title && (
                <FormText color="danger">{errors.title.message}</FormText>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="description"
                    placeholder="Enter quiz description"
                    type="textarea"
                    invalid={!!errors.description}
                  />
                )}
              />
              {errors.description && (
                <FormText color="danger">{errors.description.message}</FormText>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="categoryId">Category</Label>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="categoryId"
                    type="select"
                    invalid={!!errors.categoryId}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Input>
                )}
              />
              {errors.categoryId && (
                <FormText color="danger">{errors.categoryId.message}</FormText>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="imageFile">Image File</Label>
              <Input
                id="imageFile"
                type="file"
                onChange={(e) =>
                  setValue('imageFile', e.target.files[0], { shouldValidate: true })
                }
                invalid={!!errors.imageFile}
              />
              {errors.imageFile && (
                <FormText color="danger">{errors.imageFile.message}</FormText>
              )}
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit">
              {isEdit ? 'Update' : 'Create'} Quiz
            </Button>
            <Button color="secondary" onClick={toggleNewQuizModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};

export default FormQuiz;
