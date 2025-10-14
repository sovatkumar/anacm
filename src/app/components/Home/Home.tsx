"use client";

import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";

type FormData = {
  name: string;
  email: string;
  phone: string;
  zip: string;
};

export default function Dashboard() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log("Form submitted:", data);

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        toast.success("User saved successfully!");
        reset();
      } else {
        toast.error(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  const router = useRouter();
  return (
    <div className="max-w-2xl mx-auto p-6 rounded-2xl h-screen m-auto flex items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-lg mx-auto p-6 border border-gray-200 rounded-xl shadow-sm"
      >
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="w-full border border-[#F2B124] rounded-lg p-2 focus:outline-none focus:border-[#F2B124]"
            placeholder="Enter Your Name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full border border-[#F2B124] rounded-lg p-2 focus:outline-none focus:border-[#F2B124]"
            placeholder="Enter Your Email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Phone</label>
            <input
              type="tel"
              {...register("phone", { required: "Phone is required" })}
              className="w-full border border-[#F2B124] rounded-lg p-2 focus:outline-none focus:border-[#F2B124]"
              placeholder="Enter Phone Number"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

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
        </div>
        <button
          type="submit"
          className="w-full bg-[#F2B124] text-white rounded-lg py-2 font-medium hover:bg-[#e0a91f] transition cursor-pointer"
        >
          Save
        </button>
<div className="flex gap-2">
        <button
          type="button"
          className="w-full bg-[#F2B124] text-white rounded-lg py-2 font-medium hover:bg-[#e0a91f] transition cursor-pointer"
          onClick={()=>router.push("/finduser")}
        >
          View user in ZIP
        </button>

        <button
          type="button"
          className="w-full bg-[#F2B124] text-white rounded-lg py-2 font-medium hover:bg-[#e0a91f] transition cursor-pointer"
          onClick={()=>router.push("/userList")}
        >
          View users list
        </button>
        </div>
      </form>
    </div>
  );
}
