const pool = require('../config/db');

exports.createExpense = async (req, res) => {
    try {
        const { vehicle_id, trip_id, expense_type, amount, description, expense_date } = req.body;
        
        const query = `
            INSERT INTO Expenses (vehicle_id, trip_id, expense_type, amount, description, expense_date) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await pool.execute(query, [
            vehicle_id, trip_id || null, expense_type, amount, description || null, expense_date
        ]);

        res.status(201).json({ message: 'Expense created', id: result.insertId });
    } catch (error) {
        console.error('Error creating expense:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const [expenses] = await pool.execute('SELECT * FROM Expenses ORDER BY id DESC');
        res.json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        await pool.execute('DELETE FROM Expenses WHERE id = ?', [req.params.id]);
        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
