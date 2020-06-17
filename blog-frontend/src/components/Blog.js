import React from "react";
import Togglable from "./Togglable";

const Blog = ({ user, blog, updateLikes, deleteBlog }) => {
	const idOfBlogCreator = blog.user
		? blog.user.id
		: "Not found";

	const nameOfBlogCreator = blog.user
		? blog.user.name
		: "Blog creator not found";

	const showDeleteButton = () => {
		if (idOfBlogCreator === user.id) {
			return (
				<button onClick={deleteBlog}>Delete</button>
			);
		}
		return;
	};

	return (
		<div className="blog">
			<h3>{blog.title}</h3>
			<p>{blog.author}</p>
			<Togglable
				buttonOpen="view"
				buttonClose="hide">

				<p>{blog.url}</p>
				<p className="likes">
					Likes: {blog.likes}
					<button onClick={updateLikes}>Like</button>
				</p>
				<p>Post creator: {nameOfBlogCreator}</p>
				{showDeleteButton()}
			</Togglable>
		</div>
	);
};

export default Blog;

