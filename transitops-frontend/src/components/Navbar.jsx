import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/vehicles">Vehicles</Link></li>
        <li><Link to="/drivers">Drivers</Link></li>
        <li><Link to="/trips">Trips</Link></li>
        <li><Link to="/maintenance">Maintenance</Link></li>
        <li><Link to="/fuel-expense">Fuel Expense</Link></li>
        <li><Link to="/reports">Reports</Link></li>
      </ul>
    </nav>
  );
}
