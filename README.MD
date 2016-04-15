# Linky : Url Shortener

I created this in order to brush up on nodejs and tackle a simple but interesting
problem. I've setup the basic REST API. You can post with a url and get a code.
You can then use that code to get the url back.

## Requirements

* redis-server
* node

## Setup

Assuming your redis-server is running

`npm install`

`node app.js`

## Usage

Using cURL or Postman, make POST on localhost:8080/url with this json:

``` 
{ url : "www.someawesomewebsite.com" }
```

Once you get a code, test out that it works by doing a GET on localhost:8080/yourcode and you should get your url back.

## Small TODO

* Handle infinite recursion / eviction when all 4 digit values 
in base36 are taken.
* Add ability to customize expirations
* Think about duplicate urls and possible optimizations and implications.
* Send code via email

# Large TODO

* Think about rate limiting requests from IP which seem to be "code-scanning" (i.e. they're iterating through base36 values to find urls).
* Add an admin dashboard