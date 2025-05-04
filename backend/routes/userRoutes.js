const express = require('express');
const userController = require('../controllers/userController');

module.exports = () => {
    const router = express.Router();

    router.post('/register', userController.registerUser);
    router.post('/login', userController.loginUser);
    router.get('/:email', userController.findUser);
    router.put('/', userController.updateUser);
    router.delete('/:id', userController.deleteUser);
    
    return router;
};
