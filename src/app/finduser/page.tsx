"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Header from "../components/Header/header";

type FormData = {
  zip: string;
};

type User = {
  email: string;
  phone: string;
  name: string;
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
        setError(result.message || "Invalid ZIP code");
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
    <Header/>
      <main className="mx-auto p-8 space-y-6 bg-[#9E1E63]">
        <div className="flex  items-center">
          {/* <a href="https://social63319.wixstudio.com/wheelchair-seating-m?rc=test-site" target="_blank">
            <img
              src="/anacmlogo.avif"
              alt="Company Logo"
              className="mx-auto w-32 sm:w-40 md:w-48 h-auto object-contain rounded-lg shadow-md bg-white p-2"
            />
          </a> */}

          <h1 className="text-2xl sm:text-4xl text-center font-normal text-[#fff] w-full">
            Find a representative closest to you
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col sm:flex-row items-center gap-4 sm:p-6 rounded-xl max-w-lg mx-auto bg-[#9E1E63]"
        >
          <label className="text-white font-medium whitespace-nowrap text-center sm:text-left">
            Enter Your Zip Code:
          </label>

          <input
            type="number"
            {...register("zip", {
              required: "ZIP is required",
              minLength: { value: 5, message: "ZIP must be 5 digits" },
              maxLength: { value: 5, message: "ZIP must be 5 digits" },
            })}
            className="w-full sm:flex-1 bg-white p-[7px] focus:outline-none focus:ring-2 dark:text-black"
          />

          <button
            type="submit"
            disabled={loading || zipValue.length !== 5}
            className={`w-full sm:w-auto bg-white cursor-pointer text-[#9E1E63] p-[7px] rounded-md px-4 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#9E1E63] disabled:border disabled:text-white`}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </main>

      {error && (
        <p className="dark:text-white text-center mt-3 text-lg sm:text-xl px-4">
          {error}
        </p>
      )}

      {users.length > 0 && (
        <div className="overflow-x-auto pt-4 text-center px-2 sm:px-0">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Dealer</h2>
          <div className="w-full sm:w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <table className="min-w-full text-center border-collapse text-sm sm:text-base">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-3 sm:px-6 py-3 font-semibold uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-3 sm:px-6 py-3 font-semibold uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-3 sm:px-6 py-3 font-semibold uppercase tracking-wider">
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
                    <td className="px-3 sm:px-6 py-4 text-gray-700 break-words">
                      {user.name}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-gray-700 break-words">
                      <a
                        href={`mailto:${defaultEmail},${user.email.toLowerCase()}`}
                        className="hover:underline text-blue-600"
                      >
                        {user.email.toLowerCase()}
                      </a>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-gray-700">
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

          <div className="mt-4 text-center px-4">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              Clinical Educator
            </h2>
            <div className="inline-block bg-white rounded-xl shadow-md border px-6 sm:px-8 py-6 text-gray-700">
              <p className="font-medium text-base sm:text-lg">Ana Endsjo</p>
              <a
                href="mailto:ana.endsjo@matrixseatingusa.com"
                className="text-blue-600 hover:underline block mt-1"
              >
                ana.endsjo@matrixseatingusa.com
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
