import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Truck, AlertTriangle, Map, Users, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const stats = [
    { name: 'Active Vehicles', value: '42', icon: Truck, color: 'text-brand-600' },
    { name: 'In Maintenance', value: '4', icon: AlertTriangle, color: 'text-amber-600' },
    { name: 'Active Trips', value: '18', icon: Map, color: 'text-emerald-600' },
    { name: 'Drivers On Duty', value: '38', icon: Users, color: 'text-indigo-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h2>
        <p className="text-slate-500">Overview of your fleet operations and key metrics.</p>
      </div>

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
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
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
            <div className="h-[300px] w-full flex items-center justify-center bg-slate-50 rounded-md border border-slate-100 border-dashed">
              <span className="text-slate-400 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" /> Chart Placeholder
              </span>
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
