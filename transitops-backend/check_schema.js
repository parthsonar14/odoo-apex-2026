const pool = require('./config/db');

async function checkSchema() {
  const [rows] = await pool.execute('DESCRIBE Users');
  console.log(rows);
  process.exit(0);
}
checkSchema();
