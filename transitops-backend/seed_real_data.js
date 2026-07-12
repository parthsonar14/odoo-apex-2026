const pool = require('./config/db');

async function seedRealData() {
    try {
        console.log("Seeding 10 real data records into all tables...");

        const vehicles = [
            { reg: 'GJ-01-AB-1234', name: 'Tata Prima 4928', model: '2023', type: 'Truck', capacity: 25.5, odo: 12500, cost: 3500000, region: 'Gujarat', status: 'Available' },
            { reg: 'MH-12-CD-5678', name: 'Ashok Leyland U-3118', model: '2022', type: 'Truck', capacity: 31.0, odo: 45000, cost: 4200000, region: 'Maharashtra', status: 'Available' },
            { reg: 'DL-01-EF-9012', name: 'Mahindra Bolero Pickup', model: '2024', type: 'Mini Truck', capacity: 1.5, odo: 5000, cost: 850000, region: 'Delhi', status: 'On Trip' },
            { reg: 'RJ-14-GH-3456', name: 'Eicher Pro 3019', model: '2021', type: 'Truck', capacity: 19.5, odo: 85000, cost: 2100000, region: 'Rajasthan', status: 'Available' },
            { reg: 'KA-01-IJ-7890', name: 'Tata Ace Gold', model: '2023', type: 'Mini Truck', capacity: 0.75, odo: 12000, cost: 550000, region: 'Karnataka', status: 'In Shop' },
            { reg: 'TN-09-KL-1234', name: 'BharatBenz 2823C', model: '2024', type: 'Truck', capacity: 28.0, odo: 8000, cost: 3800000, region: 'Tamil Nadu', status: 'Available' },
            { reg: 'UP-32-MN-5678', name: 'Maruti Suzuki Super Carry', model: '2022', type: 'Van', capacity: 0.74, odo: 32000, cost: 480000, region: 'Uttar Pradesh', status: 'Available' },
            { reg: 'MP-04-OP-9012', name: 'Ashok Leyland Dost', model: '2023', type: 'Mini Truck', capacity: 1.25, odo: 15000, cost: 720000, region: 'Madhya Pradesh', status: 'Available' },
            { reg: 'PB-08-QR-3456', name: 'Tata Signa 4825.T', model: '2021', type: 'Truck', capacity: 47.5, odo: 110000, cost: 4500000, region: 'Punjab', status: 'On Trip' },
            { reg: 'HR-26-ST-7890', name: 'Mahindra Supro', model: '2023', type: 'Van', capacity: 0.85, odo: 18000, cost: 600000, region: 'Haryana', status: 'Available' }
        ];

        const drivers = [
            { name: 'Rajesh Kumar', lic: 'DL-1420110012345', cat: 'Heavy', exp: '2028-10-15', phone: '9876543210', safety: 4.8, status: 'Available' },
            { name: 'Suresh Singh', lic: 'DL-1420110054321', cat: 'Heavy', exp: '2027-05-20', phone: '9876543211', safety: 4.5, status: 'Available' },
            { name: 'Amit Patel', lic: 'DL-1420110098765', cat: 'Light', exp: '2030-01-10', phone: '9876543212', safety: 4.9, status: 'On Trip' },
            { name: 'Vikram Sharma', lic: 'DL-1420110011223', cat: 'Heavy', exp: '2029-08-25', phone: '9876543213', safety: 4.2, status: 'Available' },
            { name: 'Ravi Verma', lic: 'DL-1420110033445', cat: 'Light', exp: '2026-11-30', phone: '9876543214', safety: 4.6, status: 'Off Duty' },
            { name: 'Manoj Yadav', lic: 'DL-1420110055667', cat: 'Heavy', exp: '2031-03-15', phone: '9876543215', safety: 4.7, status: 'Available' },
            { name: 'Anil Gupta', lic: 'DL-1420110077889', cat: 'Light', exp: '2028-07-22', phone: '9876543216', safety: 4.4, status: 'Available' },
            { name: 'Dinesh Tiwari', lic: 'DL-1420110099001', cat: 'Light', exp: '2027-09-05', phone: '9876543217', safety: 4.3, status: 'Available' },
            { name: 'Sunil Mishra', lic: 'DL-1420110022334', cat: 'Heavy', exp: '2029-12-12', phone: '9876543218', safety: 4.1, status: 'On Trip' },
            { name: 'Mukesh Choudhary', lic: 'DL-1420110044556', cat: 'Light', exp: '2032-04-18', phone: '9876543219', safety: 4.9, status: 'Available' }
        ];

        let vIds = [];
        let dIds = [];

        // Insert Vehicles
        for (let v of vehicles) {
            const [rows] = await pool.execute("SELECT id FROM Vehicles WHERE registration_number = ?", [v.reg]);
            if (rows.length === 0) {
                const [result] = await pool.execute(
                    "INSERT INTO Vehicles (registration_number, vehicle_name, vehicle_model, vehicle_type, max_load_capacity, odometer, acquisition_cost, region, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [v.reg, v.name, v.model, v.type, v.capacity, v.odo, v.cost, v.region, v.status]
                );
                vIds.push(result.insertId);
            } else {
                vIds.push(rows[0].id);
            }
        }
        console.log("Vehicles seeded.");

        // Insert Drivers
        for (let d of drivers) {
            const [rows] = await pool.execute("SELECT id FROM Drivers WHERE license_number = ?", [d.lic]);
            if (rows.length === 0) {
                const [result] = await pool.execute(
                    "INSERT INTO Drivers (full_name, license_number, license_category, license_expiry, contact_number, safety_score, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    [d.name, d.lic, d.cat, d.exp, d.phone, d.safety, d.status]
                );
                dIds.push(result.insertId);
            } else {
                dIds.push(rows[0].id);
            }
        }
        console.log("Drivers seeded.");

        // Insert 10 Trips
        const trips = [
            { num: 'TRP-1001', vId: vIds[0], dId: dIds[0], src: 'Ahmedabad', dest: 'Surat', weight: 15.0, pDist: 260, aDist: 265, sOdo: 12500, eOdo: 12765, fuel: 52, rvn: 15000, stat: 'Completed' },
            { num: 'TRP-1002', vId: vIds[1], dId: dIds[1], src: 'Mumbai', dest: 'Pune', weight: 20.0, pDist: 150, aDist: 155, sOdo: 45000, eOdo: 45155, fuel: 35, rvn: 12000, stat: 'Completed' },
            { num: 'TRP-1003', vId: vIds[2], dId: dIds[2], src: 'Delhi', dest: 'Jaipur', weight: 1.2, pDist: 280, aDist: 0, sOdo: 5000, eOdo: null, fuel: null, rvn: 8000, stat: 'Dispatched' },
            { num: 'TRP-1004', vId: vIds[3], dId: dIds[3], src: 'Jaipur', dest: 'Udaipur', weight: 18.0, pDist: 400, aDist: 410, sOdo: 85000, eOdo: 85410, fuel: 85, rvn: 25000, stat: 'Completed' },
            { num: 'TRP-1005', vId: vIds[4], dId: dIds[4], src: 'Bengaluru', dest: 'Mysuru', weight: 0.5, pDist: 150, aDist: 150, sOdo: 12000, eOdo: 12150, fuel: 10, rvn: 5000, stat: 'Completed' },
            { num: 'TRP-1006', vId: vIds[5], dId: dIds[5], src: 'Chennai', dest: 'Coimbatore', weight: 25.0, pDist: 500, aDist: 505, sOdo: 8000, eOdo: 8505, fuel: 110, rvn: 30000, stat: 'Completed' },
            { num: 'TRP-1007', vId: vIds[6], dId: dIds[6], src: 'Lucknow', dest: 'Kanpur', weight: 0.7, pDist: 90, aDist: 95, sOdo: 32000, eOdo: 32095, fuel: 8, rvn: 4000, stat: 'Completed' },
            { num: 'TRP-1008', vId: vIds[7], dId: dIds[7], src: 'Bhopal', dest: 'Indore', weight: 1.0, pDist: 200, aDist: 202, sOdo: 15000, eOdo: 15202, fuel: 15, rvn: 7000, stat: 'Completed' },
            { num: 'TRP-1009', vId: vIds[8], dId: dIds[8], src: 'Ludhiana', dest: 'Chandigarh', weight: 40.0, pDist: 100, aDist: 0, sOdo: 110000, eOdo: null, fuel: null, rvn: 18000, stat: 'Dispatched' },
            { num: 'TRP-1010', vId: vIds[9], dId: dIds[9], src: 'Gurugram', dest: 'Delhi', weight: 0.6, pDist: 40, aDist: 42, sOdo: 18000, eOdo: 18042, fuel: 3, rvn: 2500, stat: 'Completed' }
        ];

        let tIds = [];
        for (let t of trips) {
            const [rows] = await pool.execute("SELECT id FROM Trips WHERE trip_number = ?", [t.num]);
            if (rows.length === 0) {
                const [result] = await pool.execute(
                    "INSERT INTO Trips (trip_number, vehicle_id, driver_id, source, destination, cargo_weight, revenue, planned_distance, actual_distance, start_odometer, end_odometer, fuel_used, trip_status, dispatch_date, completion_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [t.num, t.vId, t.dId, t.src, t.dest, t.weight, t.rvn, t.pDist, t.aDist, t.sOdo, t.eOdo, t.fuel, t.stat, '2026-06-01 08:00:00', t.stat === 'Completed' ? '2026-06-02 18:00:00' : null]
                );
                tIds.push(result.insertId);
            } else {
                tIds.push(rows[0].id);
            }
        }
        console.log("Trips seeded.");

        // Insert 10 Maintenance Logs
        const maints = [
            { vId: vIds[0], type: 'Routine Service', cost: 15000, desc: 'Oil change and filter replacement', stat: 'Completed', sDate: '2026-05-15', eDate: '2026-05-16' },
            { vId: vIds[1], type: 'Tire Replacement', cost: 45000, desc: 'Replaced all 6 tires', stat: 'Completed', sDate: '2026-04-20', eDate: '2026-04-21' },
            { vId: vIds[4], type: 'Engine Repair', cost: 35000, desc: 'Engine overhauling required', stat: 'Active', sDate: '2026-07-10', eDate: null },
            { vId: vIds[5], type: 'Brake Servicing', cost: 8000, desc: 'Brake pad change', stat: 'Completed', sDate: '2026-06-05', eDate: '2026-06-06' },
            { vId: vIds[3], type: 'Battery Replacement', cost: 12000, desc: 'Replaced dead battery', stat: 'Completed', sDate: '2026-05-25', eDate: '2026-05-25' },
            { vId: vIds[6], type: 'Routine Service', cost: 5000, desc: 'Standard checkup', stat: 'Completed', sDate: '2026-03-10', eDate: '2026-03-10' },
            { vId: vIds[7], type: 'Suspension Fix', cost: 18000, desc: 'Fixed front suspension', stat: 'Completed', sDate: '2026-02-14', eDate: '2026-02-15' },
            { vId: vIds[8], type: 'Routine Service', cost: 22000, desc: 'Heavy vehicle routine service', stat: 'Completed', sDate: '2026-01-20', eDate: '2026-01-22' },
            { vId: vIds[9], type: 'AC Repair', cost: 4000, desc: 'Fixed AC cooling issue', stat: 'Completed', sDate: '2026-04-18', eDate: '2026-04-18' },
            { vId: vIds[2], type: 'Routine Service', cost: 3500, desc: 'Oil change', stat: 'Completed', sDate: '2026-06-20', eDate: '2026-06-20' }
        ];

        for (let m of maints) {
            await pool.execute(
                "INSERT INTO Maintenance_Logs (vehicle_id, maintenance_type, description, maintenance_cost, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [m.vId, m.type, m.desc, m.cost, m.sDate, m.eDate, m.stat]
            );
        }
        console.log("Maintenance logs seeded.");

        // Insert 10 Fuel Logs
        const fuels = [
            { vId: vIds[0], tId: tIds[0], liters: 52, cost: 4680, date: '2026-06-01' },
            { vId: vIds[1], tId: tIds[1], liters: 35, cost: 3150, date: '2026-06-01' },
            { vId: vIds[2], tId: tIds[2], liters: 20, cost: 1800, date: '2026-07-12' },
            { vId: vIds[3], tId: tIds[3], liters: 85, cost: 7650, date: '2026-06-01' },
            { vId: vIds[4], tId: tIds[4], liters: 10, cost: 900, date: '2026-06-01' },
            { vId: vIds[5], tId: tIds[5], liters: 110, cost: 9900, date: '2026-06-01' },
            { vId: vIds[6], tId: tIds[6], liters: 8, cost: 720, date: '2026-06-01' },
            { vId: vIds[7], tId: tIds[7], liters: 15, cost: 1350, date: '2026-06-01' },
            { vId: vIds[8], tId: tIds[8], liters: 40, cost: 3600, date: '2026-07-12' },
            { vId: vIds[9], tId: tIds[9], liters: 3, cost: 270, date: '2026-06-01' }
        ];

        for (let f of fuels) {
            await pool.execute(
                "INSERT INTO Fuel_Logs (vehicle_id, trip_id, liters, cost, fuel_date) VALUES (?, ?, ?, ?, ?)",
                [f.vId, f.tId, f.liters, f.cost, f.date]
            );
        }
        console.log("Fuel logs seeded.");

        // Insert 10 Expenses
        const expenses = [
            { vId: vIds[0], tId: tIds[0], type: 'Toll', amount: 850, desc: 'Highway toll', date: '2026-06-01' },
            { vId: vIds[1], tId: tIds[1], type: 'Toll', amount: 320, desc: 'Expressway toll', date: '2026-06-01' },
            { vId: vIds[3], tId: tIds[3], type: 'Other', amount: 500, desc: 'Driver allowance', date: '2026-06-01' },
            { vId: vIds[5], tId: tIds[5], type: 'Toll', amount: 1200, desc: 'Multiple state borders', date: '2026-06-01' },
            { vId: vIds[5], tId: tIds[5], type: 'Other', amount: 200, desc: 'Parking', date: '2026-06-02' },
            { vId: vIds[6], tId: tIds[6], type: 'Toll', amount: 150, desc: 'Toll', date: '2026-06-01' },
            { vId: vIds[7], tId: tIds[7], type: 'Toll', amount: 90, desc: 'Toll tax', date: '2026-06-01' },
            { vId: vIds[8], tId: tIds[8], type: 'Other', amount: 300, desc: 'Unloading charges', date: '2026-07-12' },
            { vId: vIds[0], tId: null, type: 'Maintenance', amount: 15000, desc: 'Routine Service', date: '2026-05-15' },
            { vId: vIds[1], tId: null, type: 'Maintenance', amount: 45000, desc: 'Tire Replacement', date: '2026-04-20' }
        ];

        for (let e of expenses) {
            await pool.execute(
                "INSERT INTO Expenses (vehicle_id, trip_id, expense_type, amount, description, expense_date) VALUES (?, ?, ?, ?, ?, ?)",
                [e.vId, e.tId, e.type, e.amount, e.desc, e.date]
            );
        }
        console.log("Expenses seeded.");

        console.log("Successfully seeded 10 realistic data records per table!");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding DB:", err);
        process.exit(1);
    }
}

seedRealData();
