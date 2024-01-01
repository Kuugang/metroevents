import React, { useState, useEffect } from "react";
import Modal from "react-modal";

export default function CancelEventFormModal({
  isOpen,
  onClose,
  handleCancelEvent,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={
        "w-[400px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-max bg-[#808080] shadow-md rounded px-8 pt-6 pb-8 mb-4 z-50"
      }
    >
      <form onSubmit={handleCancelEvent} className="w-full">
        <textarea
          name="cancel_reason"
          className="border text-black border-black p-3 rounded bg-gray-300 w-full"
          cols="30"
          rows="10"
          placeholder="Enter cancellation reason"
          required
        ></textarea>
        <div className="flex flex-row gap-2 float-right">
          <button onClick={onClose}>
            Close
          </button>
          <button type="submit">
            Cancel Event
          </button>
        </div>
      </form>
    </Modal>
  );
}
