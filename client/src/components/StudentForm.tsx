import { useState } from "react";
import { encryptData } from "../utils/crypto";
import Toast from "./Toast";

interface StudentFormProps {
  onStudentCreated: () => void;
}

interface StudentFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  courseEnrolled: string;
  password: string;
}

const initialForm: StudentFormData = {
  fullName: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  courseEnrolled: "",
  password: "",
};

function StudentForm({ onStudentCreated }: StudentFormProps) {
  const [formData, setFormData] =
    useState<StudentFormData>(initialForm);

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [errors, setErrors] = useState<
    Partial<Record<keyof StudentFormData, string>>
  >({});

 const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >
) => {
  const { name, value } = e.target;

  // Phone number: allow digits only and maximum 10 digits
  if (name === "phoneNumber") {
    const onlyNumbers = value.replace(/\D/g, "").slice(0, 10);

    setFormData((prev) => ({
      ...prev,
      phoneNumber: onlyNumbers,
    }));

    setErrors((prev) => ({
      ...prev,
      phoneNumber: "",
    }));

    return;
  }

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  setErrors((prev) => ({
    ...prev,
    [name]: "",
  }));
};

  const validateForm = () => {
    const newErrors: Partial<
      Record<keyof StudentFormData, string>
    > = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber =
        "Phone number must contain exactly 10 digits.";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required.";
    } else {
      const selectedDate = new Date(formData.dateOfBirth);
      const today = new Date();

      if (selectedDate > today) {
        newErrors.dateOfBirth =
          "Date of birth cannot be in the future.";
      }
    }

    if (!formData.gender) {
      newErrors.gender = "Please select a gender.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
    } else if (formData.address.trim().length < 5) {
      newErrors.address = "Please enter a valid address.";
    }

    if (!formData.courseEnrolled) {
      newErrors.courseEnrolled =
        "Please select a course.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!validateForm()) {
      setToast({
        message: "Please fix the highlighted fields.",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);

      const encryptedData = await encryptData(formData);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: encryptedData,
          }),
        }
      );

      const result = await response.json();

    if (!response.ok) {
  throw new Error(
    result.message || "Registration failed."
  );
}

// Clear the complete form
setFormData(initialForm);

// Clear validation errors
setErrors({});

// Refresh student list
onStudentCreated();

// Show success toast
setToast({
  message: "Student registered successfully!",
  type: "success",
});
      // Clear form after successful registration
      setFormData(initialForm);

      // Clear validation errors
      setErrors({});

      // Refresh student list
      onStudentCreated();

      // Show success toast
      setToast({
        message: "Student registered successfully!",
        type: "success",
      });
    } catch (error) {
      setToast({
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-5 md:grid-cols-2"
      >
        {/* Full Name */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Full Name
          </label>

          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter full name"
            className={`w-full rounded-lg border px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.fullName
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />

          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            className={`w-full rounded-lg border px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Phone Number
          </label>

          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="10-digit phone number"
            maxLength={10}
            className={`w-full rounded-lg border px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phoneNumber
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />

          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">
              {errors.phoneNumber}
            </p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Date of Birth
          </label>

          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className={`w-full rounded-lg border px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.dateOfBirth
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />

          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600">
              {errors.dateOfBirth}
            </p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Gender
          </label>

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={`w-full rounded-lg border bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.gender
                ? "border-red-500"
                : "border-gray-300"
            }`}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">
              {errors.gender}
            </p>
          )}
        </div>

        {/* Course */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Course Enrolled
          </label>

          <select
            name="courseEnrolled"
            value={formData.courseEnrolled}
            onChange={handleChange}
            className={`w-full rounded-lg border bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.courseEnrolled
                ? "border-red-500"
                : "border-gray-300"
            }`}
          >
            <option value="">Select course</option>
            <option value="Computer Science">
              Computer Science
            </option>
            <option value="Data Science">
              Data Science
            </option>
            <option value="Artificial Intelligence">
              Artificial Intelligence
            </option>
            <option value="Information Technology">
              Information Technology
            </option>
          </select>

          {errors.courseEnrolled && (
            <p className="mt-1 text-sm text-red-600">
              {errors.courseEnrolled}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Address
          </label>

          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
            rows={3}
            className={`w-full rounded-lg border px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.address
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />

          {errors.address && (
            <p className="mt-1 text-sm text-red-600">
              {errors.address}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Minimum 6 characters"
            className={`w-full rounded-lg border px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />

          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Registering..."
              : "Register Student"}
          </button>
        </div>
      </form>
    </>
  );
}

export default StudentForm;