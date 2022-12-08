module.exports = {
	success: {
		default: true,
		code: 200,
		text: "success",
	},
	error: {
		internalError: {
			status: false,
			message: "Internal Server Error",
		},
		url: {
			status: false,
			message: "Missing url parameter !",
		},
		default: {
			status: false,
			message: "Request error !",
		},
		image: {
			status: false,
			message: "Please provide url contain image",
		},
		missing: {
			status: false,
			message: "Some parameter are missing",
		},
		query: {
			status: false,
			message: "Missing parameter query",
		},
		notAllowed: {
			status: false,
			message: "Method not allowed",
		},
	},
	creator: "Frieren",
};
