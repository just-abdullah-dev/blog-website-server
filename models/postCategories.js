const mongoose = require('mongoose');

const postCategoriesSchema = new mongoose.Schema(
    { name: { type: String, required: true }, },
    { timestamps: true }
)

const PostCategories = mongoose.model("PostCategories", postCategoriesSchema);
module.exports = PostCategories;
