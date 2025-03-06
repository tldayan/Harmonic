import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../store/slices/authSlice';
import postActionsReducer from "../store/slices/postActionsSlice"
import postLikesReducer from "./slices/postLikesSlice"


export const store = configureStore({
    reducer :{
        auth: authReducer,
        postActions: postActionsReducer,
        postLikes: postLikesReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch