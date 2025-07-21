import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage/Homepage"
import Login from "./components/Users/Login";
import UserProfile from "./components/Users/UserProfile";
import PublicNavbar from "./components/NavBar/PublicNavbar";
import PrivateNavbar from "./components/NavBar/PrivateNavbar";
import { useSelector } from "react-redux";
import ProtectedRoute from "./components/AuthRoute/ProtectedRoute";
//import PublicPosts from "./components/Posts/PublicPosts"
import PostDetails from "./components/Posts/PostDetails";
import AddPost from "./components/Posts/AddPost"
import PublicPosts from "./components/Posts/PublicPosts";
import PostList from "./components/Posts/PostList";
import Job from "./components/Jobs/Job";
import JobDetails from "./components/Jobs/JobDetails";
import AddJob from "./components/Jobs/AddJobs";
export default function App() {
    const { userAuth } = useSelector((state) => state.users);
    const isLoggedIn = userAuth?.userInfo?.token;
  return (
      <BrowserRouter>
                       {isLoggedIn ? <PrivateNavbar /> : <PublicNavbar />}

          <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login/>} />
              <Route path="/add-post" element={
                <ProtectedRoute>
                <AddPost/>
              </ProtectedRoute>
                } />
               //! Adding Job route
              <Route path="/add-job" element={
                <ProtectedRoute>
                <AddJob/>
              </ProtectedRoute>
                } />

                //! job Routes
                <Route
                    path="/jobs"
                    element={
                        <ProtectedRoute>
                            <Job />
                        </ProtectedRoute>
                    }
                ></Route>

                {/* post details */}
                <Route
                    path="/job/:jobId"
                    element={
                        <ProtectedRoute>
                            <JobDetails />
                        </ProtectedRoute>
                    }
                ></Route>
                


                {/* post details */}
                <Route
                    path="/posts/:postId"
                    element={
                        <ProtectedRoute>
                            <PostDetails />
                        </ProtectedRoute>
                    }
                ></Route>

                {/* post details */}
                <Route
                    path="/posts"
                    element={
                        <ProtectedRoute>
                            <PostList />
                        </ProtectedRoute>
                    }
                ></Route>

              
              <Route path="/user-profile" element={
                <ProtectedRoute>
                     <UserProfile />
                </ProtectedRoute>

               } />
          </Routes>
      </BrowserRouter>
  );
}
