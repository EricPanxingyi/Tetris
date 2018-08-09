var Remote = function(socket) {
	//游戏对象
	var game;
	
	var bindEvents = function() {
		socket.on('init', function(data) {
			start(data.type, data.dir);
		});
		socket.on('next', function(data) {
			game.performNext(data.type, data.dir);
		});
		socket.on('rotate', function(data) {
			game.rotate();
		});
		socket.on('down', function(data) {
			game.down();
		});
		socket.on('left', function(data) {
			game.left();
		});
		socket.on('right', function(data) {
			game.right();
		});
		socket.on('fall', function(data) {
			game.fall();
		});
		socket.on('fixed', function(data) {
			game.fixed();
		});
		socket.on('line', function(data) {
			game.checkClear();
			game.addScore(data);
		});
		socket.on('time', function(data) {
			game.setTime(data);
		});
		socket.on('level', function(data) {
			game.setLevel(data);
		});
		socket.on('addTailLines', function(data) {
			game.addTailLines(data);
		});
		socket.on('lose', function(data) {
			document.getElementById('remote_gameover').innerHTML = "Opponent Lose!";
		});
	}
	//开始
	var start = function(type, dir) {
		var doms = {
			gameDiv: document.getElementById('remote_game'),
			nextDiv: document.getElementById('remote_next'),
			timeDiv: document.getElementById('remote_time'),
			scoreDiv: document.getElementById('remote_score'),
			lineDiv: document.getElementById('remote_line'),
			levelDiv: document.getElementById('remote_level'),
			gameoverDiv: document.getElementById('remote_gameover')
		}
		game = new Game();
		game.init(doms, type, dir);
	}
	
	bindEvents();
}