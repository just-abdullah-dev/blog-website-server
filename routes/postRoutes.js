const express = require('express');
const postRoutes = express.Router();

//Middlewares
const { authGuard, adminGaurd } = require('../middleware/authMiddleware');

//Controllers
const { createPost, updatePost, deletePost, getPost, getAllPosts, updatePostStatus } = require('../controllers/postControllers');

postRoutes.route('/')
.post(authGuard, adminGaurd, createPost)
.get(getAllPosts);

postRoutes.route('/:slug')
.put(authGuard, adminGaurd, updatePost)
.delete(authGuard, adminGaurd, deletePost)
.get(getPost);

postRoutes.put('/status/:slug', authGuard, adminGaurd, updatePostStatus);

module.exports = postRoutes;