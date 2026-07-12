import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Plus, Search, Edit2, Trash2, Truck, CheckCircle, XCircle } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Pagination } from '../components/ui/Pagination';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

export function Trips() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tripsData, setTripsData] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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

  const fetchDropdownData = async () => {
    try {
      const [vehiclesRes, driversRes] = await Promise.all([
        api.get('/vehicles/available'),
        api.get('/drivers/available')
      ]);
      setAvailableVehicles(vehiclesRes.data);
      setAvailableDrivers(driversRes.data);
    } catch (error) {
      toast.error('Failed to load available vehicles or drivers');
    }
  };

  useEffect(() => {
    fetchTrips();
    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/trips/${editingId}`, formData);
        toast.success('Trip updated successfully!');
      } else {
        await api.post('/trips', formData);
        toast.success('Trip created successfully!');
      }
      setIsModalOpen(false);
      setEditingId(null);
      fetchTrips();
    } catch (error) {
      toast.error(error.response?.data?.message || (editingId ? 'Failed to update trip' : 'Failed to create trip'));
    }
  };

  const handleEdit = (trip) => {
    if (trip.trip_status !== 'Draft') {
      toast.error('Only Draft trips can be edited.');
      return;
    }
    setFormData({
      trip_number: trip.trip_number,
      vehicle_id: trip.vehicle_id,
      driver_id: trip.driver_id,
      source: trip.source,
      destination: trip.destination,
      cargo_weight: trip.cargo_weight,
      revenue: trip.revenue || '',
      planned_distance: trip.planned_distance || '',
      actual_distance: trip.actual_distance || '',
      start_odometer: trip.start_odometer || '',
      end_odometer: trip.end_odometer || '',
      fuel_used: trip.fuel_used || '',
      dispatch_date: trip.dispatch_date ? trip.dispatch_date.split('.')[0] : '',
      completion_date: trip.completion_date ? trip.completion_date.split('.')[0] : '',
      trip_status: trip.trip_status
    });
    setEditingId(trip.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this trip?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/trips/${id}`);
      toast.success('Trip deleted successfully');
      fetchTrips();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete trip');
    }
  };

  const handleDispatch = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to dispatch this trip?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, dispatch it!'
    });
    if (!result.isConfirmed) return;
    try {
      await api.put(`/trips/${id}/dispatch`);
      toast.success('Trip dispatched successfully!');
      fetchTrips();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to dispatch trip');
    }
  };

  const handleComplete = async (id) => {
    const { value: endOdometer } = await Swal.fire({
      title: 'Complete Trip',
      input: 'number',
      inputLabel: 'Enter End Odometer:',
      inputPlaceholder: 'e.g. 52000',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      confirmButtonText: 'Complete'
    });
    if (!endOdometer) return;
    
    try {
      await api.put(`/trips/${id}/complete`, { end_odometer: endOdometer });
      toast.success('Trip completed successfully!');
      fetchTrips();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete trip');
    }
  };

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to cancel this trip?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!'
    });
    if (!result.isConfirmed) return;
    try {
      await api.put(`/trips/${id}/cancel`);
      toast.success('Trip cancelled successfully!');
      fetchTrips();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel trip');
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

  const filteredTrips = tripsData.filter(t => 
    (t.trip_number && t.trip_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (t.source && t.source.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (t.destination && t.destination.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedTrips = filteredTrips.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Trips</h2>
          <p className="text-slate-500">Monitor active and past dispatch routes.</p>
        </div>
        {[1, 2].includes(user?.role_id) && (
          <Button onClick={() => {
            setFormData({
              trip_number: '', vehicle_id: '', driver_id: '', source: '', destination: '', cargo_weight: '', 
              revenue: '', planned_distance: '', actual_distance: '', start_odometer: '', end_odometer: '', 
              fuel_used: '', dispatch_date: '', completion_date: '', trip_status: 'Draft'
            });
            setEditingId(null);
            setIsModalOpen(true);
          }}><Plus className="mr-2 h-4 w-4" /> Create Trip</Button>
        )}
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200">
          <div className="relative w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search trips by ID, source, or destination..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
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
                  {[1, 2].includes(user?.role_id) && (
                    <div className="flex justify-end gap-2">
                      {t.trip_status === 'Draft' && (
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(t)} className="h-8 w-8 p-0" title="Edit Trip"><Edit2 className="h-4 w-4 text-blue-600" /></Button>
                      )}
                      {t.trip_status === 'Draft' && (
                        <Button variant="ghost" size="sm" onClick={() => handleDispatch(t.id)} className="h-8 w-8 p-0" title="Dispatch Trip"><Truck className="h-4 w-4 text-brand-600" /></Button>
                      )}
                      {t.trip_status === 'Dispatched' && (
                        <Button variant="ghost" size="sm" onClick={() => handleComplete(t.id)} className="h-8 w-8 p-0" title="Complete Trip"><CheckCircle className="h-4 w-4 text-green-600" /></Button>
                      )}
                      {(t.trip_status === 'Draft' || t.trip_status === 'Dispatched') && (
                        <Button variant="ghost" size="sm" onClick={() => handleCancel(t.id)} className="h-8 w-8 p-0" title="Cancel Trip"><XCircle className="h-4 w-4 text-red-600" /></Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(t.id)} className="h-8 w-8 p-0 hover:bg-red-50"><Trash2 className="h-4 w-4 text-red-600" /></Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredTrips.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Pagination 
          currentPage={currentPage} 
          totalItems={filteredTrips.length} 
          itemsPerPage={itemsPerPage} 
          onPageChange={setCurrentPage} 
        />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Trip" : "Create Trip"}>
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
              <select name="vehicle_id" value={formData.vehicle_id} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required>
                <option value="">Select Available Vehicle</option>
                {availableVehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.registration_number} - {v.vehicle_name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Driver</label>
              <select name="driver_id" value={formData.driver_id} onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required>
                <option value="">Select Available Driver</option>
                {availableDrivers.map(d => (
                  <option key={d.id} value={d.id}>{d.full_name} ({d.license_number})</option>
                ))}
              </select>
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
            <Button type="submit">{editingId ? "Save Changes" : "Save Trip"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
