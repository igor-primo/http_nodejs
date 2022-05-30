# http_nodejs
http_nodejs is a growing http server implementing
a RESTful API using http Node.js module, which is
way more elegant than Express.js.

## Currently implemented routes

* curl -X POST http\:\/\/host\:port\/api\/v1\/user -d '{"name":"my_name","email":"email_here","password":"my_password"}'
* curl http\:\/\/host\:port\/api\/v1\/userlogin?email=email_here&password=my_password
