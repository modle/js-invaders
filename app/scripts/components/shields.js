/*jslint white: true */
var shields = {
  shields : [],
  init : function() {
    Object.assign(this, gameObjectsBase);
    supporting.applyOverrides(this);
    console.log('shields initialized');
  },
  functionOverrides : {
    manage : function() {
      if (game.gameArea.frameNo == 1) {
        this.spawn(knobsAndLevers.shields.initialAmount);
      };
      this.update();
    },
    spawn : function(amount) {
      let coordinates = {};
      while (this.shields.length < amount) {
        coordinates = this.getCoordinates();
        if (coordinates.y > knobsAndLevers.player.topLimit) {
          continue;
        };
        this.make(coordinates, knobsAndLevers.shields.color);
      };
    },
    make : function(coordinates, color) {
      if (coordinates.x == undefined || coordinates.y == undefined) {
        throw new Error('coordinate error: x: ' + coordinates.x + ', y: ' + coordinates.y);
      };
      color = color ? color : knobsAndLevers.shields.color;
      coordinates.x = supporting.getClosest(game.gameArea.xVertices, coordinates.x);
      coordinates.y = supporting.getClosest(game.gameArea.yVertices, coordinates.y);
      let shield = this.generate(coordinates, color);
      if (collisions.withShields(shield) || this.collidesWithPlayers(shield)) {
        return;
      };
      this.shields.push(shield);
    },
    generate : function(coordinates, color) {
      let shield = new Component(knobsAndLevers.shields.args);
      shield.x = coordinates.x + knobsAndLevers.shields.scaleFactor,
      shield.y = coordinates.y + knobsAndLevers.shields.scaleFactor,
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
  getCoordinates : function() {
    let coordinates = {x : 0, y : 0};
    coordinates.x = game.gameArea.xVertices[Math.floor(Math.random() * game.gameArea.xVertices.length)];
    coordinates.y = game.gameArea.yVertices[Math.floor(Math.random() * game.gameArea.yVertices.length)];
    return coordinates;
  },
  collidesWithPlayers : function(shield) {
    return Object.keys(players.players).find(key => players.players[key].crashWith(shield));
  },
};
