var Plugin = require("contentcube/plugins/plugin");

module.exports = function WebsocketChat(application) {
	var SOCKET_IO_NAMESPACE = '/chat';
	
	var chatIO = application.services.getSocketIO().of(SOCKET_IO_NAMESPACE);
	var instance = Plugin(application);
	
	instance.register = function() {		
		chatIO.on("connection", function(socket) {
			socket.on("message:send", function(message) {
				chatIO.emit("message:received", {id: socket.id, message: message});
			});
			chatIO.emit("user:connected", {id: socket.id});
		});
	};
	
	instance.unregister = function() {
		chatIO.removeAllListeners();
	};
	
	return instance;
};