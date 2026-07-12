import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Plus, Search } from 'lucide-react';

const logs = [
  { id: 'F-1001', vehicle: 'V-102', date: '2026-07-11', liters: '45 L', cost: '₹4,050', type: 'Fuel' },
  { id: 'E-1001', vehicle: 'V-101', date: '2026-07-10', liters: '-', cost: '₹850', type: 'Toll Tax' },
  { id: 'F-1002', vehicle: 'V-103', date: '2026-07-09', liters: '25 L', cost: '₹2,250', type: 'Fuel' },
];

export function FuelExpense() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Fuel & Expenses</h2>
          <p className="text-slate-500">Track fuel consumption and operational costs.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary"><Plus className="mr-2 h-4 w-4" /> Add Expense</Button>
          <Button><Plus className="mr-2 h-4 w-4" /> Add Fuel Log</Button>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200">
          <div className="relative w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search records..."
              className="flex h-9 w-full rounded-md border border-slate-300 bg-transparent px-3 py-1 pl-9 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500"
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Record ID</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Expense Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Liters / Qty</TableHead>
              <TableHead>Total Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.id}</TableCell>
                <TableCell>{l.vehicle}</TableCell>
                <TableCell>{l.type}</TableCell>
                <TableCell>{l.date}</TableCell>
                <TableCell>{l.liters}</TableCell>
                <TableCell className="font-medium">{l.cost}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
