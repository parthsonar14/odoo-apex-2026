const pool = require('./config/db');

async function migrate() {
    try {
        console.log("Adding permissions column to Users table...");
        
        const [columns] = await pool.execute(`SHOW COLUMNS FROM Users LIKE 'permissions'`);
        
        if (columns.length === 0) {
            // Add column without DEFAULT
            await pool.execute(`ALTER TABLE Users ADD COLUMN permissions JSON`);
            
            const defaultPerms = JSON.stringify({
                Dashboard: true,
                Vehicles: true,
                Drivers: true,
                Trips: true,
                Maintenance: true,
                FuelExpenses: true,
                Reports: true,
                Users: true
            });
            // Update all existing rows
            await pool.execute(`UPDATE Users SET permissions = ?`, [defaultPerms]);
            console.log("Column added successfully!");
        } else {
            console.log("Column already exists.");
        }
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        process.exit();
    }
}

migrate();
