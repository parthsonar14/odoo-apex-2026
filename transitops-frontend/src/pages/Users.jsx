import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRoleId, currentPermissions) => {
    try {
      await api.put(`/users/${userId}/role`, { role_id: newRoleId, permissions: currentPermissions });
      toast.success('User role updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handlePermissionChange = async (userId, currentRoleId, currentPermissions, field, value) => {
    try {
      const newPermissions = { ...(currentPermissions || {}), [field]: value };
      // Optimistically update UI
      setUsers(users.map(u => u.id === userId ? { ...u, permissions: newPermissions } : u));
      await api.put(`/users/${userId}/role`, { role_id: currentRoleId, permissions: newPermissions });
      toast.success('Permissions updated');
    } catch (error) {
      toast.error('Failed to update permissions');
      fetchUsers(); // revert
    }
  };

  const roles = [
    { id: 1, name: 'Fleet Manager' },
    { id: 2, name: 'Dispatcher' },
    { id: 3, name: 'Safety Officer' },
    { id: 4, name: 'Financial Analyst' },
  ];

  const getRoleColor = (roleId) => {
    switch(roleId) {
      case 1: return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400';
      case 2: return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 3: return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 4: return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">User Management</h2>
          <p className="text-slate-500 dark:text-slate-400">Manage team members and their roles.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="min-w-[1100px]">
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">Name</TableHead>
                <TableHead className="min-w-[150px]">Email</TableHead>
                <TableHead className="min-w-[120px]">Current Role</TableHead>
                <TableHead className="min-w-[150px]">Change Role</TableHead>
                <TableHead className="text-center min-w-[100px]">Dashboard</TableHead>
                <TableHead className="text-center min-w-[100px]">Vehicles</TableHead>
                <TableHead className="text-center min-w-[100px]">Drivers</TableHead>
                <TableHead className="text-center min-w-[100px]">Trips</TableHead>
                <TableHead className="text-center min-w-[100px]">Maintenance</TableHead>
                <TableHead className="text-center min-w-[100px]">Fuel & Exp</TableHead>
                <TableHead className="text-center min-w-[100px]">Reports</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">
                    {u.full_name}
                    {currentUser.id === u.id && <Badge className="ml-2" variant="outline">You</Badge>}
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(u.role_id)}`}>
                      {u.role_name || 'Unknown'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <select
                      value={u.role_id}
                      onChange={(e) => handleRoleChange(u.id, parseInt(e.target.value), u.permissions)}
                      disabled={currentUser.id === u.id} // prevent self-demotion
                      className="rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
                    >
                      {roles.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell className="text-center">
                    <input type="checkbox" disabled={currentUser.id === u.id} checked={u.permissions?.Dashboard || false} onChange={(e) => handlePermissionChange(u.id, u.role_id, u.permissions, 'Dashboard', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600 cursor-pointer disabled:opacity-50" />
                  </TableCell>
                  <TableCell className="text-center">
                    <input type="checkbox" disabled={currentUser.id === u.id} checked={u.permissions?.Vehicles || false} onChange={(e) => handlePermissionChange(u.id, u.role_id, u.permissions, 'Vehicles', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600 cursor-pointer disabled:opacity-50" />
                  </TableCell>
                  <TableCell className="text-center">
                    <input type="checkbox" disabled={currentUser.id === u.id} checked={u.permissions?.Drivers || false} onChange={(e) => handlePermissionChange(u.id, u.role_id, u.permissions, 'Drivers', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600 cursor-pointer disabled:opacity-50" />
                  </TableCell>
                  <TableCell className="text-center">
                    <input type="checkbox" disabled={currentUser.id === u.id} checked={u.permissions?.Trips || false} onChange={(e) => handlePermissionChange(u.id, u.role_id, u.permissions, 'Trips', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600 cursor-pointer disabled:opacity-50" />
                  </TableCell>
                  <TableCell className="text-center">
                    <input type="checkbox" disabled={currentUser.id === u.id} checked={u.permissions?.Maintenance || false} onChange={(e) => handlePermissionChange(u.id, u.role_id, u.permissions, 'Maintenance', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600 cursor-pointer disabled:opacity-50" />
                  </TableCell>
                  <TableCell className="text-center">
                    <input type="checkbox" disabled={currentUser.id === u.id} checked={u.permissions?.FuelExpenses || false} onChange={(e) => handlePermissionChange(u.id, u.role_id, u.permissions, 'FuelExpenses', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600 cursor-pointer disabled:opacity-50" />
                  </TableCell>
                  <TableCell className="text-center">
                    <input type="checkbox" disabled={currentUser.id === u.id} checked={u.permissions?.Reports || false} onChange={(e) => handlePermissionChange(u.id, u.role_id, u.permissions, 'Reports', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600 cursor-pointer disabled:opacity-50" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
