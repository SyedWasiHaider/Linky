'use strict';
var redis = require('redis');
var bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
var client = redis.createClient();

//Get the url for the given code
function getUrl(req, res, next) {
	var code = req.params.code;
	console.log("code is " + code);
	if (code == undefined){
		res.send(404, new Error("Please provide a valid url code"));
	}
	return client.getAsync(code).then(function(result){
		if (result == null){
			return Promise.resolve(res.send(404, new Error("Your url is invalid or has expired")));
		}else{
			return Promise.resolve(res.send(200, result));
		}
	}).then(function(){
		return Promise.resolve(next());
	})
}

//TODO: provide option for expiry. Perhaps a min of 10 seconds and max of 30 minutes.
//Create a short code for a url
function create(req, res, next) {
	var url = req.body.url;
	if (url == undefined){
		res.send(400, new Error("Please provide a json object with a url field"))
	}

	 generateShortForUrl().then(function(shorty){
		client.setAsync(shorty, url).then(function(result){
			return client.expireAsync(shorty, 5*60);
		}).then(function(){
			return Promise.resolve(res.send(201, shorty));
		}).then(function(){
			return Promise.resolve(next());
		})
	 });
}

//TODO: Think about optimizations for duplicate urls. What are the implications of use the same code and renewing the expiration?
//TODO: Handle infinite recursion / eviction when all 4 digit values 
//in base36 are taken.
function generateShortForUrl(){
	var shortCode =  Math.random().toString(36).substring(2,6);
	return client.getAsync(shortCode).then(function(result){
		if (result == null){
			return Promise.resolve(shortCode);
		//the code already exists. Try to generate another.
		}else{
			return generateShortForUrl();
		}
	})
}

module.exports.urlcontroller = { create, getUrl }

