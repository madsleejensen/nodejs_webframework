var RemoteProcedureCallCreator = function(host) {
	
	var instance = EmitterCreator();
	var connection = io.connect(host);
	var channel = connection.socket.of('/rpc');
	var callbacks = {};
	
	channel.on('response:rpc', onRemoteProcedureResponse);
	channel.on('response:meta_descriptions', onResponseMetaDescriptions);
	
	function onRemoteProcedureResponse (response) {
		if (!response) return;
		if (!callbacks[response.requestId]) return;
		
		callbacks[response.requestId].apply(null, response.arguments);
		callbacks[response.requestId] = null;
	}
	
	function onResponseMetaDescriptions (descriptions) {
		
		for (var name in descriptions) {
			var proxySchema = descriptions[name];
			var proxy = {};
			
			for (var member in proxySchema) {
				if (proxySchema[member] == 'method') {
					
					proxy[member] = function() {
						var requestId = new Date().getTime();
						var args = Array.prototype.slice.call(arguments);
						var callback = args.pop();
						
						channel.emit("request:rpc", {
							arguments: args,
							requestId: requestId,
							name: name,
							method: member
						});
						
						callbacks[requestId] = callback;
					};
					
				}
			}
			
			instance[name] = proxy;
		}
		
		instance.emit("received:meta_descriptions", [descriptions]);
	}
	
	channel.emit("request:meta_descriptions");
	
	return instance;
};