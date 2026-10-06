import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function CommentsManage() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [busyId, setBusyId] = useState(null);

  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [deleteReplyId, setDeleteReplyId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState(null);

  const load = () => {
    api
      .get('/comments')
      .then(({ data }) => setComments(data.comments))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const setDraft = (commentId, text) =>
    setReplyDrafts((prev) => ({
      ...prev,
      [commentId]: text,
    }));

  const sendReply = async (commentId) => {
    const text = (replyDrafts[commentId] || '').trim();
    if (!text) return;

    setBusyId(commentId);

    try {
      const { data } = await api.post(
        `/comments/${commentId}/reply`,
        { text }
      );

      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId
            ? { ...c, reply: data.reply }
            : c
        )
      );

      setDraft(commentId, '');
    } finally {
      setBusyId(null);
    }
  };

  const removeReply = (commentId) => {
    setDeleteReplyId(commentId);
    setDeleteCommentId(null);
    setDeleteType('reply');
    setShowDeleteModal(true);
  };

  const removeComment = (commentId) => {
    setDeleteCommentId(commentId);
    setDeleteReplyId(null);
    setDeleteType('comment');
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (deleteType === 'comment') {
        await api.delete(`/comments/${deleteCommentId}`);

        setComments((prev) =>
          prev.filter((c) => c._id !== deleteCommentId)
        );
      }

      if (deleteType === 'reply') {
        await api.delete(`/comments/${deleteReplyId}/reply`);

        setComments((prev) =>
          prev.map((c) =>
            c._id === deleteReplyId
              ? { ...c, reply: null }
              : c
          )
        );
      }
    } finally {
      setShowDeleteModal(false);
      setDeleteCommentId(null);
      setDeleteReplyId(null);
      setDeleteType(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteCommentId(null);
    setDeleteReplyId(null);
    setDeleteType(null);
  };

  return (
    <>
      <div>
        <div className="admin-header">
          <div>
            <span className="eyebrow">Moderation</span>
            <h1>Comments</h1>
          </div>
        </div>

        {loading ? (
          <div className="state-message">Loading…</div>
        ) : comments.length === 0 ? (
          <div className="admin-empty">No comments yet.</div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
          >
            {comments.map((c) => (
              <div
                className="admin-form-card"
                key={c._id}
                style={{ maxWidth: 'none' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  <div>
                    <strong>
                      {c.user?.name || 'Unknown user'}
                    </strong>{' '}
                    <span
                      style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.85rem',
                      }}
                    >
                      {c.user?.email}
                    </span>
                  </div>

                  {c.article && (
                    <Link
                      to={`/articles/${c.article.slug}`}
                      className="btn-text"
                    >
                      {c.article.title}
                    </Link>
                  )}
                </div>

                <p style={{ marginBottom: 14 }}>{c.text}</p>

                {c.reply ? (
                  <div
                    className="comment-reply"
                    style={{ margin: '0 0 14px' }}
                  >
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)',
                        marginBottom: 6,
                      }}
                    >
                      Your reply
                    </p>

                    <p style={{ marginBottom: 10 }}>
                      {c.reply.text}
                    </p>

                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => removeReply(c._id)}
                    >
                      Remove reply
                    </button>
                  </div>
                ) : (
                  <div className="field">
                    <textarea
                      rows={2}
                      placeholder="Write a reply as Inkora team…"
                      value={replyDrafts[c._id] || ''}
                      onChange={(e) =>
                        setDraft(c._id, e.target.value)
                      }
                    />
                  </div>
                )}

                <div className="admin-form-actions">
                  {!c.reply && (
                    <button
                      className="btn btn-primary btn-sm"
                      disabled={
                        busyId === c._id ||
                        !(replyDrafts[c._id] || '').trim()
                      }
                      onClick={() => sendReply(c._id)}
                    >
                      {busyId === c._id
                        ? 'Sending…'
                        : 'Send reply'}
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => removeComment(c._id)}
                  >
                    Delete comment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div
          className="delete-modal-overlay"
          onClick={cancelDelete}
        >
          <div
            className="delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>
              {deleteType === 'reply'
                ? 'Remove reply?'
                : 'Delete comment?'}
            </h3>

            <p>
              {deleteType === 'reply'
                ? 'Remove this reply?'
                : 'Delete this comment and any reply to it?'}
            </p>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={cancelDelete}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn delete-btn"
                onClick={confirmDelete}
              >
                {deleteType === 'reply'
                  ? 'Remove'
                  : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}