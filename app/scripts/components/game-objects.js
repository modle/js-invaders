/*jslint white: true */
var gameObjects = {
  types : ['invaders', 'shields'],
  shields : {objects : [], coordinates : [], numberSpawned : 0, currRow : 0},
  invaders : {objects : [], coordinates : [], numberSpawned : 0, numberKilled : 0, reverseDirectionX : false, currRow : 0},
  init : function() {
    Object.assign(this, gameObjectsBase);
    supporting.applyOverrides(this);
    this.types.forEach(type => this.setCoordinates(type));
    let shieldOffset = 0;
    while (shieldOffset < game.gameArea.xVertices.length) {
      this.setShieldCoordinates(shieldOffset);
      shieldOffset += dials.shields.gap;
    };
    console.log('shields initialized');
  },
  functionOverrides : {
    manage : function() {
      this.types.forEach(type => {
        this.spawn(type, dials[type].initialAmount);
        this.update(type, this[type].objects);
      });
    },
    spawn : function(type, amount) {
      let coordinates = {};
      let theType = this[type];
      //TODO replace these if statements with an eligibleToSpawn()
      if (type == 'shields' && theType.numberSpawned >= dials[type].initialAmount) {
        return;
      };
      if (type == 'invaders' && theType.numberKilled != theType.numberSpawned) {
        return;
      };
      while (theType.objects.length < theType.coordinates.length) {
        coordinates = theType.coordinates[theType.objects.length % theType.coordinates.length];
        this.make(type, coordinates, dials[type].color);
      };
    },
    make : function(type, coordinates, color) {
      if (coordinates.x == undefined || coordinates.y == undefined) {
        throw new Error('coordinate error: x: ' + coordinates.x + ', y: ' + coordinates.y);
      };
      let obj = this.generate(type, coordinates, color);
      this[type].numberSpawned++;
      this[type].objects.push(obj);
    },
    generate : function(type, coordinates, color) {
      let theThing = Object.assign(new Component(dials[type].args), dials[type].defaults);
      theThing.x = coordinates.x,
      theThing.y = coordinates.y,
      theThing.pointValue = dials[type].pointValue || metrics.currentLevel + 1;
      return theThing;
    },
    update : function(type, objects) {
      if (type == 'invaders') {
        if (!this.invaders.reverseDirectionX) {
          this.determineDirections();
        };
        this.updateDirections();
      };
      objects.forEach(obj => obj.update());
      objects.forEach(obj => obj.newPos());
    },
    clear : function() {
      console.log('calling clear on things');
      this.types.forEach(type => {
        this[type].objects = [];
        if (type != 'shields') {
          this[type].numberSpawned = 0;
        };
        this[type].numberKilled = 0;
      });
    },
  },
  setCoordinates : function(type) {
    if (type == 'shields') {
      return;
    };
    let coordinates = this[type].coordinates;
    console.log(type, 'coordinates are', coordinates);
    let max = dials[type].maxNumber;
    let rows = dials[type].rows ? dials[type].rows : 1;
    let toMake = max * rows;
    let spacing = dials[type].spacing;
    lastX = coordinates.length % max == 0 ? -spacing : coordinates[coordinates.length - 1].x;
    this[type].currRow = coordinates.length % max == 0 ? this[type].currRow + 1 : this[type].currRow;
    let xCoord = lastX + spacing;
    let yCoord = dials[type].args.y + ((this[type].currRow - 1) * spacing);
    coordinates.push({x : xCoord, y : yCoord});
    if (coordinates.length < toMake) {
      this.setCoordinates(type);
    };
  },
  removeDestroyedTargets : function(targets) {
    this.types.forEach(type =>
      this[type].objects = this[type].objects.filter(obj => obj.hitPoints > 0)
    );
  },
  determineDirections : function() {
    this.resetInvaderUpdateFlag();
    // if any collide with edge, move them all down and change x direction
    this.invaders.objects.filter(invader => !invader.updated).forEach(invader => {
      this.checkHorizonalCollisions(invader);
    });
  },
  resetInvaderUpdateFlag : function() {
    this.invaders.objects.forEach(invader => invader.updated = false);
  },
  checkHorizonalCollisions : function(invader) {
    if (this.hasCollidedWithWall(invader)) {
      invader.distanceMovedX = 0;
      this.invaders.reverseDirectionX = true;
    };
    invader.updated = true;
  },
  hasCollidedWithWall : function(invader) {
    let isOutside = invader.getLeft() <= 1
          || invader.getRight() >= dials.canvas.width - 1;
    let hasMovedEnoughHorizontally = invader.distanceMovedX > dials.general.gridSquareSideLength;
    let hasCollided = isOutside && hasMovedEnoughHorizontally;
    return hasCollided;
  },
  updateDirections : function() {
    this.invaders.objects.forEach(element => {
      if (this.invaders.reverseDirectionX) {
        element.speedX *= -1;
        element.y += dials.general.gridSquareSideLength;
      } else {
        element.distanceMovedX += 1;
      };
    });
    this.invaders.reverseDirectionX = false;
  },
  setShieldCoordinates : function(offset) {
    let gridIndexOffsets = dials.shields.gridIndexOffsets;
    let xVertices = game.gameArea.xVertices;
    let yVertices = game.gameArea.yVertices;
    let startVertGridIndex = yVertices.length - dials.shields.startVertGridIndex;
    let edges = dials.shields.edges;
    coordinates = [];
    gridIndexOffsets.forEach(rows => {
      for (i = edges.left + rows.row.from; i < edges.right + rows.row.to; i++) {
        x = xVertices[i + offset];
        if (x) {
          coordinates.push({x : xVertices[i + offset], y : yVertices[startVertGridIndex + rows.y]});
        };
      };
    });
    this.shields.coordinates.push(...coordinates);
  },
};
