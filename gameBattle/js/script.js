var start = document.getElementById('toStart');
var startDiv = document.getElementById('start');
var waitingDiv = document.getElementById('waiting');
var msgDiv = document.getElementById('waiting_message');
var mainDiv = document.getElementById('main');
var remoteDiv = document.getElementById('remote');
start.addEventListener('click', function() {
	var socket = io('ws://localhost:3000');
	socket.on('waiting', function(str) {
		msgDiv.innerHTML = str;
	});
	var local = new Local(socket);
	var remote = new Remote(socket);
	startDiv.setAttribute('class', 'toStart toStartAnimate');
	setTimeout(function(){
		startDiv.style.display = 'none';	
	}, 400);
	setTimeout(function() {
		waitingDiv.style.display = 'block';
	}, 401);
})