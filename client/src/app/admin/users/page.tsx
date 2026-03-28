"use client";

import { useEffect, useState } from "react";
import api from "../../../utils/api";

export default function UsersPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
    partnerSpacebyteFolderLink: "",
  });

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingUserId, setSavingUserId] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 FETCH USERS
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔥 CREATE USER
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await api.post("/users", form);
      alert("User created");

      setForm({
        name: "",
        email: "",
        password: "",
        role: "client",
        partnerSpacebyteFolderLink: "",
      });

      fetchUsers();
    } catch {
      alert("Error creating user");
    }
  };

  // 🔥 DELETE USER
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/users/${id}`);
      alert("User deleted");
      fetchUsers();
    } catch {
      alert("Delete failed");
    }
  };

  const handleUserFieldChange = (id: string, key: string, value: string) => {
    setUsers((current) =>
      current.map((user) => (user._id === id ? { ...user, [key]: value } : user))
    );
  };

  const handleSaveUser = async (user: any) => {
    setSavingUserId(user._id);
    try {
      await api.put(`/users/${user._id}`, {
        name: user.name,
        email: user.email,
        role: user.role,
        partnerSpacebyteFolderLink: user.partnerSpacebyteFolderLink || "",
      });
      alert("User updated");
      fetchUsers();
    } catch {
      alert("Update failed");
    } finally {
      setSavingUserId("");
    }
  };

  const getRoleColor = (role: string) => {
    if (role === "super-admin") return "bg-purple-600";
    if (role === "admin") return "bg-red-500";
    if (role === "partner") return "bg-yellow-500";
    return "bg-blue-500";
  };

  return (
    <div className="p-10 bg-slate-900 min-h-screen text-white">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-8">User Management</h1>

      {/* CREATE USER */}
      <div className="bg-slate-800 p-6 rounded-xl mb-10 max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Create User</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-3 bg-slate-900 border border-slate-600 rounded"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 bg-slate-900 border border-slate-600 rounded"
          />

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 bg-slate-900 border border-slate-600 rounded"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-3 bg-slate-900 border border-slate-600 rounded"
          >
            <option value="super-admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="partner">Partner</option>
            <option value="client">Client</option>
          </select>

          {form.role === "partner" && (
            <input
              name="partnerSpacebyteFolderLink"
              value={form.partnerSpacebyteFolderLink}
              onChange={handleChange}
              placeholder="Partner Spacebyte Folder Link"
              className="w-full p-3 bg-slate-900 border border-slate-600 rounded"
            />
          )}

          <button className="w-full bg-green-600 hover:bg-green-700 p-3 rounded font-semibold">
            Create User
          </button>
        </form>
      </div>

      {/* USERS LIST */}
      <div className="bg-slate-800 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-6">Users List</h2>

        {users.length === 0 ? (
          <p className="text-gray-400">No users found</p>
        ) : (
          <div className="space-y-3">
            {users.map((user: any) => (
              <div
                key={user._id}
                className="bg-slate-900 p-4 rounded-lg border border-slate-700"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1 space-y-3">
                    <input
                      value={user.name}
                      onChange={(e) => handleUserFieldChange(user._id, "name", e.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-800 p-2"
                    />
                    <input
                      value={user.email}
                      onChange={(e) => handleUserFieldChange(user._id, "email", e.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-800 p-2 text-sm text-gray-200"
                    />
                    {user.role === "partner" && (
                      <input
                        value={user.partnerSpacebyteFolderLink || ""}
                        onChange={(e) =>
                          handleUserFieldChange(user._id, "partnerSpacebyteFolderLink", e.target.value)
                        }
                        placeholder="Partner Spacebyte Folder Link"
                        className="w-full rounded border border-slate-700 bg-slate-800 p-2 text-sm text-gray-200"
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-3 py-1 rounded text-white ${getRoleColor(user.role)}`}
                    >
                      {user.role}
                    </span>
                    <button
                      onClick={() => handleSaveUser(user)}
                      disabled={savingUserId === user._id}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm disabled:opacity-60"
                    >
                      {savingUserId === user._id ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
