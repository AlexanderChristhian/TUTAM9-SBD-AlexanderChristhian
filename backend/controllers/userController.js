const pool = require('../database/pg-database'); // Import the pool module
const bcrypt = require('bcrypt');

const registerUser = async (req, res, next) => {
    // Properly extract data from all possible sources
    const username = req.body?.username || req.query?.username || req.params?.username;
    const email = req.body?.email || req.query?.email || req.params?.email;
    const password = req.body?.password || req.query?.password || req.params?.password;

    // Validate that we have all required data
    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Username, email and password are required",
            payload: null,
        });
    }

    try {
        // Check if email is already used
        const existingEmail = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingEmail.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already used",
                payload: null,
            });
        }
        
        // Check if username is already taken
        const existingUsername = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (existingUsername.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Username already taken",
                payload: null,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10); 
        
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );
        
        // Don't include password_hash in the response
        const user = result.rows[0];
        delete user.password_hash;
        
        res.status(201).json({
            success: true,
            message: "User created",
            payload: user,
        });
    } catch (error) {
        next(error); // Pass error to centralized error handler
    }
}

const loginUser = async (req, res, next) => {
    // Properly extract data
    const email = req.body?.email || req.query?.email || req.params?.email;
    const password = req.body?.password || req.query?.password || req.params?.password;

    // Validate data
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required",
            payload: null,
        });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
                payload: null,
            });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
                payload: null,
            });
        }

        // Don't include password_hash in the response
        delete user.password_hash;

        res.json({
            success: true,
            message: "Login successful",
            payload: user,
        });
    } catch (error) {
        next(error);
    }
};

const findUser = async (req, res, next) => {
    const email = req.body?.email || req.query?.email || req.params?.email;
    
    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required",
            payload: null,
        });
    }
    
    try {
        const result = await pool.query('SELECT id, username, email, created_at FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                payload: null,
            });
        }
        res.json({
            success: true,
            message: "User found",
            payload: result.rows,
        });
    } catch (error) {
        next(error);
    }
}

const updateUser = async (req, res, next) => {
    const id = req.body?.id || req.query?.id || req.params?.id;
    const username = req.body?.username || req.query?.username || req.params?.username;
    const email = req.body?.email || req.query?.email || req.params?.email;
    const password = req.body?.password || req.query?.password || req.params?.password;
    
    if (!id || !username || !email) {
        return res.status(400).json({
            success: false,
            message: "ID, username and email are required",
            payload: null,
        });
    }
    
    try {
        // Only hash if password is provided
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        
        let result;
        if (hashedPassword) {
            result = await pool.query(
                'UPDATE users SET username = $2, email = $3, password_hash = $4 WHERE id = $1 RETURNING *',
                [id, username, email, hashedPassword]
            );
        } else {
            result = await pool.query(
                'UPDATE users SET username = $2, email = $3 WHERE id = $1 RETURNING *',
                [id, username, email]
            );
        }
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                payload: null,
            });
        }
        
        // Don't include password_hash in the response
        const user = result.rows[0];
        delete user.password_hash;

        res.json({
            success: true,
            message: "User updated",
            payload: user,
        });
    } catch (error) {
        next(error);
    }
}

const deleteUser = async (req, res, next) => {
    const id = req.body?.id || req.query?.id || req.params?.id;
    
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "ID is required",
            payload: null,
        });
    }

    try {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id, username, email, created_at', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                payload: null,
            });
        }
        res.json({
            success: true,
            message: "User deleted",
            payload: result.rows[0],
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { registerUser, loginUser, findUser, updateUser, deleteUser };