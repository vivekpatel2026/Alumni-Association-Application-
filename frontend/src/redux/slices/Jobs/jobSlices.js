import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const INITIAL_STATE = {
  loading: false,
  error: null,
  jobs: [],
  job: null,
  success: false,
};

//! Fetch All Jobs Action
export const fetchJobAction = createAsyncThunk(
  "job/fetch",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get("http://localhost:5000/api/v1/job", config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Something went wrong");
    }
  }
);

//! Add new job action
export const newJobAction = createAsyncThunk(
  "job/create",
  async (jobData, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const formattedData = {
        ...jobData,
        requirements: jobData.requirements.filter(req => req.trim()),
        responsibilities: jobData.responsibilities.filter(resp => resp.trim()),
        qualifications: jobData.qualifications.filter(qual => qual.trim()),
      };

      const { data } = await axios.post("http://localhost:5000/api/v1/job/newjob", formattedData, config);
      return data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

//! Delete Job Detail Action
export const deleteJobAction = createAsyncThunk(
  "job/delete",
  async (jobId, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.delete(`http://localhost:5000/api/v1/job/${jobId}`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Something went wrong");
    }
  }
);

//! Fetch Job Detail Action
export const fetchJobDetailAction = createAsyncThunk(
  "job/fetchDetail",
  async (jobId, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(`http://localhost:5000/api/v1/job/${jobId}`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Something went wrong");
    }
  }
);

//! Reset Success Action
export const resetSuccessAction = createAsyncThunk("job/resetSuccess", async () => {
  return false;
});

//! Reset Error Action
export const resetErrorAction = createAsyncThunk("job/resetError", async () => {
  return null;
});

//! Jobs Slice
const jobsSlice = createSlice({
  name: "jobs",
  initialState: INITIAL_STATE,
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobAction.fulfilled, (state, action) => {
        state.jobs = action.payload;
        state.loading = false;
        state.error = null;
        //state.success=false;
      })
      .addCase(fetchJobAction.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchJobDetailAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobDetailAction.fulfilled, (state, action) => {
        state.job = action.payload;
        state.success=true;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchJobDetailAction.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(newJobAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(newJobAction.fulfilled, (state, action) => {
        state.success = true;
        state.job = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(newJobAction.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(resetSuccessAction.fulfilled, (state) => {
        console.log("yes");
        state.success = false;
      })
      .addCase(resetErrorAction.fulfilled, (state) => {
        state.error = null;
      });
  },
});

//! Export Reducer
const jobsReducer = jobsSlice.reducer;
export default jobsReducer;
