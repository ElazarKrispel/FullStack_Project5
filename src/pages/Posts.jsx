import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import { getLoggedUser } from '../utils/storage';
import { useComments } from '../hooks/useComments';
import NavBar from '../components/NavBar';
import PostItem from '../components/PostItem';
import CommentItem from '../components/CommentItem';
import './Posts.css';

/**
 * Posts page for a specific user. Supports add/edit/delete posts and per-post comments.
 */
export default function Posts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, loading, error, addPost, deletePost, updatePost } = usePosts(id);

  const [searchTerm, setSearchTerm] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [selectedPostId, setSelectedPostId] = useState(null);
  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
    fetchComments,
    addComment,
    deleteComment,
    updateComment,
    clearComments,
  } = useComments();
  const [showComments, setShowComments] = useState(false);
  const [newCommentBody, setNewCommentBody] = useState('');

  const loggedUser = getLoggedUser();

  // redirect if wrong user
  useEffect(() => {
    if (!loggedUser || String(loggedUser.id) !== String(id)) {
      navigate('/home');
    }
  }, [id]);

  async function handleAddPost(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await addPost(newTitle.trim(), newBody.trim());
    setNewTitle('');
    setNewBody('');
  }

  function handleSelect(postId) {
    if (selectedPostId === postId) {
      // deselect
      setSelectedPostId(null);
      clearComments();
      setShowComments(false);
    } else {
      setSelectedPostId(postId);
      clearComments();
      setShowComments(false);
    }
  }

  async function handleShowComments() {
    if (showComments) {
      setShowComments(false);
      return;
    }
    await fetchComments(selectedPostId);
    setShowComments(true);
  }

  async function handleAddComment(e) {
    e.preventDefault();
    if (!newCommentBody.trim()) return;
    await addComment(selectedPostId, loggedUser.name, loggedUser.email, newCommentBody.trim());
    setNewCommentBody('');
  }

  // filter posts by id or title
  const filtered = posts.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      String(p.id).includes(term) ||
      p.title.toLowerCase().includes(term)
    );
  });

  const selectedPost = posts.find((p) => p.id === selectedPostId);

  return (
    <>
      <NavBar />
      <main className="postsPage">
        <h2 className="postsTitle">My Posts</h2>
        <input
          className="postsSearch"
          type="text"
          placeholder="Search by id or title..."
          value={searchTerm}
          onChange={({ target }) => setSearchTerm(target.value)}
        />
        {loading && <p className="postsLoading">Loading...</p>}
        {error && <p className="postsError">{error}</p>}
        <ul className="postsList">
          {filtered.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              isSelected={post.id === selectedPostId}
              onSelect={handleSelect}
              onDelete={deletePost}
              onUpdate={updatePost}
            />
          ))}
        </ul>
        <form className="postsAddForm" onSubmit={handleAddPost}>
          <h3 className="postsAddTitle">Add Post</h3>
          <input
            className="postsAddInput"
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={({ target }) => setNewTitle(target.value)}
            required
          />
          <textarea
            className="postsAddBody"
            placeholder="Body"
            value={newBody}
            onChange={({ target }) => setNewBody(target.value)}
            rows={3}
          />
          <button className="postsAddBtn" type="submit">Add</button>
        </form>

        {selectedPost && (
          <section className="postsSelectedPost">
            <h3 className="postsSelectedTitle">{selectedPost.title}</h3>
            <p className="postsSelectedBody">{selectedPost.body}</p>
            <button className="postsCommentsToggle" onClick={handleShowComments}>
              {showComments ? 'Hide Comments' : 'Show Comments'}
            </button>
            {commentsLoading && <p className="postsLoading">Loading comments...</p>}
            {commentsError && <p className="postsError">{commentsError}</p>}
            {showComments && (
              <div className="postsComments">
                <ul className="postsCommentsList">
                  {comments.map((c) => (
                    <CommentItem
                      key={c.id}
                      comment={c}
                      loggedUserEmail={loggedUser.email}
                      onDelete={deleteComment}
                      onUpdate={updateComment}
                    />
                  ))}
                </ul>
                <form className="postsAddComment" onSubmit={handleAddComment}>
                  <input
                    className="postsAddCommentInput"
                    type="text"
                    placeholder="Write a comment..."
                    value={newCommentBody}
                    onChange={({ target }) => setNewCommentBody(target.value)}
                    required
                  />
                  <button className="postsAddCommentBtn" type="submit">Add Comment</button>
                </form>
              </div>
            )}
          </section>
        )}
      </main>
    </>
  );
}
