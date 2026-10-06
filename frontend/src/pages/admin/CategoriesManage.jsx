import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function CategoriesManage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const load = () => {
    api
      .get('/categories')
      .then(({ data }) => setCategories(data.categories))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const resetForm = () => {
    setForm({ name: '', description: '' });
    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form);
        setMessage({ type: 'success', text: 'Category updated.' });
      } else {
        await api.post('/categories', form);
        setMessage({ type: 'success', text: 'Category created.' });
      }

      resetForm();
      load();
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Could not save category.',
      });
    }
  };

  const edit = (c) => {
    setEditingId(c._id);
    setForm({
      name: c.name,
      description: c.description || '',
    });
  };

  const remove = (id) => {
    setDeleteCategoryId(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteCategory = async () => {
    try {
      await api.delete(`/categories/${deleteCategoryId}`);
      load();
    } catch (err) {
      setMessage({
        type: 'error',
        text:
          err.response?.data?.message ||
          'Could not delete category.',
      });
    } finally {
      setShowDeleteModal(false);
      setDeleteCategoryId(null);
    }
  };

  const cancelDeleteCategory = () => {
    setShowDeleteModal(false);
    setDeleteCategoryId(null);
  };

  return (
    <>
      <div>
        <div className="admin-header">
          <div>
            <span className="eyebrow">Taxonomy</span>
            <h1>Categories</h1>
          </div>
        </div>

        <form
          className="admin-form-card"
          onSubmit={submit}
          style={{ marginBottom: 32 }}
        >
          <div className="admin-form-row">
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                required
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="field">
              <label htmlFor="description">Description</label>
              <input
                id="description"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {message && (
            <p className={`admin-inline-msg ${message.type}`}>
              {message.text}
            </p>
          )}

          <div className="admin-form-actions">
            <button className="btn btn-primary btn-sm">
              {editingId ? 'Save changes' : 'Add category'}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {loading ? (
          <div className="state-message">Loading…</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {categories.map((c) => (
                  <tr key={c._id}>
                    <td>{c.name}</td>
                    <td>{c.description || '—'}</td>

                    <td>
                      <div className="admin-table-actions">
                        <button onClick={() => edit(c)}>
                          Edit
                        </button>

                        <button
                          className="danger"
                          onClick={() => remove(c._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {categories.length === 0 && (
                  <tr>
                    <td colSpan={3} className="admin-empty">
                      No categories yet.
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
          onClick={cancelDeleteCategory}
        >
          <div
            className="delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Delete category?</h3>

            <p>Delete this category?</p>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={cancelDeleteCategory}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn delete-btn"
                onClick={confirmDeleteCategory}
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