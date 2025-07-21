const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const connectDB = require("./config/database");
const userRoutes=require("./routes/User/UserRoutes");
const jobRoutes = require('./routes/Job/JobRoutes');
const postRoutes = require('./routes/Post/postRoutes');
const commentRoutes = require('./routes/Comment/commentRoute');

//!Create an express app
const app = express();

//! load the environment variable
dotenv.config();

//!Establish connection to MongoDB
connectDB();

//!Set up the middleware
app.use(express.json());
app.use(cors());

//?Setup the Router
app.use("/api/v1/users", userRoutes);

//? setup the job routes
app.use("/api/v1/job", jobRoutes);

//? set the post routes
app.use("/api/v1/post", postRoutes);

//? set the comment routes
app.use("/api/v1/comment",commentRoutes)

//!Not found middleware
app.use((req, resp, next) => {
    let error =new Error(
        `Cannot find the route ${req.originalUrl} on the server`
    );
    next(error);
});



//?Setup the global error handler
app.use((error, req, resp, next) => {
	const status = error?.status ? error.status : "failed";
	resp.status(500).json({ status: "failed", message: error?.message });
});
const PORT = process.env.PORT || 9080;
app.listen(PORT, () => {
	console.log(`Server started at ${PORT}`);
});
