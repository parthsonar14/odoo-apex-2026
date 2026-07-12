import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Plus, Search } from 'lucide-react';

const logs = [
  { id: 'M-1001', vehicle: 'V-102 (Tata Signa)', type: 'Routine Service', date: '2026-06-15', cost: '₹5,000', status: 'Completed' },
  { id: 'M-1002', vehicle: 'V-103 (Mahindra Bolero)', type: 'Brake Replacement', date: '2026-07-10', cost: '₹12,500', status: 'In Progress' },
  { id: 'M-1003', vehicle: 'V-101 (Volvo FH16)', type: 'Oil Change', date: '2026-07-20', cost: '₹8,200', status: 'Scheduled' },
];

export function Maintenance() {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return <Badge variant="success">Completed</Badge>;
      case 'In Progress': return <Badge variant="warning">In Progress</Badge>;
      case 'Scheduled': return <Badge variant="info">Scheduled</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Maintenance</h2>
          <p className="text-slate-500">Track vehicle repairs and service schedules.</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" /> Add Maintenance Record</Button>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200">
          <div className="relative w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search logs..."
              className="flex h-9 w-full rounded-md border border-slate-300 bg-transparent px-3 py-1 pl-9 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500"
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Log ID</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Service Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.id}</TableCell>
                <TableCell>{l.vehicle}</TableCell>
                <TableCell>{l.type}</TableCell>
                <TableCell>{l.date}</TableCell>
                <TableCell>{l.cost}</TableCell>
                <TableCell>{getStatusBadge(l.status)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
