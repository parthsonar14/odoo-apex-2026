const pool = require('../config/db');

exports.getAllUsers = async (req, res) => {
    try {
        const query = `
            SELECT u.id, u.full_name, u.email, u.phone, u.role_id, u.permissions, r.role_name 
            FROM Users u 
            LEFT JOIN Roles r ON u.role_id = r.id
        `;
        const [users] = await pool.execute(query);
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role_id, permissions } = req.body;

        if (!role_id) {
            return res.status(400).json({ message: 'role_id is required' });
        }

        let query = 'UPDATE Users SET role_id = ?';
        let params = [role_id];

        if (permissions) {
            query += ', permissions = ?';
            params.push(JSON.stringify(permissions));
        }

        query += ' WHERE id = ?';
        params.push(id);

        const [result] = await pool.execute(query, params);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User role updated successfully' });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
