const pool = require('../config/db');

exports.getVehicleSummary = async (req, res) => {
    try {
        const query = `
            SELECT 
                v.id AS vehicle_id, 
                v.registration_number, 
                v.vehicle_name,
                v.acquisition_cost,
                COALESCE(SUM(t.actual_distance), 0) AS totalDistance,
                COALESCE(SUM(t.fuel_used), 0) AS totalFuel,
                COALESCE(SUM(t.revenue), 0) AS totalRevenue,
                COALESCE(f.totalFuelCost, 0) AS totalFuelCost,
                COALESCE(m.totalMaintenanceCost, 0) AS totalMaintenanceCost
            FROM Vehicles v
            LEFT JOIN Trips t ON v.id = t.vehicle_id AND t.trip_status = 'Completed'
            LEFT JOIN (
                SELECT vehicle_id, SUM(cost) AS totalFuelCost 
                FROM Fuel_Logs 
                GROUP BY vehicle_id
            ) f ON v.id = f.vehicle_id
            LEFT JOIN (
                SELECT vehicle_id, SUM(maintenance_cost) AS totalMaintenanceCost 
                FROM Maintenance_Logs 
                GROUP BY vehicle_id
            ) m ON v.id = m.vehicle_id
            GROUP BY v.id, v.registration_number, v.vehicle_name, v.acquisition_cost, f.totalFuelCost, m.totalMaintenanceCost
        `;

        const [results] = await pool.execute(query);

        const summary = results.map(row => {
            const totalDistance = Number(row.totalDistance);
            const totalFuel = Number(row.totalFuel);
            const fuelEfficiency = totalFuel > 0 ? (totalDistance / totalFuel).toFixed(2) : 0;
            
            const totalFuelCost = Number(row.totalFuelCost);
            const totalMaintenanceCost = Number(row.totalMaintenanceCost);
            const operationalCost = totalFuelCost + totalMaintenanceCost;
            
            const totalRevenue = Number(row.totalRevenue);
            const acquisitionCost = Number(row.acquisition_cost) || 0;
            
            const vehicleROI = acquisitionCost > 0 ? ((totalRevenue - operationalCost) / acquisitionCost).toFixed(2) : 0;

            return {
                vehicle_id: row.vehicle_id,
                registration_number: row.registration_number,
                vehicle_name: row.vehicle_name,
                totalDistance,
                totalFuel,
                fuelEfficiency: Number(fuelEfficiency),
                totalFuelCost,
                totalMaintenanceCost,
                operationalCost,
                totalRevenue,
                vehicleROI: Number(vehicleROI)
            };
        });

        res.json(summary);
    } catch (error) {
        console.error('Error generating vehicle summary report:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getFleetUtilization = async (req, res) => {
    try {
        const [activeVehicles] = await pool.execute("SELECT COUNT(*) as count FROM Vehicles WHERE status = 'On Trip'");
        const [totalVehicles] = await pool.execute("SELECT COUNT(*) as count FROM Vehicles");
        
        const total = totalVehicles[0].count;
        const active = activeVehicles[0].count;
        const utilizationPercentage = total > 0 ? ((active / total) * 100).toFixed(1) : 0;

        res.json({
            totalVehicles: total,
            vehiclesOnTrip: active,
            utilizationPercentage: Number(utilizationPercentage)
        });
    } catch (error) {
        console.error('Error generating fleet utilization report:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getFleetSummary = async (req, res) => {
    try {
        const [fuelRes] = await pool.execute('SELECT COALESCE(SUM(cost), 0) AS totalFuelCost FROM Fuel_Logs');
        const [maintRes] = await pool.execute('SELECT COALESCE(SUM(maintenance_cost), 0) AS totalMaintenanceCost FROM Maintenance_Logs');
        
        const totalOperationalCost = Number(fuelRes[0].totalFuelCost) + Number(maintRes[0].totalMaintenanceCost);

        const [revRes] = await pool.execute("SELECT COALESCE(SUM(revenue), 0) AS totalRevenue FROM Trips WHERE trip_status = 'Completed'");
        const totalRevenue = Number(revRes[0].totalRevenue);

        const [effRes] = await pool.execute("SELECT AVG(actual_distance / fuel_used) AS averageFuelEfficiency FROM Trips WHERE trip_status = 'Completed' AND fuel_used > 0");
        const averageFuelEfficiency = effRes[0].averageFuelEfficiency ? Number(effRes[0].averageFuelEfficiency).toFixed(2) : 0;

        res.json({
            totalOperationalCost,
            totalRevenue,
            averageFuelEfficiency: Number(averageFuelEfficiency)
        });
    } catch (error) {
        console.error('Error generating fleet summary report:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
