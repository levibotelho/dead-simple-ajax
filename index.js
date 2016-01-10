"use strict";

var XMLHttpRequest = null;
if (typeof window === "undefined" || window == null || window.XMLHttpRequest == null) {
	XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
} else {
	XMLHttpRequest = window.XMLHttpRequest;
}

function generateQueryString(payload) {
	if (payload == null) {
		return null;
	}

	var queryString = "";
	for (var key in payload) {
		queryString += encodeURIComponent(key);
		queryString += "=";
		queryString += encodeURIComponent(payload[key]);
		queryString += "&";
	}
	return queryString.substring(0, queryString.length - 1);
}

function wrapRequestInPromise(request, returnRawResponse) {
	return new Promise(function (resolve, reject) {
		request.onreadystatechange = function () {
			if (request.readyState !== 4) {
				return;
			}

			if (request.status >= 200 && request.status < 300) {
				if (returnRawResponse) {
					resolve(request.responseText);
				} else if (request.responseText != null && request.responseText !== "") {
					try {
						resolve(JSON.parse(request.responseText));
					} catch (e) {
						reject("Could not parse the following response as JSON: " + request.responseText);
					}
				} else {
					resolve();
				}
			} else {
				try {
					reject(JSON.parse(request.responseText));
				} catch (e) {
					reject("AJAX error:" + request.responseText);
				}
			}
		};
	});
}

function sendRequest(verb, url, encodedPayload, options) {
	var request = new XMLHttpRequest();
	var promise = wrapRequestInPromise(request, options.returnRawResponse);

	request.open(verb, url, true);

	var jsonMIMEType = "application/json";
	request.setRequestHeader("Accept", jsonMIMEType);
	request.setRequestHeader("Content-Type", jsonMIMEType + ";charset=UTF-8");
	if (typeof options.onBeforeSend === "function") {
		options.onBeforeSend(request, verb, url)
	}
	
	request.send(encodedPayload);
	return promise;
}

exports.get = function (url, payload, options) {
	var queryString = generateQueryString(payload);
	if (queryString != null) {
		url = url + "?" + queryString;
	}
	return sendRequest("GET", url, null, options);
};

exports.post = function (url, payload, options) {
	return sendRequest("POST", url, JSON.stringify(payload), options);
};

exports.put = function (url, payload, options) {
	return sendRequest("PUT", url, JSON.stringify(payload), options);
};

exports.del = function (url, payload, options) {
	return sendRequest("DELETE", url, JSON.stringify(payload), options);
};
