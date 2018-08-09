var local = new Local();
var start = document.getElementById('toStart');
var startDiv = document.getElementById('start');
var mainDiv = document.getElementById('main');
var gameDiv = document.getElementById('game');
start.addEventListener('click', function() {
	startDiv.setAttribute('class', 'toStart toStartAnimate');
	setTimeout(function(){
		startDiv.style.display = 'none';	
	}, 400);
	setTimeout(function() {
		mainDiv.style.display = 'block';
		local.start();
		local.timeCount();
	}, 401);
})