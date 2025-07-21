const jwt = require("jsonwebtoken");
const User = require("../models/User");
const isLoggedIn = (req, resp, next) => {
	
	//Fetch token from request
	const token = req.headers.authorization?.split(" ")[1];
	//Verfify token
	jwt.verify(token, "Alumni", async (err, decoded) => {
		
		//if unsuccessfull then send the error message
		if (err) {
			return resp.status(401).json({ status: "Failed", message: err?.message });
		} else {
			//if successful , then pass the User object to next path
			const userId = decoded?.user?.id;
			
			const user = await User.findById(userId).select(
				"username email role _id"
			);
			req.userAuth = user;
			next();
			console.log("isLoggedIn executed!");
		}
	});
};
module.exports = isLoggedIn;
