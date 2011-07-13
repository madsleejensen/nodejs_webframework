var Path = require("contentcube/path");

module.exports = function () {

	application.plugins.addPath(Path.getModulePath('examples'), function() {
		
	});	
};