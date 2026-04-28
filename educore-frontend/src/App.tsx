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

import { ClassProvider } from './context/ClassContext';
import { TeacherProvider } from './context/TeacherContext';
import { GradeProvider } from './context/GradeContext';
import { AttendanceProvider } from './context/AttendanceContext';
import { AddStudent } from './pages/Students/AddStudent';
import { TeacherList } from './pages/Teachers/TeacherList';
import { GradesManagement } from './pages/Grades/GradesManagement';
import { AttendanceTracker } from './pages/Attendance/AttendanceTracker';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

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
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            
            {/* Admin only routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/students" element={<StudentList />} />
              <Route path="/students/add" element={<AddStudent />} />
              <Route path="/teachers" element={<TeacherList />} />
            </Route>

            {/* Admin & Teacher routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']} />}>
              <Route path="/attendance" element={<AttendanceTracker />} />
            </Route>

            {/* Multi-role routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']} />}>
              <Route path="/timetables" element={<AddTimetable />} />
              <Route path="/grades" element={<GradesManagement />} />
            </Route>
          </Route>
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
      <ClassProvider>
        <TeacherProvider>
          <StudentProvider>
            <TimetableProvider>
              <GradeProvider>
                <AttendanceProvider>
                  <AppRoutes />
                </AttendanceProvider>
              </GradeProvider>
            </TimetableProvider>
          </StudentProvider>
        </TeacherProvider>
      </ClassProvider>
    </AuthProvider>
  );
};

export default App;
