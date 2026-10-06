import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';

const EMPTY = {
  title: '',
  shortDescription: '',
  content: '',
  coverImage: '',
  category: '',
  authorName: '',
  tags: '',
  status: 'unpublished',
};

export default function ArticleForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    api.get('/articles', { params: { limit: 100 } }).then(({ data }) => {
      const article = data.articles.find((a) => a._id === id);
      if (article) {
        setForm({
          title: article.title,
          shortDescription: article.shortDescription,
          content: article.content,
          coverImage: article.coverImage || '',
          category: article.category?._id || '',
          authorName: article.authorName,
          tags: (article.tags || []).join(', '),
          status: article.status,
        });
      }
      setLoading(false);
    });
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      if (isEdit) {
        await api.put(`/articles/${id}`, form);
        setMessage({ type: 'success', text: 'Article updated.' });
      } else {
        await api.post('/articles', form);
        setMessage({ type: 'success', text: 'Article created.' });
        setForm(EMPTY);
      }
      setTimeout(() => navigate('/admin/articles'), 700);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Could not save article.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="state-message">Loading article…</div>;

  return (
    <div>
      <div className="admin-header">
        <div>
          <span className="eyebrow">{isEdit ? 'Edit' : 'New'}</span>
          <h1>{isEdit ? 'Edit Article' : 'Add Article'}</h1>
        </div>
      </div>

      <form className="admin-form-card" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" required value={form.title} onChange={handleChange} />
        </div>

        <div className="field">
          <label htmlFor="shortDescription">Short description</label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            rows={2}
            maxLength={280}
            required
            value={form.shortDescription}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="content">Full content</label>
          <textarea
            id="content"
            name="content"
            rows={10}
            required
            value={form.content}
            onChange={handleChange}
            placeholder="Separate paragraphs with a blank line."
          />
        </div>

        <div className="admin-form-row">
          <div className="field">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" required value={form.category} onChange={handleChange}>
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="authorName">Author name</label>
            <input
              id="authorName"
              name="authorName"
              required
              value={form.authorName}
              onChange={handleChange}
              placeholder="Can be anyone — not just registered users"
            />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="field">
            <label htmlFor="coverImage">Cover image URL</label>
            <input
              id="coverImage"
              name="coverImage"
              value={form.coverImage}
              onChange={handleChange}
              placeholder="https://…"
            />
          </div>
          <div className="field">
            <label htmlFor="tags">Tags (comma separated)</label>
            <input id="tags" name="tags" value={form.tags} onChange={handleChange} placeholder="writing, culture" />
          </div>
        </div>

        <div className="field">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={form.status} onChange={handleChange}>
            <option value="unpublished">Unpublished (draft)</option>
            <option value="published">Published</option>
          </select>
        </div>

        {message && <p className={`admin-inline-msg ${message.type}`}>{message.text}</p>}

        <div className="admin-form-actions">
          <button className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create article'}
          </button>
          <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/articles')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
