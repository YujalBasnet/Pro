const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
        <button
          onClick={onClose}
          className="float-right text-gray-500 hover:text-gray-800 font-bold"
        >
          X
        </button>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;