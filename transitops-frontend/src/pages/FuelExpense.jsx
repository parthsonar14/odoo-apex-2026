import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { Modal } from '../components/ui/Modal';

const logs = [
  { id: 'F-1001', vehicle: 'V-102', date: '2026-07-11', liters: '45 L', cost: '₹4,050', type: 'Fuel' },
  { id: 'E-1001', vehicle: 'V-101', date: '2026-07-10', liters: '-', cost: '₹850', type: 'Toll Tax' },
  { id: 'F-1002', vehicle: 'V-103', date: '2026-07-09', liters: '25 L', cost: '₹2,250', type: 'Fuel' },
];

export function FuelExpense() {
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Fuel & Expenses</h2>
          <p className="text-slate-500">Track fuel consumption and operational costs.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setIsExpenseModalOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Expense</Button>
          <Button onClick={() => setIsFuelModalOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Fuel Log</Button>
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
                <TableCell>{l.liters}</TableCell>
                <TableCell className="font-medium">{l.cost}</TableCell>
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

      <Modal isOpen={isFuelModalOpen} onClose={() => setIsFuelModalOpen(false)} title="Add Fuel Log">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsFuelModalOpen(false); }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Vehicle</label>
              <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required>
                <option value="">Select Vehicle</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Trip</label>
              <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="">Select Trip (Optional)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Liters</label>
              <input type="number" step="0.01" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Cost</label>
              <input type="number" step="0.01" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-slate-700">Fuel Date</label>
              <input type="date" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsFuelModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Fuel Log</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} title="Add Expense">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsExpenseModalOpen(false); }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Vehicle</label>
              <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required>
                <option value="">Select Vehicle</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Trip</label>
              <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="">Select Trip (Optional)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Expense Type</label>
              <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required>
                <option value="Fuel">Fuel</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Toll">Toll</option>
                <option value="Repair">Repair</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Amount</label>
              <input type="number" step="0.01" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Expense Date</label>
              <input type="date" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" rows="3"></textarea>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsExpenseModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Expense</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
