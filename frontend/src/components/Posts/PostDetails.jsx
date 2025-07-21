import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams,useNavigate,  } from "react-router-dom";
import { getPostAction,deletePostAction } from "../../redux/slices/posts/postSlices";
import LoadingComponent from "../Alert/LoadingComponent";
import ErrorMsg from "../Alert/ErrorMsg";
import AddComment from "../Comments/AddComment";

import PostStats from "./PostStats";
import { CheckBadgeIcon, TrashIcon } from "@heroicons/react/24/solid"; // Import Icons

const PostDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { postId } = useParams();
  
  const { post, error, loading ,success} = useSelector((state) => state?.posts);
  const { userAuth } = useSelector((state) => state?.users);
  const comment = useSelector((state) => state?.comments);
  //console.log(comment);
  useEffect(() => {
    dispatch(getPostAction(postId));
   // console.log(post?.onePost);
  }, [dispatch, postId,post?.onePost?.likes?.length,post?.onePost?.dislikes?.length,post?.onePost?.comments?.length]);
 //console.log(post?.onePost?.comments);
  //! Delete post handler
  const deletePostHandler = () => {
    dispatch(deletePostAction(postId)); 
    if (success) {
        navigate("/posts");
    }
   };


  const creator = post?.onePost?.postOwner?._id?.toString();

    //! Get the login id of the user
    const loginUser = userAuth?.userInfo?._id?.toString();

    //! Check whether login user is the creator
    const isCreator = creator === loginUser;


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
      {loading && <LoadingComponent />}
     {/* // {error && <ErrorMsg message={error} />} */}

      {!loading && !error && post?.onePost && (
        <>
          {/* Author Info and Creation Date */}
          <div className="w-full max-w-4xl mb-8">
            <div className="flex items-center">
              {/* Profile Image */}
              <img
                className="w-16 h-16 rounded-full mr-4 object-cover"
                src={
                  post.onePost?.postOwner?.profilePhoto ||
                  "https://cdn.pixabay.com/photo/2015/01/08/18/29/entrepreneur-593358_1280.jpg"
                }
                alt={post.onePost?.postOwner?.username || "Unknown User"}
              />

              {/* Name and Date Section */}
              <div>
                {/* Username and Verified Badge in One Line */}
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {post.onePost?.postOwner?.username || "Unknown User"}
                  </p>

                  {/* Verified Badge (Only If Verified) */}
                  {post?.onePost?.postOwner?.isVerified && (
                    <CheckBadgeIcon className="w-5 h-5 text-blue-500" />
                  )}
                </div>

                {/* Post Created Date Below the Username */}
                <p className="text-sm text-gray-600">
                  Posted on{" "}
                  {new Date(
                    post.onePost?.createdAt || "2023-10-01T12:00:00Z"
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Post Title */}
          <div className="w-full max-w-4xl mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              {post.onePost?.title || "Untitled Post"}
            </h1>
          </div>

          {/* Post Image with Delete Icon */}
          <div className="relative w-full max-w-4xl mb-8">
            {/* Delete Icon Positioned in the Top-Right Corner */}
            {isCreator&&(<button
              className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition duration-200"
              onClick={deletePostHandler}
            >
              <TrashIcon className="w-6 h-6" />
            </button>)}
            

            <img
              className="w-full h-auto rounded-lg shadow-lg"
              src={
                post.onePost?.image ||
                "https://cdn.pixabay.com/photo/2023/02/21/20/37/dandelion-7805073_960_720.jpg"
              }
              alt="Post"
            />
          </div>

          {/* Post Description */}
          <div className="w-full max-w-4xl">
            <p className="text-xl text-gray-700 leading-relaxed">
              {post.onePost?.description || "No description available."}
            </p>
          </div>

          {/* Post Stats */}
          <PostStats
            views={post?.onePost?.postViews.length}
            likes={post?.onePost?.likes.length}
            dislikes={post?.onePost?.dislikes.length}
            totalComments={post?.onePost?.comments?.length}
            createdAt={post?.onePost?.createdAt}
            postId={post?.onePost?._id}
          />
          

          
        </>
        
      )}
      {/* <h3 className="mb-4 text-2xl font-semibold md:text-3xl text-coolGray-800">
     Add a comment 
 </h3> */}
   {/* Comment form */}
   <div className="w-full flex justify-center">
  <div className="w-full md:w-1/2">
  
    <AddComment comments={post?.onePost?.comments}/>
  </div>
</div>
        
      
    </div>
  );
};

export default PostDetail;
