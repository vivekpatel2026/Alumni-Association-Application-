const express = require("express");
const postRoutes = express.Router();
const multer=require("multer");

const isLoggedIn = require("../../middleware/isLoggedIn");
const { newPost, getOnePost, getAllPosts, deletePost, updatePost, likePost, dislikePost, getPublicPosts } = require("../../controllers/PostController");
const storage =require("../../utils/fileUpload");
const upload =multer({ storage });
//!  New Post Create
postRoutes.post("/",isLoggedIn,upload.single("file"),newPost);
//! get the 6 public post 
postRoutes.get("/public",getPublicPosts)

//! Get One Post
postRoutes.get("/:id",isLoggedIn,getOnePost);

//! Get All Post
postRoutes.get("/",isLoggedIn,getAllPosts);

//! delete the post
postRoutes.delete("/:id",isLoggedIn,deletePost);

//! Update the post
postRoutes.put("/:id",isLoggedIn,updatePost);

//! Like post
postRoutes.put("/like/:id",isLoggedIn,likePost);

//! dislike post
postRoutes.put("/dislike/:id",isLoggedIn,dislikePost);

module.exports=postRoutes;