import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Pagination } from '../components/ui/Pagination';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export function Drivers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [driversData, setDriversData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    full_name: '', license_number: '', license_category: '', license_expiry: '', 
    contact_number: '', safety_score: '100.00', status: 'Available'
  });

  const fetchDrivers = async () => {
    try {
      const response = await api.get('/drivers');
      setDriversData(response.data);
    } catch (error) {
      toast.error('Failed to load drivers');
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/drivers/${editingId}`, formData);
        toast.success('Driver updated successfully!');
      } else {
        await api.post('/drivers', formData);
        toast.success('Driver added successfully!');
      }
      setIsModalOpen(false);
      setEditingId(null);
      fetchDrivers();
    } catch (error) {
      toast.error(error.response?.data?.message || (editingId ? 'Failed to update driver' : 'Failed to add driver'));
    }
  };

  const handleEdit = (driver) => {
    setFormData({
      full_name: driver.full_name,
      license_number: driver.license_number,
      license_category: driver.license_category || '',
      license_expiry: driver.license_expiry ? driver.license_expiry.split('T')[0] : '',
      contact_number: driver.contact_number || '',
      safety_score: driver.safety_score || '100.00',
      status: driver.status
    });
    setEditingId(driver.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this driver?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/drivers/${id}`);
      toast.success('Driver deleted successfully');
      fetchDrivers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete driver');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available': return <Badge variant="success">Available</Badge>;
      case 'On Trip': return <Badge variant="info">On Trip</Badge>;
      case 'Suspended': return <Badge variant="danger">Suspended</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const paginatedDrivers = driversData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Drivers</h2>
          <p className="text-slate-500">Manage your driver staff and compliance.</p>
        </div>
        <Button onClick={() => {
          setFormData({
            full_name: '', license_number: '', license_category: '', license_expiry: '',
            contact_number: '', safety_score: '100.00', status: 'Available'
          });
          setEditingId(null);
          setIsModalOpen(true);
        }}><Plus className="mr-2 h-4 w-4" /> Add Driver</Button>
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
            {paginatedDrivers.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="font-medium">{d.id}</TableCell>
                <TableCell>{d.full_name}</TableCell>
                <TableCell>{d.license_number}</TableCell>
                <TableCell>{d.license_expiry}</TableCell>
                <TableCell>{d.safety_score}</TableCell>
                <TableCell>{getStatusBadge(d.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(d)} className="h-8 w-8 p-0"><Edit2 className="h-4 w-4 text-blue-600" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(d.id)} className="h-8 w-8 p-0 hover:bg-red-50"><Trash2 className="h-4 w-4 text-red-600" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination 
          currentPage={currentPage} 
          totalItems={driversData.length} 
          itemsPerPage={itemsPerPage} 
          onPageChange={setCurrentPage} 
        />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Driver" : "Add Driver"}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">License Number</label>
              <input type="text" name="license_number" value={formData.license_number} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">License Category</label>
              <input type="text" name="license_category" value={formData.license_category} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">License Expiry</label>
              <input type="date" name="license_expiry" value={formData.license_expiry} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Contact Number</label>
              <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Safety Score</label>
              <input type="number" step="0.01" name="safety_score" value={formData.safety_score} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="Available">Available</option>
                <option value="On Trip">On Trip</option>
                <option value="Off Duty">Off Duty</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingId ? "Save Changes" : "Save Driver"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
