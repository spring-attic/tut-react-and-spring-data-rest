define(function(require) {
	'use strict';

	var SockJS = require('sockjs-client'); // <1>
	require('stomp-websocket'); // <2>

	return {
		register: register
	};

	function register(registrations) {
		var socket = SockJS('/payroll'); // <3>
		var stompClient = Stomp.over(socket);
		stompClient.connect({}, function(frame) {
			registrations.forEach(function (registration) { // <4>
				stompClient.subscribe(registration.route, registration.callback);
			});
		});
	}

});
