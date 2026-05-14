import './InfoModal.css';

/**
 * Full-screen overlay modal that displays the user's profile details.
 * Clicking the overlay closes the modal; clicking inside stops propagation.
 */
export default function InfoModal({ user, onClose }) {
  return (
    <div className="infoModalOverlay" onClick={onClose}>
      <div className="infoModal" onClick={(e) => e.stopPropagation()}>
        <button className="infoModalClose" onClick={onClose}>X</button>
        <h2 className="infoModalName">{user.name}</h2>
        <p><span className="infoModalLabel">Username:</span> {user.username}</p>
        <p><span className="infoModalLabel">Email:</span> {user.email}</p>
        <p><span className="infoModalLabel">Phone:</span> {user.phone}</p>
        <p><span className="infoModalLabel">City:</span> {user.address?.city}</p>
        <p><span className="infoModalLabel">Company:</span> {user.company?.name}</p>
      </div>
    </div>
  );
}
