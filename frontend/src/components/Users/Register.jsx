import React, { useState ,useEffect} from "react";
import { Link ,useNavigate} from "react-router-dom";
import { useDispatch , useSelector } from "react-redux";
import { registerAction } from "../../redux/slices/users/userSlices";
import ErrorMsg from "../Alert/ErrorMsg";
import SuccesMsg from "../Alert/SuccessMsg";
const Register = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		username: "",
	});

	// Handle form change
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Handle form submit
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("register data", formData);
		dispatch(
            registerAction({
                username: formData.username,
                password: formData.password,
                email: formData.email,
            })
        );

		// Reset form
		setFormData({
			email: "",
			password: "",
			username: "",
		});
	};
	const { user ,success,error,loading} = useSelector((state) => state.users);
	//console.log("user", user); 

    //*Redirect*/
    useEffect(() => {
        if (user?.status === "success") {
            navigate("/login");
        }
    }, [user?.status]);


	return (
		<form className="w-full lg:w-1/2" onSubmit={handleSubmit}>
			<div className="flex flex-col items-center p-10 xl:px-24 xl:pb-12 bg-white lg:max-w-xl lg:ml-auto rounded-3xl shadow-lg">
				<img
					className="relative -top-2 -mt-16 mb-6 h-16"
					src="flex-ui-assets/logos/flex-circle-green.svg"
					alt="Logo"
				/>
				<h2 className="mb-4 text-2xl md:text-3xl text-gray-800 font-bold text-center">
					Join Our Alumni Community
				</h2>
				<h3 className="mb-7 text-base md:text-lg text-gray-500 font-medium text-center">
					Connect, network, and grow with fellow alumni.
				</h3>
				{/* Display Error */}
								{error && <ErrorMsg message={error.message} />}
                {/* Display Success */}
                {success && <SuccesMsg message="Registration Successful!" />}

				<label className="mb-4 flex flex-col w-full">
					<span className="mb-1 text-gray-800 font-medium">Username</span>
					<input
						className="py-3 px-4 leading-5 w-full text-gray-700 font-normal border border-gray-300 outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg shadow-sm"
						type="text"
						placeholder="Enter your username"
						value={formData.username}
						onChange={handleChange}
						name="username"
						required
					/>
				</label>
				<label className="mb-4 flex flex-col w-full">
					<span className="mb-1 text-gray-800 font-medium">Email</span>
					<input
						className="py-3 px-4 leading-5 w-full text-gray-700 font-normal border border-gray-300 outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg shadow-sm"
						placeholder="Enter your email"
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						required
					/>
				</label>
				<label className="mb-4 flex flex-col w-full">
					<span className="mb-1 text-gray-800 font-medium">Password</span>
					<input
						className="py-3 px-4 leading-5 w-full text-gray-700 font-normal border border-gray-300 outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg shadow-sm"
						type="password"
						placeholder="Create a password"
						value={formData.password}
						onChange={handleChange}
						name="password"
						required
					/>
				</label>
				<button
					className="mb-4 inline-block py-3 px-7 w-full leading-6 text-white font-medium text-center bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md transition duration-200"
					type="submit"
				>
					Get Started
				</button>
				<p className="text-sm text-gray-400 font-medium text-center">
					<span>Already have an account?</span>
					<Link className="text-green-600 hover:text-green-700 font-semibold" to="/login">
						 Sign In
					</Link>
				</p>
			</div>
		</form>
	);
};

export default Register;