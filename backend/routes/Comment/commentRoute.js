const express=require("express");
const commentRoute=express.Router();


const isLoggedIn=require("../../middleware/isLoggedIn");
const { newComment,deleteComment } = require("../../controllers/CommentController");

commentRoute.post("/:id",isLoggedIn,newComment);

commentRoute.delete("/:id",isLoggedIn,deleteComment);

module.exports=commentRoute;