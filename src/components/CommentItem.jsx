import { useState } from 'react';
import './CommentItem.css';

/**
 * Renders a single comment. Edit and delete buttons are shown only when
 * the comment belongs to the currently logged-in user.
 */
export default function CommentItem({ comment, loggedUserEmail, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(comment.body);

  const isOwner = comment.email === loggedUserEmail;

  function handleSave() {
    if (editBody.trim()) {
      onUpdate(comment.id, editBody.trim());
    }
    setIsEditing(false);
  }

  return (
    <li className="commentItem">
      <div className="commentItemMeta">
        <span className="commentItemName">{comment.name}</span>
        <span className="commentItemEmail">{comment.email}</span>
      </div>
      {isEditing ? (
        <input
          className="commentItemEditInput"
          value={editBody}
          onChange={(e) => setEditBody(e.target.value)}
          autoFocus
        />
      ) : (
        <p className="commentItemBody">{comment.body}</p>
      )}
      {isOwner && (
        <div className="commentItemActions">
          {isEditing ? (
            <button className="commentItemBtn" onClick={handleSave}>Save</button>
          ) : (
            <button className="commentItemBtn" onClick={() => setIsEditing(true)}>Edit</button>
          )}
          <button
            className="commentItemBtn commentItemBtnDelete"
            onClick={() => onDelete(comment.id)}
          >
            Delete
          </button>
        </div>
      )}
    </li>
  );
}
