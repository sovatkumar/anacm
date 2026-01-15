"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type ZipRange = {
  start: number;
  end: number;
};

type User = {
  _id: string;
  email: string;
  phone: string;
  name: string;
  zipRanges: ZipRange[];
};

export const UserList = () => {
  const [userData, setUserData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<{
    email: string;
    phone: string;
    zipRanges: ZipRange[];
    name:string
  }>({ email: "", phone: "", zipRanges: [],name:"" });

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
    setFormData({
      email: user.email,
      phone: user.phone,
      zipRanges: user.zipRanges,
      name:user.name
    });
    setShowModal(true);
  };

  const handleZipRangeChange = (
    index: number,
    field: "start" | "end",
    value: string
  ) => {
    const newRanges = [...formData.zipRanges];
    newRanges[index][field] = Number(value);
    setFormData({ ...formData, zipRanges: newRanges });
  };

  const addZipRange = () => {
    setFormData({
      ...formData,
      zipRanges: [...formData.zipRanges, { start: 0, end: 0 }],
    });
  };

  const removeZipRange = (index: number) => {
    const newRanges = [...formData.zipRanges];
    newRanges.splice(index, 1);
    setFormData({ ...formData, zipRanges: newRanges });
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
    <div className="h-screen py-3 px-2 sm:px-6">
      <div className="overflow-x-auto">
        <table className="min-w-[800px] mx-auto border border-gray-200 rounded-2xl overflow-hidden shadow-sm text-sm text-gray-700 dark:shadow-none dark:hover:bg-transparent">
          <thead className="bg-gray-100 text-gray-800 uppercase text-xs tracking-wide">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-left">ZIP Ranges</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((user) => (
              <tr
                key={user._id}
                className="border-t border-gray-100 hover:bg-gray-100 dark:hover:bg-none dark:bg-white transition-all duration-200"
              >
                <td className="px-6 py-3">{user.name}</td>
                <td className="px-6 py-3">{user.email.toLowerCase()}</td>
                <td className="px-6 py-3">{user.phone}</td>
                <td className="px-6 py-3">
                  {user?.zipRanges?.map((z, i) => (
                    <span key={i}>
                      {z.start.toString().padStart(5, "0")}-
                      {z.end.toString().padStart(5, "0")}
                      {i < user.zipRanges.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </td>
                <td className="px-6 py-3 text-center space-x-3">
                  <button
                    className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#9E1E63] hover:bg-blue-100 hover:scale-105 transition cursor-pointer"
                    onClick={() => handleEditClick(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-lg bg-red-50 text-[#9E1E63] hover:bg-red-100 hover:scale-105 transition cursor-pointer"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 px-2">
          <div className="bg-white rounded-xl p-4 sm:p-6 min-w-fit max-w-md relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold cursor-pointer"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 dark:text-black text-center sm:text-left">
              Edit User
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
               <div>
                <label className="block font-medium dark:text-black">Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2 dark:text-black"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block font-medium dark:text-black">Email</label>
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
                <label className="block font-medium dark:text-black">Phone</label>
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
                <label className="block font-medium dark:text-black">
                  ZIP Ranges
                </label>
                {formData?.zipRanges?.map((z, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row gap-2 mb-2"
                  >
                    <input
                      type="number"
                      className="flex-1 border border-gray-300 rounded-lg p-2 dark:text-black"
                      value={z.start}
                      onChange={(e) =>
                        handleZipRangeChange(i, "start", e.target.value)
                      }
                      required
                    />
                    <span className="hidden sm:inline self-center">-</span>
                    <span className="sm:hidden text-center">to</span>
                    <input
                      type="number"
                      className="flex-1 border border-gray-300 rounded-lg p-2 dark:text-black"
                      value={z.end}
                      onChange={(e) =>
                        handleZipRangeChange(i, "end", e.target.value)
                      }
                      required
                    />
                    {i > 0 && (
                    <button
                      type="button"
                      onClick={() => removeZipRange(i)}
                      className="text-red-500 font-bold cursor-pointer self-center sm:self-auto"
                    >
                      ✕
                    </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addZipRange}
                  className="text-blue-600 underline text-sm cursor-pointer"
                >
                  + Add another ZIP range
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-[#9E1E63] text-white rounded-lg py-2 font-medium hover:bg-[#9E1E63] transition cursor-pointer"
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
