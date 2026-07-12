import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Download, BarChart2, Activity } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import api from '../api/axiosConfig';

export function Reports() {
  const [summary, setSummary] = useState({ totalOperationalCost: 0, totalRevenue: 0, averageFuelEfficiency: 0 });
  const [utilization, setUtilization] = useState({ utilizationPercentage: 0 });
  const [vehicleSummary, setVehicleSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [summaryRes, utilRes, vehRes] = await Promise.all([
          api.get('/reports/summary'),
          api.get('/reports/fleet-utilization'),
          api.get('/reports/vehicle-summary')
        ]);
        setSummary(summaryRes.data);
        setUtilization(utilRes.data);
        setVehicleSummary(vehRes.data);
        setError(null);
      } catch (err) {
        setError('Failed to load reports. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const formatCurrency = (val) => {
    return '₹' + Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleExportCSV = () => {
    if (vehicleSummary.length === 0) return;
    const headers = ['Registration Number', 'Vehicle Name', 'Total Distance', 'Fuel Efficiency', 'Operational Cost', 'Total Revenue', 'Vehicle ROI'];
    const rows = vehicleSummary.map(v => {
      const roi = v.vehicleROI === null || v.vehicleROI === undefined ? 'N/A' : (v.vehicleROI * 100).toFixed(2) + '%';
      return [
        v.registration_number,
        v.vehicle_name,
        v.totalDistance || 0,
        v.fuelEfficiency || 0,
        v.operationalCost || 0,
        v.totalRevenue || 0,
        roi
      ].map(field => `"${field}"`).join(',');
    });
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'vehicle_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const metrics = [
    { title: 'Avg Fuel Efficiency', value: `${Number(summary.averageFuelEfficiency || 0).toFixed(2)} KM/L` },
    { title: 'Total Operational Cost', value: formatCurrency(summary.totalOperationalCost) },
    { title: 'Fleet Utilization Rate', value: `${Number(utilization.utilizationPercentage || 0).toFixed(1)}%` },
  ];

  if (loading) {
    return <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading reports...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Reports & Analytics</h2>
          <p className="text-slate-500 dark:text-slate-400">Insights into your fleet's performance and ROI.</p>
        </div>
        <Button variant="secondary" onClick={handleExportCSV}><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((m) => (
          <Card key={m.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">{m.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{m.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Registration Number</TableHead>
                <TableHead>Vehicle Name</TableHead>
                <TableHead>Total Distance</TableHead>
                <TableHead>Fuel Efficiency</TableHead>
                <TableHead>Operational Cost</TableHead>
                <TableHead>Total Revenue</TableHead>
                <TableHead>Vehicle ROI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicleSummary.map((v) => {
                const isZeroAcq = v.vehicleROI === null || v.vehicleROI === undefined;
                const roiValue = isZeroAcq ? 0 : v.vehicleROI * 100;
                let roiColor = "text-slate-900 dark:text-white";
                if (!isZeroAcq) {
                  roiColor = roiValue > 0 ? "text-green-600" : (roiValue < 0 ? "text-red-600" : "text-slate-900 dark:text-white");
                }
                
                return (
                  <TableRow key={v.vehicle_id}>
                    <TableCell className="font-medium">{v.registration_number}</TableCell>
                    <TableCell>{v.vehicle_name}</TableCell>
                    <TableCell>{Number(v.totalDistance || 0).toFixed(2)}</TableCell>
                    <TableCell>{Number(v.fuelEfficiency || 0).toFixed(2)} KM/L</TableCell>
                    <TableCell>{formatCurrency(v.operationalCost)}</TableCell>
                    <TableCell>{formatCurrency(v.totalRevenue)}</TableCell>
                    <TableCell className={`font-medium ${roiColor}`}>
                      {isZeroAcq ? 'N/A' : `${roiValue.toFixed(2)}%`}
                    </TableCell>
                  </TableRow>
                );
              })}
              {vehicleSummary.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No vehicle data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
