import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const initialState = {
  isLoading: false,
  error: null,
  data: [],
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  return axios
    .get("http://localhost:3004/posts")
    .then((response) => response.data);
});

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      });
  },
});

export const { setError } = postsSlice.actions;
export default postsSlice.reducer;
