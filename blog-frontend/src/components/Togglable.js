import React, { useState, useImperativeHandle } from "react";
import PropTypes from "prop-types";

const Togglable = React.forwardRef((props, ref) => {
	const [visible, setVisible] = useState(false);

	const hideWhenVisible = { display: visible ? "none" : "" };
	const showWhenVisible = { display: visible ? "" : "none" };

	const toggleVisibility = () => {
		setVisible(!visible);
	};

	useImperativeHandle(ref, () => {
		return {
			toggleVisibility
		};
	});

	return (
		<div>
			<div style={hideWhenVisible}>
				<button onClick={toggleVisibility}>{props.buttonOpen}</button>
			</div>
			<div style={showWhenVisible} className="togglableContent">
				{props.children}
				<button onClick={toggleVisibility}>{props.buttonClose}</button>
			</div>
		</div>
	);
});

Togglable.propTypes = {
	buttonOpen: PropTypes.string.isRequired,
	buttonClose: PropTypes.string.isRequired,
};

Togglable.displayName = "Togglable";

export default Togglable;