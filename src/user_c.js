const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const {error_c, respond_err}= require('./error_c');

const MIN_NAME_L = 0;
const MIN_EMAIL_L = 8;
const MIN_PASSWORD_L = 8;
const MAX_NAME_L = 40;
const MAX_EMAIL_L = 40;
const MAX_PASSWORD_L = 18;
const EMAIL_REG = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class user_c {
	constructor(){}
	async post_user(req, res){
		req.on('data', async chunk => {
			try {
				const body = await JSON.parse(chunk.toString());
				const {name, email, password} = body;

				/* check data validity */
				if(!name || !email || !password)
					throw new error_c('Some parameters are not defined.', 300);

				if(!(MIN_NAME_L <= name.length && name.length <= MAX_NAME_L))
					throw new error_c('Name can have at least 1 character and at most 40', 300);

				if(!(MIN_EMAIL_L <= email.length && email.length <= MAX_EMAIL_L)
					|| !String(email).toLowerCase().match(EMAIL_REG))
					throw new error_c('Either email is not between 8 and 40 character inclusive or it is not a valid email.', 300);

				if(!(MIN_PASSWORD_L <= password.length && password.length <= MAX_PASSWORD_L))
					throw new error_c('Password can have at least 8 character and at most 18', 300);

				/* validity checks passed */

				/* check if email is registered */

				const email_is_q = `SELECT id FROM users
				WHERE email = $1;`;
				const email_is_v = [ email ];
				const email_is_query = await db.query(email_is_q, email_is_v);
				if(email_is_query.rows.length > 0)
					throw new error_c('Email already registered.', 401);

				/* it is not */

				/* prep the password */
				const hashed_pass = await bcrypt.hash(password, 10);

				/* ok */
				const query = `INSERT INTO users 
				VALUES(DEFAULT, $1, $2, $3);`;
				const vals = [ name, email, hashed_pass ];
				await db.query(query, vals);
				res.writeHead(201, {'Content-Type':'application/json'});
				res.end(JSON.stringify({msg: 'User created.'}));
			} catch(e){
				respond_err(e, res);
			}
		});
	}

	async login(req, res){
		try {
			let email = '';
			let password = '';
			const params = new URLSearchParams(req.url.split('?')[1]).entries();
			for(const param of params){
				if(param[0] === 'email'){
					email = param[1];
				} else if(param[0] === 'password'){
					password = param[1];
				} else {}
				/* params not sought will be ignored */
			}

			/* validity checks */	

			if(!email || !password)
				throw new error_c('Some parameters were not given.', 300);

			if(!(MIN_EMAIL_L <= email.length && email.length <= MAX_EMAIL_L)
				|| !String(email).toLowerCase().match(EMAIL_REG))
				throw new error_c('Either email is not between 8 and 40 character inclusive or it is not a valid email.', 300);

			if(!(MIN_PASSWORD_L <= password.length && password.length <= MAX_PASSWORD_L))
				throw new error_c('Password can have at least 8 character and at most 18', 300);
			/* checked */

			const query = `SELECT id, password FROM users
			WHERE email = $1;`;
			const vals = [ email ];
			const user = await db.query(query, vals);
			if(user.rows.length <= 0)
				throw new error_c('Incorrect data or user is not registered.', 401);

			const is_match = bcrypt.compareSync(password, user.rows[0].password);
			if(!is_match)
				throw new error_c('Incorrect data or user is not registered.', 401);

			/* send jwt */
			const id_us = user.rows[0].id;
			const PRIV_KEY = process.env.PRIVATE_KEY;
			const token = jwt.sign({id_us}, PRIV_KEY,{expiresIn: '2h', algorithm: 'RS256'});
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify({msg: 'Welcome.', token}));
		} catch(e) {
			respond_err(e, res);
		}
	}

	authenticate(req, res){
		try {
			if(!req.headers['authorization'])
				throw new error_c('You need to pass the authorization header with the token', 401);

			let decoded = {};
			const token = req.headers['authorization'].split(' ')[1];
			const PUB_KEY = process.env.PUBLIC_KEY;
			if(!(decoded = jwt.verify(token, PUB_KEY, {algorithms: ['RS256']})))
				throw new error_c('Invalid token.', 401);

			console.log(decoded);

			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify({msg: 'I think I know you.'}));
		} catch(e){
			respond_err(e, res);
		}
	}
}

module.exports = user_c;
