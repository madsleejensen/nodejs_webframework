var http = require("http");
var Step = require("step");
var router = require("contentcube/router");
var dispatcher = require("contentcube/dispatcher");
var httpRequest = require("contentcube/request");
var httpResponse = require("contentcube/response");

var server = http.createServer(function(request, response)
{
	request = httpRequest.decorate(request);
	response = httpResponse.decorate(response);
	
	var buffer = "";
	request.setEncoding('UTF8');
	
	request.on("data", function(chunk) {
		buffer += chunk;
	});
	
	request.on("end", function() {	
		Step(
			function route() {
				router.route(request, this);
			},
			function dispatch(error) {
				if (error) throw error;
				dispatcher.dispatch(request, response, this);
			},
			function sendResponse(error) {
				if (error) {
					console.log("error: " + error.message);
					return;
				}
				
				response.end();
			}
		);
	});
});

server.listen(8123);