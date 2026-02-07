import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  FiSearch,
  FiMail,
  FiShield,
  FiUser,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiX,
  FiRefreshCw,
  FiUsers,
} from "react-icons/fi";

import {
  useGetUsersQuery,
  useEditUserMutation,
  useDeleteUserMutation,
} from "../../../redux/features/users/usersApi";
import type { IUser } from "../../../types/types";

const MAIN_EMAIL = "kirill.akhmatshin@gmail.com";

const roleLabel = (roleId: number) =>
  roleId === 1 ? "Admin" : roleId === 2 ? "User" : "Unknown";

const UserDashboard: React.FC = () => {
  const { data: users = [], isLoading, isError, refetch } = useGetUsersQuery();
  const [editUser, { isLoading: isSaving }] = useEditUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [roleInput, setRoleInput] = useState<number>(2);
  const [q, setQ] = useState("");

  // 1) Filter
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return users;

    return users.filter((u) => {
      const email = (u.email ?? "").toLowerCase();
      const role = roleLabel(u.role_id).toLowerCase();
      return email.includes(s) || role.includes(s);
    });
  }, [users, q]);

  // 2) Sort: main first, then admins, then users
  const sorted = useMemo(() => {
    const rank = (u: IUser) => {
      if (u.email === MAIN_EMAIL) return 0; // main always first
      if (u.role_id === 1) return 1; // admins next
      return 2; // users last
    };

    return [...filtered].sort((a, b) => {
      const ra = rank(a);
      const rb = rank(b);
      if (ra !== rb) return ra - rb;

      // внутри одной группы — сортируем по email (чтобы было стабильно и красиво)
      return (a.email ?? "").localeCompare(b.email ?? "");
    });
  }, [filtered]);

  const startEdit = (user: IUser) => {
    if (user.email === MAIN_EMAIL) return;
    setEditingUserId(user.id);
    setRoleInput(user.role_id === 1 ? 1 : 2);
  };

  const cancelEdit = () => {
    setEditingUserId(null);
  };

  const handleEditSave = async () => {
    if (editingUserId === null) return;

    try {
      const userToEdit = users.find((u) => u.id === editingUserId);
      if (!userToEdit) return;

      await editUser({
        id: editingUserId,
        email: userToEdit.email,
        role_id: roleInput,
      }).unwrap();

      setEditingUserId(null);

      await Swal.fire({
        icon: "success",
        title: "Role updated!",
        text: "User role has been successfully updated.",
        timer: 1300,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Failed to update user:", err);
      await Swal.fire("Error", "Failed to update user!", "error");
    }
  };

  const handleDelete = async (id: number, email: string) => {
    if (email === MAIN_EMAIL) return;

    const confirm = await Swal.fire({
      title: "Delete user?",
      html: `<div style="text-align:left;line-height:1.4">
              <div><b>Email:</b> ${email}</div>
              <div style="margin-top:8px;color:#64748b">This action cannot be undone.</div>
             </div>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteUser(id).unwrap();
      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "User has been deleted.",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Failed to delete user:", err);
      await Swal.fire("Error", "Failed to delete user!", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="h-7 w-48 bg-slate-200 rounded mb-6" />
          <div className="h-10 w-full bg-slate-200 rounded mb-4" />
          <div className="h-64 w-full bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-rose-200 p-6">
          <div className="text-lg font-semibold text-rose-600 mb-2">
            Error fetching users
          </div>
          <div className="text-slate-600 mb-4">
            Check the server and your authorization.
          </div>
          <button
            onClick={() => refetch?.()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
          >
            <FiRefreshCw /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FiUsers className="text-slate-700" />
              <h1 className="text-2xl font-bold text-slate-900">Users</h1>
            </div>
            <p className="text-slate-500 mt-1">
              Total:{" "}
              <span className="font-semibold text-slate-700">{sorted.length}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search: email, role…"
                className="w-full sm:w-80 pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <button
              onClick={() => refetch?.()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700"
              title="Refresh"
            >
              <FiRefreshCw />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-5 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-5 py-4 text-left font-semibold">Email</th>
                <th className="px-5 py-4 text-left font-semibold">Role</th>
                <th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-10 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              ) : (
                sorted.map((user: IUser) => {
                  const isMain = user.email === MAIN_EMAIL;
                  const isEditing = editingUserId === user.id;

                  return (
                    <tr
                      key={user.id}
                      className={["hover:bg-slate-50/60", isMain ? "bg-amber-50/40" : ""].join(" ")}
                    >
                      {/* Email */}
                      <td className="px-5 py-4">
                        <div className="inline-flex items-center gap-2 text-slate-700">
                          <FiMail className="text-slate-400" />
                          <span className="font-medium text-slate-900">{user.email}</span>
                        </div>
                        {isMain && (
                          <div className="mt-1 text-xs text-slate-500 italic">
                            Main account (protected)
                          </div>
                        )}
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        {isEditing ? (
                          <div className="inline-flex items-center gap-2">
                            <FiShield className="text-slate-400" />
                            <select
                              value={roleInput}
                              onChange={(e) => setRoleInput(Number(e.target.value))}
                              className="px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                            >
                              <option value={1}>Admin</option>
                              <option value={2}>User</option>
                            </select>
                          </div>
                        ) : (
                          <span
                            className={[
                              "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm",
                              user.role_id === 1
                                ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                                : "bg-slate-50 text-slate-700 border-slate-200",
                            ].join(" ")}
                          >
                            {user.role_id === 1 ? <FiShield /> : <FiUser />}
                            {roleLabel(user.role_id)}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          {isMain ? (
                            <span className="text-slate-400 text-sm italic">Protected</span>
                          ) : isEditing ? (
                            <>
                              <button
                                onClick={handleEditSave}
                                disabled={isSaving}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                                title="Save"
                              >
                                <FiCheck />
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
                                title="Cancel"
                              >
                                <FiX />
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEdit(user)}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
                                title="Edit role"
                              >
                                <FiEdit2 />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(user.id, user.email)}
                                disabled={isDeleting}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60"
                                title="Delete user"
                              >
                                <FiTrash2 />
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 bg-slate-50 text-slate-500 text-xs">
          Tip: search by <b>email</b> or <b>role</b>. Admins are always shown above users.
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;