/*========================================
        DEPENDENCIES
========================================*/
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
// const usersService = require('../../src/utilities/users-service')

/*========================================
        EXPORTS
========================================*/
module.exports = {
	create,
	login,
	checkToken,
	remove,
	update,
};

/*========================================
        USER FUNCTIONS
========================================*/
function checkToken(req, res) {
	console.log('req.user', req.user);
	res.status(401).json();
}

async function login(req, res) {
	try {
		const user = await User.findOne({ email: req.body.email });
		console.log(req.body);

		if (!user) throw new Error();
		const match = await bcrypt.compare(req.body.password, user.password);
		if (!match) throw new Error();
		res.json(createJWT(user));
	} catch {
		res.status(400).json('Invalid Credentials');
	}
}

async function create(req, res) {
	try {
		const user = await User.create(req.body);
		const token = createJWT(user);
		res.json(token);
	} catch (err) {
		res.status(400).json(err);
	}
}

async function remove(req, res) {
	try {
		const userId = req.user._id;
		await User.findByIdAndRemove(userId);
		console.log('REMOVED USER');
	} catch (err) {
		res.status(400).json(err);
	}
	console.log('usrsvc logout after delete');
	// setUser(null)
}

async function update(req, res) {
	const id = req.params.id;
	console.log(id);
	console.log(req.body);

	const newName = await User.findByIdAndUpdate(
		id,
		{ name: 'Tim', email: 'tim@gmail.com' },
		{ new: true }
	);
	console.log(newName);
}

/*========================================
        HELPER FUNCTIONS
========================================*/
// Reusable JWT creation
function createJWT(user) {
	return jwt.sign({ user }, process.env.SECRET, { expiresIn: '24hr' });
}
