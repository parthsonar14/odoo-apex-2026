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

export function Trips() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tripsData, setTripsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    trip_number: '', vehicle_id: '', driver_id: '', source: '', destination: '', cargo_weight: '', 
    revenue: '', planned_distance: '', actual_distance: '', start_odometer: '', end_odometer: '', 
    fuel_used: '', dispatch_date: '', completion_date: '', trip_status: 'Draft'
  });

  const fetchTrips = async () => {
    try {
      const response = await api.get('/trips');
      setTripsData(response.data);
    } catch (error) {
      toast.error('Failed to load trips');
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/trips', formData);
      toast.success('Trip created successfully!');
      setIsModalOpen(false);
      fetchTrips();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create trip');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    try {
      await api.delete(`/trips/${id}`);
      toast.success('Trip deleted successfully');
      fetchTrips();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete trip');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Draft': return <Badge variant="default">Draft</Badge>;
      case 'Dispatched': return <Badge variant="brand">Dispatched</Badge>;
      case 'Completed': return <Badge variant="success">Completed</Badge>;
      case 'Cancelled': return <Badge variant="danger">Cancelled</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const paginatedTrips = tripsData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
            {paginatedTrips.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.trip_number}</TableCell>
                <TableCell>{t.source}</TableCell>
                <TableCell>{t.destination}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">Vehicle: {t.vehicle_id}</span>
                    <span className="text-xs text-slate-500">Driver: {t.driver_id}</span>
                  </div>
                </TableCell>
                <TableCell>{t.cargo_weight}</TableCell>
                <TableCell>{getStatusBadge(t.trip_status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Edit2 className="h-4 w-4 text-blue-600" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(t.id)} className="h-8 w-8 p-0 hover:bg-red-50"><Trash2 className="h-4 w-4 text-red-600" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination 
          currentPage={currentPage} 
          totalItems={tripsData.length} 
          itemsPerPage={itemsPerPage} 
          onPageChange={setCurrentPage} 
        />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Trip">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Trip Number</label>
              <input type="text" name="trip_number" value={formData.trip_number} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Trip Status</label>
              <select name="trip_status" value={formData.trip_status} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="Draft">Draft</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Vehicle</label>
              <input type="text" name="vehicle_id" value={formData.vehicle_id} onChange={handleChange} placeholder="Vehicle ID" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Driver</label>
              <input type="text" name="driver_id" value={formData.driver_id} onChange={handleChange} placeholder="Driver ID" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Source</label>
              <input type="text" name="source" value={formData.source} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Destination</label>
              <input type="text" name="destination" value={formData.destination} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Cargo Weight</label>
              <input type="number" step="0.01" name="cargo_weight" value={formData.cargo_weight} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Revenue</label>
              <input type="number" step="0.01" name="revenue" value={formData.revenue} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Planned Distance</label>
              <input type="number" step="0.01" name="planned_distance" value={formData.planned_distance} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Actual Distance</label>
              <input type="number" step="0.01" name="actual_distance" value={formData.actual_distance} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Start Odometer</label>
              <input type="number" step="0.01" name="start_odometer" value={formData.start_odometer} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">End Odometer</label>
              <input type="number" step="0.01" name="end_odometer" value={formData.end_odometer} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Fuel Used (Liters)</label>
              <input type="number" step="0.01" name="fuel_used" value={formData.fuel_used} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Dispatch Date</label>
              <input type="datetime-local" name="dispatch_date" value={formData.dispatch_date} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Completion Date</label>
              <input type="datetime-local" name="completion_date" value={formData.completion_date} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
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
