import React from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Plus, Search } from 'lucide-react';

const vehicles = [
  { id: 'V-101', name: 'Volvo FH16', type: 'Heavy Truck', status: 'Available', capacity: '30 Tons' },
  { id: 'V-102', name: 'Tata Signa', type: 'Medium Truck', status: 'On Trip', capacity: '15 Tons' },
  { id: 'V-103', name: 'Mahindra Bolero', type: 'Light Van', status: 'In Shop', capacity: '1.5 Tons' },
  { id: 'V-104', name: 'Ashok Leyland', type: 'Heavy Truck', status: 'Retired', capacity: '25 Tons' },
];

export function Vehicles() {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available': return <Badge variant="success">Available</Badge>;
      case 'On Trip': return <Badge variant="info">On Trip</Badge>;
      case 'In Shop': return <Badge variant="warning">In Shop</Badge>;
      case 'Retired': return <Badge variant="default">Retired</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Vehicles</h2>
          <p className="text-slate-500">Manage your fleet inventory and statuses.</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" /> Add Vehicle</Button>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200">
          <div className="relative w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search vehicles..."
              className="flex h-9 w-full rounded-md border border-slate-300 bg-transparent px-3 py-1 pl-9 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500"
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Registration No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((v) => (
              <TableRow key={v.id}>
                <TableCell className="font-medium">{v.id}</TableCell>
                <TableCell>{v.name}</TableCell>
                <TableCell>{v.type}</TableCell>
                <TableCell>{v.capacity}</TableCell>
                <TableCell>{getStatusBadge(v.status)}</TableCell>
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
