import React from 'react';
import { StarRating } from './StarRating';
import LazyLoad from 'react-lazyload';

const ReviewComponent = ({ title, rating, description, username, imageUrl }) =>
{
    return (
        <div className="review-card card shadow-sm p-5 mb-4 ml-4">
            <div className="d-flex align-items-center">
                <LazyLoad height={40} offset={100}>
                    <img
                        src={imageUrl}
                        alt="User"
                        className="rounded-circle mr-3 mb-2"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        loading="lazy"
                    />
                </LazyLoad>
                <p className='text-secondary mb-2 font-weight-bold'>{username}</p>
            </div>
            <h5 className="card-title text-dark mb-3" style={{ fontSize: '20px', fontWeight: 'bold' }}>{title}</h5>
            <StarRating
                rating={rating}
                readOnly={true}
            />
            <div className="card-text text-dark mt-3" dangerouslySetInnerHTML={{ __html: description }} />
        </div>
    );
};
export default ReviewComponent;
