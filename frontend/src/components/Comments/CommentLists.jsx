import React,{ useEffect } from "react";

const CommentsList = ({ comments }) => {
  
  useEffect(() => {
    // This runs every time the 'comments' prop changes
    console.log("Comments updated", comments);
  }, [comments]);

  return (
    <div className="space-y-6">
      {comments?.map((comment) => (
        <div key={comment._id} className="flex space-x-4">
          <div className="flex-shrink-0">
            <img
              src={comment?.author?.avatar || "https://placehold.co/50x50"}
              alt="avatar"
              className="rounded-full h-10 w-10 object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-semibold text-gray-900">
                  {comment?.author?.username}
                </h4>
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-700">{comment.message}</p>
            </div>
            
            {/* Optional reply/like actions */}
            <div className="mt-2 flex space-x-4 text-xs text-gray-500">
              <button className="hover:text-gray-700">Like</button>
              <button className="hover:text-gray-700">Reply</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentsList;