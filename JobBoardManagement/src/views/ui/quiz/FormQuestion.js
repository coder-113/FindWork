import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { useDispatch } from 'react-redux';
import axiosRequest from '../../../configs/axiosConfig';
import { createQuestion, updateQuestion, deleteQuestion } from '../../../features/quizSlice';
import './formquestions.css';

const FormQuestion = ({ quizId, selectedQuestion, toggleModal, isOpen }) => {
    const dispatch = useDispatch();
    const [questionText, setQuestionText] = useState('');
    const [options, setOptions] = useState({
        A: '',
        B: '',
        C: '',
        D: '',
    });
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (selectedQuestion) {
            setQuestionText(selectedQuestion.questionText || '');
            const existingOptions = selectedQuestion.options?.split(', ') || [];
            setOptions({
                A: existingOptions[0]?.split('. ')[1] || '',
                B: existingOptions[1]?.split('. ')[1] || '',
                C: existingOptions[2]?.split('. ')[1] || '',
                D: existingOptions[3]?.split('. ')[1] || '',
            });
            setCorrectAnswer(selectedQuestion.correctAnswer || '');
        } else {
            setQuestionText('');
            setOptions({
                A: '',
                B: '',
                C: '',
                D: '',
            });
            setCorrectAnswer('');
        }
    }, [selectedQuestion]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const optionsString = `A. ${options.A}, B. ${options.B}, C. ${options.C}, D. ${options.D}`;

        try {
            let response;
            if (selectedQuestion) {
                response = await axiosRequest.put(
                    `/quizzes/${quizId}/questions/${selectedQuestion.id}`,
                    { questionText, options: optionsString, correctAnswer }
                );
                dispatch(updateQuestion({ quizId, questionId: selectedQuestion.id, questionText, options: optionsString, correctAnswer }));
            } else {
                response = await axiosRequest.post(
                    `/quizzes/${quizId}/questions`,
                    { questionText, options: optionsString, correctAnswer }
                );
                dispatch(createQuestion({ quizId, questionText, options: optionsString, correctAnswer }));
            }

            console.log('Created/updated question:', response);
            toggleModal();
        } catch (error) {
            console.error('Error creating/updating question:', error);
        }
    };

    

const handleDelete = async () => {
  if (selectedQuestion) {
    try {
      await axiosRequest.delete(`/quizzes/${quizId}/questions/${selectedQuestion.id}`);
      dispatch(deleteQuestion({ quizId, questionId: selectedQuestion.id }));
      toggleModal();
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  }
};
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axiosRequest.post(`/quizzes/${quizId}/questions/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Uploaded questions:', response);
            toggleModal();
        } catch (error) {
            console.error('Error uploading questions:', error);
        }
    };

    return (
        <Modal isOpen={isOpen} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal}>
                {selectedQuestion ? `Edit Question ${selectedQuestion.id}` : 'Add Question'}
            </ModalHeader>
            <ModalBody>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="questionText">Question</Label>
                        <Input
                            type="text"
                            id="questionText"
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Options</Label>
                        {['A', 'B', 'C', 'D'].map((option) => (
                            <FormGroup key={option}>
                                <Label>
                                    {option}.{' '}
                                    <Input
                                        type="text"
                                        value={options[option]}
                                        onChange={(e) => setOptions({ ...options, [option]: e.target.value })}
                                        required
                                    />
                                </Label>
                            </FormGroup>
                        ))}
                    </FormGroup>
                    <FormGroup>
                        <Label for="correctAnswer">Correct Answer</Label>
                        <Input
                            type="text"
                            id="correctAnswer"
                            value={correctAnswer}
                            onChange={(e) => setCorrectAnswer(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <Button type="submit" color="primary">
                        {selectedQuestion ? 'Update' : 'Add'}
                    </Button>
                    {selectedQuestion && (
                        <Button type="button" color="danger" onClick={handleDelete} className="ml-2">
                            Delete
                        </Button>
                    )}
                </Form>
                <FormGroup>
                    <Label for="file">Upload Questions from Excel</Label>
                    <Input type="file" id="file" onChange={handleFileChange} />
                    <Button color="primary" onClick={handleFileUpload}>
                        Upload
                    </Button>
                </FormGroup>
            </ModalBody>
        </Modal>
    );
};

export default FormQuestion;




