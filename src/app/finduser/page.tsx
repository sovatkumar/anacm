"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";

type FormData = {
  zip: string;
};

type User = {
  email: string;
  phone: string;
};

export default function ZipSearch() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    setError("");
    setUsers([]);
    try {
      const res = await fetch(`/api/user?zip=${data.zip}`);
      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "No users found");
      } else {
        setUsers(result.data);
        setShowModal(true);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching users");
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <main className="max-w-lg mx-auto p-8 space-y-6">
      {/* ZIP Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 border border-gray-200 rounded-xl p-6 shadow-sm"
      >
        <div>
          <label className="block font-medium">ZIP</label>
          <input
            type="text"
            {...register("zip", { required: "ZIP is required" })}
            className="w-full border border-[#F2B124] rounded-lg p-2 focus:outline-none focus:border-[#F2B124]"
            placeholder="ZIP Code"
          />
          {errors.zip && (
            <p className="text-red-500 text-sm">{errors.zip.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#F2B124] text-white rounded-lg py-2 font-medium hover:bg-[#e0a91f] transition disabled:opacity-50"
        >
          {loading ? "Searching..." : "Find"}
        </button>
      </form>

      {error && <p className="text-white-500 text-center">{error}</p>}

      {showModal && (
  <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold cursor-pointer"
      >
        ✕
      </button>

      <h2 className="text-xl font-semibold mb-4">Users in ZIP</h2>

      {users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={index}
                  className="border-b even:bg-gray-50 hover:bg-gray-100"
                >
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  </div>
)}

    </main>
  );
}
