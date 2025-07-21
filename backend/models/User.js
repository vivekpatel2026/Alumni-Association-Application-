const mongoose = require("mongoose");
const crypto=require("crypto");

const userSchema = new mongoose.Schema(
   {
      username: {
         type: String,
         required: true,
         unique: true,
         trim: true
      },
      email: {
         type: String,
         required: true,
      },
      role: {
         type: String,
         enum: ["user", "admin"],
         default: "user"
      },
      password: {
         type: String,
         required: true
      },
      lastLogin: {
         type: Date,
      },
      isVerified: {
         type: Boolean,
         default: false
      },
      accountLevel: {
         type: String,
         enum: ["bronze", "silver", "gold"],
         default: "bronze"
      },
      profilePicture: {
         type: String,
         default: ""
      },
      coverImage: {
         type: String,
         default: ""
      },
      bio: {
         type: String
      },
      joblocation: {
         type: String
      },
      notificationType: {
         email: { type: String, default: "all" } // "all", "mentions", "none"
      },
      gender: {
         type: String,
         enum: ["male", "female", "prefer not to say"]
      },
      graduationYear: {
         type: Number,
        
      },
      degree: {
         type: String,
         
      },
      major: {
         type: String,
         
      },
      currentJob: {
         company: String,
         position: String,
         startDate: Date,
         endDate: Date,
         isCurrent: { type: Boolean, default: true }
      },
      previousJobs: [
         {
            company: String,
            position: String,
            startDate: Date,
            endDate: Date
         }
      ],
      skills: [String],
      profileViewers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
      likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
      jobpost: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
      passwordResetToken: String,
      passwordResetExpires: Date,
      accountVerificationToken: String,
      accountVerificationExpires: Date
   },
   {
      timestamps: true
   }
);
userSchema.methods.genrateForgetPasswordResetTokan = function(){
   //generate token
   const resetToken = crypto.randomBytes(20).toString("hex");
   console.log("reset token", resetToken);

   //Assign the token to passwordResetToken field
   this.passwordResetToken = crypto
       .createHash("sha256")
       .update(resetToken)
       .digest("hex");
   console.log("hashed reset token", this.passwordResetToken);
   //Update the passwordResetExpires and when to expire
   this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //! 10 minutes
   return resetToken;
}

userSchema.methods.genrateAccountVarificationTokan = function(){
   //generate token
   const resetToken = crypto.randomBytes(20).toString("hex");
   console.log("reset token", resetToken);

   //Assign the token to passwordResetToken field
   this.accountVerificationToken = crypto
       .createHash("sha256")
       .update(resetToken)
       .digest("hex");
   console.log("hashed reset token", this.passwordResetToken);
   //Update the passwordResetExpires and when to expire
   this.accountVerificationExpires = Date.now() + 10 * 60 * 1000; //! 10 minutes
   return resetToken;
}

// Convert schema to model
const User = mongoose.model("User", userSchema);
module.exports = User;
