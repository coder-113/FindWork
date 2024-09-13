import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import "./company-review.css";

export const WriteReview = () => {
  const [rating, setRating] = useState(0);
  const [summary, setSummary] = useState("");
  const [overtimePolicy, setOvertimePolicy] = useState("");
  const [loveWorkingHere, setLoveWorkingHere] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const review = {
      rating,
      summary,
      overtimePolicy,
      loveWorkingHere,
    };
    console.log("Review submitted:", review);
    // Here you can add the code to send the review data to your backend
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h2>Write a Review for 11Data Insights Ltd.</h2>
      <div className="form-group">
        <label htmlFor="rating">Overall rating *</label>
        <Rating
          name="rating"
          value={rating}
          onChange={(event, newValue) => setRating(newValue)}
          className="star-rating"
          precision={0.5}
        />
      </div>
      <div className="form-group">
        <label htmlFor="summary">Summary *</label>
        <input
          type="text"
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="overtimePolicy">
          What makes you love working here *
        </label>
        <textarea
          id="overtimePolicy"
          value={overtimePolicy}
          onChange={(e) => setOvertimePolicy(e.target.value)}
          required
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="loveWorkingHere">Suggestion for improvement *</label>
        <textarea
          id="loveWorkingHere"
          value={loveWorkingHere}
          onChange={(e) => setLoveWorkingHere(e.target.value)}
          required
        ></textarea>
      </div>
      <button type="submit">Submit Review</button>
    </form>
  );
};
