import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import Blog from "./Blog";

describe("<Blog />", () => {
	let blog;
	let user;
	let mockHandlerLikes;
	let mockHandlerDelete;
	let component;

	beforeEach(() => {
		blog = {
			title: "So many things to learn.",
			author: "Ngoc",
			url: "www.gmx.de",
			likes: 0,
		};

		user = {
			title: "So many things to learn.",
			author: "Ngoc",
			url: "www.gmx.de",
			likes: 0,
		};

		mockHandlerLikes = jest.fn();
		mockHandlerDelete = jest.fn();

		component = render(
			<Blog
				blog={blog}
				user={user}
				updateLikes={mockHandlerLikes}
				deleteBlog={mockHandlerDelete}
			/>
		);
	});

	test("renders title", () => {
		component.debug();
		expect(component.container).toHaveTextContent("So many things to learn.");
	});

	test("renders author", () => {
		expect(component.container).toHaveTextContent("Ngoc");
	});

	test("at start children (url and likes) are not displayed", () => {
		const div = component.container.querySelector(".togglableContent");
		const url = component.getByText("www.gmx.de");
		const likes = component.container.querySelector(".likes");

		expect(div).toContainElement(url);
		expect(div).toContainElement(likes);
		expect(div).toHaveStyle("display: none");
	});

	test("after clicking button, url and likes are displayed", () => {
		const button = component.getByText("view");
		fireEvent.click(button);

		const div = component.container.querySelector(".togglableContent");
		expect(div).not.toHaveStyle("display: none");
	});

	test("clicking like twice will call the event handler twice", () => {
		const button = component.getByText("Like");

		fireEvent.click(button);
		fireEvent.click(button);

		expect(mockHandlerLikes.mock.calls).toHaveLength(2);
	});
});

