import { configureStore } from '@reduxjs/toolkit';

import postReducer from '../features/posts/postsSlice';
import usersReducer from '../features/users/userSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';

export default configureStore({
	reducer: {
		posts: postReducer,
		users: usersReducer,
		notifications: notificationsReducer,
	},
});
