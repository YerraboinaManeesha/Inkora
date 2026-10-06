import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function Overview() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/admin/overview').then(({ data }) => setData(data));
  }, []);

  if (!data) return <div className="state-message">Loading overview…</div>;

  const { stats, recentArticles } = data;

  const cards = [
    { label: 'Total articles', value: stats.totalArticles },
    { label: 'Published', value: stats.publishedArticles },
    { label: 'Total users', value: stats.totalUsers },
    { label: 'Total likes', value: stats.totalLikes },
    { label: 'Total comments', value: stats.totalComments },
    { label: 'Categories', value: stats.totalCategories },
  ];

  return (
    <div>
      <div className="admin-header">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1>Overview</h1>
        </div>
        <Link to="/admin/articles/new" className="btn btn-primary btn-sm">Add Article</Link>
      </div>

      <div className="stat-grid">
        {cards.map((c) => (
          <div className="stat-card" key={c.label}>
            <div className="stat-value">{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      <h3 style={{ marginBottom: 16 }}>Recently added articles</h3>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {recentArticles.map((a) => (
              <tr key={a._id}>
                <td>{a.title}</td>
                <td>{a.category?.name || '—'}</td>
                <td>
                  <span className={`badge badge-${a.status}`}>{a.status}</span>
                </td>
                <td>{new Date(a.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {recentArticles.length === 0 && (
              <tr><td colSpan={4} className="admin-empty">No articles yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
