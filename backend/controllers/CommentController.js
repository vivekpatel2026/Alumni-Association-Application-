const Comment = require("../models/Comments");
const Post = require("../models/Post");

exports.newComment = async (req, res, next) => {
    const postId = req.params.id; 
    const author = req.userAuth._id; // Assuming `req.userAuth` is populated via middleware
    const message = req.body.message;

    try {
        //! Find if the post exists
        const postExist = await Post.findById(postId);
        if (!postExist) {
            const error = new Error("Post does not exist");
            throw(error); 
        }

        //! Create a new comment
        const createComment = new Comment({ message, author, postId });
        const createCommentSuccess = await createComment.save();

        //! Update the post with the comment
        await Post.findByIdAndUpdate(postId, {
            $push: { comments: createCommentSuccess._id },
        });

        //! Respond with success
        res.json({
            status: "success",
            message: "Comment posted successfully",
            comment: createCommentSuccess,
        });
    } catch (error) {
        next(error); 
    }
};
exports.deleteComment = async (req, res, next) => {
    try {
        const commentTobeDelete = req.params.id;

        // Delete the comment from the database
        const deleteComment = await Comment.findByIdAndDelete(commentTobeDelete);

        if (!deleteComment) {
            return res.status(404).json({
                status: "error",
                message: "Comment not found",
            });
        }

        //! Find the associated post
        const updatePost = await Post.findById(deleteComment.postId);

        if (!updatePost) {
            return res.status(404).json({
                status: "error",
                message: "Post not found",
            });
        }

        //! Check if the deleted comment is in the post's comments array and remove it
        updatePost.comments = updatePost.comments.filter((postCommentId) => {
            return postCommentId.toString() !== deleteComment._id.toString();
        });

        //! Save the updated post
        await updatePost.save();

        //! Respond with success
        res.json({
            status: "success",
            message: "Comment deleted successfully",
            deleteComment,
        });
    } catch (error) {
        next(error);
    }
};