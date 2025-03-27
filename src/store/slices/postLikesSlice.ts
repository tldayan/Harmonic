import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PostItemProps } from "../../types/post-types";


interface Post {
    MessageBoardUUID: string;
    hasLiked: boolean;
    likeCount: number; 
}

interface PostState {
    posts: Record<string, Post>;
}

const initialState: PostState = {
    posts: {}
};

const postLikesSlice = createSlice({
    name: "postLikes",
    initialState,
    reducers: {
        updateLikes: (state, action: PayloadAction<PostItemProps[]>) => {
            for (let message of action.payload) {
                if (!state.posts[message.MessageBoardUUID]) {
                    state.posts[message.MessageBoardUUID] = {
                        MessageBoardUUID: message.MessageBoardUUID,
                        hasLiked: true,
                        likeCount: message.NoofLikes 
                    };
                } else {
                    state.posts[message.MessageBoardUUID].hasLiked = true;
                }
            }
        },
        toggleLike: (state, action: PayloadAction<{ postId: string}>) => {
            const { postId } = action.payload;

            if (!state.posts[postId]) {

                state.posts[postId] = { MessageBoardUUID: postId, hasLiked: true, likeCount: 1 };
            } else {
                const post = state.posts[postId];
                post.hasLiked = !post.hasLiked;
                post.likeCount = post.hasLiked ? post.likeCount + 1 : post.likeCount - 1
            }
        }
    }
});

export const { toggleLike, updateLikes } = postLikesSlice.actions;
export default postLikesSlice.reducer;
