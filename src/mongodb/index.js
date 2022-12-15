const MONGO_URL = process.env.MONGO_URL;

const mongoClient = require("mongodb").MongoClient;

const randomKey = (val = 12) => {
	const crypto = require("crypto");
	return crypto.randomBytes(val).toString("hex");
};

/**
 * @param {email}
 **/
const emailValidator = (email) => {
	const REGEX =
		/^[a-zA-Z0-9_.+]*[a-zA-Z][a-zA-Z0-9_.+]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
	if (email.match(REGEX)) {
		return true;
	} else {
		return false;
	}
};
const connect = () => {
	const client = new mongoClient(MONGO_URL, { useNewUrlParser: true });
	client.connect((err) => {
		if (err) throw err;
		const collection = client.db("rest-api").collection("users");
		client.close();
	});
};
/**
 * @param {name}
 * @param {limit}
 * @param {email}
 * @param {password}
 * @param {key}
 **/
const createUser = (name, limit, email, password, key) => {
	const user = {
		name: name,
		email: email,
		password: password,
		limit: limit ? limit : 100,
		apikey: key ? key : randomKey(),
	};
	return new Promise((resolve, reject) => {
		mongoClient.connect(MONGO_URL, (err, db) => {
			if (err) throw err;
			const dbo = db.db("rest-api");
			dbo.collection("users").insertOne(user, (err, _user) => {
				if (err) throw err;
				resolve(user);
				db.close();
			});
		});
	});
};

// createUser("testing", 100, "testing@gmail.com" false).then(a => console.log(a))
const getUserByEmail = (email, check) =>
	new Promise((resolve, reject) => {
		mongoClient.connect(MONGO_URL, (err, db) => {
			if (err) throw err;

			let user;

			db.db("rest-api")
				.collection("users")
				.findOne(
					{
						email: email,
					},
					(err, _user) => {
						if (err) throw err;
						if (_user) {
							if (check) {
								user = true
							} else {
								user = {
									name: _user.name,
									email: _user.email,
									password: _user.password,
									limit: _user.limit,
									apikey: _user.apikey,
								};
							}
						} else {
							user = false;
						}
						resolve(user);
						db.close();
					}
				);
		});
	});
const isValidKey = (key) =>
	new Promise((resolve, reject) => {
		mongoClient.connect(MONGO_URL, (err, db) => {
			if (err) throw err;

			let user;

			db.db("rest-api")
				.collection("users")
				.findOne(
					{
						apikey: key,
					},
					(err, _user) => {
						if (err) throw err;
						if (_user) {
							user = {
								name: _user.name,
								email: _user.email,
								password: _user.password,
								limit: _user.limit,
								apikey: _user.apikey,
							};
						} else {
							user = false;
						}
						resolve(user);
						db.close();
					}
				);
		});
	});
const updateUser = async (name, limit, email, password, key) => {
	const isValid = await getUserByEmail(email);
	if (!isValid) {
		return false;
	}
	const oldUser = {
		name: isValid.name,
		email: isValid.email,
		password: isValid.password,
		limit: isValid.limit,
		apikey: isValid.apikey,
	};
	const newUser = {
		name: name ? name : isValid.name,
		email: email ? email : isValid.email,
		password: password ? password : isValid.password,
		limit: limit ? limit : isValid.limit,
		apikey: key ? key : isValid.apikey,
	};
	return new Promise((resolve, reject) => {
		mongoClient.connect(MONGO_URL, (err, db) => {
			if (err) throw err;
			const dbo = db.db("rest-api");
			dbo.collection("users").replaceOne(oldUser, newUser, (err, _user) => {
				if (err) throw err;
				resolve(_user);
				db.close();
			});
		});
	});
};
// isValidKey("Anjay").then(a => console.log(a))
// getUserByEmail("testing@gmail.com").then(a => console.log(a))
module.exports = {
	isValidKey,
	getUserByEmail,
	createUser,
	updateUser,
	emailValidator,
	connect,
};
