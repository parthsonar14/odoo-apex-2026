import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Vehicles } from './pages/Vehicles';
import { Drivers } from './pages/Drivers';
import { Trips } from './pages/Trips';
import { Maintenance } from './pages/Maintenance';
import { FuelExpense } from './pages/FuelExpense';
import { Reports } from './pages/Reports';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes Wrapper */}
        <Route path="/" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
        <Route path="/vehicles" element={<ProtectedRoute><AppLayout><Vehicles /></AppLayout></ProtectedRoute>} />
        <Route path="/drivers" element={<ProtectedRoute><AppLayout><Drivers /></AppLayout></ProtectedRoute>} />
        <Route path="/trips" element={<ProtectedRoute><AppLayout><Trips /></AppLayout></ProtectedRoute>} />
        <Route path="/maintenance" element={<ProtectedRoute><AppLayout><Maintenance /></AppLayout></ProtectedRoute>} />
        <Route path="/expenses" element={<ProtectedRoute><AppLayout><FuelExpense /></AppLayout></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><AppLayout><Reports /></AppLayout></ProtectedRoute>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
