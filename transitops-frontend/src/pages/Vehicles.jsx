import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Pagination } from '../components/ui/Pagination';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

export function Vehicles() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehiclesData, setVehiclesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    registration_number: '', vehicle_name: '', vehicle_model: '', vehicle_type: 'Truck',
    max_load_capacity: '', odometer: '0', acquisition_cost: '', region: '', status: 'Available'
  });

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/vehicles');
      setVehiclesData(response.data);
    } catch (error) {
      toast.error('Failed to load vehicles');
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/vehicles/${editingId}`, formData);
        toast.success('Vehicle updated successfully!');
      } else {
        await api.post('/vehicles', formData);
        toast.success('Vehicle added successfully!');
      }
      setIsModalOpen(false);
      setEditingId(null);
      fetchVehicles();
    } catch (error) {
      toast.error(error.response?.data?.message || (editingId ? 'Failed to update vehicle' : 'Failed to add vehicle'));
    }
  };

  const handleEdit = (vehicle) => {
    setFormData({
      registration_number: vehicle.registration_number,
      vehicle_name: vehicle.vehicle_name,
      vehicle_model: vehicle.vehicle_model || '',
      vehicle_type: vehicle.vehicle_type,
      max_load_capacity: vehicle.max_load_capacity,
      odometer: vehicle.odometer || '0',
      acquisition_cost: vehicle.acquisition_cost || '',
      region: vehicle.region || '',
      status: vehicle.status
    });
    setEditingId(vehicle.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this vehicle?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/vehicles/${id}`);
      toast.success('Vehicle deleted successfully');
      fetchVehicles();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete vehicle');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available': return <Badge variant="success">Available</Badge>;
      case 'On Trip': return <Badge variant="info">On Trip</Badge>;
      case 'In Shop': return <Badge variant="warning">In Shop</Badge>;
      case 'Retired': return <Badge variant="default">Retired</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const filteredVehicles = vehiclesData.filter(v => 
    (v.registration_number && v.registration_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (v.vehicle_name && v.vehicle_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedVehicles = filteredVehicles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Vehicles</h2>
          <p className="text-slate-500 dark:text-slate-400">Manage your fleet inventory and statuses.</p>
        </div>
        {user?.role_id === 1 && (
          <Button onClick={() => { 
            setFormData({
              registration_number: '', vehicle_name: '', vehicle_model: '', vehicle_type: 'Truck',
              max_load_capacity: '', odometer: '0', acquisition_cost: '', region: '', status: 'Available'
            });
            setEditingId(null);
            setIsModalOpen(true); 
          }}><Plus className="mr-2 h-4 w-4" /> Add Vehicle</Button>
        )}
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Search vehicles by registration or name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-4 py-2 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
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
            {paginatedVehicles.map((v) => (
              <TableRow key={v.id}>
                <TableCell className="font-medium">{v.registration_number}</TableCell>
                <TableCell>{v.vehicle_name}</TableCell>
                <TableCell>{v.vehicle_type}</TableCell>
                <TableCell>{v.max_load_capacity}</TableCell>
                <TableCell>{getStatusBadge(v.status)}</TableCell>
                <TableCell className="text-right">
                  {user?.role_id === 1 && (
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(v)} className="h-8 w-8 p-0"><Edit2 className="h-4 w-4 text-blue-600" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(v.id)} className="h-8 w-8 p-0 hover:bg-red-50"><Trash2 className="h-4 w-4 text-red-600" /></Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredVehicles.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Pagination 
          currentPage={currentPage} 
          totalItems={filteredVehicles.length} 
          itemsPerPage={itemsPerPage} 
          onPageChange={setCurrentPage} 
        />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Vehicle" : "Add Vehicle"}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Registration No.</label>
              <input type="text" name="registration_number" value={formData.registration_number} onChange={handleChange} className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Vehicle Name</label>
              <input type="text" name="vehicle_name" value={formData.vehicle_name} onChange={handleChange} className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Model</label>
              <input type="text" name="vehicle_model" value={formData.vehicle_model} onChange={handleChange} className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Type</label>
              <select name="vehicle_type" value={formData.vehicle_type} onChange={handleChange} className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required>
                <option value="Truck">Truck</option>
                <option value="Van">Van</option>
                <option value="Mini Truck">Mini Truck</option>
                <option value="Bike">Bike</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Max Load Capacity</label>
              <input type="number" step="0.01" name="max_load_capacity" value={formData.max_load_capacity} onChange={handleChange} className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Odometer</label>
              <input type="number" step="0.01" name="odometer" value={formData.odometer} onChange={handleChange} className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Acquisition Cost</label>
              <input type="number" step="0.01" name="acquisition_cost" value={formData.acquisition_cost} onChange={handleChange} className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Region</label>
              <input type="text" name="region" value={formData.region} onChange={handleChange} className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-slate-700">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="Available">Available</option>
                <option value="On Trip">On Trip</option>
                <option value="In Shop">In Shop</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingId ? "Save Changes" : "Save Vehicle"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
