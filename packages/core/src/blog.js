// blog.js
import { createContentType } from "./ContentTypes.js";
import { textField } from "./Fields";

const BlogPost = createContentType("BlogPost", {
	title: textField("title", { required: true, maxLength: 200 }),
	body: textField("body", { required: true }),
	//publishedDate: dateField("publishedDate"),
	// ... other fields
});

// Usage example:

(async function () {
	try {
		const newPostData = {
			title: "My Awesome Blog Post",
			body: "This is the content of the blog post.",
			//publishedDate: new Date(),
			// ... other field values
		};

		const newPost = await BlogPost.create(newPostData);
		console.log(newPost);
	} catch (error) {
		console.error("Failed to create post:", error.message);
	}
})();
