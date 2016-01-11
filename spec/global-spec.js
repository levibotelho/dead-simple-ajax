var proxyquire = require("proxyquire");

var exampleUrl = "http://www.example.com";

// Returns an ajax instance that has the underlying XMLHttpRequest stubbed.
function getStubbedAjax(stub) {
	proxyquire("../index.js", {
		xmlhttprequest: {
			"XMLHttpRequest": function () {
				if (stub != null) {
					for (var method in stub) {
						this[method] = stub[method];
					}
				}
			}
		}
	});
	return require("../index.js");
}

describe("The get method", function () {
	var ajax, stub, wasOpenCalled, wasSendCalled, headers = {};
	beforeAll(function (done) {
		stub = {
			open: function () {
				wasOpenCalled = true;
			},
			send: function () {
				wasSendCalled = true;
				this.readyState = 4;
				this.status = 200;
				this.onreadystatechange();
			},
			setRequestHeader: function (key, value) {
				headers[key] = value;
			}
		};
		ajax = getStubbedAjax(stub);
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
});

describe("The post method", function () {
	it("works", function (done) {
		var ajax = getStubbedAjax();
		ajax.post(exampleUrl)
			.then(done, fail);
	});
});


describe("The put method", function () {
	it("works", function (done) {
		var ajax = getStubbedAjax();
		ajax.put(exampleUrl)
			.then(done, fail);
	});
});

describe("The del method", function () {
	it("works", function (done) {
		var ajax = getStubbedAjax();
		ajax.del(exampleUrl)
			.then(done, fail);
	});
});