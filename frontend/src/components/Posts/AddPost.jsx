import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPostAction } from "../../redux/slices/posts/postSlices";
import { resetSuccessAction, resetErrorAction } from "../../redux/slices/globalSlice/globalSlice"; // Import reset actions
import LoadingComponent from "../Alert/LoadingComponent";
import ErrorMsg from "../Alert/ErrorMsg";
import SuccessMsg from "../Alert/SuccessMsg";

export default function AddPost() {
  const dispatch = useDispatch();
  const [postData, setPostData] = useState({
    title: "",
    description: "",
    image: null,
  });

  const { post, error, loading, success } = useSelector((state) => state?.posts);
   // console.log(success);
  // Reset success and error states after a successful post creation
  
  useEffect(() => {
    if (success) {
      // Show the success message for 3 seconds before resetting
      const timer = setTimeout(() => {
        dispatch(resetSuccessAction());
        dispatch(resetErrorAction());
      }, 1000); // 3 seconds delay
       
      // Clear the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData({ ...postData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPostData({ ...postData, image: file });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addPostAction(postData));

    // Reset form
    setPostData({ title: "", description: "", image: null });
    e.target.reset(); // Resets file input field
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <h2 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg transition-transform duration-300 hover:scale-105">
        ✨ Add a New Post ✨
      </h2>

      {/* Error & Success Messages */}
      {error && <ErrorMsg message={error?.message} />}
      {success && <SuccessMsg message="Post Created Successfully!" />}

      <div className="w-full max-w-lg bg-white shadow-lg p-6 rounded-lg border border-gray-300">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter post title"
              value={postData.title}
              onChange={handleChange}
              className="w-full p-4 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium mb-2">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-4 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          {/* Image Preview */}
          {postData.image && (
            <img
              src={URL.createObjectURL(postData.image)}
              alt="Preview"
              className="w-full h-56 object-cover rounded-md mt-2"
            />
          )}

          {/* Description Input */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              placeholder="Enter post description"
              value={postData.description}
              onChange={handleChange}
              className="w-full p-4 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 h-36 resize-none"
              required
            />
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center">
              <LoadingComponent />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-indigo-600 text-white px-6 py-3 rounded-md transition text-lg ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"}`}
          >
            {loading ? "Submitting..." : "Add Post"}
          </button>
        </form>
      </div>
    </div>
  );
}