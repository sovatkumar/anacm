"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type User = {
  _id: string;
  email: string;
  phone: string;
  zip: string;
};

export const UserList = () => {
  const [userData, setUserData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ email: "", phone: "", zip: "" });

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/user/all`);
      const data = await res.json();
      setUserData(data?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleDelete = async (id: string) => {
    // if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/api/user/${id}`);
      toast.success("User deleted successfully");
      fetchUser();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setFormData({ email: user.email, phone: user.phone, zip: user.zip });
    setShowModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      await axios.patch(`/api/user/${selectedUser._id}`, formData);
      setShowModal(false);
      toast.success("User Updated Successfully");
      fetchUser();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user");
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="h-screen py-3">
      <table className="min-w-[800px] mx-auto border border-gray-200 rounded-2xl overflow-hidden shadow-sm text-sm text-gray-700 dark:border-white">
        <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 uppercase text-xs tracking-wide">
          <tr>
            <th className="px-6 py-3 text-left">Email</th>
            <th className="px-6 py-3 text-left">Phone</th>
            <th className="px-6 py-3 text-left">ZIP</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((user) => (
            <tr
              key={user._id}
              className="border-t border-gray-100 even:bg-gray-50 hover:bg-gray-100 transition-all duration-200 dark:hover:bg-transparent"
            >
              <td className="px-6 py-3 dark:text-white">{user.email}</td>
              <td className="px-6 py-3 dark:text-white">{user.phone}</td>
              <td className="px-6 py-3 dark:text-white">{user.zip}</td>
              <td className="px-6 py-3 text-center space-x-3">
                <button
                  className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105 transition-all duration-150 cursor-pointer"
                  onClick={() => handleEditClick(user)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:scale-105 transition-all duration-150 cursor-pointer"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold cursor-pointer"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 dark:text-black">
              Edit User
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block font-medium dark:text-black">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg p-2 dark:text-black"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block font-medium dark:text-black">
                  Phone
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2 dark:text-black"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block font-medium dark:text-black">ZIP</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2 dark:text-black"
                  value={formData.zip}
                  onChange={(e) =>
                    setFormData({ ...formData, zip: e.target.value })
                  }
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#F2B124] text-white rounded-lg py-2 font-medium hover:bg-[#e0a91f] transition cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
