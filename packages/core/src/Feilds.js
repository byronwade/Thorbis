// fields.js

function textField(name, options = {}) {
	return { name, type: "text", ...options };
}

function dateField(name, options = {}) {
	return { name, type: "date", ...options };
}

// ... More field types as needed

export {
	textField,
	dateField,
	// ... Export other field types
};
