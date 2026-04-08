import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));

  // ✅ Memoized function
  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  // ✅ Safe useEffect
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
                    try {
                     await axios.put(
                         `${process.env.REACT_APP_BACKEND_URL}/api/admin/toggle-admin/${u._id}`,
                         {},
                         {
                          headers: {
                             Authorization: `Bearer ${user.token}`,
                             },
                         }
                     );
                     fetchUsers(); // refresh list
                    } catch (err) {
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
