var Game = function() {
	//dom
	var gameDiv;
	var nextDiv;
	var timeDiv;
	var scoreDiv;
	var lineDiv;
	var levelDiv;
	var gameoverDiv;
	var gamingType;
	//分数
	var score = 0;
	var lines = 0;
	//矩阵
	var gameData = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	];
	//当前方块
	var cur;
	//下一个方块
	var next;
	//divs
	var nextDivs = [];
	var gameDivs = [];
	//初始化
	var initDiv = function(container, data, divs) {
		for ( var i = 0; i < data.length; i++ ) {
			var div = [];
			for ( var j = 0; j < data[0].length; j++ ) {
				var newNode = document.createElement('div');
				newNode.className = 'none';
				newNode.style.top = (i * 20) + 'px';
				newNode.style.left = (j * 20) + 'px';
				container.appendChild(newNode);
				div.push(newNode);
			}
			divs.push(div);
		}
	}
	//刷新div
	var refreshDiv = function(data, divs, type) {
		type = type === null || type === false || type === undefined || type === '' ? '' : type;
		for ( var i = 0; i < data.length; i++ ) {
			for ( var j = 0; j < data[0].length; j++ ) {
				if ( data[i][j] == 0 ) {
					divs[i][j].className = 'none';
				} else if ( data[i][j] == 1 ) {
					divs[i][j].className = 'done';
				} else if ( data[i][j] == 2 ) {
					divs[i][j].className = 'current' + type;
				}
			}
		}
	}
	//检测点是否合法
	var check = function(pos, x, y) {
		if ( pos.x + x < 0 ) { //上部
			return false;
		} else if ( pos.x + x >= gameData.length ) { //下边界
			return false;
		} else if ( pos.y + y < 0 ) { //左边界
			return false;
		} else if ( pos.y + y >= gameData[0].length ) { //右边界
			return false;
		} else if ( gameData[pos.x + x][pos.y + y] == 1 ) { //有方块
			return false;
		} else {
			return true;
		}
	}
	//检测数据是否合法
	var isValid = function(pos, data) {
		for ( var i = 0; i < data.length; i++ ) {
			for ( var j = 0; j < data[0].length; j++ ) {
				if ( data[i][j] != 0 ) {
					if ( !check(pos, i, j) ) {
						return false;
					}
				}
			}
		}
		return true;
	}
	//清楚数据
	var clearData = function() {
		for ( var i = 0; i < cur.data.length; i++ ) {
			for ( var j = 0; j < cur.data[0].length; j++ ) {
				if ( check(cur.origin, i, j) ){
					gameData[cur.origin.x + i][cur.origin.y + j] = 0;
				}
			}
		}
	}
	//设置数据
	var setData = function() {
		for ( var i = 0; i < cur.data.length; i++ ) {
			for ( var j = 0; j < cur.data[0].length; j++ ) {
				if ( check(cur.origin, i, j) ){
					gameData[cur.origin.x + i][cur.origin.y + j] = cur.data[i][j];
				}
			}
		}
	}
	//下移
	var down = function() {
		if (cur.canDown(isValid)) {
			clearData();
			cur.down();
			setData();
			refreshDiv(gameData, gameDivs, gamingType);
			return true;
		} else {
			return false;
		}
	}
	//左移
	var left = function() {
		if (cur.canLeft(isValid)) {
			clearData();
			cur.left();
			setData();
			refreshDiv(gameData, gameDivs, gamingType);
		}
	}
	//右移
	var right = function() {
		if (cur.canRight(isValid)) {
			clearData();
			cur.right();
			setData();
			refreshDiv(gameData, gameDivs, gamingType);
		}
	}
	//旋转
	var rotate = function() {
		if (cur.canRotate(isValid)) {
			clearData();
			cur.rotate();
			setData();
			refreshDiv(gameData, gameDivs, gamingType);
		}
	}
	//固定
	var fixed = function() {
		for ( var i = 0; i < cur.data.length; i++ ) {
			for ( var j = 0; j < cur.data[0].length; j++ ) {
				if ( check(cur.origin, i, j) ) {
					if ( gameData[cur.origin.x + i][cur.origin.y + j] == 2 ) {
						gameData[cur.origin.x + i][cur.origin.y + j] = 1
					}
				}
			}
		}
		refreshDiv(gameData, gameDivs)
	}
	//下一个方块
	var performNext = function(type, dir) {
		cur = next;
		gamingType = cur.type - 1;
		setData();
		next = SquareFactory.prototype.make(type, dir);
		refreshDiv(gameData, gameDivs, gamingType);
		refreshDiv(next.data, nextDivs, type);
	}
	//消行
	var checkClear = function() {
		var line = 0;
		for ( var i = gameData.length - 1; i >= 0; i-- ) {
			var clear = true;
			for ( var j = 0; j < gameData[0].length; j++ ) {
				if ( gameData[i][j] != 1 ) {
					clear = false;
					break;
				} 
			}
			if ( clear ) {
				line++;
				for ( var m = i; m > 0; m-- ) {
					for ( var n = 0; n < gameData[0].length; n++ ) {
						gameData[m][n] = gameData[m-1][n];
					}
				} 
				for ( var n = 0; n < gameData[0].length; n++ ) {
						gameData[0][n] = 0;
				}
				i++;
			}
		}
		return line;
	}
	//游戏结束
	var checkGameOver = function() {
		var gameOver = false;
		for ( var i = 0; i < gameData[0].length; i++ ) {
			if ( gameData[1][i] == 1 ) {
				gameOver = true;
			}
		}
		return gameOver;
	}
	//设置时间
	var setTime = function(time) {
		timeDiv.innerHTML = time;
	}
	//设置游戏难度
	var setLevel = function(level) {
		levelDiv.innerHTML = level;
	}
	//加分
	var addScore = function(line) {
		var s = 0;
		switch(line) {
			case 1: s = 10; break;
			case 2: s = 30; break;
			case 3: s = 60; break;
			case 4: s = 100; break;
			default: break;
		}
		lines += line;
		score += s;
		scoreDiv.innerHTML = score;
		lineDiv.innerHTML = lines;
		return score;
	}
	//重置分数
	var resetScore = function() {
		score = 0;
		scoreDiv.innerHTML = score;
	}
	//重置gameover
	var resetGameOver = function() {
		gameoverDiv.innerHTML = "";
	}
	//gameover
	var gameover = function(win) {
		if ( !win ) {
			gameoverDiv.innerHTML = "You Lose!";
		}
	}
	//初始化方块
	var init = function(doms, type, dir) {
		gameDiv = doms.gameDiv;
		nextDiv = doms.nextDiv;
		timeDiv = doms.timeDiv;
		scoreDiv = doms.scoreDiv;
		lineDiv = doms.lineDiv;
		levelDiv = doms.levelDiv;
		gameoverDiv = doms.gameoverDiv;
		next = SquareFactory.prototype.make(type, dir);
		initDiv(gameDiv, gameData, gameDivs);
		initDiv(nextDiv, next.data, nextDivs);
		refreshDiv(next.data, nextDivs, type);
	}
	//导出api
	this.init = init;
	this.down = down;
	this.left = left;
	this.right = right;
	this.rotate = rotate;
	this.fall = function() {
		while (down());
	};
	this.fixed = fixed;
	this.performNext = performNext;
	this.checkClear = checkClear;
	this.checkGameOver = checkGameOver;
	this.setTime = setTime;
	this.addScore = addScore;
	this.gameover = gameover;
	this.resetScore = resetScore;
	this.resetGameOver = resetGameOver;
	this.setLevel = setLevel;
}