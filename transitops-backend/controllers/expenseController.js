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

exports.updateExpense = async (req, res) => {
    const { expense_type, amount, description, expense_date, trip_id } = req.body;
    try {
        const [expenses] = await pool.execute('SELECT id FROM Expenses WHERE id = ?', [req.params.id]);
        if (expenses.length === 0) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        const query = `
            UPDATE Expenses SET 
                expense_type = COALESCE(?, expense_type),
                amount = COALESCE(?, amount),
                description = COALESCE(?, description),
                expense_date = COALESCE(?, expense_date),
                trip_id = COALESCE(?, trip_id)
            WHERE id = ?
        `;

        await pool.execute(query, [
            expense_type || null,
            amount || null,
            description || null,
            expense_date || null,
            trip_id || null,
            req.params.id
        ]);

        res.json({ message: 'Expense updated successfully' });
    } catch (error) {
        console.error('Error updating expense:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
