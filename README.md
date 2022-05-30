# http_nodejs
http_nodejs is a growing http server implementing
a RESTful API using http Node.js module, which is
way more elegant than Express.js.

## Currently implemented routes

* curl -X POST http\:\/\/host\:port\/api\/v1\/user -d '{"name":"my_name","email":"email_here","password":"my_password"}'
* curl "http\:\/\/host\:port\/api\/v1\/userlogin?email=email_here&password=my_password"
* With the token as an environment variable, test it: curl http\:\/\/host:port\/api\/v1\/authenticate_test -H 'Authorization: Bearer '"$TOKEN"''
* Get a list of books: curl http\:\/\/host:port\/api\/v1\/books -H 'Authorization: Bearer '"$TOKEN"''
* Post a book recomendation: curl -X POST http\:\/\/host:port\/api\/v1\/books -H 'Authorization: Bearer '"$TOKEN"''
