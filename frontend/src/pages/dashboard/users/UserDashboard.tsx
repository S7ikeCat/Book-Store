// src/pages/dashboard/users/UserDashboard.tsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useGetUsersQuery, useEditUserMutation, useDeleteUserMutation } from '../../../redux/features/users/usersApi';
import type { IUser } from '../../../types/types';

const UserDashboard: React.FC = () => {
  const { data: users = [], isLoading, isError } = useGetUsersQuery();
  const [editUser] = useEditUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [emailInput, setEmailInput] = useState<string>('');
  const [roleInput, setRoleInput] = useState<number>(2);

  if (isLoading)
    return <div className="text-center mt-10 text-gray-500">Loading users...</div>;

  if (isError)
    return <div className="text-center mt-10 text-red-500">Error fetching users!</div>;

  if (users.length === 0)
    return <div className="text-center mt-10 text-gray-500">No users found.</div>;

  const handleEditClick = (user: IUser) => {
    setEditingUserId(user.id);
    setEmailInput(user.email);
    setRoleInput(user.role_id);
  };

  const handleEditSave = async () => {
    if (editingUserId === null) return;

    try {
      await editUser({ id: editingUserId, email: emailInput, role_id: roleInput }).unwrap();
      setEditingUserId(null);
      Swal.fire({
        icon: 'success',
        title: 'User updated!',
        text: `User's email and role have been successfully updated.`,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    } catch (err) {
      console.error('Failed to update user:', err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to update user!',
      });
    }
  };

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This user will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete!',
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteUser(id).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'User has been deleted.',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    } catch (err) {
      console.error('Failed to delete user:', err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to delete user!',
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">User Dashboard</h1>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-3 text-left">ID</th>
            <th className="border p-3 text-left">Email</th>
            <th className="border p-3 text-left">Role</th>
            <th className="border p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: IUser) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="border p-3">{user.id}</td>

              <td className="border p-3">
                {editingUserId === user.id ? (
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  user.email
                )}
              </td>

              <td className="border p-3">
                {editingUserId === user.id ? (
                  <select
                    value={roleInput}
                    onChange={(e) => setRoleInput(Number(e.target.value))}
                    className="border p-1 rounded"
                  >
                    <option value={1}>Admin</option>
                    <option value={2}>User</option>
                  </select>
                ) : user.role_id === 1 ? 'Admin' : user.role_id === 2 ? 'User' : 'Unknown'}
              </td>

              <td className="border p-3 flex gap-2">
                {editingUserId === user.id ? (
                  <>
                    <button
                      onClick={handleEditSave}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingUserId(null)}
                      className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditClick(user)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserDashboard;