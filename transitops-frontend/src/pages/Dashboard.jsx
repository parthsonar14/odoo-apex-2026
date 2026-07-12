import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Truck, AlertTriangle, Map, Users, TrendingUp, Filter, X } from 'lucide-react';
import api from '../api/axiosConfig';

export function Dashboard() {
  const [kpis, setKpis] = useState({
    activeVehicles: 0,
    availableVehicles: 0,
    vehiclesInMaintenance: 0,
    activeTrips: 0,
    pendingTrips: 0,
    driversOnDuty: 0,
    fleetUtilization: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [regionsList, setRegionsList] = useState([]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await api.get('/vehicles');
        const uniqueRegions = [...new Set(response.data.map(v => v.region).filter(Boolean))];
        setRegionsList(uniqueRegions);
      } catch (err) {
        console.error('Failed to load regions');
      }
    };
    fetchRegions();
  }, []);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filterType) params.append('vehicle_type', filterType);
        if (filterStatus) params.append('status', filterStatus);
        if (filterRegion) params.append('region', filterRegion);
        
        const response = await api.get(`/dashboard/kpis?${params.toString()}`);
        setKpis(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard metrics. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchKPIs();
  }, [filterType, filterStatus, filterRegion]);

  const handleClearFilters = () => {
    setFilterType('');
    setFilterStatus('');
    setFilterRegion('');
  };

  const stats = [
    { name: 'Active Vehicles', value: kpis.activeVehicles, icon: Truck, color: 'text-brand-600' },
    { name: 'In Maintenance', value: kpis.vehiclesInMaintenance, icon: AlertTriangle, color: 'text-amber-600' },
    { name: 'Active Trips', value: kpis.activeTrips, icon: Map, color: 'text-emerald-600' },
    { name: 'Drivers On Duty', value: kpis.driversOnDuty, icon: Users, color: 'text-indigo-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h2>
          <p className="text-slate-500">Overview of your fleet operations and key metrics.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-slate-500 mr-2">
            <Filter className="h-4 w-4" /> Filters
          </div>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="">All Types</option>
            <option value="Truck">Truck</option>
            <option value="Van">Van</option>
            <option value="Mini Truck">Mini Truck</option>
            <option value="Bike">Bike</option>
            <option value="Other">Other</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="In Shop">In Shop</option>
            <option value="Retired">Retired</option>
          </select>
          <select value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="">All Regions</option>
            {regionsList.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
          {(filterType || filterStatus || filterRegion) && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-slate-500 hover:text-slate-700">
              <X className="h-4 w-4 mr-1" /> Clear
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {stat.name}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-8 w-16 bg-slate-200 animate-pulse rounded-md mt-1" />
              ) : (
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Fleet Utilization</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full flex items-center justify-center bg-slate-50 rounded-md border border-slate-100">
              {loading ? (
                <div className="h-16 w-32 bg-slate-200 animate-pulse rounded-md" />
              ) : (
                <div className="text-center space-y-2">
                  <div className="text-5xl font-bold text-brand-600">{kpis.fleetUtilization}%</div>
                  <div className="text-slate-500 text-sm flex items-center justify-center gap-1">
                    <TrendingUp className="h-4 w-4" /> Currently On Trip
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Maintenance Due: Truck #{100+i}</p>
                    <p className="text-sm text-slate-500">Scheduled for tomorrow</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
