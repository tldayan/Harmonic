import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../store/slices/authSlice';
import postLikesReducer from "./slices/postLikesSlice"


export const store = configureStore({
    reducer :{
        auth: authReducer,
        postLikes: postLikesReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch