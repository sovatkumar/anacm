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
      <Header />
      <main className="mx-auto p-6 md:p-10 lg:p-12 space-y-6 bg-[#9E1E63] w-full">
        <div className="flex items-center justify-center">
          <h1 className="text-2xl md:text-4xl text-center font-normal text-white w-full px-4">
            Find a representative closest to you
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col md:flex-row items-center gap-4 p-4 md:p-6 rounded-xl max-w-xl md:max-w-2xl mx-auto w-full bg-[#9E1E63]"
        >
          <label className="text-white font-medium whitespace-nowrap text-center md:text-left">
            Enter Your Zip Code:
          </label>

          <input
            type="number"
            {...register("zip", {
              required: "ZIP is required",
              minLength: { value: 5, message: "ZIP must be 5 digits" },
              maxLength: { value: 5, message: "ZIP must be 5 digits" },
            })}
            className="w-full md:flex-1 bg-white p-[7px] focus:outline-none focus:ring-2 dark:text-black rounded-md"
          />

          <button
            type="submit"
            disabled={loading || zipValue.length !== 5}
            className={`w-full md:w-auto bg-white cursor-pointer text-[#9E1E63] p-[7px] rounded-md px-4 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#9E1E63] disabled:border disabled:text-white`}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </main>

      {error && (
        <p className="dark:text-white text-center mt-3 text-lg md:text-xl px-4">
          {error}
        </p>
      )}

      {users.length > 0 && (
        <div className="overflow-x-auto pt-4 text-center px-2 md:px-6">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Dealer</h2>

          <div className="w-full md:max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-x-auto">
            <table className="min-w-full text-center border-collapse text-sm md:text-base">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-3 md:px-6 py-3 font-semibold uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-3 md:px-6 py-3 font-semibold uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-3 md:px-6 py-3 font-semibold uppercase tracking-wider">
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
                    <td className="px-3 md:px-6 py-4 text-gray-700 break-words">
                      {user.name}
                    </td>
                    <td className="px-3 md:px-6 py-4 text-gray-700 break-words">
                      <a
                        href={`mailto:${defaultEmail},${user.email.toLowerCase()}`}
                        className="hover:underline text-blue-600"
                      >
                        {user.email.toLowerCase()}
                      </a>
                    </td>
                    <td className="px-3 md:px-6 py-4 text-gray-700">
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

          <div className="mt-6 text-center px-4">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">
              Clinical Educator
            </h2>

            <div className="inline-block bg-white rounded-xl shadow-md border px-6 md:px-10 py-6 text-gray-700">
              <p className="font-medium text-base md:text-lg">Ana Endsjo</p>

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
