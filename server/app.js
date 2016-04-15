'use strict';

var restify = require('restify');
var urlcontroller = require('./Controllers/urlcontroller.js').urlcontroller
var server = restify.createServer();

server.use(restify.gzipResponse());
server.use(restify.bodyParser());
server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

server.post('/url', urlcontroller.create);
server.get('/:code', urlcontroller.getUrl)