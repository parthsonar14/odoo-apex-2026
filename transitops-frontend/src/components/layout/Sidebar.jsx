import React from 'react';
import { NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import { LayoutDashboard, Truck, Users, Map, Wrench, Fuel, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Vehicles', href: '/vehicles', icon: Truck },
  { name: 'Drivers', href: '/drivers', icon: Users },
  { name: 'Trips', href: '/trips', icon: Map },
  { name: 'Maintenance', href: '/maintenance', icon: Wrench },
  { name: 'Fuel & Expenses', href: '/expenses', icon: Fuel },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
];

export function Sidebar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your session.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log me out!'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };

  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-200 bg-slate-900 text-slate-300">
      <div className="flex h-16 items-center px-6">
        <span className="text-xl font-bold text-white tracking-tight">Transit<span className="text-brand-500">Ops</span></span>
      </div>
      {user && (
        <div className="px-6 py-2 text-sm text-slate-400 border-b border-slate-800">
          Welcome, <span className="text-white font-medium">{user.full_name || user.email}</span>
        </div>
      )}
      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/50 hover:text-white',
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors'
                )
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="border-t border-slate-800 p-4">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
          Logout
        </button>
      </div>
    </div>
  );
}
