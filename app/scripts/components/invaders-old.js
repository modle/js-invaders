/*jslint white: true */
var invaders = {
  // invaders are basically shields that move; get shields working, then add movement function
  // use the same file for both
  invaders : [],
  numberSpawned : 0,
  numberKilled : 0,
  init : function() {
    console.log('initializing invaders');
    Object.assign(this, gameObjectsBase);
    supporting.applyOverrides(this);
    console.log('invaders initialized', this);
  },
  functionOverrides : {
    manage : function() {
      this.spawn();
      this.update();
    },
    spawn : function() {
      if (!this.eligibleToSpawn()) {
        return;
      };
      this.setXPosition();
      let invaders = this.make();
      if (this.cannotAdd(invaders)) {
        return;
      };
      this.add(invaders);
    },
    make : function() {
      let invaders = Object.assign(new Component(knobsAndLevers.invaders.args), knobsAndLevers.invaders.defaults);
      let pointValue = knobsAndLevers.invaders.pointValue;
      invaders.pointValue = supporting.getRandom(pointValue, pointValue + 20);
      invaders.sound = sounds.getSound('invaders');
      return invaders;
    },
    add : function(invaders) {
      this.invaders.push(invaders);
      this.numberSpawned++;
    },
    update : function() {
      this.resetInvaderUpdateFlag();
      this.determineDirections();
      this.updateDirections();
      this.updateCoordinates();
      for (i = 0; i < this.invaders.length; i += 1) {
        this.invaders[i].update();
      };
    },
    clear : function() {
      this.invaders = [];
      this.numberSpawned = 0;
      this.numberKilled = 0;
    },
  },
  determineHorizontalPosition : function() {
    let baseRange = game.gameArea.canvas.width;
    return supporting.getRandom(baseRange * 0.2, baseRange * 0.8);
  },
  eligibleToSpawn : function() {
    return this.numberSpawned < this.segments;
  },
  setXPosition : function() {
    knobsAndLevers.invaders.args.x = this.positions[this.invaders.length % this.positions.length];
  },
  cannotAdd : function(invaders) {
    return this.invaders.find(checkInvader => checkInvader.crashWith(invaders));
  },
  determineDirections : function() {
    // if any collide with edge, move them all down and change x direction
    this.invaders.filter(invaders => !invaders.updated).forEach(invaders => {
      this.checkHorizonalCollisions(invaders);
      this.reverseHorizontal(invaders);
    });
  },
  resetInvaderUpdateFlag : function() {
    this.invaders.map(invaders => invaders.updated = false);
  },
  checkHorizonalCollisions : function(invaders) {
    if (invaders.distanceMovedY === 0) {
      if (this.hasCollidedWithWall(invaders)) {
        invaders.distanceMovedX = 0;
        invaders.moveVertically = true;
      } else if (this.hasCollidedWithShield(invaders)) {
        invaders.moveVertically = true;
      };
      invaders.updated = true;
    }
  },
  hasCollidedWithWall : function(invaders) {
    let isOutside = invaders.getLeft() <= 1
          || invaders.getRight() >= game.gameArea.canvas.width - 1;
    let hasMovedEnoughHorizontally = invaders.distanceMovedX > game.gameArea.gridSquareSideLength;
    let hasCollided = isOutside && hasMovedEnoughHorizontally;
    return hasCollided;
  },
  reverseHorizontal : function(invaders) {
    if (invaders.distanceMovedY >= game.gameArea.gridSquareSideLength) {
      invaders.reverseDirectionX = true;
      invaders.moveVertically = false;
      invaders.distanceMovedY = 0;
      invaders.updated = true;
    };
    invaders.moveVertically = invaders.poisoned ? true : invaders.moveVertically;
  },
  updateDirections : function() {
    for (i = 0; i < this.invaders.length; i += 1) {
      if (this.invaders[i].reverseDirectionX) {
        this.invaders[i].directionX *= -1;
        this.invaders[i].reverseDirectionX = false;
      };
    };
  },
  updateCoordinates : function() {
    for (i = 0; i < this.invaders.length; i += 1) {
      toMoveX = this.invaders[i].directionX;
      newPositionX = this.invaders[i].x + toMoveX;
      if (newPositionX + this.invaders[i].width < game.gameArea.canvas.width && newPositionX > 0) {
        this.invaders[i].x = newPositionX;
        this.invaders[i].distanceMovedX += Math.abs(toMoveX);
      };
    };
  },
};
