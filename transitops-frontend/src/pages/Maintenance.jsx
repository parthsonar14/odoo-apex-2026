import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { Modal } from '../components/ui/Modal';

const logs = [
  { id: 'M-1001', vehicle: 'V-102 (Tata Signa)', type: 'Routine Service', date: '2026-06-15', cost: '₹5,000', status: 'Completed' },
  { id: 'M-1002', vehicle: 'V-103 (Mahindra Bolero)', type: 'Brake Replacement', date: '2026-07-10', cost: '₹12,500', status: 'In Progress' },
  { id: 'M-1003', vehicle: 'V-101 (Volvo FH16)', type: 'Oil Change', date: '2026-07-20', cost: '₹8,200', status: 'Scheduled' },
];

export function Maintenance() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <Button onClick={() => setIsModalOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Maintenance Record</Button>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Maintenance Record">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-slate-700">Vehicle</label>
              <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required>
                <option value="">Select Vehicle</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Maintenance Type</label>
              <input type="text" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Maintenance Cost</label>
              <input type="number" step="0.01" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" rows="3"></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Start Date</label>
              <input type="date" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">End Date</label>
              <input type="date" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-slate-700">Status</label>
              <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Record</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
