const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title:{type: String, required: true},
    caption:{type: String, required: true},
    slug:{type: String, required: true, unique: true},
    body:{type: Object, required: true},
    status:{type: Boolean, default: false},
    photo:{type: String, required: false},
    user:{type: mongoose.Schema.Types.ObjectId, ref: "User"},
    tags:{type: [String], required: true},
    categories:{type: mongoose.Schema.Types.ObjectId, ref: "PostCategories"},
},
{timestamps:true, toJSON:{virtuals:true}})

postSchema.virtual("comments",
{
    ref: "Comment",
    localField: "_id",
    foreignField: "post"
})

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
