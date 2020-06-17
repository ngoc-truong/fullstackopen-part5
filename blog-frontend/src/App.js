import React, { useState, useEffect } from "react";
import "./App.css";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [user, setUser] = useState(null);
	const [notification, setNotification] = useState("");
	const blogFormRef = React.createRef();

	// const [blogFormVisible, setBlogFormVisible] = useState("");

	// Load blog posts into React app
	useEffect(() => {
		blogService.getAll().then(blogs =>
			setBlogs( blogs )
		);
	}, []);

	// Remember logged-in user from localStorage
	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			setUser(user);
			blogService.setToken(user.token);
		}
	}, []);

	const notifyWith = (message, type="success") => {
		setNotification({ message, type });
		setTimeout(() => {
			setNotification(null);
		}, 5000);
	};

	const handleLogin = async (event) => {
		event.preventDefault();
		try {
			const user = await loginService.login({ username, password });
			window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
			blogService.setToken(user.token);
			setUser(user);
			setUsername("");
			setPassword("");
		} catch (exception) {
			notifyWith("Invalid username or password.", "error");
		}
	};

	const handleLogout = () => {
		window.localStorage.removeItem("loggedBlogappUser");
		setUser(null);
	};

	const addBlog = (blogObject) => {
		blogFormRef.current.toggleVisibility();
		blogService
			.create(blogObject)
			.then(returnedBlog => {
				setBlogs(blogs.concat(returnedBlog));
				notifyWith(`Blog with title "${blogObject.title}" saved.`);
			})
			.catch((error) => {
				notifyWith(`Could not save blog ${blogObject.title} to the server`, "error");
			});
	};

	const deleteBlog = (id) => {
		const index = blogs.findIndex((blog) => blog.id === id);
		const blog = blogs.find((blog) => blog.id === id);
		const userWantsToDelete = window.confirm(`Do you really want to delete ${blog.title}`);

		if (userWantsToDelete) {
			const blogsCopy = [ ...blogs ];
			blogsCopy.splice(index, 1);

			blogService
				.remove(id)
				.then( (response) => {
					notifyWith(`${blog.title} was deleted.`);
					setBlogs(blogsCopy);
				})
				.catch((error) => {
					notifyWith(`Could not delete blog with title ${blog.title}.`, "error");
				});
		} else {
			return;
		}
	};

	const updateLikes = (id) => {
		const blog = blogs.find((b) => b.id === id);
		const changedBlog = { ...blog, likes: blog.likes + 1 };

		blogService
			.update(id, changedBlog)
			.then(returnedBlog => {
				setBlogs(blogs.map((blog) => blog.id !== id ? blog : returnedBlog));
			})
			.catch((error) => {
				notifyWith(`Could not update blog ${blog.title}`);
			});
	};

	const loginForm = () => {
		return (
			<Togglable
				buttonOpen="Login"
				buttonClose="Cancel">
				<LoginForm
					username={username}
					password={password}
					handleUsernameChange={({ target }) => setUsername(target.value)}
					handlePasswordChange={({ target }) => setPassword(target.value)}
					handleSubmit={handleLogin}
				/>
			</Togglable>
		);
	};

	const blogForm = () => {
		return (
			<Togglable
				buttonOpen="Create new blog"
				buttonClose="Cancel"
				ref={blogFormRef}>
				<BlogForm createBlog={addBlog}/>
			</Togglable>
		);
	};

	const blogsSortedByLikes = blogs.sort((a, b) => {
		return b.likes - a.likes;
	});

	if (user === null) {
		return (
			<div>
				<h2>Log in to see blogs</h2>
				<Notification notification={notification} />
				{loginForm()}
			</div>
		);
	} else {
		return (
			<div>
				<h2>Blogs</h2>
				<p>Logged in as {user.name}</p>
				<button onClick={handleLogout}>Logout</button>
				<Notification notification={notification} />
				{blogForm()}
				{blogsSortedByLikes.map((blog) =>
					<Blog
						key={blog.id}
						blog={blog}
						updateLikes={() => updateLikes(blog.id)}
						deleteBlog={() => deleteBlog(blog.id)}
						user={user}
					/>
				)}
			</div>
		);
	}
};

export default App;