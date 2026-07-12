const { getDashboardKPIs } = require('./controllers/dashboardController');

const req = {
  query: {
    status: 'Available'
  }
};
const res = {
  json: (data) => console.log('KPIs:', data),
  status: (code) => ({ json: (err) => console.error(code, err) })
};

getDashboardKPIs(req, res).then(() => process.exit());
