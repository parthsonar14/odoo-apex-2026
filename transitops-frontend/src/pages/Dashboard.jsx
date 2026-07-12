import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Truck, AlertTriangle, Map, Users, TrendingUp } from 'lucide-react';
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

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const response = await api.get('/dashboard/kpis');
        setKpis(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard metrics. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchKPIs();
  }, []);

  const stats = [
    { name: 'Active Vehicles', value: kpis.activeVehicles, icon: Truck, color: 'text-brand-600' },
    { name: 'In Maintenance', value: kpis.vehiclesInMaintenance, icon: AlertTriangle, color: 'text-amber-600' },
    { name: 'Active Trips', value: kpis.activeTrips, icon: Map, color: 'text-emerald-600' },
    { name: 'Drivers On Duty', value: kpis.driversOnDuty, icon: Users, color: 'text-indigo-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h2>
        <p className="text-slate-500">Overview of your fleet operations and key metrics.</p>
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
