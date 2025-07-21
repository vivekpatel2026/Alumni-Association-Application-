import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicPostAction } from "../../redux/slices/posts/postSlices";
import {
  resetErrorAction,
  resetSuccessAction,
} from "../../redux/slices/globalSlice/globalSlice";
import { useNavigate } from "react-router-dom";

export default function PublicPosts() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { posts, error, loading, success } = useSelector(
    (state) => state?.posts
  );

  useEffect(() => {
    dispatch(fetchPublicPostAction());
  }, [dispatch]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(resetSuccessAction());
        dispatch(resetErrorAction());
      }, 1000);

      return () => clearTimeout(timer); // Cleanup function
    }
  }, [success, error, dispatch]);

  const post = posts?.posts || [];

  return (
    <div className="p-8">
      {success && <p className="text-green-500">{success}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
        {post.map((post) => (
          <Card
            key={post.id}
            className="w-full max-w-sm mx-auto shadow-lg rounded-lg p-4 flex flex-col h-full 
            transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl"
          >
            <CardHeader
              color="blue-gray"
              className="relative h-56 rounded-t-lg overflow-hidden"
            >
              <img
                src={
                  post.image ||
                  "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                }
                alt={post.title}
                className="w-full h-full object-cover rounded-t-lg transition-transform duration-300 ease-in-out hover:scale-110"
              />
            </CardHeader>
            <CardBody className="p-4 flex-grow">
              <Typography
                variant="h5"
                color="blue-gray"
                className="mb-2 font-semibold"
              >
                {post.title}
              </Typography>
              <Typography className="text-gray-600 truncate w-full overflow-hidden whitespace-nowrap">
                {post.description}
              </Typography>
            </CardBody>
            <CardFooter className="mt-auto pt-2 flex justify-start">
              <Button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg transition-transform duration-200 hover:scale-110"
                onClick={() => navigate(`/posts/${post._id}`)}
              >
                Read More
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
