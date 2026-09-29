import { useState } from "react";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";
import LoginForm from "./components/LoginForm";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(true)

  const [refreshStudents, setRefreshStudents] = useState(0);

  const handleStudentCreated = () => {
    setRefreshStudents((prev) => prev + 1);
  };

  if (!isLoggedIn) {
    return (
      <LoginForm
        onLogin={() => setIsLoggedIn(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-blue-600 text-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold">
              Student Management System
            </h1>

            <p className="text-sm text-blue-100">
              React + TypeScript + Tailwind CSS
            </p>
          </div>

          <button
            onClick={() => setIsLoggedIn(false)}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl space-y-8 px-6 py-8">

        {/* Registration */}
        <section className="rounded-2xl bg-white p-6 shadow">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Register Student
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add a new student to the system.
            </p>
          </div>

          <StudentForm
            onStudentCreated={handleStudentCreated}
          />
        </section>

        {/* Student List */}
        <section className="rounded-2xl bg-white p-6 shadow">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Students
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View and manage registered students.
            </p>
          </div>

          <StudentList
            refreshTrigger={refreshStudents}
          />
        </section>

      </main>
    </div>
  );
}

export default App;