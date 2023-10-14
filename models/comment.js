const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user:{type: mongoose.Schema.Types.ObjectId, ref: "User"},
    desc:{type: String, required: true},
    post:{type: mongoose.Schema.Types.ObjectId, ref: "Post"},
    check:{type: Boolean, default: true},
    parent:{
        type: mongoose.Schema.Types.ObjectId, ref:"User", default: null
    },
    replyOnUser:{type: mongoose.Schema.Types.ObjectId, ref: "User", default: null},
},
{timestamps:true, toJSON:{virtuals:true}}
)
commentSchema.virtual("replies",{
    ref: "Comment",
    localField: "_id",
    foreignField: "parent"
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
