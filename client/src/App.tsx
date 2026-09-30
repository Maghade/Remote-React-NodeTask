









import { useState } from "react"; 
import StudentForm from "./components/StudentForm"; 
import StudentList from "./components/StudentList"; 
import LoginForm from "./components/LoginForm"; 
 
function App() { 
  const [isRegistered, setIsRegistered] = useState(false); 
 
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
 
  const [refreshStudents, setRefreshStudents] = useState(0); 
 
  const handleStudentCreated = () => { 
    setIsRegistered(true); 
  }; 
 
  const handleLogin = () => { 
    setIsLoggedIn(true); 
  }; 
 
  const handleLogout = () => { 
    setIsLoggedIn(false); 
  }; 
 
  if (!isRegistered) { 
    return ( 
      <div className="min-h-screen bg-gray-100 px-4 py-10"> 
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-xl"> 
          <div className="mb-8 text-center bg-green-700 p-4 rounded-lg text-white shadow"> 
            <h1 className="text-3xl font-bold text-white"> 
              Student Registration 
            </h1> 
 
            <p className="mt-2 text-white">Register a student to continue</p> 
          </div> 
 
          <StudentForm onStudentCreated={handleStudentCreated} /> 
        </div> 
      </div> 
    ); 
  } 
 
  if (!isLoggedIn) { 
    return <LoginForm onLogin={handleLogin} />; 
  } 
 
  return ( 
    <div className="min-h-screen bg-gray-100"> 
      {/* Header */} 
 
      <header className="bg-green-800 text-white shadow"> 
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"> 
          <div> 
            <h1 className="text-2xl font-bold">Student Management System</h1> 
          </div> 
 
          <button 
            onClick={handleLogout} 
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50" 
          > 
            Logout 
          </button> 
        </div> 
      </header> 
      {/* Student List */} 
      <main className="mx-auto max-w-7xl px-6 py-8"> 
        <section className="rounded-2xl bg-white p-6 shadow"> 
          <div className="mb-6"> 
            <h2 className="text-xl font-bold text-gray-800">Students</h2> 
 
            <p className="mt-1 text-sm text-gray-500"> 
              View and manage registered students. 
            </p> 
          </div> 
 
          <StudentList refreshTrigger={refreshStudents} /> 
        </section> 
      </main> 
    </div> 
  ); 
} 
 
export default App; 