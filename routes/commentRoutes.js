const express = require('express');
const commentRoutes = express.Router();

//Middlewares
const { authGuard } = require('../middleware/authMiddleware');

//Controllers
const { createComment, updateComment, deleteComment } = require('../controllers/commentController');

commentRoutes.route('/')
.post(authGuard, createComment)
.put(authGuard, updateComment);

commentRoutes.delete('/:commentID', authGuard, deleteComment);

module.exports = commentRoutes;