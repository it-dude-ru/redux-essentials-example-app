import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { client } from '../../api/client';

const initialState = {
	posts: [],
	status: 'idle',
	error: null,
};

export const fetchPosts = createAsyncThunk(
	'posts/fetchPosts',
	async () => {
		const responce = await client.get('/fakeApi/posts');
		return responce.data;
	}
);

export const addNewPost = createAsyncThunk(
	'posts/addNewPost',
	async initialPost => {
		const responce = await client.post('/fakeApi/posts', initialPost);
		return responce.data;
	}
);

const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {
		reactionAdded(state, action) {
			const { postId, reaction } = action.payload;
			const existingPost = state.posts.find(post => post.id === postId);
			if (existingPost) {
				existingPost.reactions[reaction]++;
			}
		},
		postUpdated(state, action) {
			const { id, title, content } = action.payload;
			const existingPost = state.posts.find(post => post.id === id);
			if (existingPost) {
				existingPost.title = title;
				existingPost.content = content;
			}
		}
	},
	extraReducers(builder) {
		builder
			.addCase(fetchPosts.pending, (state, action) => {
				state.status = 'loading';
			})
			.addCase(fetchPosts.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.posts = state.posts.concat(action.payload);
			})
			.addCase(fetchPosts.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			})
			.addCase(addNewPost.fulfilled, (state, action) => {
				state.posts.push(action.payload);
			})
	}
});

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;

export const selectAllPosts = state => state.posts.posts;

export const selectPostById = (state, postId) =>
	state.posts.posts.find(post => post.id === postId);

export const selectPostByUser = createSelector(
	[selectAllPosts, (state, userId) => userId],
	(posts, userId) => posts.filter(post => post.user === userId)
);