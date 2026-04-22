import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));

  /* =========================
     SAFETY CHECK
  ========================= */
  const token = user?.token;

  /* =========================
     FETCH USERS
  ========================= */
  const fetchUsers = useCallback(async () => {
    if (!token) {
      setLoading(false);
      alert("Unauthorized access");
      return;
    }

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [token]);

  /* =========================
     USE EFFECT
  ========================= */
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /* =========================
     LOADING
  ========================= */
  if (loading) {
    return <p className="text-center mt-5">Loading users...</p>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Admin – Users</h2>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Admin</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>

              <td>
                <button
                  className={`btn btn-sm ${
                    u.isAdmin ? 'btn-danger' : 'btn-success'
                  }`}
                  onClick={async () => {
                    if (!token) return alert("Login required");

                    try {
                      await axios.put(
                        `${process.env.REACT_APP_BACKEND_URL}/api/admin/toggle-admin/${u._id}`,
                        {},
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );

                      fetchUsers(); // refresh
                    } catch (err) {
                      console.error(err);
                      alert('Action not allowed');
                    }
                  }}
                >
                  {u.isAdmin ? 'Remove Admin' : 'Make Admin'}
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
