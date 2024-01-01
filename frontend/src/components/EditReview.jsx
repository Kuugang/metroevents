import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { axiosFetch } from "../utils/axios";

export default function EditReview({
  isOpen,
  onClose,
  initialReview,
  setEditReviewIsOpen,
  reviews,
  setReviews,
}) {
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    if (initialReview && initialReview.review) {
      setEditValue(initialReview.review);
    }
  }, [initialReview]);

  async function handleEditReview(e) {
    e.preventDefault();

    const inputs = {
      review: e.target.review.value,
    };

    const data = await axiosFetch.put(
      `/event/review?review_id=${initialReview.id}`,
      inputs
    );

    if (data.status !== 200) {
      throw new Error(data.data.message);
    }

    const updatedReviews = reviews.map((review) => {
      if (review.id == initialReview.id) {
        return {
          ...review,
          review: inputs.review,
        };
      }
      return review;
    });

    setReviews(updatedReviews);
    setEditReviewIsOpen(false);
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={
        "w-[400px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-max bg-[rgb(41,41,41)] shadow-md rounded px-8 pt-6 pb-8 mb-4 z-50"
      }
    >
      <form onSubmit={handleEditReview}>
        <textarea
          name="review"
          className="border text-black border-black p-3 rounded w-full"
          cols="30"
          rows="10"
          value={editValue}
          onChange={(event) => setEditValue(event.target.value)}
          placeholder="Wow cool event, definitely coming"
          required
        ></textarea>
        <div className="flex flex-row justify-end">
          <button onClick={onClose}>Close</button>
          <button>Edit</button>
        </div>
      </form>
    </Modal>
  );
}
