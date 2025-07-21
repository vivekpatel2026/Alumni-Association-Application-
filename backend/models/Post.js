const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: true
      },
      description:{
         type: String,
         required: true
      },

      
      image: {
         type: String,
         required: true
      },
      claps: {
         type: Number,
         default: 0
      },
      
      postOwner: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true
      },
      shares: {
         type: Number,
         default: 0
      },
      postViews:  [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
      
      likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
      dislikes: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
         }
      ],
      comments: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
         }
      ]
   },
   {
      timestamps: true
   }
);

// Convert schema to model
const Post = mongoose.model("Post", postSchema);
module.exports = Post;
