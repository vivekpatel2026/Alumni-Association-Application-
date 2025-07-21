const mongoose = require("mongoose");

const jobDetailSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: true
      },
      company: {
         type: String,
         required: true
      },
      location: {
         type: String,
         required: true
      },
      employmentType: {
         type: String,
         enum: ["Full-time", "Part-time", "Contract", "Internship", "FreeLance"],
         required: true
      },
      salaryRange: {
         min: {
            type: Number,
            default: null // Set default to null instead of assigning null as the value
         },
         max: {
            type: Number,
            default: null // Set default to null instead of assigning null as the value
         }
      },
      requirements: [
         {
            type: String,
            required: true
         }
      ],
      responsibilities: [
         {
            type: String
         }
      ],
      qualifications: [
         {
            type: String
         }
      ],
      applicationDeadline: {
         type: Date
      },
      applicationLink: {
         type: String
      },
      postedBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true
      }
   },
   {
      timestamps: true
   }
);

// Convert schema to model
const JobDetail = mongoose.model("JobDetail", jobDetailSchema);
module.exports = JobDetail;
