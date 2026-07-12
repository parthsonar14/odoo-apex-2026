import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Pagination } from '../components/ui/Pagination';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';

export function FuelExpense() {
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [fuelData, setFuelData] = useState({
    vehicle_id: '', trip_id: '', liters: '', cost: '', fuel_date: ''
  });

  const [expenseData, setExpenseData] = useState({
    vehicle_id: '', trip_id: '', expense_type: 'Fuel', amount: '', expense_date: '', description: ''
  });

  const fetchData = async () => {
    try {
      const [fuelRes, expenseRes] = await Promise.all([
        api.get('/fuel'),
        api.get('/expenses')
      ]);
      setFuelLogs(fuelRes.data);
      setExpenses(expenseRes.data);
    } catch (error) {
      toast.error('Failed to load records');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFuelSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/fuel', fuelData);
      toast.success('Fuel log added successfully!');
      setIsFuelModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add fuel log');
    }
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expenses', expenseData);
      toast.success('Expense added successfully!');
      setIsExpenseModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add expense');
    }
  };

  const handleDelete = async (log) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      if (log.isFuel) {
        await api.delete(`/fuel/${log.id}`);
      } else {
        await api.delete(`/expenses/${log.id}`);
      }
      toast.success('Record deleted successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete record');
    }
  };

  const combinedLogs = [
    ...fuelLogs.map(f => ({ ...f, isFuel: true, displayType: 'Fuel', displayDate: f.fuel_date, displayCost: f.cost, displayLiters: f.liters })),
    ...expenses.map(e => ({ ...e, isFuel: false, displayType: e.expense_type, displayDate: e.expense_date, displayCost: e.amount, displayLiters: '-' }))
  ].sort((a, b) => new Date(b.displayDate || 0) - new Date(a.displayDate || 0));

  const paginatedLogs = combinedLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
            {paginatedLogs.map((l, index) => (
              <TableRow key={`${l.isFuel ? 'F' : 'E'}-${l.id}-${index}`}>
                <TableCell className="font-medium">{l.isFuel ? `F-${l.id}` : `E-${l.id}`}</TableCell>
                <TableCell>{l.vehicle_id}</TableCell>
                <TableCell>{l.displayType}</TableCell>
                <TableCell>{l.displayDate}</TableCell>
                <TableCell>{l.displayLiters}</TableCell>
                <TableCell className="font-medium">{l.displayCost}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Edit2 className="h-4 w-4 text-blue-600" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(l)} className="h-8 w-8 p-0 hover:bg-red-50"><Trash2 className="h-4 w-4 text-red-600" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination 
          currentPage={currentPage} 
          totalItems={combinedLogs.length} 
          itemsPerPage={itemsPerPage} 
          onPageChange={setCurrentPage} 
        />
      </Card>

      <Modal isOpen={isFuelModalOpen} onClose={() => setIsFuelModalOpen(false)} title="Add Fuel Log">
        <form className="space-y-4" onSubmit={handleFuelSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Vehicle</label>
              <input type="text" value={fuelData.vehicle_id} onChange={(e) => setFuelData({...fuelData, vehicle_id: e.target.value})} placeholder="Vehicle ID" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Trip</label>
              <input type="text" value={fuelData.trip_id} onChange={(e) => setFuelData({...fuelData, trip_id: e.target.value})} placeholder="Trip ID (Optional)" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Liters</label>
              <input type="number" step="0.01" value={fuelData.liters} onChange={(e) => setFuelData({...fuelData, liters: e.target.value})} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Cost</label>
              <input type="number" step="0.01" value={fuelData.cost} onChange={(e) => setFuelData({...fuelData, cost: e.target.value})} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-slate-700">Fuel Date</label>
              <input type="date" value={fuelData.fuel_date} onChange={(e) => setFuelData({...fuelData, fuel_date: e.target.value})} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsFuelModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Fuel Log</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} title="Add Expense">
        <form className="space-y-4" onSubmit={handleExpenseSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Vehicle</label>
              <input type="text" value={expenseData.vehicle_id} onChange={(e) => setExpenseData({...expenseData, vehicle_id: e.target.value})} placeholder="Vehicle ID" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Trip</label>
              <input type="text" value={expenseData.trip_id} onChange={(e) => setExpenseData({...expenseData, trip_id: e.target.value})} placeholder="Trip ID (Optional)" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Expense Type</label>
              <select value={expenseData.expense_type} onChange={(e) => setExpenseData({...expenseData, expense_type: e.target.value})} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required>
                <option value="Fuel">Fuel</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Toll">Toll</option>
                <option value="Repair">Repair</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Amount</label>
              <input type="number" step="0.01" value={expenseData.amount} onChange={(e) => setExpenseData({...expenseData, amount: e.target.value})} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Expense Date</label>
              <input type="date" value={expenseData.expense_date} onChange={(e) => setExpenseData({...expenseData, expense_date: e.target.value})} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea value={expenseData.description} onChange={(e) => setExpenseData({...expenseData, description: e.target.value})} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" rows="3"></textarea>
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
