const app = require("./src/app");

let address;
try {
	address = require("ip").address();
} catch {
	address = false;
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
	/* eslint-disable no-console */
	console.log(`Listening: http://${address ? address : "localhost"}:${port}`);
	/* eslint-enable no-console */
});
