/*jslint white: true */
var gameObjects = {
  types : ['invaders', 'shields'],
  shields : {objects : [], coordinates : [], numberSpawned : 0},
  invaders : {objects : [], coordinates : [], numberSpawned : 0, numberKilled : 0},
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
        this.update(this[type].objects);
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
      let theThing = new Component(knobsAndLevers[type].args);
      theThing.x = coordinates.x,
      theThing.y = coordinates.y,
      theThing.pointValue = metrics.currentLevel;
      return theThing;
    },
    update : function(objects) {
      objects.forEach(obj => obj.update());
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
      console.log(type, yCoord, lastX, this[type].coordinates.length);
    };
  },
  removeDestroyedTargets : function(targets) {
    this.types.forEach(type =>
      this[type].objects = this[type].objects.filter(obj => obj.hitPoints > 0)
    );
  },
};
