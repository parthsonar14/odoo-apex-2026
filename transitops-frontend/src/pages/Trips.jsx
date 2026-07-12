import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { Modal } from '../components/ui/Modal';

const trips = [
  { id: 'TRP-1001', src: 'Ahmedabad', dest: 'Surat', vehicle: 'V-102 (Tata Signa)', driver: 'Mohan Patel', cargo: '12 Tons', status: 'Dispatched' },
  { id: 'TRP-1002', src: 'Rajkot', dest: 'Vadodara', vehicle: 'V-101 (Volvo FH16)', driver: 'Rahul Sharma', cargo: '28 Tons', status: 'Completed' },
  { id: 'TRP-1003', src: 'Surat', dest: 'Mumbai', vehicle: 'V-104 (Ashok Leyland)', driver: 'Ramesh Singh', cargo: '20 Tons', status: 'Draft' },
  { id: 'TRP-1004', src: 'Ahmedabad', dest: 'Delhi', vehicle: 'V-103 (Bolero)', driver: 'Alex M', cargo: '1 Ton', status: 'Cancelled' },
];

export function Trips() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <Button onClick={() => setIsModalOpen(true)}><Plus className="mr-2 h-4 w-4" /> Create Trip</Button>
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
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Edit2 className="h-4 w-4 text-blue-600" /></Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-50"><Trash2 className="h-4 w-4 text-red-600" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Trip">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Trip Number</label>
              <input type="text" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Trip Status</label>
              <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="Draft">Draft</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Vehicle</label>
              <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required>
                <option value="">Select Vehicle</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Driver</label>
              <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required>
                <option value="">Select Driver</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Source</label>
              <input type="text" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Destination</label>
              <input type="text" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Cargo Weight</label>
              <input type="number" step="0.01" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Revenue</label>
              <input type="number" step="0.01" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Planned Distance</label>
              <input type="number" step="0.01" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Actual Distance</label>
              <input type="number" step="0.01" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Start Odometer</label>
              <input type="number" step="0.01" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">End Odometer</label>
              <input type="number" step="0.01" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Fuel Used (Liters)</label>
              <input type="number" step="0.01" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Dispatch Date</label>
              <input type="datetime-local" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Completion Date</label>
              <input type="datetime-local" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Trip</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
