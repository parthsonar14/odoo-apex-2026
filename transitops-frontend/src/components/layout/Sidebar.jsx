import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import { LayoutDashboard, Truck, Users, Map, Wrench, Fuel, BarChart3, LogOut, ChevronRightCircle, Sun, Moon, Settings as SettingsIcon, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
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
  const { isDark, toggleTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <div className={cn("flex h-full flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-300 transition-all duration-300 relative", isCollapsed ? "w-20" : "w-64")}>
      <div className={cn("flex h-16 items-center relative", isCollapsed ? "justify-center px-0" : "px-6")}>
        {!isCollapsed && (
          <span className="text-xl font-bold text-white tracking-tight flex items-center gap-1">
            Transit<span className="text-brand-500">Ops</span>
          </span>
        )}
        <ChevronRightCircle 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "h-6 w-6 text-brand-500 absolute -right-3 top-1/2 -translate-y-1/2 bg-slate-900 rounded-full cursor-pointer z-10 transition-transform duration-300",
            isCollapsed && "rotate-180"
          )} 
        />
      </div>
      {user && !isCollapsed && (
        <div className="px-6 py-2 text-sm text-slate-400 border-b border-slate-800 truncate">
          Welcome, <span className="text-white font-medium">{user.full_name || user.email}</span>
        </div>
      )}
      <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.filter(item => {
            if (user?.role_id === 1) return true;
            if (!user?.permissions) return false;
            let permKey = item.name;
            if (item.name === 'Fuel & Expenses') permKey = 'FuelExpenses';
            return user.permissions[permKey] === true;
          }).map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/50 hover:text-white',
                  'group flex items-center rounded-md py-2 text-sm font-medium transition-colors',
                  isCollapsed ? "justify-center px-0" : "px-3"
                )
              }
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0", !isCollapsed && "mr-3")} aria-hidden="true" />
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="border-t border-slate-800 p-4 space-y-2">
        {user && user.role_id === 1 && (
          <NavLink
            to="/users"
            className={({ isActive }) =>
              cn(
                isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                'group flex w-full items-center rounded-md py-2 text-sm font-medium transition-colors',
                isCollapsed ? "justify-center px-0" : "px-3"
              )
            }
            title={isCollapsed ? "Team Access" : undefined}
          >
            <Shield className={cn("h-5 w-5 flex-shrink-0", !isCollapsed && "mr-3")} aria-hidden="true" />
            {!isCollapsed && <span>Team Access</span>}
          </NavLink>
        )}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white',
              'group flex w-full items-center rounded-md py-2 text-sm font-medium transition-colors',
              isCollapsed ? "justify-center px-0" : "px-3"
            )
          }
          title={isCollapsed ? "Settings" : undefined}
        >
          <SettingsIcon className={cn("h-5 w-5 flex-shrink-0", !isCollapsed && "mr-3")} aria-hidden="true" />
          {!isCollapsed && <span>Settings</span>}
        </NavLink>
        <button
          onClick={toggleTheme}
          className={cn(
            "group flex w-full items-center rounded-md py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer",
            isCollapsed ? "justify-center px-0" : "px-3"
          )}
          title={isCollapsed ? (isDark ? 'Light Mode' : 'Dark Mode') : undefined}
        >
          {isDark ? (
            <Sun className={cn("h-5 w-5 flex-shrink-0", !isCollapsed && "mr-3")} aria-hidden="true" />
          ) : (
            <Moon className={cn("h-5 w-5 flex-shrink-0", !isCollapsed && "mr-3")} aria-hidden="true" />
          )}
          {!isCollapsed && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
        <button
          onClick={handleLogout}
          className={cn(
            "group flex w-full items-center rounded-md py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer",
            isCollapsed ? "justify-center px-0" : "px-3"
          )}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className={cn("h-5 w-5 flex-shrink-0", !isCollapsed && "mr-3")} aria-hidden="true" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
