import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Plus, Search } from 'lucide-react';

const drivers = [
  { id: 'D-001', name: 'Rahul Sharma', license: 'GJ-01-2015-123', expiry: '2028-10-15', score: '98/100', status: 'Available' },
  { id: 'D-002', name: 'Mohan Patel', license: 'GJ-05-2018-456', expiry: '2027-05-20', score: '95/100', status: 'On Trip' },
  { id: 'D-003', name: 'Alex M', license: 'GJ-02-2019-789', expiry: '2024-01-10', score: '45/100', status: 'Suspended' },
  { id: 'D-004', name: 'Ramesh Singh', license: 'GJ-27-2020-321', expiry: '2029-12-01', score: '92/100', status: 'Available' },
];

export function Drivers() {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available': return <Badge variant="success">Available</Badge>;
      case 'On Trip': return <Badge variant="info">On Trip</Badge>;
      case 'Suspended': return <Badge variant="danger">Suspended</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Drivers</h2>
          <p className="text-slate-500">Manage driver profiles and compliance.</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" /> Add Driver</Button>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200">
          <div className="relative w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search drivers..."
              className="flex h-9 w-full rounded-md border border-slate-300 bg-transparent px-3 py-1 pl-9 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500"
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Driver ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>License No</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Safety Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="font-medium">{d.id}</TableCell>
                <TableCell>{d.name}</TableCell>
                <TableCell>{d.license}</TableCell>
                <TableCell>{d.expiry}</TableCell>
                <TableCell>{d.score}</TableCell>
                <TableCell>{getStatusBadge(d.status)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
