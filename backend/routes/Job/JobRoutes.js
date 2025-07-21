const express = require("express");
const jobRoutes = express.Router();

const { newJob , deletejob,allJob, getJobs} = require("../../controllers/JobController");
const isLoggedIn = require("../../middleware/isLoggedIn");



//@desc for posting new job by alumni
//@route post /api/v1/job/newjob
//@access private
jobRoutes.post("/newjob", isLoggedIn,newJob);

//@desc Fetching all the jobs by Alumni/user
//@route GET /api/v1/job/
//@access public
jobRoutes.get("/",isLoggedIn,allJob);

//@desc deleting the any posted jobs by the user/Alumni
//@route delete /api/v1/job/
//@access private
jobRoutes.delete("/:id",isLoggedIn,deletejob)

// getting job details
jobRoutes.get("/:id",isLoggedIn,getJobs)


module.exports = jobRoutes;
