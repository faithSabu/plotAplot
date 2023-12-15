import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./user/userSlice";
import socketReducer from "./socket/socketSlice";
import chatReducer from "./user/chatSlice";

const rootReducer = combineReducers({
  user: userReducer,
  socket: socketReducer,
  chat: chatReducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const persistedReduer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReduer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
