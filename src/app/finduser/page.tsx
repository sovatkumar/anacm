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
  const defaultEmail = process.env.NEXT_PUBLIC_DEFAULT_EMAIL;
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    setError("");
    setUsers([]);
    try {
      const res = await fetch(`/api/user?zip=${data.zip}`);
      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Invalid Zip code");
      } else {
        setUsers(result.data);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching users");
    } finally {
      setLoading(false);
      reset();
    }
  };

  const zipValue = watch("zip") || "";

  return (
    <>
      <main className="mx-auto p-8 space-y-6 bg-[#005cbe]">
        <h1 className="text-4xl text-center font-normal text-[#fff] w-full">
          Find your representatives closest to you
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center gap-4 p-6 rounded-xl max-w-lg mx-auto"
        >
          <label className="text-white font-medium whitespace-nowrap">
            Enter Your Zip Code:
          </label>

          <input
            type="number"
            {...register("zip", {
              required: "ZIP is required",
              minLength: { value: 5, message: "ZIP must be 5 digits" },
              maxLength: { value: 5, message: "ZIP must be 5 digits" },
            })}
            className="flex-1 bg-white p-[7px] focus:outline-none focus:ring-2 dark:text-black"
          />

          <button
            type="submit"
            disabled={loading || zipValue.length !== 5}
            className={`bg-white cursor-pointer text-[#1668a8] p-[7px] rounded-sm px-4 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#4888cd] disabled:text-white`}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </main>

      {error && (
        <p className="text-white-500 text-center mt-3 text-xl">{error}</p>
      )}

      {users.length > 0 && (
        <div className="overflow-x-auto py-10">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Users in ZIP
          </h2>
          <table className="w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden text-left border-collapse">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider">
                  Phone
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={index}
                  className={`transition-colors duration-200 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-yellow-50`}
                >
                  <td className="px-6 py-4 text-gray-700">
                    <a
                      href={`mailto:${defaultEmail},${user.email.toLocaleLowerCase()}`}
                      className="hover:underline text-blue-600"
                    >
                      {user.email.toLowerCase()}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    <a
                      href={`tel:${user.phone}`}
                      className="hover:underline text-blue-600"
                    >
                      {user.phone}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
