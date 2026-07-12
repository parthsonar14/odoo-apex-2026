import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Plus, Search } from 'lucide-react';

const trips = [
  { id: 'TRP-1001', src: 'Ahmedabad', dest: 'Surat', vehicle: 'V-102 (Tata Signa)', driver: 'Mohan Patel', cargo: '12 Tons', status: 'Dispatched' },
  { id: 'TRP-1002', src: 'Rajkot', dest: 'Vadodara', vehicle: 'V-101 (Volvo FH16)', driver: 'Rahul Sharma', cargo: '28 Tons', status: 'Completed' },
  { id: 'TRP-1003', src: 'Surat', dest: 'Mumbai', vehicle: 'V-104 (Ashok Leyland)', driver: 'Ramesh Singh', cargo: '20 Tons', status: 'Draft' },
  { id: 'TRP-1004', src: 'Ahmedabad', dest: 'Delhi', vehicle: 'V-103 (Bolero)', driver: 'Alex M', cargo: '1 Ton', status: 'Cancelled' },
];

export function Trips() {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Draft': return <Badge variant="default">Draft</Badge>;
      case 'Dispatched': return <Badge variant="brand">Dispatched</Badge>;
      case 'Completed': return <Badge variant="success">Completed</Badge>;
      case 'Cancelled': return <Badge variant="danger">Cancelled</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Trips</h2>
          <p className="text-slate-500">Monitor active and past dispatch routes.</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" /> Create Trip</Button>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200">
          <div className="relative w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search trips..."
              className="flex h-9 w-full rounded-md border border-slate-300 bg-transparent px-3 py-1 pl-9 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500"
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trip ID</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Vehicle & Driver</TableHead>
              <TableHead>Cargo Weight</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trips.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.id}</TableCell>
                <TableCell>{t.src}</TableCell>
                <TableCell>{t.dest}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">{t.vehicle}</span>
                    <span className="text-xs text-slate-500">{t.driver}</span>
                  </div>
                </TableCell>
                <TableCell>{t.cargo}</TableCell>
                <TableCell>{getStatusBadge(t.status)}</TableCell>
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
