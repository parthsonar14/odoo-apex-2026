const pool = require('./config/db');
const bcrypt = require('bcryptjs');

async function seed() {
    try {
        console.log("Seeding database...");
        
        // Ensure tables exist or create them (or assume they exist based on promt.txt)
        // I will just insert data assuming they exist, but use INSERT IGNORE or check
        
        // 1. Roles
        const [roles] = await pool.execute("SELECT id FROM Roles WHERE role_name = 'Fleet Manager'");
        let roleId;
        if (roles.length === 0) {
            const [result] = await pool.execute("INSERT INTO Roles (role_name) VALUES ('Fleet Manager')");
            roleId = result.insertId;
        } else {
            roleId = roles[0].id;
        }

        // 2. Users
        const [users] = await pool.execute("SELECT id FROM Users WHERE email = 'seed@transitops.com'");
        let userId;
        if (users.length === 0) {
            const hash = await bcrypt.hash('password123', 10);
            const [result] = await pool.execute("INSERT INTO Users (role_id, full_name, email, password, phone) VALUES (?, ?, ?, ?, ?)", [roleId, 'Seed User', 'seed@transitops.com', hash, '9876543210']);
            userId = result.insertId;
        } else {
            userId = users[0].id;
        }

        // 3. Vehicles
        const [vehicles] = await pool.execute("SELECT id FROM Vehicles WHERE registration_number = 'SEED-101'");
        let vehicleId;
        if (vehicles.length === 0) {
            const [result] = await pool.execute("INSERT INTO Vehicles (registration_number, vehicle_name, vehicle_model, vehicle_type, max_load_capacity, odometer, acquisition_cost, region, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", ['SEED-101', 'Seed Truck', '2026 Model', 'Truck', 10.5, 0, 500000, 'Gujarat', 'Available']);
            vehicleId = result.insertId;
        } else {
            vehicleId = vehicles[0].id;
        }

        // 4. Drivers
        const [drivers] = await pool.execute("SELECT id FROM Drivers WHERE license_number = 'DL-SEED-001'");
        let driverId;
        if (drivers.length === 0) {
            const [result] = await pool.execute("INSERT INTO Drivers (full_name, license_number, license_category, license_expiry, contact_number) VALUES (?, ?, ?, ?, ?)", ['Seed Driver', 'DL-SEED-001', 'Heavy', '2030-12-31', '1234567890']);
            driverId = result.insertId;
        } else {
            driverId = drivers[0].id;
        }

        // 5. Trips
        const [trips] = await pool.execute("SELECT id FROM Trips WHERE trip_number = 'TRP-SEED-01'");
        let tripId;
        if (trips.length === 0) {
            const [result] = await pool.execute("INSERT INTO Trips (trip_number, vehicle_id, driver_id, source, destination, cargo_weight, planned_distance) VALUES (?, ?, ?, ?, ?, ?, ?)", ['TRP-SEED-01', vehicleId, driverId, 'Ahmedabad', 'Surat', 5.5, 250]);
            tripId = result.insertId;
        } else {
            tripId = trips[0].id;
        }

        // 6. Maintenance Logs
        const [maintenance] = await pool.execute("SELECT id FROM Maintenance_Logs WHERE vehicle_id = ? LIMIT 1", [vehicleId]);
        if (maintenance.length === 0) {
            await pool.execute("INSERT INTO Maintenance_Logs (vehicle_id, maintenance_type, description, maintenance_cost, start_date) VALUES (?, ?, ?, ?, ?)", [vehicleId, 'Routine Service', 'Seed maintenance', 1500, '2026-07-01']);
        }

        // 7. Fuel Logs
        const [fuel] = await pool.execute("SELECT id FROM Fuel_Logs WHERE vehicle_id = ? LIMIT 1", [vehicleId]);
        if (fuel.length === 0) {
            await pool.execute("INSERT INTO Fuel_Logs (vehicle_id, trip_id, liters, cost, fuel_date) VALUES (?, ?, ?, ?, ?)", [vehicleId, tripId, 50, 4500, '2026-07-01']);
        }

        // 8. Expenses
        const [expense] = await pool.execute("SELECT id FROM Expenses WHERE vehicle_id = ? LIMIT 1", [vehicleId]);
        if (expense.length === 0) {
            await pool.execute("INSERT INTO Expenses (vehicle_id, trip_id, expense_type, amount, description, expense_date) VALUES (?, ?, ?, ?, ?, ?)", [vehicleId, tripId, 'Toll', 500, 'Toll tax', '2026-07-01']);
        }

        console.log("Seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding DB:", error);
        process.exit(1);
    }
}

seed();
