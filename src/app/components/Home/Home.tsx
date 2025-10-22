"use client";

import { useRouter } from "next/navigation";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";

type ZipRange = {
  start: string;
  end: string;
};

type FormData = {
  name: string;
  email: string;
  phone: string;
  zipRanges: ZipRange[];
};

export default function Dashboard() {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      zipRanges: [{ start: "", end: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "zipRanges",
  });
console.log(fields,"fields++++")
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const zipRanges = data.zipRanges.map((r) => ({
        start: Number(r.start),
        end: Number(r.end),
      }));

      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        zipRanges,
      };

      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("✅ User saved successfully!");
        reset({
          name: "",
          email: "",
          phone: "",
          zipRanges: [{ start: "", end: "" }],
        });
      } else {
        toast.error(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-2xl h-screen m-auto flex items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-lg mx-auto p-6 border border-gray-200 rounded-xl shadow-sm bg-white dark:text-black"
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
        <div className="space-y-3">
          <label className="block font-medium">ZIP Ranges</label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <div>
                <input
                  type="number"
                  placeholder="Start"
                  {...register(`zipRanges.${index}.start` as const, {
                    required: "Start ZIP required",
                  })}
                  className="flex-1 border border-[#F2B124] rounded-lg p-2 focus:outline-none focus:border-[#F2B124]"
                />

                {errors.zipRanges?.[index]?.start && (
                  <p className="text-red-500 text-sm">
                    {errors.zipRanges[index]?.start?.message}
                  </p>
                )}
              </div>
              <span>-</span>
              <div>
                <input
                  type="number"
                  placeholder="End"
                  {...register(`zipRanges.${index}.end` as const, {
                    required: "End ZIP required",
                  })}
                  className="flex-1 border border-[#F2B124] rounded-lg p-2 focus:outline-none focus:border-[#F2B124]"
                />
                {errors.zipRanges?.[index]?.end && (
                  <p className="text-red-500 text-sm">
                    {errors.zipRanges[index]?.end?.message}
                  </p>
                )}
              </div>
              {index > 0 && (
              <button
                type="button"
                className="text-red-500 font-bold cursor-pointer"
                onClick={() => remove(index)}
              >
                ✕
              </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ start: "", end: "" })}
            className="text-blue-600 underline text-sm cursor-pointer"
          >
            + Add another ZIP range
          </button>
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
            onClick={() => router.push("/finduser")}
          >
            View user in ZIP
          </button>

          <button
            type="button"
            className="w-full bg-[#F2B124] text-white rounded-lg py-2 font-medium hover:bg-[#e0a91f] transition cursor-pointer"
            onClick={() => router.push("/userList")}
          >
            View users list
          </button>
        </div>
      </form>
    </div>
  );
}
