import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import BlogForm from "./BlogForm";

test("<BlogForm /> updates parent state and calls onSubmit", () => {
	const addBlogMock = jest.fn();

	const component = render(
		<BlogForm createBlog={addBlogMock} />
	);

	const title = component.container.querySelector("#title");
	const author = component.container.querySelector("#author");
	const url = component.container.querySelector("#url");
	const form = component.container.querySelector("form");

	fireEvent.change(title, {
		target: { value: "SV Werder Bremen" }
	});

	fireEvent.change(author, {
		target: { value: "Claudio Pizarro" }
	});

	fireEvent.change(url, {
		target: { value: "www.werder.de" }
	});

	fireEvent.submit(form);
	expect(addBlogMock.mock.calls).toHaveLength(1);
	expect(addBlogMock.mock.calls[0][0].title).toBe("SV Werder Bremen");
	expect(addBlogMock.mock.calls[0][0].author).toBe("Claudio Pizarro");
	expect(addBlogMock.mock.calls[0][0].url).toBe("www.werder.de");
});