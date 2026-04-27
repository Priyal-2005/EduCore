import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StudentProvider } from './context/StudentContext';
import { TimetableProvider } from './context/TimetableContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { MainLayout } from './components/layout/MainLayout';
import { StudentList } from './pages/Students/StudentList';
import { AddTimetable } from './pages/Timetable/AddTimetable';

// Placeholder for unbuilt pages
const Placeholder = ({ title }: { title: string }) => (
  <div className="p-8 text-center text-gray-500">
    <h2 className="text-2xl font-bold mb-2">{title}</h2>
    <p>This page is scaffolded but not fully implemented in the demo.</p>
  </div>
);

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />} 
        />
        <Route 
          path="/register" 
          element={!isAuthenticated ? <Register /> : <Navigate to="/" />} 
        />

        {/* Protected Routes inside MainLayout */}
        <Route 
          element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}
        >
          <Route path="/" element={<Dashboard />} />
          
          <Route path="/students" element={<StudentList />} />
          <Route path="/students/add" element={<Placeholder title="Add Student" />} />
          
          <Route path="/teachers" element={<Placeholder title="Teachers List" />} />
          
          <Route path="/timetables" element={<AddTimetable />} />
          
          <Route path="/grades" element={<Placeholder title="Grades Management" />} />
          
          <Route path="/attendance" element={<Placeholder title="Attendance Tracker" />} />
        </Route>
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <StudentProvider>
        <TimetableProvider>
          <AppRoutes />
        </TimetableProvider>
      </StudentProvider>
    </AuthProvider>
  );
};

export default App;
