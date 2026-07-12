import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
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
        <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/vehicles" element={<AppLayout><Vehicles /></AppLayout>} />
        <Route path="/drivers" element={<AppLayout><Drivers /></AppLayout>} />
        <Route path="/trips" element={<AppLayout><Trips /></AppLayout>} />
        <Route path="/maintenance" element={<AppLayout><Maintenance /></AppLayout>} />
        <Route path="/expenses" element={<AppLayout><FuelExpense /></AppLayout>} />
        <Route path="/reports" element={<AppLayout><Reports /></AppLayout>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
