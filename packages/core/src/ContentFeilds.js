// ContentFeilds.js
function textField(name, options = {}) {
	return {
		name,
		type: "text",
		...options,
	};
}

function imageField(name, options = {}) {
	return {
		name,
		type: "text", // Assuming image URLs. For actual image blobs, consider using 'file'
		...options,
	};
}

// ... Add more field types as necessary

export {
	textField,
	imageField,
	// ... export other field types
};
