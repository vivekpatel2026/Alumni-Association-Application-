const mongoose = require("mongoose");
const connectDB = async () => {
	try {
		await mongoose.connect("mongodb://localhost:27017/AlumniApp");
		console.log("Connected successfully to MongoDB");
	} catch (error) {
		console.log("Connection to MongoDB failed:", error.message);
	}
};
module.exports = connectDB;
