import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Plus, Search, Edit2, Trash2, CheckCircle } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Pagination } from '../components/ui/Pagination';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export function Maintenance() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    vehicle_id: '', maintenance_type: '', description: '', maintenance_cost: '', 
    start_date: '', end_date: '', status: 'Active'
  });

  const fetchMaintenance = async () => {
    try {
      const response = await api.get('/maintenance');
      setMaintenanceData(response.data);
    } catch (error) {
      toast.error('Failed to load maintenance logs');
    }
  };

  const fetchDropdownData = async () => {
    try {
      const vehiclesRes = await api.get('/vehicles/available');
      setAvailableVehicles(vehiclesRes.data);
    } catch (error) {
      toast.error('Failed to load available vehicles');
    }
  };

  useEffect(() => {
    fetchMaintenance();
    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/maintenance/${editingId}`, formData);
        toast.success('Maintenance record updated successfully!');
      } else {
        await api.post('/maintenance', formData);
        toast.success('Maintenance record created successfully!');
      }
      setIsModalOpen(false);
      setEditingId(null);
      fetchMaintenance();
    } catch (error) {
      toast.error(error.response?.data?.message || (editingId ? 'Failed to update record' : 'Failed to create record'));
    }
  };

  const handleEdit = (record) => {
    if (record.status !== 'Active') {
      toast.error('Only Active records can be edited.');
      return;
    }
    setFormData({
      vehicle_id: record.vehicle_id,
      maintenance_type: record.maintenance_type || '',
      description: record.description || '',
      maintenance_cost: record.maintenance_cost || '',
      start_date: record.start_date ? record.start_date.split('T')[0] : '',
      end_date: record.end_date ? record.end_date.split('T')[0] : '',
      status: record.status
    });
    setEditingId(record.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this record?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/maintenance/${id}`);
      toast.success('Record deleted successfully');
      fetchMaintenance();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete record');
    }
  };

  const handleClose = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to close this maintenance record?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, close it!'
    });
    if (!result.isConfirmed) return;
    try {
      await api.put(`/maintenance/${id}/close`);
      toast.success('Maintenance closed successfully!');
      fetchMaintenance();
      fetchDropdownData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to close maintenance');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return <Badge variant="success">Completed</Badge>;
      case 'In Progress': return <Badge variant="warning">In Progress</Badge>;
      case 'Scheduled': return <Badge variant="info">Scheduled</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const paginatedLogs = maintenanceData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Maintenance</h2>
          <p className="text-slate-500">Track vehicle repairs and service schedules.</p>
        </div>
        <Button onClick={() => {
          setFormData({
            vehicle_id: '', maintenance_type: '', description: '', maintenance_cost: '', 
            start_date: '', end_date: '', status: 'Active'
          });
          setEditingId(null);
          setIsModalOpen(true);
        }}><Plus className="mr-2 h-4 w-4" /> Add Maintenance Record</Button>
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
            {paginatedLogs.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.id}</TableCell>
                <TableCell>{l.vehicle_id}</TableCell>
                <TableCell>{l.maintenance_type}</TableCell>
                <TableCell>{l.start_date}</TableCell>
                <TableCell>{l.maintenance_cost}</TableCell>
                <TableCell>{getStatusBadge(l.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {l.status === 'Active' && (
                      <Button variant="ghost" size="sm" onClick={() => handleClose(l.id)} className="h-8 w-8 p-0" title="Close Maintenance"><CheckCircle className="h-4 w-4 text-green-600" /></Button>
                    )}
                    {l.status === 'Active' && (
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(l)} className="h-8 w-8 p-0" title="Edit Record"><Edit2 className="h-4 w-4 text-blue-600" /></Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(l.id)} className="h-8 w-8 p-0 hover:bg-red-50"><Trash2 className="h-4 w-4 text-red-600" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination 
          currentPage={currentPage} 
          totalItems={maintenanceData.length} 
          itemsPerPage={itemsPerPage} 
          onPageChange={setCurrentPage} 
        />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Maintenance Record" : "Add Maintenance Record"}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-slate-700">Vehicle</label>
              <select name="vehicle_id" value={formData.vehicle_id} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required>
                <option value="">Select Available Vehicle</option>
                {availableVehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.registration_number} - {v.vehicle_name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Maintenance Type</label>
              <input type="text" name="maintenance_type" value={formData.maintenance_type} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Maintenance Cost</label>
              <input type="number" step="0.01" name="maintenance_cost" value={formData.maintenance_cost} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" rows="3"></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Start Date</label>
              <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">End Date</label>
              <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-slate-700">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingId ? "Save Changes" : "Save Record"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
