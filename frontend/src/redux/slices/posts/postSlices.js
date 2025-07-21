import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
    resetErrorAction,
    resetSuccessAction,
} from "../globalSlice/globalSlice";

const INITIAL_STATE = {
    loading: false,
    error: null,
    posts: [],
    post: null,
    success: false,
};

//! Fetch Public Post Action
export const fetchPublicPostAction = createAsyncThunk(
    "posts/fetch-public-posts",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        //make request
        try {
            const { data } = await axios.get(
                "http://localhost:5000/api/v1/post/public"
            );
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//! get Private All post 
//!Fetch pricate posts
export const fetchPrivatePostsAction = createAsyncThunk(
    "posts/fetch-private-posts",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        //make request
        try {
            const token = getState().users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
              },
            };
            const { data } = await axios.get(
                "http://localhost:5000/api/v1/post",
                config
            );
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);



// ! Create post
export const addPostAction = createAsyncThunk(
    "post/create",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const postData = new FormData();
            postData.append("title", payload?.title);
            postData.append("description", payload?.description);

            if (payload?.image) {
                postData.append("file", payload?.image);
            }

            const token = getState().users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.post(
                "http://localhost:5000/api/v1/post",
                postData,
                config
            );

            // Dispatch reset actions after successful post creation
            dispatch(resetSuccessAction());
            dispatch(resetErrorAction());

            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//!fetch single  posts
export const getPostAction = createAsyncThunk(
    "posts/get-post",
    async (postId, { rejectWithValue, getState }) => {
        try {
            const token = getState().users?.userAuth?.userInfo?.token;

            if (!token) {
                return rejectWithValue("Unauthorized: No token provided");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            //console.log("Request Config:", config);

            // Fix: Remove extra {} from axios.get
            const { data } = await axios.get(
                `http://localhost:5000/api/v1/post/${postId}`, 
                config
            );
            //console.log(data);

            return data;
        } catch (error) {
         console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error?.response?.data || "Something went wrong");
        }
    }
);

//! Delete Post 
//!Delete post
export const deletePostAction = createAsyncThunk(
    "posts/delete-post",
    async (postId, { rejectWithValue, getState, dispatch }) => {
        //make request
        try {
            const token = getState().users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.delete(
                `http://localhost:5000/api/v1/post/${postId}`,
                config
            );
            return data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error?.response?.data);
        }
    }
);

//! //!Like Post
export const likePostAction = createAsyncThunk(
    "posts/like-post",
    async (postId, { rejectWithValue, getState, dispatch }) => {
        //make request
        try {
            const token = getState().users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            //console.log(config);
            const { data } = await axios.put(
                `http://localhost:5000/api/v1/post/like/${postId}`,{},
                config
            );
            console.log(data);
            return data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error?.response?.data);
        }
    }
);

//! DisLike post Action

//! //!Like Post
export const disLikePostAction = createAsyncThunk(
    "posts/dislike-post",
    async (postId, { rejectWithValue, getState, dispatch }) => {
        //make request
        try {
            const token = getState().users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            //console.log(config);
            const { data } = await axios.put(
                `http://localhost:5000/api/v1/post/dislike/${postId}`,{},
                config
            );
            console.log(data);
            return data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error?.response?.data);
        }
    }
);


//! Posts slices
const postsSlice = createSlice({
    name: "posts",
    initialState: INITIAL_STATE,
    extraReducers: (builder) => {
        //! Fetch public post
        builder.addCase(fetchPublicPostAction.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(fetchPublicPostAction.fulfilled, (state, action) => {
            state.success = true;
            state.posts = action.payload;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(fetchPublicPostAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.success = false;
        });

        //! create post
        builder.addCase(addPostAction.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(addPostAction.fulfilled, (state, action) => {
            state.post = action.payload;
            state.success = true;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(addPostAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.success = false;
        });

                //! get single post
                builder.addCase(getPostAction.pending, (state, action) => {
                   // console.log("pending");
                    state.loading = true;
                });
                builder.addCase(getPostAction.fulfilled, (state, action) => {
                   // console.log("success");
                    state.post = action.payload;
                    state.loading = false;
                    state.success = true;
                    state.error = null;
                });
                builder.addCase(getPostAction.rejected, (state, action) => {
                   // console.log("rejected");
                    state.error = action.payload;
                    state.loading = false;
                    state.success = false;
                });

                //! Fetch private post
        builder.addCase(fetchPrivatePostsAction.pending, (state, action) => {
           // console.log("pending", fetchPrivatePostsAction.pending);
            state.loading = true;
        });
        builder.addCase(fetchPrivatePostsAction.fulfilled, (state, action) => {
            console.log("success", action.payload);
           // console.log("fetchPPrivatePostAction", fetchPrivatePostsAction.fulfilled);
           // state.success = true;
           state.posts = action.payload;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(fetchPrivatePostsAction.rejected, (state, action) => {
          //  console.log("failed", action.payload);
            state.error = action.payload;
            state.loading = false;
            state.success = false;
        });

        //! delete post action

        //! Delete post
        builder.addCase(deletePostAction.pending, (state, action) => {
            state.loading = true;
        });
        //handle fulfilled state
        builder.addCase(deletePostAction.fulfilled, (state, action) => {
            state.success = true;
            state.loading = false;
            state.error = null;
        });
        //* Handle the rejection
        builder.addCase(deletePostAction.rejected, (state, action) => {
            state.error = action.payload;
            state.success = false;
            state.loading = false;
        });
         //! Like Post

        builder.addCase(likePostAction.pending, (state, action) => {
            state.loading = true;
        });
        //handle fulfilled state
        builder.addCase(likePostAction.fulfilled, (state, action) => {
            state.success = true;
            state.loading = false;
            state.error = null;
        });
        //* Handle the rejection
        builder.addCase(likePostAction.rejected, (state, action) => {
            state.error = action.payload;
            state.success = false;
            state.loading = false;
        });
       
        //! disLike post 

        builder.addCase(disLikePostAction.pending, (state, action) => {
            state.loading = true;
        });
        //handle fulfilled state
        builder.addCase(disLikePostAction.fulfilled, (state, action) => {
            state.success = true;
            state.loading = false;
            state.error = null;
        });
        //* Handle the rejection
        builder.addCase(disLikePostAction.rejected, (state, action) => {
            state.error = action.payload;
            state.success = false;
            state.loading = false;
        });
       

        

        //! Reset error action
        builder.addCase(resetErrorAction, (state) => {
            state.error = null;
        });

        //! Reset success action
        builder.addCase(resetSuccessAction, (state) => {
            state.success = false;
        });
    },
});

//! generate reducer
const postsReducer = postsSlice.reducer;

export default postsReducer;