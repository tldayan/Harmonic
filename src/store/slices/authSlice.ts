import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import { MMKV } from "../../services/storage-service"

interface AuthState {
    organizationUUID: string
    userUUID: string
}

const initialState: AuthState = {
    organizationUUID: MMKV.getString("OrganizationUUID") || "",
    userUUID: MMKV.getString("UserUUID") || "",
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers : {
        setUUIDs: (state, action: PayloadAction<{ organizationUUID: string; userUUID: string }>) => {
            state.organizationUUID = action.payload.organizationUUID
            state.userUUID = action.payload.userUUID
        },
        logout: (state) => {
            state.organizationUUID = ""
            state.userUUID = ""
        }
    }
})

export const { setUUIDs, logout } = authSlice.actions;
export default authSlice.reducer;