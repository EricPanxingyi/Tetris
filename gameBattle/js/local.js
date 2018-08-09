var Local = function(socket) {
	//游戏对象
	var game;
	var INTERVAL = 600; //ms
	var timer = null;
	//时间计数器
	var time = 0;
	//时间计时器
	var timerCount = null;
	//难度
	var level = 1;
	var lastLevel = 1;
	// var resetDiv1 = document.getElementById('reset1');
	// var resetDiv2 = document.getElementById('reset2');
	//绑定键盘事件
	var bindKeyEvent = function() {
		document.onkeydown = function(e) {
			e.preventDefault();
			if ( e.keyCode == 38 ) { //up
				game.rotate();
				socket.emit('rotate');
			} else if ( e.keyCode == 39 ) { //right
				game.right();
				socket.emit('right');
			} else if ( e.keyCode == 40 ) { //down
				game.down();
				socket.emit('down');
			} else if ( e.keyCode == 37 ) { //left
				game.left();
				socket.emit('left');
			} else if ( e.keyCode == 32 ) { //space
				game.fall();
				socket.emit('fall');
			}
		}
	}
	//移动
	var move = function() {
		if ( !game.down() ) {
			game.fixed();
			socket.emit('fixed');
			var line = game.checkClear();
			if ( line ) {
				socket.emit('line', line);
				var score = game.addScore(line);
				checkScore(score);
				if ( line > 1 ) {
					var bottomLines = generateBottomLine(line);
					socket.emit('bottomLines', bottomLines);
				}
			}
			var gameOver = game.checkGameOver();
			if ( gameOver ) {
				game.gameover(false);
				document.getElementById('remote_gameover').innerHTML = "Opponent Win!";
				socket.emit('lose');
				stop();
				// resetDiv1.style.opacity = 0;
				// resetDiv2.style.opacity = 1;
				// resetDiv2.addEventListener('click', reset, false);
			} else {
				var nextTypeStorage = generateType();
				var nextDirStorage = generateDir();
				game.performNext(nextTypeStorage, nextDirStorage);
				socket.emit('next', {type: nextTypeStorage, dir: nextDirStorage});	
			}
		} else {
			socket.emit('down');
		}
	}
	//根据分数调整level
	var checkScore = function(score) {
		if ( score > 100 ) {
			INTERVAL = 500;
			level = 2;
			if ( lastLevel == 1 ) {
				timerChange();
			} else {
				return;
			}
		} else if ( score > 365 ) {
			INTERVAL = 400;
			level = 3;
			if ( lastLevel == 2 ) {
				timerChange();
			} else {
				return;
			}
		} else if ( score > 520 ) {
			INTERVAL = 300;
			level = 4;
			if ( lastLevel == 3 ) {
				timerChange();
			} else {
				return;
			}
		} else if ( score > 613 ) {
			INTERVAL = 200;
			level = 5;
			if ( lastLevel == 4 ) {
				timerChange();
			} else {
				return;
			}
		} else if ( score > 830 ) {
			INTERVAL = 150;
			level = 6;
			if ( lastLevel == 5 ) {
				timerChange();
			} else {
				return;
			}
		} else if ( score > 912 ) {
			INTERVAL = 100;
			level = 7;
			if ( lastLevel == 6 ) {
				timerChange();
			} else {
				return;
			}
		}
	}
	//调整timer
	var timerChange = function() {
		socket.emit('level', level);
		clearInterval(timer);
		timer = null;
		timer = setInterval(move, INTERVAL);
		game.setLevel(level);
		lastLevel++;
	}
	//页面计时赋值
	var timeFunc = function() {
		socket.emit('time', time);
		game.setTime(time);
		time++;
	}
	//先初始化一次 再每秒计时
	var timeCount = function() {
		timeFunc();
		timerCount = setInterval(function(){
			timeFunc();
		},1000);
	}
	//随机生成干扰行
	var generateBottomLine = function(lineNum) {
		var lines = [];
		for ( var i = 0; i < lineNum; i++ ) {
			var line = [];
			// do {
			// 	for ( var j = 0; j < 10; j++ ) {
			// 		line.push(Math.ceil(Math.random() * 2) - 1);
			// 	}
			// 	if ( checkTailLine(line) ) {
			// 		lines.push(line);
			// 	} else {
			// 		line = [];
			// 	}
			// } while (line.length === 0);
			for ( var j = 0; j < 10; j++ ) {
				line.push(Math.ceil(Math.random() * 2) - 1);
			}
			lines.push(line);
		}
		return lines;
	}
	//检验随机生成的干扰行不全为0 或 1
	var checkTailLine = function(line) {
		var tmp = line[0];
		for ( var i = 1; i < line.length; i++ ) {
			if ( line[i] != tmp ) {
				return true;
			}
		}
		return false;
	}
	//随机生成一个方块种类
	var generateType = function() {
		return Math.ceil(Math.random() * 7) - 1;
	}
	//随机生成一个旋转次数
	var generateDir = function() {
		return Math.ceil(Math.random() * 4) - 1;
	}
	//开始
	var start = function() {
		var doms = {
			gameDiv: document.getElementById('game'),
			nextDiv: document.getElementById('next'),
			timeDiv: document.getElementById('time'),
			scoreDiv: document.getElementById('score'),
			lineDiv: document.getElementById('line'),
			levelDiv: document.getElementById('level'),
			gameoverDiv: document.getElementById('gameover')
		}
		game = new Game();
		var typeStorage = generateType();
		var dirStorage = generateDir();
		game.init(doms, typeStorage, dirStorage);
		socket.emit('init', {type: typeStorage, dir: dirStorage});
		bindKeyEvent();
		var nextTypeStorage = generateType();
		var nextDirStorage = generateDir();
		game.performNext(nextTypeStorage, nextDirStorage);
		socket.emit('next', {type: nextTypeStorage, dir: nextDirStorage});
		game.setLevel(level);
		timer = setInterval(move, INTERVAL);
		//resetDiv2.removeEventListener('click', reset, false);
	}
	//结束
	var stop = function() {
		if ( timer && timerCount ) {
			clearInterval(timer);
			clearInterval(timerCount);
		}
		timer = null;
		timerCount = null;
		time = 0;
		document.onkeydown = null;
	}
	//重置游戏
	var reset = function() {
		INTERVAL = 600;
		game.setTime(time);
		game.resetScore();
		game.resetGameOver();
		// resetDiv2.style.opacity = 0;
		// resetDiv1.style.opacity = 1;
	};
	var countDownTimer = null;
	var countDownTime = 3;
	var waitingDiv = document.getElementById('waiting');
	var mainDiv = document.getElementById('main');
	var remoteDiv = document.getElementById('remote');
	var countDownDiv = document.getElementById('countdown');
	var countDownNumDiv = document.getElementById('countdownnum');
	//倒计时开始游戏
	var countdown = function() {
		if ( countDownTime == 0 ) {
			countDownNumDiv.innerHTML = 'Start';
		} else {
			countDownNumDiv.innerHTML = countDownTime;
		}
		if ( countDownTime < 0 ) {
			countDownDiv.style.display = 'none';
			mainDiv.style.display = 'block';
			remoteDiv.style.display = 'block';
			clearInterval(countDownTimer);
			countDownTimer = null;
			start();
			timeCount();
		}
		countDownTime--;
	}
	socket.on('start', function(){
		setTimeout(function() {
			waitingDiv.style.display = 'none';
			countDownDiv.style.display = 'block';
			countdown();
			countDownTimer = setInterval(countdown, 1000);
		}, 401);
	});

	socket.on('lose', function(){
		game.gameover(true);
		stop();
	});

	socket.on('leave', function(){
		document.getElementById('gameover').innerHTML = 'Opponent lost connection!';
		document.getElementById('remote_gameover').innerHTML = 'Lost connection!';
		stop();
	});

	socket.on('bottomLines', function(data) {
		game.addTailLines(data);
		socket.emit('addTailLines', data);
	});
}