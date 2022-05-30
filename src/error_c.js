class error_c extends Error {
	constructor(message, status){
		super(message);
		this.status = status;
	}
}

function respond_err(e, res){
	if(e instanceof error_c){
		res.writeHead(e.status, {'Content-Type': 'application/json'});
		res.end(JSON.stringify({msg: e.message}));
	} else {
		console.log(e);
		res.writeHead(500, {'Content-Type': 'application/json'});
		res.end(JSON.stringify({msg: 'Internal server error.'}));
	}
}

module.exports = {error_c, respond_err};
