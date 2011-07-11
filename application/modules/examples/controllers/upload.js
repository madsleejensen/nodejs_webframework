var FileSystem = require("fs");
var Step = require("step");
var ControllerCreator = require("contentcube/controller");

module.exports = function(application, request, response) {
	var instance = ControllerCreator(application, request, response);
		instance.layout = 'layouts/example_layout.ejs';
	
	instance.indexAction = function() {
		instance.renderViewWithLayout('pages/upload.form.ejs', null, this);	
	};
	
	instance.doUploadAction = function() {
		var callback = this;
		var file = request.files('my_file'); // file is an instance of formidable.File
		
		var viewData = {};
		if (file) {
			var savepath = application.config.get('system.url') + 'uploads/' + file.name;
			viewData.title = "Great you've uploaded the file: " + file.name;
			
			FileSystem.rename(file.path, savepath, function() {
				viewData.link = savepath;
				instance.renderViewWithLayout('pages/upload.display.ejs', viewData, callback);
			});
		}
		else {
			viewData.title = "You did not pick any files to upload.";
			instance.renderViewWithLayout('pages/upload.display.ejs', viewData, this);
		}
	};
	
	return instance;
};
