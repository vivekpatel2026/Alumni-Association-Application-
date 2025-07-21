import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { resetErrorAction } from "../../redux/slices/globalSlice/globalSlice";
// import { resetSuccessAction } from "../../redux/slices/globalSlice/globalSlice";
import axios from "axios";
// import {
//     resetErrorAction,
//     resetSuccesAction,
// } from "../globalSlice/globalSlice";

//initialstate
const INITIAL_STATE = {
    loading: false,
    error: null,
    comments: [],
    comment: null,
    success: false,
};

// ! Create Comment
export const createCommentAction = createAsyncThunk(
    "comment/create",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const token = getState().users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            console.log(payload);
            const { data } = await axios.post(
                `http://localhost:5000/api/v1/comment/${payload?.postId}`,
                {
                    message: payload?.message,
                },
                config
            );
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);
//comments/commentSlices.js
//! comment slices
const commentSlice = createSlice({
    name: "comments",
    initialState: INITIAL_STATE,
    extraReducers: (builder) => {
        //create comment
        builder.addCase(createCommentAction.pending, (state, action) => {
            state.loading = true;
        });

        builder.addCase(createCommentAction.fulfilled, (state, action) => {
            state.comment = action.payload;
            state.loading = false;
            state.error = null;
            state.success=true;
        });
        builder.addCase(createCommentAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        // //! Reset error action
        // builder.addCase(resetErrorAction.fulfilled, (state) => {
        //     state.error = null;
        // });
        // //! Reset success action
        // builder.addCase( resetSuccessAction .fulfilled, (state) => {
        //     state.success = false;
        // });
    },
});

//! generate reducer
const commentReducer = commentSlice.reducer;

export default commentReducer;
