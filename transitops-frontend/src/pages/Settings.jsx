import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Settings() {
  const { user } = useAuth();

  const permissions = [
    { role_id: 1, role: 'Fleet Manager', dashboard: true, vehicles: true, drivers: true, trips: true, reports: true },
    { role_id: 2, role: 'Dispatcher', dashboard: true, vehicles: true, drivers: true, trips: true, reports: false },
    { role_id: 3, role: 'Safety Officer', dashboard: true, vehicles: false, drivers: true, trips: false, reports: true },
    { role_id: 4, role: 'Financial Analyst', dashboard: true, vehicles: false, drivers: false, trips: false, reports: true },
  ];

  const renderIcon = (isAllowed) => {
    return isAllowed ? (
      <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500 mx-auto" />
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h2>
        <p className="text-slate-500 dark:text-slate-400">Role-Based Access Control (RBAC) Permissions Matrix</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Page Access by Role</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead className="text-center">Dashboard</TableHead>
                <TableHead className="text-center">Vehicles</TableHead>
                <TableHead className="text-center">Drivers</TableHead>
                <TableHead className="text-center">Trips</TableHead>
                <TableHead className="text-center">Reports</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((p) => {
                const isCurrentUserRole = user && user.role_id === p.role_id;
                return (
                  <TableRow 
                    key={p.role_id}
                    className={isCurrentUserRole ? "bg-brand-50 dark:bg-brand-900/20 border-l-4 border-brand-500" : ""}
                  >
                    <TableCell className="font-medium">
                      {p.role} {isCurrentUserRole && <span className="ml-2 text-xs bg-brand-100 text-brand-700 dark:bg-brand-800 dark:text-brand-300 px-2 py-1 rounded-full">You</span>}
                    </TableCell>
                    <TableCell>{renderIcon(p.dashboard)}</TableCell>
                    <TableCell>{renderIcon(p.vehicles)}</TableCell>
                    <TableCell>{renderIcon(p.drivers)}</TableCell>
                    <TableCell>{renderIcon(p.trips)}</TableCell>
                    <TableCell>{renderIcon(p.reports)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
