const express = require('express');
const userRoutes = express.Router();

//Controllers
const {
    userRegister, 
    userLogin, 
    userProfile, 
    userUpdate, 
    updateProfilePicture
} = require('../controllers/userController');

//Middlewares
const { authGuard } = require('../middleware/authMiddleware');

// const bodyParser = require('body-parser');
// userRoutes.use(bodyParser.urlencoded({ extended: true }));

userRoutes.post('/register', userRegister);
userRoutes.post('/login', userLogin);
userRoutes.get('/profile', authGuard, userProfile);
userRoutes.put('/updateProfile', authGuard, userUpdate);
userRoutes.put('/updateProfilePicture', authGuard, updateProfilePicture);

module.exports = userRoutes;