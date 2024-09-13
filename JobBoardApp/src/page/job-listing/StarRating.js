// src/components/StarRating.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaStar } from 'react-icons/fa';

const getStarRatingMessage = (rating) =>
{
    switch (rating)
    {
        case 1: return 'Terrible';
        case 2: return 'Needs improvement';
        case 3: return 'Good';
        case 4: return 'Really good';
        case 5: return 'Fantastic!';
        default: return '';
    }
};

export const StarRating = ({ rating, onRatingChange, readOnly }) =>
{
    const [hoverRating, setHoverRating] = useState(null);

    const handleMouseEnter = (index) =>
    {
        if (!readOnly) setHoverRating(index);
    };
    const handleMouseLeave = () =>
    {
        if (!readOnly) setHoverRating(null);
    };
    const handleClick = (index) =>
    {
        if (!readOnly) onRatingChange(index);
    };

    const displayRatingMessage = hoverRating ? getStarRatingMessage(hoverRating) : getStarRatingMessage(rating);

    return (
        <div className="star-rating d-flex position-relative">
            {[1, 2, 3, 4, 5].map((index) => (
                <FaStar
                    key={index}
                    className="star"
                    size={24}
                    color={index <= (hoverRating || rating) ? "#FFD700" : "#e4e5e9"}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(index)}
                    style={{ cursor: readOnly ? 'default' : 'pointer' }}
                />
            ))}
            <div
                className="rating-message position-absolute"
                style={{
                    left: '15%',
                    marginLeft: '1px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    whiteSpace: 'nowrap',
                }}
            >
                {displayRatingMessage}
            </div>
        </div>
    );
};

StarRating.propTypes = {
    rating: PropTypes.number.isRequired,
    onRatingChange: PropTypes.func,
    readOnly: PropTypes.bool,
};

StarRating.defaultProps = {
    onRatingChange: () => { },
    readOnly: false,
};
