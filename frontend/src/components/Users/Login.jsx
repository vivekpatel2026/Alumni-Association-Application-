import React, { useEffect, useState } from "react";
//import { Link } from "react-router-dom";
import { loginAction } from "../../redux/slices/users/userSlices";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import LoadingComponent from "../Alert/LoadingComponent"
import ErrorMsg from "../Alert/ErrorMsg";
import SuccesMsg from "../Alert/SuccessMsg";
import { resetSuccess } from "../../redux/slices/users/userSlices";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.users); // Moved hook to the top level

  const [formData, setFormData] = useState({
    password: "vivek",
    username: "vivekpatel",
  });

  // Handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
   // console.log(formData);

    //!dispatch
    dispatch(
      loginAction({
        username: formData.username,
        password: formData.password,
      })
    );

    // Reset form
    setFormData({
      password: "",
      username: "",
    });
  };
  // store data
  let count=0;
  const {userAuth,  error ,success} = useSelector((state) => state.users);
    
    useEffect(() => {

      if(success){
        navigate("/user-profile");
        window.location.reload();
        dispatch(resetSuccess()); 
      }

      // if (userAuth?.userInfo?.token) {
        
      //     navigate("/user-profile");
      // }
  }, [userAuth?.userInfo?.token,success]);

  // useEffect(() => {
  //   console.log("Checking for navigation...");
  
  //   if (userAuth?.token) {  // ✅ Fix: Directly check userAuth.token
  //     console.log("Navigating to user profile...");
  //     navigate("/user-profile");
  //     dispatch(resetSuccess());  // ✅ Reset success after navigation
  //   }
  // }, [userAuth, navigate, dispatch]);
 


  // useEffect(() => {
  //   if (success) {
  //     navigate("/user-profile");
  //     dispatch(resetSuccess()); // ✅ Reset success state after navigating
  //   }
  // }, [success, dispatch, navigate]);



  return (
    <section className="py-16 xl:pb-56 bg-gray-100 overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-md mx-auto bg-white p-8 rounded-3xl shadow-lg">
          <a className="mb-8 inline-block" href="#">
            <img
              src="flaro-assets/logos/flaro-logo-black-xl.svg"
              alt="Logo"
            />
          </a>
          <h2 className="mb-4 text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
            Login to Your Account
          </h2>
          <p className="mb-8 font-medium text-lg text-gray-600 leading-normal">
            Enter your details below to access your account.
          </p>
          {error && <ErrorMsg message={error.message} />}
          {success && <SuccesMsg message="Login Successful!" />}
          <form onSubmit={handleSubmit}>
            <label className="block mb-5">
              <input
                className="px-4 py-3.5 w-full text-gray-700 font-medium placeholder-gray-400 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 transition duration-200"
                type="text"
                placeholder="Enter Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </label>

            <label className="block mb-5">
              <input
                className="px-4 py-3.5 w-full text-gray-700 font-medium placeholder-gray-400 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 transition duration-200"
                type="password"
                placeholder="Enter Your Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>
            {loading ? (
              <LoadingComponent /> // Self-closing tag
            ) : (
              <button
                className="mb-8 py-4 px-9 w-full text-white font-semibold border border-green-700 rounded-xl shadow-md focus:ring-2 focus:ring-green-500 bg-green-600 hover:bg-green-700 transition ease-in-out duration-200"
                type="submit"
              >
                Login Account
              </button>
            )}

            <p className="font-medium">
              <span className="m-2">Forgot Password?</span>
              <Link
                className="text-green-600 hover:text-green-700 font-semibold"
                to="/forgot-password"
              >
                Reset Password
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
