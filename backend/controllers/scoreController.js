const pool = require('../database/pg-database'); // Import the pool module

// Add a new score record
const addScore = async (req, res, next) => {
    // Properly extract data from all possible sources
    const user_id = req.body?.user_id || req.query?.user_id || req.params?.user_id;
    const score = req.body?.score || req.query?.score || req.params?.score;

    // Validate inputs
    if (!user_id || !score) {
        return res.status(400).json({
            success: false,
            message: "User ID and score are required",
            payload: null,
        });
    }

    if (isNaN(parseInt(score)) || parseInt(score) < 0) {
        return res.status(400).json({
            success: false,
            message: "Score must be a positive number",
            payload: null,
        });
    }

    try {
        // Verify user exists
        const userExists = await pool.query('SELECT * FROM users WHERE id = $1', [user_id]);
        if (userExists.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                payload: null,
            });
        }

        // Add score record
        const result = await pool.query(
            'INSERT INTO scores (user_id, score) VALUES ($1, $2) RETURNING *',
            [user_id, score]
        );
        
        res.status(201).json({
            success: true,
            message: "Score recorded successfully",
            payload: result.rows[0],
        });
    } catch (error) {
        next(error);
    }
};

// Get all scores for a specific user
const getUserScores = async (req, res, next) => {
    const user_id = req.body?.user_id || req.query?.user_id || req.params?.user_id;

    if (!user_id) {
        return res.status(400).json({
            success: false,
            message: "User ID is required",
            payload: null,
        });
    }

    try {
        // Verify user exists
        const userExists = await pool.query('SELECT * FROM users WHERE id = $1', [user_id]);
        if (userExists.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                payload: null,
            });
        }

        const result = await pool.query(
            'SELECT * FROM scores WHERE user_id = $1 ORDER BY achieved_at DESC',
            [user_id]
        );

        res.json({
            success: true,
            message: "User scores retrieved",
            payload: result.rows,
        });
    } catch (error) {
        next(error);
    }
};

// Get a specific score by id
const getScore = async (req, res, next) => {
    const id = req.body?.id || req.query?.id || req.params?.id;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Score ID is required",
            payload: null,
        });
    }

    try {
        const result = await pool.query('SELECT * FROM scores WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Score not found",
                payload: null,
            });
        }

        res.json({
            success: true,
            message: "Score retrieved",
            payload: result.rows[0],
        });
    } catch (error) {
        next(error);
    }
};

// Update a score entry
const updateScore = async (req, res, next) => {
    const id = req.body?.id || req.query?.id || req.params?.id;
    const score = req.body?.score || req.query?.score || req.params?.score;

    // Validate score
    if (!id || !score) {
        return res.status(400).json({
            success: false,
            message: "Score ID and value are required",
            payload: null,
        });
    }

    if (isNaN(parseInt(score)) || parseInt(score) < 0) {
        return res.status(400).json({
            success: false,
            message: "Score must be a positive number",
            payload: null,
        });
    }

    try {
        const result = await pool.query(
            'UPDATE scores SET score = $2 WHERE id = $1 RETURNING *',
            [id, score]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Score not found",
                payload: null,
            });
        }

        res.json({
            success: true,
            message: "Score updated",
            payload: result.rows[0],
        });
    } catch (error) {
        next(error);
    }
};

// Delete a score entry
const deleteScore = async (req, res, next) => {
    const id = req.body?.id || req.query?.id || req.params?.id;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Score ID is required",
            payload: null,
        });
    }

    try {
        const result = await pool.query(
            'DELETE FROM scores WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Score not found",
                payload: null,
            });
        }

        res.json({
            success: true,
            message: "Score deleted",
            payload: result.rows[0],
        });
    } catch (error) {
        next(error);
    }
};

// Get top scores (leaderboard)
const getLeaderboard = async (req, res, next) => {
    const limit = req.body?.limit || req.query?.limit || req.params?.limit;
    const scoreLimit = limit ? parseInt(limit) : 10; // Default to top 10

    try {
        const result = await pool.query(
            `SELECT s.id, s.score, s.achieved_at, u.id as user_id, u.username 
             FROM scores s 
             INNER JOIN users u ON s.user_id = u.id 
             ORDER BY s.score DESC 
             LIMIT $1`,
            [scoreLimit]
        );

        res.json({
            success: true,
            message: "Leaderboard retrieved",
            payload: result.rows,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { 
    addScore, 
    getUserScores, 
    getScore, 
    updateScore, 
    deleteScore, 
    getLeaderboard 
};

