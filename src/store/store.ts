import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../store/slices/authSlice';
import postActionsReducer from "../store/slices/postActionsSlice"


export const store = configureStore({
    reducer :{
        auth: authReducer,
        postActions: postActionsReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch