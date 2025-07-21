import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../slices/users/userSlices";
import postsReducer from "../slices/posts/postSlices";
import jobsReducer from "../slices/Jobs/jobSlices";
import commentReducer from "../slices/Comments/commentSlices";
//! Store
const store = configureStore({
    reducer: {
        users: usersReducer,
        posts:postsReducer,
        jobs:jobsReducer,
        comments:commentReducer
    },
});

export default store;
