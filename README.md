# dead-simple-ajax

dead-simple-ajax does three things:

1. Provides promise-enabled Ajax for CommonJS environments (Node JS/Browserify)
2. Automatically deserializes responses as JSON, unless you tell it not to
3. Allows custom request modification via a callback

## Installing

The entire codebase is located in `index.js`. You can either copy that file directly into your project (and `npm install -S xmlhttprequest` if you're using Node), or use the NPM module (`npm install -S dead-simple-ajax`).

## API

The API consists of four methods:

- `get(url, payload, options)`
- `post(url, payload, options)`
- `put(url, payload, options)`
- `del(url, payload, options)`

**url**: `string`

The URL to which the request will be sent.

**payload**: `object`

An object that will be turned into a query string in the case of `get`, or JSON-serialized into the request payload for `post`, `put`, and `del`.

**options**: `object`

An object that looks like the following:

    {
	    onBeforeSend: function (request, verb, url) {
			// Modify the request object.
		},
		returnRawResponse: true
	}

`onBeforeSend` is called when the XMLHttpRequest object is constructed, just before it is sent, and allows you to modify the request. If you need to set HTTP headers, this is where you do it. The method takes three arguments:

- `request` contains the raw XMLHttpRequest object.
- `verb` contains the string of the HTTP verb being used ("GET", "POST", etc.).
- `url` contains the url to which the request is being sent.

`returnRawResponse`, when true, prevents the response from being deserialized as JSON into a JavaScript object.

## Example

    var ajax = require("dead-simple-ajax");
	
	// Make a GET request to https://www.example.com?foo=bar.
	ajax.get("https://www.example.com", {foo: "bar"})
		.then(function (response) {
			// Do something.
		}, function (error) {
			// Handle the error.
		});
		
	// Make a POST request to https://www.example.com with a JSON payload of `{foo: "bar"}`.
	ajax.post("https://www.example.com", {foo: "bar"})
		.then(function (response) {
			// Do something.
		}, function (error) {
			// Handle the error.
		});
		
	// Make a PUT request to https://www.example.com with a JSON payload of `{foo: "bar"}`,
	// and set the Authorization header before sending.
	function setHeader(request, verb, url) {
		request.setRequestHeader("Authorization", "supersecretvalue");
	}
	
	ajax.post("https://www.example.com", {foo: "bar"}, {onBeforeSend: setHeader})
		.then(function (response) {
			// Do something.
		}, function (error) {
			// Handle the error.
		});
		
	// Make a DELETE request to https://www.example.com and do not deserialize the response.	
	ajax.post("https://www.example.com", null, {returnRawResponse: true})
		.then(function (response) {
			// Do something.
		}, function (error) {
			// Handle the error.
		});