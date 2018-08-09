var Local = function() {
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
	var resetType = 0;
	var resetDiv1 = document.getElementById('reset1');
	var resetDiv2 = document.getElementById('reset2');
	//绑定键盘事件
	var bindKeyEvent = function() {
		document.onkeydown = function(e) {
			e.preventDefault();
			if ( e.keyCode == 38 ) { //up
				game.rotate();
			} else if ( e.keyCode == 39 ) { //right
				game.right();
			} else if ( e.keyCode == 40 ) { //down
				game.down();
			} else if ( e.keyCode == 37 ) { //left
				game.left();
			} else if ( e.keyCode == 32 ) { //space
				game.fall();
			}
		}
	}
	//移动
	var move = function() {
		if ( !game.down() ) {
			game.fixed();
			var line = game.checkClear();
			if ( line ) {
				var score = game.addScore(line);
				checkScore(score);
			}
			var gameOver = game.checkGameOver();
			if ( gameOver ) {
				game.gameover(false);
				stop();
				clearInterval(timerCount);
				timer = null;
				time = 0;
				resetDiv1.style.opacity = 0;
				resetDiv2.style.opacity = 1;
				resetDiv2.addEventListener('click', reset, false);
			} else {
				game.performNext(generateType(), generateDir());	
			}
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
		} else if ( score > 1014 ) {
			stop();
			surprise();
		}
	}
	//调整timer
	var timerChange = function() {
		clearInterval(timer);
		timer = null;
		timer = setInterval(move, INTERVAL);
		game.setLevel(level);
		lastLevel++;
	}
	//页面计时赋值
	var timeFunc = function() {
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
		game.init(doms, generateType(), generateDir());
		bindKeyEvent();
		game.performNext(generateType(), generateDir());
		game.setLevel(level);
		timer = setInterval(move, INTERVAL);
		if ( resetType == 1 ) {
			timeCount();
		} 
		resetDiv2.removeEventListener('click', reset, false);
	}
	//结束
	var stop = function() {
		if ( timer ) {
			clearInterval(timer);
			timer = null;
		}
		document.onkeydown = null;
	}
	//重置游戏
	var reset = function() {
		clearInterval(timer);
		clearInterval(timerCount);
		timer = null;
		time = 0;
		INTERVAL = 600;
		game.setTime(time);
		game.resetScore();
		game.resetGameOver();
		resetDiv2.style.opacity = 0;
		resetDiv1.style.opacity = 1;
		resetType = 1;
		start();
	};

	var surprise = function() {
		var gameDiv = document.getElementById('game'),
			rightDiv = document.getElementById('right'),
			nextDiv = document.getElementById('next'),
			infoDiv = document.getElementsByClassName('info'),
			surpriseDiv = document.getElementsByClassName('surprise'),
			circleDiv = document.getElementById('circle');
		gameDiv.style.opacity = '0.3';
		rightDiv.style.opacity = '0.3';
		nextDiv.style.opacity = '0.3';
		infoDiv[0].style.opacity = '0.3';
		surpriseDiv[0].style.display = 'block';
	}
	this.start = start;
	this.reset = reset;
	this.timeCount = timeCount;
}