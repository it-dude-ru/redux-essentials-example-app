import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import { client } from '../../api/client';

const postsAdapter = createEntityAdapter({
	sortComparer: (a, b) => b.date.localeCompare(a.date)
});

const initialState = postsAdapter.getInitialState({
	status: 'idle',
	error: null,
});

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
			const existingPost = state.entities[postId];
			if (existingPost) {
				existingPost.reactions[reaction]++;
			}
		},
		postUpdated(state, action) {
			const { id, title, content } = action.payload;
			const existingPost = state.entities[id];
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
				postsAdapter.upsertMany(state, action.payload);
			})
			.addCase(fetchPosts.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			})
			.addCase(addNewPost.fulfilled, postsAdapter.addOne);
	}
});

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;

export const {
	selectAll: selectAllPosts,
	selectById: selectPostById,
	selectIds: selectPostIds
} = postsAdapter.getSelectors(state => state.posts);

export const selectPostByUser = createSelector(
	[selectAllPosts, (state, userId) => userId],
	(posts, userId) => posts.filter(post => post.user === userId)
);