const pool = require('../config/db');

exports.getDashboardKPIs = async (req, res) => {
    try {
        const { vehicle_type, status, region } = req.query;
        let baseWhere = '1=1';
        const params = [];

        if (vehicle_type) {
            baseWhere += ' AND vehicle_type = ?';
            params.push(vehicle_type);
        }
        if (region) {
            baseWhere += ' AND region = ?';
            params.push(region);
        }
        
        let onTripWhere = baseWhere + " AND status = 'On Trip'";
        let availableWhere = baseWhere + " AND status = 'Available'";
        let inShopWhere = baseWhere + " AND status = 'In Shop'";
        let totalWhere = baseWhere;
        const totalParams = [...params];

        if (status) {
            onTripWhere += ' AND status = ?';
            availableWhere += ' AND status = ?';
            inShopWhere += ' AND status = ?';
            totalWhere += ' AND status = ?';
            totalParams.push(status);
        }

        const [activeVehicles] = await pool.execute(`SELECT COUNT(*) as count FROM Vehicles WHERE ${onTripWhere}`, status ? [...params, status] : params);
        const [availableVehiclesResult] = await pool.execute(`SELECT COUNT(*) as count FROM Vehicles WHERE ${availableWhere}`, status ? [...params, status] : params);
        const [vehiclesInMaintenance] = await pool.execute(`SELECT COUNT(*) as count FROM Vehicles WHERE ${inShopWhere}`, status ? [...params, status] : params);
        const [totalVehicles] = await pool.execute(`SELECT COUNT(*) as count FROM Vehicles WHERE ${totalWhere}`, totalParams);
        
        let tripJoin = '';
        let driverJoin = '';
        if (vehicle_type || region || status) {
            tripJoin = 'JOIN Vehicles v ON Trips.vehicle_id = v.id';
            driverJoin = 'JOIN Trips t ON Drivers.id = t.driver_id JOIN Vehicles v ON t.vehicle_id = v.id';
        }
        
        let tripsWhere = tripJoin ? 'WHERE 1=1' : 'WHERE 1=1';
        let driversWhere = driverJoin ? 'WHERE Drivers.status = "On Trip"' : 'WHERE status = "On Trip"';
        
        const extraParams = [];
        if (vehicle_type) { tripsWhere += ' AND v.vehicle_type = ?'; driversWhere += ' AND v.vehicle_type = ?'; extraParams.push(vehicle_type); }
        if (region) { tripsWhere += ' AND v.region = ?'; driversWhere += ' AND v.region = ?'; extraParams.push(region); }
        if (status) { tripsWhere += ' AND v.status = ?'; driversWhere += ' AND v.status = ?'; extraParams.push(status); }

        const [activeTrips] = await pool.execute(`SELECT COUNT(DISTINCT Trips.id) as count FROM Trips ${tripJoin} ${tripsWhere} AND Trips.trip_status = 'Dispatched'`, extraParams);
        const [pendingTrips] = await pool.execute(`SELECT COUNT(DISTINCT Trips.id) as count FROM Trips ${tripJoin} ${tripsWhere} AND Trips.trip_status = 'Draft'`, extraParams);
        
        const [driversOnDuty] = await pool.execute(`SELECT COUNT(DISTINCT Drivers.id) as count FROM Drivers ${driverJoin} ${driversWhere}`, extraParams);

        const totalVehiclesCount = totalVehicles[0].count;
        const activeVehiclesCount = activeVehicles[0].count;
        const fleetUtilization = totalVehiclesCount > 0 ? ((activeVehiclesCount / totalVehiclesCount) * 100).toFixed(1) : '0.0';

        res.json({
            activeVehicles: activeVehiclesCount,
            availableVehicles: availableVehiclesResult[0].count,
            vehiclesInMaintenance: vehiclesInMaintenance[0].count,
            activeTrips: activeTrips[0].count,
            pendingTrips: pendingTrips[0].count,
            driversOnDuty: driversOnDuty[0].count,
            fleetUtilization: parseFloat(fleetUtilization)
        });
    } catch (error) {
        console.error('Error fetching dashboard KPIs:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
