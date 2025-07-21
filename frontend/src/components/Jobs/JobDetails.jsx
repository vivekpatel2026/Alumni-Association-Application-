import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams,useNavigate,  } from "react-router-dom";
import { fetchJobDetailAction ,deleteJobAction} from "../../redux/slices/Jobs/jobSlices";
import LoadingComponent from "../Alert/LoadingComponent";
import ErrorMsg from "../Alert/ErrorMsg";
import { CheckBadgeIcon } from "@heroicons/react/24/solid"; // Import verification icon
import { resetErrorAction } from "../../redux/slices/Jobs/jobSlices";
import { resetSuccessAction } from "../../redux/slices/Jobs/jobSlices";
import SuccesMsg from "../Alert/SuccessMsg";
const JobDetails = () => {
     const navigate = useNavigate();
  const dispatch = useDispatch();
  const { jobId } = useParams();

  const { job, error, loading ,success} = useSelector((state) => state?.jobs);
  const { userAuth } = useSelector((state) => state?.users);

  useEffect(() => {
    dispatch(fetchJobDetailAction(jobId));
  }, [dispatch, jobId]);

  // Helper function to format the application deadline date
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper function to calculate time left to apply
  const getTimeLeft = (deadline) => {
    if (!deadline) return "Not specified";
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate - now;

    if (timeDiff <= 0) return "Application closed";

    const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return `${daysLeft} days and ${hoursLeft.toFixed(0)} hours left`;
  };

  const creator = job?.job?.postedBy?._id?.toString();
  const loginUser = userAuth?.userInfo?._id?.toString();
  const isCreator = creator === loginUser;

  const deleteJobHandler = () => {
    dispatch(deleteJobAction(jobId)); 
    if (success) {
        dispatch(resetSuccessAction());
        console.log(success); // Reset success state before navigation
        navigate("/jobs");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {loading && <LoadingComponent />}
      {error && <ErrorMsg message={error} />}
      {/* {success && <SuccesMsg message="Job Deleted Successfully!" />} */}
      {!loading && !error && job?.job && (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 relative">
          {/* Delete Button (Top-Right Corner) */}
          {isCreator && (
            <button
              className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
              onClick={deleteJobHandler}
            >
              Delete
            </button>
          )}
          {}

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {job.job?.title || "Not specified"}
          </h1>

          {/* Posted By */}
          <div className="flex items-center text-gray-600 mb-4">
            <span className="mr-2 font-semibold text-blue-600">Posted by:</span>
            <span className="text-gray-800">{job.job?.postedBy?.username || "Unknown"}</span>
            {job.job?.postedBy?.isVerified && (
              <CheckBadgeIcon className="h-5 w-5 text-blue-500 ml-1" /> // Verification symbol
            )}
          </div>

          {/* Company and Location */}
          <div className="flex items-center text-gray-600 mb-4">
            <span className="mr-4 font-semibold text-blue-600">Company:</span>
            <span className="text-gray-800">{job.job?.company || "Not specified"}</span>
            <span className="mx-4 font-semibold text-blue-600">•</span>
            <span className="font-semibold text-blue-600">Location:</span>
            <span className="text-gray-800 ml-2">{job.job?.location || "Not specified"}</span>
          </div>

          {/* Employment Type and Salary Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-blue-600 font-semibold">Employment Type:</p>
              <p className="text-gray-800">
                {job.job?.employmentType || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-blue-600 font-semibold">Salary Range:</p>
              <p className="text-gray-800">
                {job.job?.salaryRange?.min && job.job?.salaryRange?.max
                  ? `$${job.job.salaryRange.min} - $${job.job.salaryRange.max} USD/month`
                  : "Not specified"}
              </p>
            </div>
          </div>

          {/* Job Description */}
          <div className="mb-6">
            <p className="text-blue-600 font-semibold mb-2">Job Description:</p>
            <p className="text-gray-800">
              {job.job?.description || "No job description available."}
            </p>
          </div>

          {/* Requirements */}
          <div className="mb-6">
            <p className="text-blue-600 font-semibold mb-2">Requirements:</p>
            <ul className="list-disc list-inside text-gray-800">
              {job.job?.requirements?.length > 0
                ? job.job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))
                : "Not specified"}
            </ul>
          </div>

          {/* Responsibilities */}
          <div className="mb-6">
            <p className="text-blue-600 font-semibold mb-2">Responsibilities:</p>
            <ul className="list-disc list-inside text-gray-800">
              {job.job?.responsibilities?.length > 0
                ? job.job.responsibilities.map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))
                : "Not specified"}
            </ul>
          </div>

          {/* Qualifications */}
          <div className="mb-6">
            <p className="text-blue-600 font-semibold mb-2">Qualifications:</p>
            <ul className="list-disc list-inside text-gray-800">
              {job.job?.qualifications?.length > 0
                ? job.job.qualifications.map((qual, index) => (
                    <li key={index}>{qual}</li>
                  ))
                : "Not specified"}
            </ul>
          </div>

          {/* Application Deadline and Time Left */}
          <div className="mb-6">
            <p className="text-blue-600 font-semibold mb-2">Application Deadline:</p>
            <p className="text-gray-800">{formatDate(job.job?.applicationDeadline)}</p>
            <p className="text-sm text-gray-500 mt-1">
              {getTimeLeft(job.job?.applicationDeadline)}
            </p>
          </div>

          {/* Apply Now Button */}
          <div className="text-center">
            <a
              href={job.job?.applicationLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300 font-bold"
            >
              Apply Now
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;