import React, { useState } from "react";

const BlogForm = ({ createBlog }) => {
	const [newTitle, setNewTitle] = useState("");
	const [newAuthor, setNewAuthor] = useState("");
	const [newUrl, setNewUrl] = useState("");

	const handleTitleChange= (event) => {
		setNewTitle(event.target.value);
	};

	const handleAuthorChange = (event) => {
		setNewAuthor(event.target.value);
	};

	const handleUrlChange = (event) => {
		setNewUrl(event.target.value);
	};

	const addBlog = (event) => {
		event.preventDefault();
		createBlog({
			title: newTitle,
			author: newAuthor,
			url: newUrl,
		});

		setNewTitle("");
		setNewAuthor("");
		setNewUrl("");
	};

	return (
		<div>
			<h2>Create a new blog</h2>
			<form onSubmit={addBlog}>
				<div>Title:
					<input
						type="text"
						value={newTitle}
						name="Title"
						id="title"
						onChange={handleTitleChange}
					/>
				</div>

				<div>Author:
					<input
						type="text"
						value={newAuthor}
						name="Author"
						id="author"
						onChange={handleAuthorChange}
					/>
				</div>

				<div>Url:
					<input
						type="text"
						value={newUrl}
						name="Url"
						id="url"
						onChange={handleUrlChange}
					/>
				</div>

				<button type="submit">Create post</button>
			</form>
		</div>

	);
};

export default BlogForm;