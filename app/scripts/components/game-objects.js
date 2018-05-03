/*jslint white: true */
var gameObjects = {
  types : ['invaders', 'shields'],
  shields : {objects : [], coordinates : [], numberSpawned : 0},
  invaders : {objects : [], coordinates : [], numberSpawned : 0, numberKilled : 0, reverseDirectionX : false},
  init : function() {
    Object.assign(this, gameObjectsBase);
    supporting.applyOverrides(this);
    this.types.forEach(type => this.setCoordinates(type));
    console.log('shields initialized');
  },
  functionOverrides : {
    manage : function() {
      this.types.forEach(type => {
        this.spawn(type, knobsAndLevers[type].initialAmount);
        this.update(type, this[type].objects);
      });
    },
    spawn : function(type, amount) {
      let coordinates = {};
      let theType = this[type];
      //TODO replace these if statements with an eligibleToSpawn()
      if (type == 'shields' && theType.numberSpawned >= knobsAndLevers[type].initialAmount) {
        return;
      };
      if (type == 'invaders' && theType.numberKilled != theType.numberSpawned) {
        return;
      };
      while (theType.objects.length < theType.coordinates.length) {
        coordinates = theType.coordinates[theType.objects.length % theType.coordinates.length];
        this.make(type, coordinates, knobsAndLevers[type].color);
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
      let theThing = Object.assign(new Component(knobsAndLevers[type].args), knobsAndLevers[type].defaults);
      theThing.x = coordinates.x,
      theThing.y = coordinates.y,
      theThing.pointValue = knobsAndLevers[type].pointValue || metrics.currentLevel + 1;
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
    let yCoord = knobsAndLevers[type].args.y;
    let lastX = -knobsAndLevers[type].spacing / 2;
    let coordinates = {};
    while (this[type].coordinates.length < knobsAndLevers[type].maxNumber) {
      let coordinates = {x : lastX + knobsAndLevers[type].spacing, y : yCoord};
      lastX = coordinates.x;
      this[type].coordinates.push(coordinates);
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
          || invader.getRight() >= knobsAndLevers.canvas.width - 1;
    let hasMovedEnoughHorizontally = invader.distanceMovedX > knobsAndLevers.general.gridSquareSideLength;
    let hasCollided = isOutside && hasMovedEnoughHorizontally;
    return hasCollided;
  },
  updateDirections : function() {
    this.invaders.objects.forEach(element => {
      if (this.invaders.reverseDirectionX) {
        element.speedX *= -1;
        element.y += knobsAndLevers.general.gridSquareSideLength;
      } else {
        element.distanceMovedX += 1;
      };
    });
    this.invaders.reverseDirectionX = false;
  },
};
