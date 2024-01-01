import Modal from "react-modal";

export default function RequestOrganizerModal({ isOpen, onClose, handleJoinOrganizerRequest}) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={
        "w-[400px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-max bg-[rgb(41,41,41)] shadow-md rounded px-8 pt-6 pb-8 mb-4 z-50" 
      }
    >
      <button onClick={onClose}>X</button>
      <form onSubmit={handleJoinOrganizerRequest}>
        <textarea
          name="message"
          className="border border-black p-3 text-black rounded"
          cols="30"
          rows="10"
          placeholder="I want to be an organizer because..."
          required
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </Modal>
  );
}
