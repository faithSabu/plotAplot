import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  noOfChats: null,
  noOfMessages: [],
  openedChat: null,
  latestChat: null,
  loading: false,
  error: null,
  createNewChat: false,
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
    updateLatestChat: (state, action) => {
      state.latestChat = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCreateNewChat: (state, action) => {
      state.createNewChat = action.payload;
    },
  },
});

export const {
  startFetchChatNumber,
  updateChatNumber,
  updateMessageNumber,
  updateOpenedChat,
  updateLatestChat,
  setCreateNewChat,
} = chatSlice.actions;

export default chatSlice.reducer;
