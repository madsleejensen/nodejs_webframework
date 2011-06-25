var Http = require("http");

exports.findLatest = function(callback) {
	var options = {
		host: 'search.twitter.com',
		port: 80,
		path: '/search.json?q=nodejs'
	}
	var request = Http.request(options, function(response) {
		var buffer = "";
		response.setEncoding("utf8");
		response.on("data", function(chunk) {
			buffer += chunk;
		});
		response.on("end", function() {
			callback(null, buffer);
		});
	});
	
	request.end();
};