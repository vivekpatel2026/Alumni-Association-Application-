const JobDetail = require("../models/Job");
const user=require("../models/User");
const moment = require("moment");

//! Create a new job post by an Alumni
/**
 * @route POST /jobs/new
 * @description Creates a new job posting by an alumni.
 * @access Private (requires authentication)
 */
exports.newJob = async (req, resp, next) => {
  try {
    const {
      title,
      company,
      location,
      employmentType,
      salaryRange = { min: null, max: null },
      requirements = [],
      responsibilities = [],
      qualifications = [],
      applicationDeadline,
      applicationLink,
    } = req.body;

    const newJobData = {
      title,
      company,
      location,
      employmentType,
      salaryRange,
      requirements,
      responsibilities,
      qualifications,
      applicationDeadline,
      applicationLink,
      postedBy: req.userAuth._id,
    };
     // job post
    const newJob = new JobDetail(newJobData);
    const jobpost=await newJob.save();
    // update in user
     await user.findByIdAndUpdate(
      req.userAuth._id,
      { $push: { jobpost: jobpost } },
      { new: true, useFindAndModify: false } 
   );

    resp.json({
      status: "success",
      message: "New job posted successfully",
      jobId: newJob._id,
      title: newJob.title,
      company: newJob.company,
      location: newJob.location,
    });
  } catch (error) {
    next(error);
  }
};

//! Get all job postings
/**
 * @route GET /jobs
 * @description Fetches a list of all job postings with essential details.
 * @access Public
 */


exports.allJob = async (req, res, next) => {
  try {
    const currentDate = moment().toISOString();

    const alljobs = await JobDetail.find(
      { applicationDeadline: { $gte: currentDate } }, // Filter jobs with future deadlines
      { _id: 1, title: 1, company: 1, location: 1, applicationDeadline: 1 }
    );

    res.json({
      status: "success",
      message: "All jobs fetched successfully",
      alljobs
    });
  } catch (error) {
    next(error);
  }
};

//! Delete a job posting
/**
 * @route DELETE /jobs/:id
 * @description Deletes a job posting by its ID.
 * @access Private (requires authentication)
 */
exports.deletejob = async (req, res, next) => {
  try {
    const id = req.params.id;
    // delete the job
    const job = await JobDetail.findOneAndDelete({ _id: id });
    if (!job) {
      const error=new Error("post not found");
     throw(error);
    }

    // update in user
    const fullUser = await user.findById(req.userAuth._id); // Use `await` to get the user document

    const index = fullUser.jobpost.findIndex(item => item ==id); // Check if jobpost array exists and find index

    if (index !== -1) {
      fullUser.jobpost.splice(index, 1); // Remove the item at the found index
      await fullUser.save(); // Save the changes to the database
    }
    return res.status(200).json({
      status: "success",
      message: "Job deleted successfully",
      job
    });
  } catch (err) {
    next(err);
  }
};


//! fetch the single job detais
exports.getJobs = async (req, res, next) => {
  try {
    const { id } = req.params;

    

    const job = await JobDetail.findById(id).populate("postedBy");

    // Handle case where job is not found
    if (!job) {
      return res.status(404).json({
        status: "fail",
        message: "Job not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Job sent successfully",
      job,
    });

  } catch (error) {
    console.error("Error fetching job:", error); // Log error for debugging
    next(error); // Pass error to the error-handling middleware
  }
};