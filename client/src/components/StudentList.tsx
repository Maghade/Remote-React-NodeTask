import { useEffect, useState } from "react";
import { decryptData, encryptData } from "../utils/crypto";
import axios from "axios";

interface Student {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  courseEnrolled: string;
  password: string;
}

interface StudentListProps {
  refreshTrigger: number;
}

function StudentList({ refreshTrigger }: StudentListProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingStudent, setEditingStudent] =
    useState<Student | null>(null);

  // ============================================================
  // GET STUDENTS
  // ============================================================

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/students`
      );

      const result = response.data;

      // ========================================================
      // FRONTEND DECRYPTION
      // ========================================================

      const decryptedStudents: Student[] =
        await Promise.all(
          result.students.map(
            async (student: {
              id: string;
              data: string;
            }) => {
              const decrypted =
                await decryptData(student.data);

              return {
                id: student.id,
                ...decrypted,
              };
            }
          )
        );

      setStudents(decryptedStudents);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Failed to fetch students"
        );
      } else {
        setError("Failed to fetch students");
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // FETCH STUDENTS WHEN COMPONENT LOADS
  // OR refreshTrigger CHANGES
  // ============================================================

  useEffect(() => {
    fetchStudents();
  }, [refreshTrigger]);

  // ============================================================
  // DELETE STUDENT
  // ============================================================

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/student/${id}`
      );

      const result = response.data;

      console.log(result.message);

      // Refresh student list
      await fetchStudents();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Failed to delete student"
        );
      } else {
        setError("Failed to delete student");
      }
    }
  };

  // ============================================================
  // UPDATE STUDENT
  // ============================================================

  const handleUpdate = async () => {
    if (!editingStudent) {
      return;
    }

    try {
      setError("");

      // Separate MongoDB ID from student data
      const { id, ...studentData } = editingStudent;

      // ========================================================
      // FRONTEND ENCRYPTION
      // ========================================================

      const encryptedData =
        await encryptData(studentData);

      // ========================================================
      // UPDATE API
      // ========================================================

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/student/${id}`,
        {
          data: encryptedData,
        }
      );

      const result = response.data;

      console.log(result.message);

      // Close edit modal
      setEditingStudent(null);

      // Refresh student list
      await fetchStudents();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Failed to update student"
        );
      } else {
        setError("Failed to update student");
      }
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">
        Loading students...
      </div>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div>
      {/* Error Message */}

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* No Students */}

      {students.length === 0 ? (
        <div className="rounded-lg bg-gray-50 py-10 text-center text-gray-500">
          No students registered yet.
        </div>
      ) : (
        /* ======================================================
           STUDENT TABLE
           ====================================================== */

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  Name
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  Email
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  Phone
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  Course
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  Gender
                </th>

                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {students.map((student) => (
                <tr key={student.id}>
                  {/* Name */}

                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-800">
                    {student.fullName}
                  </td>

                  {/* Email */}

                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                    {student.email}
                  </td>

                  {/* Phone */}

                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                    {student.phoneNumber}
                  </td>

                  {/* Course */}

                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                    {student.courseEnrolled}
                  </td>

                  {/* Gender */}

                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                    {student.gender}
                  </td>

                  {/* Actions */}

                  <td className="whitespace-nowrap px-4 py-4 text-right">
                    <button
                      onClick={() =>
                        setEditingStudent(student)
                      }
                      className="mr-3 rounded-md bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-200"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(student.id)
                      }
                      className="rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================================
          EDIT MODAL
          ======================================================== */}

      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">

            {/* Modal Header */}

            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                Edit Student
              </h3>

              <button
                onClick={() =>
                  setEditingStudent(null)
                }
                className="text-2xl text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            {/* Form Fields */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              {/* Full Name */}

              <input
                type="text"
                value={editingStudent.fullName}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    fullName: e.target.value,
                  })
                }
                placeholder="Full Name"
                className="rounded-lg border border-gray-300 px-4 py-2.5"
              />

              {/* Email */}

              <input
                type="email"
                value={editingStudent.email}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    email: e.target.value,
                  })
                }
                placeholder="Email"
                className="rounded-lg border border-gray-300 px-4 py-2.5"
              />

              {/* Phone */}

              <input
                type="tel"
                value={editingStudent.phoneNumber}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    phoneNumber: e.target.value,
                  })
                }
                placeholder="Phone Number"
                className="rounded-lg border border-gray-300 px-4 py-2.5"
              />

              {/* Date of Birth */}

              <input
                type="date"
                value={editingStudent.dateOfBirth}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    dateOfBirth: e.target.value,
                  })
                }
                className="rounded-lg border border-gray-300 px-4 py-2.5"
              />

              {/* Gender */}

              <select
                value={editingStudent.gender}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    gender: e.target.value,
                  })
                }
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5"
              >
                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Other">
                  Other
                </option>
              </select>

              {/* Course */}

              <input
                type="text"
                value={editingStudent.courseEnrolled}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    courseEnrolled: e.target.value,
                  })
                }
                placeholder="Course"
                className="rounded-lg border border-gray-300 px-4 py-2.5"
              />
            </div>

            {/* Address */}

            <textarea
              value={editingStudent.address}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  address: e.target.value,
                })
              }
              placeholder="Address"
              rows={3}
              className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2.5"
            />

            {/* Password */}

            <input
              type="password"
              value={editingStudent.password}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  password: e.target.value,
                })
              }
              placeholder="Password"
              className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2.5"
            />

            {/* Buttons */}

            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() =>
                  setEditingStudent(null)
                }
                className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
              >
                Save Changes
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentList;