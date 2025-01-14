import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Spinner } from '../../components/Spinner';
import { PostAuthor } from './PostAuthor';
import { TimeAgo } from './TimeAgo';
import { ReactionButtons } from './ReactionButtons';
import { fetchPosts, selectPostById, selectPostIds } from './postsSlice';

const PostExcerpt = ({ postId }) => {
	const post = useSelector(state => selectPostById(state, postId));
	return (
		<article className="post-excerpt">
			<h3>{post.title}</h3>
			<div>
				<PostAuthor userId={post.user} />
				<TimeAgo timestamp={post.date} />
			</div>
			<p className="post-content">{post.content.substring(0, 100)}</p>
			<ReactionButtons post={post} />
			<Link to={`/posts/${post.id}`} className="button muted-button">
				View Post
			</Link>
		</article>
	)
}

export const PostsList = () => {
	const dispatch = useDispatch();
	const orderedPostIds = useSelector(selectPostIds);

	const postsStatus = useSelector(state => state.posts.status);
	const error = useSelector(state => state.posts.error);

	useEffect(() => {
		if (postsStatus === 'idle') dispatch(fetchPosts());
	}, [postsStatus, dispatch]);

	let content;

	if (postsStatus === 'loading') {
		content = <Spinner text="Loading..." />
	} else if (postsStatus === 'succeeded') {
		content = orderedPostIds.map(postId => (
				<PostExcerpt key={postId} postId={postId} />
			))
	} else if (postsStatus === 'failed') {
		content = <div>{error}</div>
	}

	return (
		<section className="posts-list">
			<h2>Posts</h2>
			{content}
		</section>
	)
}

