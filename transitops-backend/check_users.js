const pool = require('./config/db');
async function check() {
  const [users] = await pool.execute('SELECT email, role_id FROM Users');
  console.log(users);
  process.exit();
}
check();
