var proxyquire = require("proxyquire");

var exampleUrl = "http://www.example.com";

// We only stub xmlhttprequest once because doing so for each test leads to some weird results.
var wasOpenCalled, wasSendCalled, headers = {}, calledVerb, openedUrl, openedAsync, passedPayload;
var ajax = proxyquire("../index.js", {
	xmlhttprequest: {
		"XMLHttpRequest": function () {
			this.open = function (verb, url, async) {
				wasOpenCalled = true;
				calledVerb = verb;
				openedUrl = url;
				openedAsync = async;
			};

			this.send = function (payload) {
				wasSendCalled = true;
				this.readyState = 4;
				this.status = 200;
				this.onreadystatechange();
				passedPayload = payload;
			};

			this.setRequestHeader = function (key, value) {
				headers[key] = value;
			};
		}
	}
});

describe("The get method", function () {
	beforeAll(function (done) {
		ajax.get(exampleUrl)
			.then(done, fail);
	});

	it("works", function () {});

	it("opens the web request", function () {
		expect(wasSendCalled).toBe(true);
	});

	it("sends the web request", function () {
		expect(wasOpenCalled).toBe(true);
	});

	it("sets the Accept header to JSON", function () {
		expect(headers.Accept).toBe("application/json");
	});

	it("does not set the Content-Type header", function () {
		expect(headers["Content-Type"]).toBe(undefined);
	});

	it("opens the connection with the GET verb", function () {
		expect(calledVerb).toBe("GET");
	});

	it("opens the connection to the correct URL", function () {
		expect(openedUrl).toBe(exampleUrl);
	});

	it("opens the connection as async", function () {
		expect(openedAsync).toBe(true);
	});

	describe("calls the onBeforeSend callback", function () {
		var onBeforeSendCalled, passedRequest, passedVerb, passedUrl;
		beforeAll(function (done) {
			ajax.get(exampleUrl, null, {
				onBeforeSend: function (request, verb, url) {
					onSendCalled = true;
					passedRequest = request;
					passedVerb = verb;
					passedUrl = url;
				}
			}).then(done, fail);
		});

		it("when one is provided", function () {
			expect(onSendCalled).toBe(true);
		});

		it("with a request object as the first parameter", function () {
			// Good enough test that it's the XHR object.
			expect(typeof passedRequest.onreadystatechange).toBe("function");
		});

		it("with the GET verb as the second parameter", function () {
			expect(passedVerb).toBe("GET");
		});

		it("with the URL as the third parameter", function () {
			expect(passedUrl).toBe(exampleUrl);
		});
	});

	describe("when passed parameters", function () {
		beforeAll(function (done) {
			ajax.get(exampleUrl, {foo: "bar baz"})
				.then(done, fail);
		});

		it("encodes them into the URL query string", function () {
			expect(openedUrl).toBe(exampleUrl + "?foo=bar%20baz");
		});

		it("does not pass them as a payload", function () {
			expect(passedPayload).toBe(null);
		});
	});
});

describe("The post method", function () {
	it("works", function (done) {
		ajax.post(exampleUrl)
			.then(done, fail);
	});
});


describe("The put method", function () {
	it("works", function (done) {
		ajax.put(exampleUrl)
			.then(done, fail);
	});
});

describe("The del method", function () {
	it("works", function (done) {
		ajax.del(exampleUrl)
			.then(done, fail);
	});
});