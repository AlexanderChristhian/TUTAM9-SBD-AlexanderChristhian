const express = require('express');
const scoreController = require('../controllers/scoreController');

module.exports = () => {
    const router = express.Router();

    router.post('/add', scoreController.addScore);
    router.get('/user/:user_id', scoreController.getUserScores);
    router.get('/leaderboard', scoreController.getLeaderboard);
    router.get('/:id', scoreController.getScore);
    router.put('/', scoreController.updateScore);
    router.delete('/:id', scoreController.deleteScore);
    
    return router;
};
