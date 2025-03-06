import { createSlice, PayloadAction } from "@reduxjs/toolkit";


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
        toggleLike: (state, action: PayloadAction<{ postId: string; postLikeCount: number }>) => {
            const { postId, postLikeCount } = action.payload;

            if (!state.posts[postId]) {

                state.posts[postId] = { MessageBoardUUID: postId, hasLiked: true, likeCount: postLikeCount + 1 };
            } else {
                const post = state.posts[postId];
                post.hasLiked = !post.hasLiked;
                post.likeCount = post.hasLiked ? post.likeCount + 1 : post.likeCount - 1;
            }
        }
    }
});

export const { toggleLike } = postLikesSlice.actions;
export default postLikesSlice.reducer;
