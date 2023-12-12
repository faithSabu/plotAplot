import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  noOfChats: null,
  noOfMessages: [],
  openedChat: null,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    startFetchChatNumber: (state) => {
      state.loading = true;
    },
    updateChatNumber: (state, action) => {
      state.noOfChats = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateMessageNumber: (state, action) => {
      state.noOfMessages = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateOpenedChat: (state, action) => {
      state.openedChat = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  startFetchChatNumber,
  updateChatNumber,
  updateMessageNumber,
  updateOpenedChat,
} = chatSlice.actions;

export default chatSlice.reducer;
