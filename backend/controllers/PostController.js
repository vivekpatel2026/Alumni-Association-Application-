const Post = require("../models/Post");
const User = require("../models/User");

//! Create a new post by an Alumni
//@private route
exports.newPost = async (req, resp, next) => {
   
    
    try {
        const { title, description} = req.body;
        const image=req?.file?.path;
        
        const newPost = new Post({ title,description, postOwner: req.userAuth._id,image});
        const savedPost = await newPost.save();

        // update in user
      

        console.log(savedPost._id);
        await User.findByIdAndUpdate(
            req.userAuth._id,
            { $push: { posts: savedPost._id } },
            { new: true, useFindAndModify: false }
        );

        resp.json({
            status: "success",
            message: "New Post created successfully",
            post: savedPost,
        });

    } catch (error) {
        next(error);
    }
};

//! getOne Post
//@private access
exports.getOnePost = async (req, resp, next) => {
    let id = req.params.id;
    let userId = req.userAuth._id; // Extracting the logged-in user's ID

    try {
        const onePost = await Post.findById(id)
        .populate("postOwner")
        .populate({
            path: "comments",
            populate: {
                path: "author", // Assuming authorId is the reference to the user model
                model: "User"
            }
        });

        if (!onePost) {
            let error = new Error("Post Not Found");
            throw error;
        }

        // Ensure the postViews array does not contain duplicate user IDs
        if (!onePost.postViews.includes(userId.toString())) {
            onePost.postViews.push(userId);
            await onePost.save();
        }

        resp.json({
            status: "success",
            message: "Return Single Post Successfully",
            onePost
        });

    } catch (error) {
        next(error);
    }
};


// Getting All post of the Login User
// private Route only Login user can see all the post
exports.getAllPosts = async (req, res, next) => {
    try {
       

        //* Get the current logged-in user ID
        const currentUserId = req.userAuth._id;

        //* Find all users who have blocked the logged-in user
        const usersBlockingCurrentUser = await User.find({
            blockedUsers: currentUserId,
        });

        //* Extract the IDs of users who have blocked the logged-in user (default to an empty array if none)
        const blockingUsersIds = usersBlockingCurrentUser?.map((user) => user?._id) || [];

        //* Extract posts whose author is not in blockingUsersIds
        const query = {
            author: { $nin: blockingUsersIds },
        };

        // Fetch all posts using the query and populate the author's information
        const allPosts = await Post.find(query);

        // Return the response with all the posts
        res.status(200).json({
            status: "success",
            message: "All posts successfully fetched",
            allPosts,
        });
    } catch (error) {
        next(error); // Handle any errors that occur during the operation
    }
};

// Deleting a post by ID for the logged-in user
// Private Route, only logged-in users can delete their own posts
exports.deletePost = async (req, resp, next) => {
    try {
        // Get the post ID from the URL parameters
        const postId = req.params.id;
       

        // Find and delete the post by ID
        const post = await Post.findById(postId);

        const isAuthor =
        req.userAuth?._id?.toString() === post?. postOwner?._id?.toString();

        if (!isAuthor) {
            throw new Error("Action denied, you are not the creator of this post");
        }
         const deletePost=await Post.findByIdAndDelete(postId);
    
        // If the post exists and is deleted successfully
        if (post) {
            resp.json({
                status: "success",
                message: "Post successfully deleted",
                deletePost
            });
        } else {
            // If no post is found with the given ID
            resp.json({
                status: "failure",
                message: "No post available for the given ID"
            });
        }
    } catch (error) {
        next(error); // Catch any errors and pass them to the error handling middleware
    }
};

//@desc Update Post
//@route PUT /api/v1/posts/:id
//@access private
exports.updatePost = async (req, resp, next) => {
    try {
        // Get the post ID from the URL parameters
        const postId = req.params.id;

        // Get the updated post details from the request body
        const postData = req.body;

        // Find and update the post in the database
        const updatedPost = await Post.findByIdAndUpdate(postId, postData, {
            new: true, // Return the updated post
            runValidators: true, // Ensure data validation is applied
        });

        // If the post is found and updated, return the updated post
        if (updatedPost) {
            resp.json({
                status: "success",
                message: "Post successfully updated",
                onePost:updatedPost,
            });
        } else {
            // If no post is found with the provided ID
            resp.json({
                status: "failure",
                message: "Post not found with the given ID",
            });
        }
    } catch (error) {
        next(error); // Pass any errors to the error handler middleware
    }
};

//@desc   Liking a Post
//@route  PUT /api/v1/posts/like/:postId
//@access Private
exports.likePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const currentUserId = req.userAuth._id;

        // Find and update in a single operation
        const updatedPost = await Post.findOneAndUpdate(
            { _id: postId },
            {
                $addToSet: { likes: currentUserId }, // Add to likes if not present
                $pull: { dislikes: currentUserId }   // Remove from dislikes if present
            },
            { new: true } // Return the updated document
        );

        if (!updatedPost) {
            return next(new Error("Post not found"));
        }

        res.status(200).json({ 
            message: "Post liked successfully.",
            onePost: updatedPost 
        });
    } catch (error) {
        next(error);
    }
};

exports.dislikePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const currentUserId = req.userAuth._id;

        // Find and update in a single operation
        const updatedPost = await Post.findOneAndUpdate(
            { _id: postId },
            {
                $addToSet: { dislikes: currentUserId }, // Add to dislikes if not present
                $pull: { likes: currentUserId }         // Remove from likes if present
            },
            { new: true } // Return the updated document
        );

        if (!updatedPost) {
            return next(new Error("Post not found"));
        }

        res.status(200).json({ 
            message: "Post disliked successfully.",
            onePost: updatedPost 
        });
    } catch (error) {
        next(error);
    }
};

//@desc  Get only 6 posts
//@route GET /api/v1/posts
//@access PUBLIC

exports.getPublicPosts = async (req, res) => {
    const posts = await Post.find({}).sort({ createdAt: -1 }).limit(6);

    res.status(201).json({
        status: "success",
        message: "Posts successfully fetched",
        posts,
    });
};
