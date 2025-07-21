const express = require("express");
const userRoutes = express.Router();

const { register, 
           login,
            getProfile,
            blockUser,
            unBlockUser,
             follow, 
             unFollow, 
             viewProfile, 
             forgetPassword, 
             verificationEmail, 
             verifyAccount, 
             resetPassword} = require("../../controllers/UserController");
const isLoggedIn = require("../../middleware/isLoggedIn");

//!  User registration route
userRoutes.post("/register", register);

//! Login route
userRoutes.post("/login", login);

//! Profile route (protected with isLoggedIn middleware)
userRoutes.get("/profile", isLoggedIn, getProfile);

//! to block user
userRoutes.put("/block-user/:id",isLoggedIn,blockUser);

//! to unblock user
userRoutes.put("/unblock-user/:id",isLoggedIn,unBlockUser);

//! to follow user
userRoutes.put("/follow-to-user/:id",isLoggedIn,follow);

//! to unfollow user
userRoutes.put("/unfollow-to-user/:id",isLoggedIn,unFollow);

//! view another user profile
userRoutes.put("/view-another-profile/:id",isLoggedIn,viewProfile)

//! forget passwword Route
userRoutes.put("/forgot-password",forgetPassword);

//! reset password Route
userRoutes.put("/reset-password/:resetToken",resetPassword);

//! account varification Email Route
userRoutes.put("/account-varification-email",isLoggedIn,verificationEmail );

//!  varify account Route
userRoutes.put("/verify-account/:verificationToken",isLoggedIn,verifyAccount );

module.exports = userRoutes;
