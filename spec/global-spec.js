var proxyquire = require("proxyquire");

// Returns an ajax instance that has the underlying XMLHttpRequest stubbed.
function getStubbedAjax(stub) {
	proxyquire("../index.js", {
		xmlhttprequest: {
			"XMLHttpRequest": function () {
				this.open = function () {};
				this.send = function () {};
				this.setRequestHeader = function () {
					this.readyState = 4;
					this.status = 200;
					this.onreadystatechange();
				};
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
	it("works", function (done) {
		var ajax = getStubbedAjax();
		ajax.get("http://www.example.com")
			.then(done, fail);
	});
});

describe("The post method", function () {
	it("works", function (done) {
		var ajax = getStubbedAjax();
		ajax.post("http://www.example.com")
			.then(done, fail);
	});
});


describe("The put method", function () {
	it("works", function (done) {
		var ajax = getStubbedAjax();
		ajax.put("http://www.example.com")
			.then(done, fail);
	});
});

describe("The del method", function () {
	it("works", function (done) {
		var ajax = getStubbedAjax();
		ajax.del("http://www.example.com")
			.then(done, fail);
	});
});