// abstract common dials and move them to canvas-libs
var dials = {
  init : function() {
    this.general.init(this);
    this.invaders.init(this);
    this.player.init(this);
    this.lasers.init(this);
    this.shields.init(this);
    this.text.init(this);
    this.ufos.init(this);
    console.log('dials initialized');
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
  bolts : {
    pointValue : 1,
    args : {
      shape : 'rectangle',
      width : 10,
      height : 30,
      extraArgs : {
        hitPoints : 1,
        type : 'bolt',
        speed : {x : 0, y : 1},
      },
    },
  },
  canvas : {
    width : 800,
    height : 800,
    gridDivisor : 100,
  },
  targetLeaderboard : 'invaderLeaderboard',
  game : {
    playerCollisionsEnabled : true,
    interval : {
      min : 1000,
      max : 2500,
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
    speed : {
      default : 0.5,
      fast : 2,
    },
    shootInterval : 200,
    boltColor : 'orange',
    initialAmount : 6,
    maxNumber : 7,
    rows : 5,
    pointValue : 20,
    args : {
      y : 50,
      width : 75,
      height : 50,
      extraArgs : {
        animationInterval : 50,
        hitPoints : 1,
        type : 'invader',
        speed : {x : 0.25, y : 0},
      },
      sprites : {
        1 : {activeIndex : 0, files : ['invader-1-a.png', 'invader-1-b.png'], images : []},
        2 : {activeIndex : 0, files : ['invader-2-a.png', 'invader-2-b.png'], images : []},
        3 : {activeIndex : 0, files : ['invader-3-a.png', 'invader-3-b.png'], images : []},
        4 : {activeIndex : 0, files : ['invader-4-a.png', 'invader-4-b.png'], images : []},
        5 : {activeIndex : 0, files : ['invader-5-a.png', 'invader-5-b.png'], images : []},
      },
      getSpriteKey : function(obj) {
        return obj.row;
      },
    },
    defaults : {
      directionX : 1,
      distanceMovedX : 0,
      reverseDirectionX : false,
      updated : false,
    },
    init : function(configs) {
      this.spacing = dials.canvas.width / 8;
      this.args.x = configs.canvas.width / 2;
      console.log('invader defaults initialized');
    },
  },
  components : {
    imageTypes : ['invader', 'player', 'ufo'],
  },
  dom : {
    blogUrl : 'http://blog.matthewodle.com/category/game-development/',
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
      width : 2.5,
      height : 12.5,
      color : 'purple',
      extraArgs : {type : 'laser', speed : {x : 0, y : 0}},
    },
    init : function(configs) {
      // this.args.width = configs.general.gridSquareSideLength / 10;
      // this.args.height = configs.general.gridSquareSideLength * 0.5;
      console.log('laser defaults initialized');
    },
    resetCheats : function() {
      dials.resetParameter(this.speed);
      dials.resetParameter(this.quantity);
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
          player.x = dials.player.startX[Object.keys(players.players).length];
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
      ];
    },
    resetCheats : function() {
      dials.resetParameter(this.speed);
    },
  },
  shields : {
    initialAmount : 4,
    maxNumber : 5,
    side : 0,
    args : {
      color : 'black',
      y : 600,
      extraArgs : {
        hitPoints : 1,
        type : 'shield',
      },
      constructorFunctions : {
        setShape : function(shield) {
          shield.shape = 'rectangle';
        },
      },
    },
    gap : 24,
    startVertGridIndex : 25,
    edges : {left : 6, right : 21},
    init : function(configs) {
      this.args.width = configs.general.gridSquareSideLength;
      this.args.height = configs.general.gridSquareSideLength;
      this.spacing = dials.canvas.width / 5;
      // only somewhat hardcoded
      this.gridIndexOffsets = [
        {y : 0, row : {from : 4, to : -4}},
        {y : 1, row : {from : 3, to : -3}},
        {y : 2, row : {from : 2, to : -2}},
        {y : 3, row : {from : 1, to : -1}},
        {y : 4, row : {from : 0, to : 0}},
        {y : 5, row : {from : 0, to : 0}},
        {y : 6, row : {from : 0, to : 0}},
        {y : 7, row : {from : 0, to : 0}},
        {y : 8, row : {from : 0, to : -11}},
        {y : 8, row : {from : 10, to : 0}},
        {y : 9, row : {from : 0, to : -12}},
        {y : 9, row : {from : 11, to : 0}},
        {y : 10, row : {from : 0, to : -12}},
        {y : 10, row : {from : 12, to : 0}},
        {y : 11, row : {from : 0, to : -12}},
        {y : 11, row : {from : 12, to : 0}},
        {y : 12, row : {from : 0, to : -12}},
        {y : 12, row : {from : 12, to : 0}},
      ],
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
      height : 25,
      color : "lightgrey",
      x : 0,
      extraArgs : {type:"background"},
    },
    init : function(configs) {
      this.baseParams.x = configs.canvas.width * 0.25;
      // this.baseBackgroundParams.height = configs.general.gridSquareSideLength;
      this.baseBackgroundParams.width = configs.canvas.width;
      // this.baseParams.gameInfoHeight = configs.general.gridSquareSideLength * 1.3;
      console.log('text defaults initialized');
    },
  },
  ufos : {
    maxNumber : 1,
    pointValue : 200,
    interval : {
      min: 1000,
      max: 1500,
    },
    shootInterval : 200,
    boltColor : 'green',
    args : {
      extraArgs : {
        animationInterval : 50,
        hitPoints : 1,
        type : 'ufo',
        speed : {x : 2, y : 0},
      },
      sprites : {
        one : {activeIndex : 0, files : ['ufo1.png', 'ufo2.png'], images : []},
      },
      getSpriteKey : function(obj) {
        return 'one';
      },
      constructorFunctions : {
        setX : function(ufo) {
          let theRoll = supporting.roll(sides = 2);
          if (theRoll.crit) {
            ufo.speedX *= -1;
            ufo.x = game.gameArea.canvas.width;
          } else {
            ufo.x = 1 - ufo.width;
          };
        },
        setY : function(ufo) {
          ufo.y = supporting.getClosest(game.gameArea.yVertices, 50);
        },
      },
    },
    init : function(configs) {
      this.initialInterval = supporting.getRandom(this.interval.min, this.interval.max);
      this.args.width = configs.general.gridSquareSideLength * 10;
      this.args.height = configs.general.gridSquareSideLength * 4;
      this.interval = supporting.clone(configs.game.interval);
      console.log('worm defaults initialized');
    },
  },
};
