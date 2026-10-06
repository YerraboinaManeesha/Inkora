import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function ArticlesManage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteArticleId, setDeleteArticleId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get('/articles', { params: { limit: 100 } })
      .then(({ data }) => setArticles(data.articles))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const togglePublish = async (id) => {
    const { data } = await api.patch(`/articles/${id}/publish`);
    setArticles((prev) =>
      prev.map((a) => (a._id === id ? data.article : a))
    );
  };

  const remove = (id) => {
    setDeleteArticleId(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteArticle = async () => {
    try {
      await api.delete(`/articles/${deleteArticleId}`);

      setArticles((prev) =>
        prev.filter((a) => a._id !== deleteArticleId)
      );
    } finally {
      setShowDeleteModal(false);
      setDeleteArticleId(null);
    }
  };

  const cancelDeleteArticle = () => {
    setShowDeleteModal(false);
    setDeleteArticleId(null);
  };

  return (
    <>
      <div>
        <div className="admin-header">
          <div>
            <span className="eyebrow">Content</span>
            <h1>Articles</h1>
          </div>

          <Link
            to="/admin/articles/new"
            className="btn btn-primary btn-sm"
          >
            Add Article
          </Link>
        </div>

        {loading ? (
          <div className="state-message">Loading…</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Likes</th>
                  <th>Comments</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {articles.map((a) => (
                  <tr key={a._id}>
                    <td>{a.title}</td>
                    <td>{a.category?.name || '—'}</td>
                    <td>{a.authorName}</td>
                    <td>
                      <span className={`badge badge-${a.status}`}>
                        {a.status}
                      </span>
                    </td>
                    <td>{a.likeCount}</td>
                    <td>{a.commentCount}</td>

                    <td>
                      <div className="admin-table-actions">
                        <Link to={`/admin/articles/${a._id}/edit`}>
                          Edit
                        </Link>

                        <button
                          onClick={() => togglePublish(a._id)}
                        >
                          {a.status === 'published'
                            ? 'Unpublish'
                            : 'Publish'}
                        </button>

                        <button
                          className="danger"
                          onClick={() => remove(a._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {articles.length === 0 && (
                  <tr>
                    <td colSpan={7} className="admin-empty">
                      No articles yet — add your first one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div
          className="delete-modal-overlay"
          onClick={cancelDeleteArticle}
        >
          <div
            className="delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Delete article?</h3>

            <p>
              Delete this article and its likes and comments?
            </p>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={cancelDeleteArticle}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn delete-btn"
                onClick={confirmDeleteArticle}
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