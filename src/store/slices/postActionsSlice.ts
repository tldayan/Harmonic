import { createSlice, PayloadAction } from "@reduxjs/toolkit"


interface PostActionState {
    isEditing: boolean
    action: "delete" | "edit" | null
    MessageBoardUUID: string | null
}

const initialState: PostActionState = {
    isEditing: false,
    action: null,
    MessageBoardUUID: null
}

const postActionsSlice = createSlice({
    name: "postActions",
    initialState,
    reducers: {
        setAction: (state, action: PayloadAction<"delete" | "edit" | null>) => {
            state.action = action.payload
        },
        setMessageBoardUUID: (state, action: PayloadAction<string | null>) => {
            state.MessageBoardUUID = action.payload
        },
        setIsEditing: (state, action: PayloadAction<boolean>) => {
            state.isEditing = action.payload;
        }
    }
})

export const { setAction, setMessageBoardUUID, setIsEditing } = postActionsSlice.actions;
export default postActionsSlice.reducer;