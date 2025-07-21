const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const sendVarificationEmail = require("../utils/sendVarificationEmail.js");

//@desc Register a new user
//@route POST /api/v1/users/register
//@access public
/**
 * Registers a new user with the given username, email, and password.
 * Hashes the password using bcrypt and saves the new user to the database.
 */
exports.register = async (req, resp, next) => {
  try {
    const { username, password, email } = req.body;
    
    // Check if the user already exists
    const user = await User.findOne({ username });
    if (user) {
      throw new Error("User Already Existing");
    }
    
    // Create a new user object
    const newUser = new User({ username, email, password });
    
    // Hash the password before saving it
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    
    // Save the new user
    await newUser.save();
    
    // Send response with user details
    resp.json({
      status: "success",
      message: "User registered successfully",
      _id: newUser?.id,
      username: newUser?.username,
      email: newUser?.email,
      role: newUser?.role,
    });
  } catch (error) {
    next(error); // Go to Global Error Handler
  }
};

//@desc Login a user
//@route POST /api/v1/users/login
//@access public
/**
 * Logs in an existing user by verifying the provided username and password.
 * If valid, returns a JWT token for authentication in future requests.
 */
exports.login = async (req, resp, next) => {
  try {
    const { username, password } = req.body;
    
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    
    // Compare provided password with hashed password in the database
    let isMatched = await bcrypt.compare(password, user?.password);
    if (!isMatched) {
      throw new Error("Invalid credentials");
    }
    
    // Update last login date and save the user
    user.lastLogin = new Date();
    await user.save();
    
    // Send response with user data and JWT token
    resp.json({
      status: "success",
      email: user?.email,
      _id: user?._id,
      username: user?.username,
      role: user?.role,
      token: generateToken(user),
    });
  } catch (error) {
    next(error); // Go to Global Error Handler
  }
};

//@desc View user profile
//@route GET /api/v1/users/profile/:id
//@access private
/**
 * Fetches the profile of the logged-in user based on the provided user ID.
 * Requires authentication (user must be logged in).
 */
exports.getProfile = async (req, resp, next) => {
  try {
    // Fetch user profile by ID from the authenticated user's data
    const user = await User.findById(req.userAuth._id);
    
    // Send response with user profile data
    resp.json({
      status: "success",
      message: "Profile fetched",
      user,
    });
  } catch (error) {
    next(error); // Go to Global Error Handler
  }
};

//@desc to block user
//@route put /api/v1/users/block-user/:id
//@access private
/**
 * Fetches the profile of the logged-in user based on the provided user ID.
 * Requires authentication (user must be logged in).
 */
exports.blockUser = async (req, res, next) => {
  try {
      // Get the logged-in user
      const logInUser = await User.findById(req.userAuth._id);

      // Get the user to be blocked
      const accountToBeBlocked = await User.findById(req.params.id);

      // Check if the user to be blocked exists
      if (!accountToBeBlocked) {
          return res.status(404).json({
              status: "error",
              message: "User not found",
          });
      }

      //! Prevent self-blocking
      if (logInUser._id.toString() === accountToBeBlocked._id.toString()) {
          const error = new Error("Cannot block yourself!");
          error.statusCode = 400; // Bad request
          throw error;
      }

      //! Check if the user is already blocked
      if (logInUser.blockedUsers.includes(accountToBeBlocked._id)) {
          const error = new Error("This user has already been blocked!");
          error.statusCode = 400; // Bad request
          throw error;
      }

      //! Block the user
      logInUser.blockedUsers.push(accountToBeBlocked._id); // Use the user's ID to avoid storing full user objects
      await logInUser.save();

      // Respond with success
      res.json({
          status: "success",
          message: "User blocked successfully",
      });
  } catch (error) {
      // Handle errors and pass them to the next middleware
      next(error);
  }
};

//@desc to block user
//@route put /api/v1/users/unblock-user/:id
//@access private
/**
 * Fetches the profile of the logged-in user based on the provided user ID.
 * Requires authentication (user must be logged in).
 */

exports.unBlockUser = async (req, res, next) => {
  try {
      // Get the logged-in user
      const logInUser = await User.findById(req.userAuth._id);

      // Get the user to be unblocked
      const accountToBeUnblocked = await User.findById(req.params.id);

      // Check if the user to be unblocked exists
      if (!accountToBeUnblocked) {
          return res.status(404).json({
              status: "error",
              message: "User not found",
          });
      }

      //! Check if the user is actually blocked
      const isBlocked = logInUser.blockedUsers.some(
          (blockedUser) => blockedUser._id.equals(accountToBeUnblocked._id)
      );

      if (!isBlocked) {
          const error = new Error("This user is not in your blocked list!");
          error.statusCode = 400; // Bad request
          throw error;
      }

      //! Unblock the user
      logInUser.blockedUsers = logInUser.blockedUsers.filter(
          (blockedUser) => !blockedUser._id.equals(accountToBeUnblocked._id)
      );

      await logInUser.save();

      // Respond with success
      res.json({
          status: "success",
          message: "User unblocked successfully",
      });
  } catch (error) {
      // Handle errors and pass them to the next middleware
      next(error);
  }
};


//@desc to follow user
//@route put /api/v1/users/view-another-profile/:id
//@access private
exports.viewProfile = async (req, res, next) => {
  try {
    // Fetch user profile by ID
    const userProfile = await User.findById(req.params.id);

    // If userProfile is not found, throw an error
    if (!userProfile) {
      let error = new Error("User whose profile is to be viewed not present!");
      return next(error);
    }

    const currentUserId = req?.userAuth?._id;

    // Check if the current user has already viewed the profile
    if (userProfile.profileViewers.includes(currentUserId)) {
      let error = new Error("You have already viewed the profile!");
      return next(error);
    }

    // Push the current user ID into the profileViewers array
    userProfile.profileViewers.push(currentUserId);

    // Save the updated user profile
    await userProfile.save();

    // Return the response
    res.json({
      status: "success",
      message: "Profile successfully viewed",
    });
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
};


//@desc to follow user
//@route put /api/v1/users/follow-to-user/:id
//@access private
exports.follow = async (req, res, next) => {
  try {
    // Prevent users from following themselves
    if (req.userAuth._id.toString() === req.params.id.toString()) {
      return res.status(400).json({
        status: "error",
        message: "You cannot follow yourself!",
      });
    }

    // Get the logged-in user
    const loginUser = await User.findById(req.userAuth._id);

    // Get the user to be followed
    const userToBeFollowed = await User.findById(req.params.id);

    //! Check if the user to be followed exists
    if (!userToBeFollowed) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    //! Check if the user is already being followed
    if (loginUser.following.includes(userToBeFollowed._id)) {
      return res.status(400).json({
        status: "error",
        message: "This user has already been followed!",
      });
    }

    //! Update the following and followers arrays using MongoDB's `$addToSet`
    await User.findByIdAndUpdate(
      req.userAuth._id,
      { $addToSet: { following: userToBeFollowed } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { followers: loginUser} },
      { new: true }
    );

    // Respond with success
    res.json({
      status: "success",
      message: "User followed successfully",
    });
  } catch (error) {
    // Handle errors and pass them to the next middleware
    next(error);
  }
};


//@desc to follow user
//@route put /api/v1/users/unfollow-to-user/:id
//@access private

exports.unFollow = async (req, res, next) => {
  try {
    // Prevent users from unfollowing themselves
    if (req.userAuth._id === req.params.id) {
      return res.status(400).json({
        status: "error",
        message: "You cannot unfollow yourself!",
      });
    }

    // Get the logged-in user
    const loginUser = await User.findById(req.userAuth._id);

    // Get the user to be unfollowed
    const userToBeUnfollowed = await User.findById(req.params.id);

    //! Check if the user to be unfollowed exists
    if (!userToBeUnfollowed) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    //! Check if the user is not currently being followed
    if (!loginUser.following.includes(userToBeUnfollowed._id)) {
      return res.status(400).json({
        status: "error",
        message: "You are not following this user!",
      });
    }

    //! Update the following and followers arrays using MongoDB's `$pull`
    await User.findByIdAndUpdate(
      req.userAuth._id,
      { $pull: { following: userToBeUnfollowed._id } }, // Remove from following
      { new: true }
    );

    await User.findByIdAndUpdate(
      req.params.id,
      { $pull: { followers: loginUser._id } }, // Remove from followers
      { new: true }
    );

    // Respond with success
    res.json({
      status: "success",
      message: "User unfollowed successfully",
    });
  } catch (error) {
    // Handle errors and pass them to the next middleware
    next(error);
  }
};

  /// @route   POST /api/v1/users/forgot-password
  // @desc   Forgot password
  // @access  Public
exports.forgetPassword = async (req, res, next) => {
    try {
      const { email } = req.body;
  
      // Check if the email exists in the database
      const userFound = await User.findOne({ email });
      if (!userFound) {
        const error = new Error("This email is not registered with us");
        error.statusCode = 404; // Set appropriate status code
        return next(error); // Pass the error to the error-handling middleware
      }
  
      // Generate a reset token for the user
      const resetToken = await userFound.genrateForgetPasswordResetTokan();
  
      // Save the user with the new reset token
      await userFound.save();
      console.log(resetToken);
      // Send the reset token via email
      await sendEmail(email,resetToken);
  
      // Send success response to the client
      res.status(200).json({
        status: "success",
        message: "Password reset token sent successfully.",
      });
    } catch (error) {
      // Pass any errors to the error-handling middleware
      next(error);
    }
};


/// @route   POST /api/v1/users/reset-password/:resetTokan
// @desc   Forgot password
// @access  Public
exports.resetPassword = async (req,res,next) => {
  try {
    // Extract the new password from the request body
    const { password } = req.body;
    
    // Extract the resetToken from the route parameters
    const  {resetToken} = req.params;


    if (!password || !resetToken) {
      return res.status(400).json({ error: "Password and reset token are required" });
    }

    // Convert the reset token into its hashed form for comparison
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Find the user by the hashed token and ensure the token is not expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }, // Check if the token is still valid
    });

    if (!user) {
      return res.status(400).json({ error: "Password reset token is invalid or has expired" });
    }

    // Generate salt and hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear the reset token and its expiration time
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // Save the updated user to the database
    await user.save();

    // Respond with a success message
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    // Pass the error to the error-handling middleware
    next(error);
  }
};

/// @route   Put /api/v1/users/account-varification-email
// @desc  Send Account Varification Mail 
// @access  private
exports.verificationEmail = async (req, res, next) => {
  try {
    // Get the current logged-in user using their ID
    const currentUser = await User.findById(req.userAuth._id);

    // Check if the user exists
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate an account verification token for the user
    const verificationToken = await currentUser.generateAccountVerificationToken();

    // Save the updated user with the verification token
    await currentUser.save();

    // Send the verification email to the user's email address
    sendVarificationEmail(currentUser.email, verificationToken);

    // Respond with a success message
    res.status(200).json({
      message: `Account verification email sent to ${currentUser.email}`,
    });
  } catch (error) {
    // Pass the error to the error-handling middleware
    next(error);
  }
};
 
///GET /api/v1/users/verify-account/:verificationToken
// @desc    Verify user's account using the verification token
// @access  private
 
exports.verifyAccount = async (req, res, next) => {
  try {
    // Extract the verification token from the route parameters
    const { verificationToken } = req.params;

    // Ensure the verification token is provided
    if (!verificationToken) {
      return res.status(400).json({ error: "Verification token is required" });
    }

    // Convert the token into its hashed form for secure comparison
    const hashedVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    // Find the user by the hashed token and ensure the token is still valid
    const user = await User.findOne({
      accountVerificationToken: hashedVerificationToken,
      accountVerificationExpires: { $gt: Date.now() }, // Ensure the token is not expired
    });

    // If no user is found, or the token is invalid/expired, return an error
    if (!user) {
      return res.status(400).json({ error: "Verification token is invalid or has expired" });
    }

    // Mark the user's account as verified (adjust based on your schema)
    user.isVerified = true;

    // Clear the verification token and its expiration time
    user.accountVerificationToken = undefined;
    user.accountVerificationExpires = undefined;

    // Save the updated user to the database
    await user.save();

    // Respond with a success message
    res.status(200).json({ message: "Account verified successfully" });
  } catch (error) {
    // Handle unexpected errors
    next(error);
  }
};