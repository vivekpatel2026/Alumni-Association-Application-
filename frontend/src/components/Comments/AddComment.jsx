import React, { useState } from "react";
import CommentsList from "./CommentLists";
import { useDispatch, useSelector } from "react-redux";
import commentReducer, { createCommentAction } from "../../redux/slices/Comments/commentSlices";
import { useParams  } from "react-router-dom";

const AddComment = ({ onSubmit,comments }) => {
  const state= useSelector((state) => state);
  console.log(state?.comments?.success);
  if(state?.comments?.success===true){
    window.location.reload();
  }
  
  const [commentText, setCommentText] = useState("");
  const { postId } = useParams();
   const dispatch = useDispatch();
    const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    dispatch(createCommentAction({message:commentText.trim(),postId}));
    setCommentText("");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Comments</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <img
                src="https://placehold.co/50x50"
                alt="User avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            
            <div className="flex-1">
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700">
                    Add your comment
                  </h4>
                </div>
                
                <div className="p-4">
                  <label htmlFor="comment" className="sr-only">
                    Your comment
                  </label>
                  <textarea
                    id="comment"
                    rows={3}
                    className="block w-full px-3 py-2 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Write your thoughts here..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center justify-end px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <button
                    onSubmit={handleSubmit}
                    type="submit"
                    disabled={!commentText.trim()}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      commentText.trim()
                        ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    } transition-colors duration-200`}
                  >
                    Post comment
                  </button>
                </div>
              </div>
              
              <p className="mt-2 text-xs text-gray-500">
                Remember to be respectful with your comments.
              </p>
            </div>
          </div>
        </form>
      </div>
	  <CommentsList comments={comments}/>
    </div>
	
  );
};

export default AddComment;