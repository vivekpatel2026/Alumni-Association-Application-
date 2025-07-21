import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobAction } from "../../redux/slices/Jobs/jobSlices";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa"; // Import the plus icon from react-icons
import { Link } from "react-router-dom";
export default function Job() {
  const dispatch = useDispatch();
  const { jobs ,error,loading,success} = useSelector((state) => state?.jobs);
  const navigate = useNavigate();
  // console.log(loading);
  // console.log(error);
  // console.log(success);
  
  // Fetch jobs on component mount
  useEffect(() => {
    dispatch(fetchJobAction());
  }, [dispatch]);

  const alljobs = jobs?.alljobs;

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header with Post New Job button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Available Jobs</h1>

          <Link 
          to={"/add-job"}>
          <button
            //onClick={() => navigate("/post-job")} // Adjust the route as needed
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            <FaPlus />
            Post New Job
          </button>
          </Link>
          
        </div>
        
        {/* Jobs list */}
        {alljobs?.length === 0 ? (
          <div className="text-center text-gray-700 text-xl">
            No jobs are currently available.
          </div>
        ) : (
          <div className="space-y-6">
            {alljobs?.map((job, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-50 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {job?.title}
                  </h2>
                  <p className="text-gray-600 mt-2">{job?.company}</p>
                  <p className="text-gray-500 mt-1">{job?.location}</p>
                </div>
                <button
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                  onClick={() => navigate(`/job/${job._id}`)}
                >
                  See Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}