import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function UsersManage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteUserId, setDeleteUserId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const load = () => {
    api
      .get('/users')
      .then(({ data }) => setUsers(data.users))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const toggleActive = async (id) => {
    const { data } = await api.patch(
      `/users/${id}/toggle-active`
    );

    setUsers((prev) =>
      prev.map((u) => (u.id === id ? data.user : u))
    );
  };

  const remove = (id) => {
    setDeleteUserId(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    try {
      await api.delete(`/users/${deleteUserId}`);

      setUsers((prev) =>
        prev.filter((u) => u.id !== deleteUserId)
      );
    } finally {
      setShowDeleteModal(false);
      setDeleteUserId(null);
    }
  };

  const cancelDeleteUser = () => {
    setShowDeleteModal(false);
    setDeleteUserId(null);
  };

  return (
    <>
      <div>
        <div className="admin-header">
          <div>
            <span className="eyebrow">People</span>
            <h1>Users</h1>
          </div>
        </div>

        {loading ? (
          <div className="state-message">Loading…</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>

                    <td style={{ textTransform: 'capitalize' }}>
                      {u.role}
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          u.isActive === false
                            ? 'badge-unpublished'
                            : 'badge-published'
                        }`}
                      >
                        {u.isActive === false
                          ? 'Deactivated'
                          : 'Active'}
                      </span>
                    </td>

                    <td>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td>
                      {u.role !== 'admin' && (
                        <div className="admin-table-actions">
                          <button
                            onClick={() => toggleActive(u.id)}
                          >
                            {u.isActive === false
                              ? 'Activate'
                              : 'Deactivate'}
                          </button>

                          <button
                            className="danger"
                            onClick={() => remove(u.id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="admin-empty">
                      No users yet.
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
          onClick={cancelDeleteUser}
        >
          <div
            className="delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Delete user?</h3>

            <p>Delete this user account?</p>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={cancelDeleteUser}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn delete-btn"
                onClick={confirmDeleteUser}
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