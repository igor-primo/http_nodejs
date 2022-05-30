const http = require('http');
const user_c = require('./user_c');
const book_c = require('./book_c');

const user = new user_c();
const book = new book_c();

async function request_listener(req, res){
	if(req.url === '/api/v1/user' && req.method === 'POST'){

		user.post_user(req, res);

	} else if(req.url.match(/\/api\/v1\/user_login\?*/) && req.method === 'GET'){

		user.login(req, res);

	} else if(req.url === '/api/v1/authenticate_test' && req.method === 'GET'){

		user.authenticate(req, res);

	} else if(req.url === '/api/v1/books' && req.method === 'GET'){

		await user.authenticate(req, res);
		book.get_books(req, res);

	} else if(req.url === '/api/v1/books' && req.method === 'POST'){

		const id_us = await user.authenticate(req, res);
		book.post_book(req, res, id_us);

	} else {
		res.writeHead(404, {'Content-Type': 'application/json'});
		res.end(JSON.stringify({msg: 'Route not found.'}));
	}
}

http.createServer(request_listener).listen(5000);
