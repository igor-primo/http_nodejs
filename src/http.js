const http = require('http');
const user_c = require('./user_c');

const user = new user_c();

function request_listener(req, res){
	if(req.url === '/api/v1/user' && req.method === 'POST'){

		user.post_user(req, res);

	} else if(req.url.match(/\/api\/v1\/user_login\?*/) && req.method === 'GET'){

		user.login(req, res);

	} else if(req.url === '/api/v1/authenticate_test' && req.method === 'GET'){

		user.authenticate(req, res);

	} else {
		res.writeHead(404, {'Content-Type': 'application/json'});
		res.end(JSON.stringify({msg: 'Route not found.'}));
	}
}

http.createServer(request_listener).listen(5000);
