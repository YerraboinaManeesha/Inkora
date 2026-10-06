import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function LikesManage() {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/likes').then(({ data }) => setLikes(data.likes)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="admin-header">
        <div>
          <span className="eyebrow">Engagement</span>
          <h1>Likes</h1>
        </div>
      </div>

      {loading ? (
        <div className="state-message">Loading…</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Article</th><th>Liked by</th><th>Email</th><th>Date</th></tr>
            </thead>
            <tbody>
              {likes.map((l) => (
                <tr key={l._id}>
                  <td>
                    {l.article ? (
                      <Link to={`/articles/${l.article.slug}`} className="btn-text">{l.article.title}</Link>
                    ) : '—'}
                  </td>
                  <td>{l.user?.name || '—'}</td>
                  <td>{l.user?.email || '—'}</td>
                  <td>{new Date(l.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {likes.length === 0 && (
                <tr><td colSpan={4} className="admin-empty">No likes yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
