/*jslint white: true */
var invaders = {
  invaders : [],
  coordinates : [],
  init : function() {
    Object.assign(this, gameObjectsBase);
    supporting.applyOverrides(this);
    this.setCoordinates();
    console.log('invaders initialized');
  },
  functionOverrides : {
    manage : function() {
      if (game.gameArea.frameNo == 1) {
        this.spawn(knobsAndLevers.invaders.initialAmount);
      };
      this.update();
    },
    spawn : function(amount) {
      let coordinates = {};
      while (this.invaders.length < this.coordinates.length) {
        coordinates = this.coordinates[this.invaders.length % this.coordinates.length];
        if (coordinates.y > knobsAndLevers.player.topLimit) {
          continue;
        };
        this.make(coordinates, knobsAndLevers.invaders.color);
      };
    },
    make : function(coordinates, color) {
      if (coordinates.x == undefined || coordinates.y == undefined) {
        throw new Error('coordinate error: x: ' + coordinates.x + ', y: ' + coordinates.y);
      };
      let invader = this.generate(coordinates, color);
      this.invaders.push(invader);
    },
    generate : function(coordinates, color) {
      let invader = new Component(knobsAndLevers.invaders.args);
      invader.x = coordinates.x,
      invader.y = coordinates.y,
      invader.pointValue = metrics.currentLevel;
      return invader;
    },
    update : function() {
      for (i = 0; i < this.invaders.length; i += 1) {
        this.invaders[i].update();
      };
    },
    clear : function() {
      this.invaders = [];
    },
  },
  setCoordinates : function() {
    this.coordinates = [
      {x : knobsAndLevers.canvas.width * 0.05, y : 100},
      {x : knobsAndLevers.canvas.width * 0.15, y : 100},
      {x : knobsAndLevers.canvas.width * 0.25, y : 100},
      {x : knobsAndLevers.canvas.width * 0.35, y : 100},
      {x : knobsAndLevers.canvas.width * 0.45, y : 100},
      {x : knobsAndLevers.canvas.width * 0.55, y : 100},
      {x : knobsAndLevers.canvas.width * 0.65, y : 100},
      {x : knobsAndLevers.canvas.width * 0.75, y : 100},
      {x : knobsAndLevers.canvas.width * 0.85, y : 100},
      {x : knobsAndLevers.canvas.width * 0.95, y : 100},
    ];
  },
};
