import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './CommentSection.css';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export default function CommentSection({ articleId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  // Delete confirmation modal
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get(`/comments/article/${articleId}`);
      setComments(data.comments);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setPosting(true);
    setError('');

    try {
      const { data } = await api.post(`/comments/article/${articleId}`, { text });
      setComments((prev) => [...prev, data.comment]);
      setText('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not post your comment.');
    } finally {
      setPosting(false);
    }
  };

  // Open custom delete confirmation
  const removeComment = (id) => {
    setDeleteCommentId(id);
    setShowDeleteModal(true);
  };

  // Delete after confirmation
  const confirmDeleteComment = async () => {
    try {
      await api.delete(`/comments/${deleteCommentId}`);

      setComments((prev) =>
        prev.filter((c) => c._id !== deleteCommentId)
      );
    } catch (err) {
      setError(
        err.response?.data?.message || 'Could not delete the comment.'
      );
    } finally {
      setShowDeleteModal(false);
      setDeleteCommentId(null);
    }
  };

  const cancelDeleteComment = () => {
    setShowDeleteModal(false);
    setDeleteCommentId(null);
  };

  return (
    <>
      <section className="comments">
        <h3 className="comments-heading">
          Conversation ({comments.length})
        </h3>

        {user ? (
          <form className="comment-form" onSubmit={submit}>
            <textarea
              rows={3}
              placeholder="Share your thoughts on this piece…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={1000}
            />

            {error && <p className="comment-error">{error}</p>}

            <button
              className="btn btn-primary btn-sm"
              disabled={posting || !text.trim()}
            >
              {posting ? 'Posting…' : 'Post comment'}
            </button>
          </form>
        ) : (
          <p className="comment-login-hint">
            <Link to="/auth" className="btn-text">
              Sign in
            </Link>{' '}
            to join the conversation.
          </p>
        )}

        {loading ? (
          <p className="comment-login-hint">Loading conversation…</p>
        ) : comments.length === 0 ? (
          <p className="comment-login-hint">
            No comments yet — be the first to respond.
          </p>
        ) : (
          <ul className="comment-list">
            {comments.map((c) => (
              <li key={c._id} className="comment-item">
                <div className="comment-item-head">
                  <span
                    className="comment-avatar"
                    style={{
                      background: c.user?.avatarColor || '#7A2E4A',
                    }}
                  >
                    {c.user?.name?.[0]?.toUpperCase() || '?'}
                  </span>

                  <div>
                    <div className="comment-author">
                      {c.user?.name || 'Former member'}
                    </div>

                    <div className="comment-date">
                      {formatDate(c.createdAt)}
                    </div>
                  </div>

                  {user &&
                    (user._id === c.user?._id ||
                      user.id === c.user?._id ||
                      user.role === 'admin') && (
                      <button
                        type="button"
                        className="comment-delete"
                        onClick={() => removeComment(c._id)}
                      >
                        Delete
                      </button>
                    )}
                </div>

                <p className="comment-text">{c.text}</p>

                {c.reply && (
                  <div className="comment-reply">
                    <div className="comment-reply-head">
                      <span className="tag">Inkora team</span>
                      <span className="comment-date">
                        {formatDate(c.reply.createdAt)}
                      </span>
                    </div>

                    <p className="comment-text">{c.reply.text}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div
          className="delete-modal-overlay"
          onClick={cancelDeleteComment}
        >
          <div
            className="delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Delete comment?</h3>

            <p>Delete this comment and any reply to it?</p>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={cancelDeleteComment}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn delete-btn"
                onClick={confirmDeleteComment}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}