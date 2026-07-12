const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const signup = async (req, res) => {
    const { full_name, email, password, role_id, phone } = req.body;

    if (!full_name || !email || !password || !role_id) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const [existingUsers] = await pool.execute('SELECT email FROM Users WHERE email = ?', [email]);
        
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const query = `
            INSERT INTO Users (role_id, full_name, email, password, phone, status)
            VALUES (?, ?, ?, ?, ?, 'Active')
        `;
        
        await pool.execute(query, [role_id, full_name, email, hashedPassword, phone || null]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    try {
        const [users] = await pool.execute('SELECT * FROM Users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        // Allow plain-text password match just in case user manually inserted it into MySQL
        if (!isMatch && password !== user.password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (user.status !== 'Active') {
            return res.status(403).json({ message: 'User account is inactive' });
        }

        const token = jwt.sign(
            { id: user.id, role_id: user.role_id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role_id: user.role_id
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    signup,
    login
};
