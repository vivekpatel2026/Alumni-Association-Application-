import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { resetErrorAction } from "../globalSlice/globalSlice";
const INITIAL_STATE = {
  loading: false,
  error: null,
  users: [],
  user: null,
  success: false,
  isUpdated: false,
  isDeleted: false,
  isEmailSent: false,
  isPasswordReset: false,
  profile: {},
  userAuth: {
    error: null, 
    userInfo: localStorage.getItem("userInfo")
            ? JSON.parse(localStorage.getItem("userInfo"))
            : null,
  },
};

//! Login Action
export const loginAction = createAsyncThunk(
  "users/login",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/login",
        payload
      );
      // storing the userinfo in local storage 
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      // Return only serializable data
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: { ...response.headers },
      };
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
//! ragister new user
export const registerAction = createAsyncThunk(
  "users/register",
  async (payload, { rejectWithValue, getState, dispatch }) => {
      //make request
      try {
          const { data } = await axios.post(
              "http://localhost:5000/api/v1/users/register",
              payload
          );

          return data;
      } catch (error) {
          return rejectWithValue(error?.response?.data);
      }
  }
);

// Users Slice
const usersSlice = createSlice({
  name: "users",
  initialState: INITIAL_STATE,
  reducers: {
    resetSuccess: (state) => {
      state.success = false; // Reset success after login navigation
    },
  },
  extraReducers: (builder) => {
    builder
      // Login Pending
      .addCase(loginAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Login Fulfilled
      .addCase(loginAction.fulfilled, (state, action) => {
        state.success = true;
        state.userAuth = action.payload; // Store authenticated user data
        state.loading = false;
        state.error = null;
      })
      // Login Rejected
      .addCase(loginAction.rejected, (state, action) => {
        console.log("Login failed", action.payload);
        state.error = action.payload;
        state.loading = false;
      });

      //Register
      builder.addCase(registerAction.pending, (state, action) => {
        console.log("pending", registerAction.pending);
        state.loading = true;
     });
    builder.addCase(registerAction.fulfilled, (state, action) => {
        console.log("success", action.payload);
        console.log("registerAction", registerAction.fulfilled);
        state.success = true;
        state.user = action.payload;
        state.loading = false;
        state.error = null;
    });
    builder.addCase(registerAction.rejected, (state, action) => {
        console.log("failed", action.payload);
        state.error = action.payload;
        state.loading = false;
        state.success = false;
    });

    //! Reset error action
    builder.addCase(resetErrorAction, (state) => {
      state.error = null;
  });


  },
});
// ! Logout action
export const logoutAction = createAsyncThunk("users/logout", async () => {
  //remove token from localstorage
  localStorage.removeItem("userInfo");
  return true;
});

export const { resetSuccess } = usersSlice.actions;
//! Generate reducer
export default usersSlice.reducer;
