/*jslint white: true */
var shields = {
  shields : [],
  coordinates : [],
  init : function() {
    Object.assign(this, gameObjectsBase);
    supporting.applyOverrides(this);
    this.setCoordinates();
    console.log('shields initialized');
  },
  functionOverrides : {
    manage : function() {
      if (game.gameArea.frameNo == 1) {
        this.spawn(dials.shields.initialAmount);
      };
      this.update();
    },
    spawn : function(amount) {
      let coordinates = {};
      while (this.shields.length < this.coordinates.length) {
        coordinates = this.coordinates[this.shields.length % this.coordinates.length];
        if (coordinates.y > dials.player.topLimit) {
          continue;
        };
        this.make(coordinates, dials.shields.color);
      };
    },
    make : function(coordinates, color) {
      if (coordinates.x == undefined || coordinates.y == undefined) {
        throw new Error('coordinate error: x: ' + coordinates.x + ', y: ' + coordinates.y);
      };
      let shield = this.generate(coordinates, color);
      this.shields.push(shield);
    },
    generate : function(coordinates, color) {
      let shield = new Component(dials.shields.args);
      shield.x = coordinates.x,
      shield.y = coordinates.y,
      shield.pointValue = metrics.currentLevel;
      return shield;
    },
    update : function() {
      for (i = 0; i < this.shields.length; i += 1) {
        this.shields[i].update();
      };
    },
    clear : function() {
      this.shields = [];
    },
  },
  setCoordinates : function() {
    this.coordinates = [
      {x : dials.canvas.width * 0.1, y : 600},
      {x : dials.canvas.width * 0.315, y : 600},
      {x : dials.canvas.width * 0.53, y : 600},
      {x : dials.canvas.width * 0.745, y : 600},
    ];
  },
};
