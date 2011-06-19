module.exports = new function()
{
	var database = global.application.getDatabase();
	var collection = database.collection('guestbook');
	var instance = {};
	
	instance.createNew = function(data, callback) {
		var insertData = {
			name: data.name,
			comment: data.comment,
			created: new Date()
		};
		
		collection.insert(insertData, callback);
	};
	
	instance.findAll = function(callback) {
		collection.find().toArray(callback);
	};
	
	return instance;
};