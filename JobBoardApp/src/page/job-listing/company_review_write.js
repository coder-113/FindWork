// src/pages/ReviewPage.js
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosRequest from '../../configs/axiosConfig';
import { StarRating } from './StarRating';
import { checkUserReviewThunk, createReviewThunk } from "../../features/reviewSlice";
import { GlobalLayoutUser } from '../../components/global-layout-user/GlobalLayoutUser';
import './company-review.css';
import { useDispatch, useSelector } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';
import DOMPurify from 'dompurify';

export const ReviewPage = () =>
{
    const { id } = useParams();
    const user = useSelector(state => state.auth.user);
    const userId = user ? user.id : null;

    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [rating, setRating] = useState(0);
    const [error, setError] = useState(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showConfirmExit, setShowConfirmExit] = useState(false);
    const overlayRef = useRef(null);
    const dispatch = useDispatch();
    const { hasReviewed } = useSelector((state) => state.review);

    useEffect(() =>
    {
        const checkIfReviewed = async () =>
        {
            try
            {
                await dispatch(checkUserReviewThunk(id));
                if (!userId)
                {
                    navigate(`/login`);
                }
                else if (hasReviewed)
                {
                    navigate(`/companyDetail/${id}`);
                }
            } catch (err)
            {
                console.error('Error checking review status:', err);
            }
        };
        checkIfReviewed();
    }, [id, userId, dispatch, hasReviewed, navigate]);

    const handleRatingChange = (newRating) =>
    {
        setRating(newRating);
    };

    const handleSubmit = async (e) =>
    {
        e.preventDefault();

        if (!title.trim() || !description.trim() || rating === 0)
        {
            setError({
                title: 'Oops! Please check required fields.',
                message: 'Required fields are missing.'
            });
            setShowOverlay(true); // Hiển thị overlay khi có lỗi
            return;
        }
        try
        {
            const actionResult = await dispatch(createReviewThunk({ companyId: id, review: { title, description: DOMPurify.sanitize(description), rating } }));
            if (createReviewThunk.fulfilled.match(actionResult))
            {
                // Xóa lỗi khi gửi thành công
                setError(null);
                setShowOverlay(false);
                // Chuyển hướng đến trang chi tiết công ty
                navigate(`/companyDetail/${id}`);
            } else
            {
                setError(null);
                setShowOverlay(false);
                setError({
                    title: 'Failed!'
                });
            }
        } catch (err)
        {
            setError({
                title: 'Failed to submit review',
                message: err.response ? err.response.data.message : err.message
            });
            setShowOverlay(true); // Hiển thị overlay khi có lỗi
        }
    };
    const companyId = parseInt(id ?? '0', 10);

    const handleBackClick = () =>
    {
        setShowConfirmExit(true);
    };

    const handleConfirmExit = () =>
    {
        navigate(`/companyDetail/${companyId}`);
    };

    const handleContinueReviewing = () =>
    {
        setShowConfirmExit(false);
    };

    useEffect(() =>
    {
        const handleClickOutside = (event) =>
        {
            if (overlayRef.current && !overlayRef.current.contains(event.target))
            {
                setShowOverlay(false);
                setShowConfirmExit(false);
            }
        };

        // Thêm sự kiện click
        document.addEventListener('mousedown', handleClickOutside);

        // Xóa sự kiện click khi component unmount
        return () =>
        {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleEditorChange = (content) =>
    {
        setDescription(content);
    };

    return (
        <GlobalLayoutUser>
            <>
                <section
                    className="section-hero overlay rv_overlay inner-page bg-image"
                    style={{
                        backgroundImage: 'url("../../../../assets/images/hero_1.jpg")',
                    }}
                    id="home-section"
                >
                    <div className="container">
                        <div className="row">
                            <div className="col-md-7">
                                <h1 className="text-white font-weight-bold">Write Review</h1>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="container mt-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <button className="btn btn-secondary" onClick={handleBackClick}>
                            &lt; Back
                        </button>
                    </div>
                    {showOverlay && error && (
                        <div className="rv_overlay overlay fade rv_fade show rv_show">
                            <div className="rv_overlay-content overlay-content" ref={overlayRef}>
                                <h4>{error.title}</h4>
                                <p>{error.message}</p>
                                <button className="btn btn-secondary" onClick={() => setShowOverlay(false)}>Back</button>
                            </div>
                        </div>
                    )}
                    {showConfirmExit && (
                        <div className="rv_overlay overlay fade rv_fade show rv_show">
                            <div className="rv_overlay-content overlay-content" ref={overlayRef}>
                                <h4>Quit reviewing</h4>
                                <p>Changes you made so far will not be saved. Are you sure you want to quit this page?</p>
                                <button className="btn btn-secondary" onClick={handleContinueReviewing}>Continue reviewing</button>
                                <button className="btn btn-primary" onClick={handleConfirmExit}>Confirm</button>
                            </div>
                        </div>
                    )}
                    <form noValidate>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                id="title"
                                className="form-control"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="description">Description</label>
                            <Editor
                                apiKey="6cb07sce109376hijr18r8vibbm3h5qjhh4qa8gc9pw8rvn0"
                                value={description}
                                init={{
                                    plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker',
                                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                                }}
                                onEditorChange={handleEditorChange}
                                required
                            />

                            {/* <textarea
                                id="description"
                                className="form-control"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            /> */}
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="rating">Rating</label>
                            <StarRating rating={rating} onRatingChange={handleRatingChange} />
                        </div>
                        <button onClick={(e) => handleSubmit(e)} type="submit" className="btn btn-primary mt-3 mb-5">Submit Review</button>
                    </form>
                </div>
            </>
        </GlobalLayoutUser >
    );
};
