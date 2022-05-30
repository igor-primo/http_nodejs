const db = require('./db');
const {respond_err, error_c} = require('./error_c');

const MIN_NAME_L = 0;
const MIN_EMAIL_L = 8;
const MIN_PASSWORD_L = 8;
const MAX_NAME_L = 40;
const MAX_EMAIL_L = 40;
const MAX_PASSWORD_L = 18;

class book_c {
	constructor(){}
	async get_books(req, res){
		try {
			const q = `SELECT * FROM books;`;
			const { rows } = await db.query(q);
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(rows));
		} catch (e){
			respond_err(e, res);
		}
	}

	async post_book(req, res, id_us){
		req.on('data', async chunk => {
			try {
				const body = await JSON.parse(chunk.toString());
				let {name, author, pub_date, synopsis} = body;

				if(!name || !author || !pub_date)
					throw new error_c('Some parameters were not given.', 300);

				if(!synopsis) synopsis = '';

				if(synopsis && !(1 <= synopsis.length && synopsis.length <= 300))
					throw new error_c('Synopsis out of bounds.', 300);

				if(!(MIN_NAME_L <= name.length <= MAX_NAME_L))
					throw new error_c('Name length is not within bounds.', 300);

				if(!(MIN_NAME_L <= author.length <= MAX_NAME_L))
					throw new error_c('Author name length is not within bounds.', 300);

				const q = `INSERT INTO books
				VALUES(DEFAULT, $1, $2, $3, $4, $5);`;
				const v = [ name, author, pub_date, synopsis, id_us ];
				await db.query(q, v);

				res.writeHead(201, {'Content-Type': 'application/json'});
				res.end(JSON.stringify({msg: 'Book posted.'}));
			} catch(e){
				respond_err(e, res);
			}
		});
	}
}

module.exports = book_c;
