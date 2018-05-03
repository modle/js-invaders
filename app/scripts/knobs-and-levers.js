// abstract common knobsAndLevers and move them to canvas-libs
var knobsAndLevers = {
  init : function() {
    this.general.init(this);
    this.invaders.init(this);
    this.player.init(this);
    this.lasers.init(this);
    this.shields.init(this);
    this.text.init(this);
    console.log('knobsAndLevers initialized');
  },
  resetCheats : function() {
    this.lasers.resetCheats();
    this.player.resetCheats();
    this.game.activeCheats = {};
    console.log('cheats reset');
  },
  toggleParameter : function(parameter) {
    parameter.value = parameter.value === parameter.default ? parameter.setting.value : parameter.default;
    parameter.setting.state = parameter.setting.state === 'OFF' ? 'ON' : 'OFF';
    console.log(parameter);
  },
  resetParameter : function(parameter) {
    parameter.value = parameter.default;
    parameter.setting.state = 'OFF';
  },
  mediaPath : "app/static/media/images/",
  general : {
    init : function(configs) {
      this.gridSquareSideLength = Math.floor(configs.canvas.width / configs.canvas.gridDivisor);
      console.log('general defaults initialized');
    },
  },
  canvas : {
    width : 800,
    height : 800,
    gridDivisor : 25,
  },
  targetLeaderboard : 'invaderLeaderboard',
  game : {
    playerCollisionsEnabled : true,
    interval : {
      min : 0,
      max : 0,
    },
    sounds : {
      value : true,
      default : true,
      setting : {
        value : false,
        state : 'ON',
        text : 'SOUNDS',
        render : function() {
          return supporting.align(this.text) + this.state;
        },
      },
    },
    gameOverDelay : 600,
    startLevel : 0,
    maxShields : 5,
    tier : {
      incrementScore : 10000,
      current: 1,
      max : 5,
      isMaxed : false,
      update : function(newTier) {
        this.current = newTier;
        this.isMaxed = this.current >= this.max ? true : false;
      },
    }
  },
  invaders : {
    baseSpeed : 10,
    initialAmount : 10,
    maxNumber : 10,
    pointValue : 20,
    args : {
      y : 0,
      extraArgs : {
        animationInterval : 50,
        hitPoints : 1,
        type : 'invader',
      },
      sprites : {
        one : {activeIndex : 0, files : ['invader-a-1.png', 'invader-a-2.png'], images : []},
      },
      getSpriteKey : function(obj) {
        return 'one';
      },
    },
    defaults : {
      directionX : 1,
      reverseDirectionX : false,
      moveVertically : true,
      updated : false,
    },
    init : function(configs) {
      this.args.width = configs.general.gridSquareSideLength;
      this.args.height = configs.general.gridSquareSideLength;
      this.args.x = configs.canvas.width / 2;
      console.log('invader defaults initialized');
    },
  },
  components : {
    imageTypes : ['invader', 'shield', 'player'],
  },
  dom : {
    blogUrl : 'http://blog.matthewodle.com/category/space-invaders/',
    sourceUrl : 'https://gitlab.com/taciturn-pachyderm/space-invaders',
    gifLocation : 'app/static/media/images/background.gif',
  },
  lasers : {
    speed : {
      value : 5,
      default : 5,
      setting : {
        value : 15,
        state : 'OFF',
        text : 'FASTER LASERS',
        render : function() {
          return supporting.align(this.text) + this.state;
        },
      },
    },
    quantity : {
      value : 1,
      default : 1,
      setting : {
        value : 5,
        state : 'OFF',
        text : 'MORE LASERS',
        render : function() {
          return supporting.align(this.text) + this.state;
        },
      },
    },
    interval : 10,
    args : {
      color : 'purple',
      extraArgs : {type : 'laser', speed : {x : 0, y : 0}},
    },
    init : function(configs) {
      this.args.width = configs.general.gridSquareSideLength / 10;
      this.args.height = configs.general.gridSquareSideLength * 0.5;
      console.log('laser defaults initialized');
    },
    resetCheats : function() {
      knobsAndLevers.resetParameter(this.speed);
      knobsAndLevers.resetParameter(this.quantity);
    },
  },
  player : {
    defaultLives : 3,
    dimensions : {width : 30, height : 30},
    args : {
      width : 100,
      height : 40,
      y : 750,
      extraArgs : {
        type : 'player',
        speed : {x : 0, y : 0},
      },
      sprites : {
        player1 : {files : ["player1.png"], images : []},
        player2 : {files : ["player2.png"], images : []},
      },
      getSpriteKey : function(obj) {
        return obj.name ? obj.name : 'player1';
      },
      constructorFunctions : {
        setX : function(player) {
          player.x = knobsAndLevers.player.startX[Object.keys(players.players).length];
        },
      },
    },
    speed : {
      value : 2,
      default : 2,
      setting : {
        value : 4,
        state : 'OFF',
        text : 'FASTER SHIP',
        render : function() {
          return supporting.align(this.text) + this.state;
        },
      },
    },
    init : function(configs) {
      this.startX = [
        (configs.canvas.width - this.dimensions.width * 2) * 0.5,
        (configs.canvas.width + this.dimensions.width * 2) * 0.5,
      ],
      this.startY = configs.canvas.height - this.dimensions.height - 1;
    },
    resetCheats : function() {
      knobsAndLevers.resetParameter(this.speed);
    },
  },
  shields : {
    initialAmount : 4,
    side : 0,
    args : {
      extraArgs : {
        hitPoints : 1,
        type : 'shield',
      },
      sprites : {
        one : {files : ['shield-1.png'], images : []},
      },
      getSpriteKey : function(obj) {
        return 'one';
      },
    },
    init : function(configs) {
      this.args.width = configs.general.gridSquareSideLength * 4;
      this.args.height = configs.general.gridSquareSideLength * 3;
      console.log('shield defaults initialized');
    },
  },
  text : {
    font : "press-start",
    baseParams : {
      fontSize : "20px",
      color : "black",
      extraArgs : {type:"text"},
      gameInfoHeight : 40,
    },
    baseBackgroundParams : {
      color : "lightgrey",
      x : 0,
      extraArgs : {type:"background"},
    },
    init : function(configs) {
      this.baseParams.x = configs.canvas.width * 0.25;
      this.baseBackgroundParams.height = configs.general.gridSquareSideLength;
      this.baseBackgroundParams.width = configs.canvas.width;
      this.baseParams.gameInfoHeight = configs.general.gridSquareSideLength * 1.3;
      console.log('text defaults initialized');
    },
  },
};
