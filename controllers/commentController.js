const Post = require('../models/post');
const Comment = require('../models/comment');


const createComment = async (req, res, next) => {
    try {
        const {desc, slug, parent, replyOnUser} = req.body;
        const post = await Post.findOne({slug:slug});
        if(!post){
            const error = new Error("Post was not found.");
            return next(error);
        }
        const comment = new Comment({
            user: req.user._id,
            desc,
            post: post._id,
            parent,
            replyOnUser,
        });
        const createdComment = await comment.save();
        return res.json(createdComment);
    } catch (error) {
        next(error);
    }
}

const updateComment = async (req, res, next) => {
    try {
        const {desc, _id} = req.body;
        const comment = await Comment.findOne({_id});
        if(!comment){
            const error = new Error("Comment was not found.");
            return next(error);
        }
        comment.desc = desc || comment.desc;
        const updatedComment = await comment.save();
        return res.json(updatedComment);
    } catch (error) {
        next(error);
    }
}

const deleteComment = async (req, res, next) => {
    try {
        const _id = req.params.commentID;
        const comment = await Comment.findByIdAndDelete(_id);
        await Comment.deleteMany({parent: comment._id})
        return res.json({message:"Comment has been deleted successfully."});
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createComment,
    updateComment,
    deleteComment
};
