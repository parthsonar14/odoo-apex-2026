import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Download, BarChart2, PieChart, Activity } from 'lucide-react';

export function Reports() {
  const metrics = [
    { title: 'Avg Fuel Efficiency', value: '4.8 KM/L', trend: '+2.1% from last month' },
    { title: 'Total Operational Cost', value: '₹4,52,000', trend: '-5.4% from last month' },
    { title: 'Fleet Utilization Rate', value: '82%', trend: '+4% from last month' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Reports & Analytics</h2>
          <p className="text-slate-500">Insights into your fleet's performance and ROI.</p>
        </div>
        <Button variant="secondary"><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((m) => (
          <Card key={m.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{m.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{m.value}</div>
              <p className="mt-1 text-xs text-brand-600">{m.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-slate-500" /> Monthly Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full flex items-center justify-center bg-slate-50 rounded-md border border-slate-100 border-dashed">
              <span className="text-slate-400">Expense Bar Chart Placeholder</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-slate-500" /> Vehicle ROI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full flex items-center justify-center bg-slate-50 rounded-md border border-slate-100 border-dashed">
              <span className="text-slate-400">ROI Line Chart Placeholder</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
