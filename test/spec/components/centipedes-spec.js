describe('CENTIPEDES SPEC: ', () => {
  let spec = 'CENTIPEDES';
  beforeAll(function () {
    console.log('running ' + spec + ' SPEC');
  });
  afterAll(function () {
    console.log(spec + ' SPEC complete');
  });
  beforeEach(function () {
    testObj = Object.assign({}, invaders);
  });
  it('manage delegates to spawn when eligible and update', () => {
    spyOn(testObj, 'spawn');
    spyOn(testObj, 'update');

    testObj.manage();

    expect(testObj.spawn).toHaveBeenCalled();
    expect(testObj.update).toHaveBeenCalled();
  });
  it('eligibleToSpawn returns false unless spawn conditions are met', () => {
    testObj.numberSpawned = 2;
    testObj.segments = 2;
    let expected = false;

    let actual = testObj.eligibleToSpawn();

    expect(actual).toBe(expected);
  });
  it('spawn adds two invaders to invaders array', () => {
    spyOn(testObj, 'determineSpawnPositions');
    spyOn(testObj, 'eligibleToSpawn').and.returnValue(true);
    spyOn(testObj, 'setXPosition');
    spyOn(testObj, 'make').and.returnValue({});
    spyOn(testObj, 'cannotAdd').and.returnValue(false);
    spyOn(testObj, 'add');

    testObj.spawn();
    testObj.spawn();

    expect(testObj.add).toHaveBeenCalledTimes(2);
  });
  it('spawn does not add invader to invaders array when it collides with an existing invader', () => {
    spyOn(testObj, 'determineSpawnPositions');
    spyOn(testObj, 'eligibleToSpawn').and.returnValue(true);
    spyOn(testObj, 'setXPosition');
    spyOn(testObj, 'make').and.returnValue({});
    spyOn(testObj, 'cannotAdd').and.returnValue(true);
    spyOn(testObj, 'add');

    testObj.spawn();
    testObj.spawn();

    expect(testObj.add).toHaveBeenCalledTimes(0);
  });
  it('make returns a invader', () => {
    metrics.init();

    let segment = testObj.make();

    expect(segment.reverseDirectionY).toBe(false);
  });
  it('update delegates to invader update functions', () => {
    testObj.invaders = [
      {update : function(){}},
      {update : function(){}},
    ];
    spyOn(testObj, 'updateDirections');
    spyOn(testObj, 'determineDirections');
    spyOn(testObj, 'updateCoordinates');
    spyOn(testObj, 'resetInvaderUpdateFlag');
    testObj.invaders.forEach(invader => spyOn(invader, 'update'));

    testObj.update();

    expect(testObj.resetInvaderUpdateFlag).toHaveBeenCalled();
    expect(testObj.determineDirections).toHaveBeenCalled();
    expect(testObj.updateDirections).toHaveBeenCalled();
    expect(testObj.updateCoordinates).toHaveBeenCalled();
    testObj.invaders.forEach(invader =>
      expect(invader.update).toHaveBeenCalled()
    );
  });
  it('clear resets parameters', () => {
    testObj.invaders = [{}];
    testObj.numberSpawned = 10;
    testObj.numberKilled = 10;

    testObj.clear();

    expect(testObj.invaders.length).toBe(0);
    expect(testObj.numberSpawned).toBe(0);
    expect(testObj.numberKilled).toBe(0);
  });
  it('determineDirections delegates to direction functions', () => {
    spyOn(testObj, 'moveDownwardInitially');
    spyOn(testObj, 'checkYDirectionInPlayerArea');
    spyOn(testObj, 'checkHorizonalCollisions');
    spyOn(testObj, 'reverseHorizontalAtNextLayer');

    testObj.invaders = [
      {moveVertically : false, updated : false, y : game.gameArea.gridStart - 2},
    ];

    testObj.determineDirections();

    expect(testObj.moveDownwardInitially).toHaveBeenCalled();
    expect(testObj.checkYDirectionInPlayerArea).toHaveBeenCalled();
    expect(testObj.checkHorizonalCollisions).toHaveBeenCalled();
    expect(testObj.reverseHorizontalAtNextLayer).toHaveBeenCalled();
  });
  it('resetInvaderUpdateFlag resets update flags', () => {
    testObj.invaders = [{update : true}, {update : true}];

    testObj.resetInvaderUpdateFlag();

    testObj.invaders.forEach(invader =>
      expect(invader.updated).toBe(false)
    );
  });
  it('moveDownwardInitially sets moveVertically and updated to true if above first shield layer', () => {
    knobsAndLevers.init();
    game.init();
    testObj.invaders = [
      {moveVertically : false, updated : false, y : game.gameArea.gridStart - 2},
      {moveVertically : false, updated : true, y : game.gameArea.gridStart - 2},
      {moveVertically : false, updated : false, y : game.gameArea.gridStart},
    ];

    testObj.invaders.filter(invader => !invader.updated).map(invader => {
      testObj.moveDownwardInitially(invader);
    });

    expect(testObj.invaders[0].moveVertically).toBe(true);
    expect(testObj.invaders[0].updated).toBe(true);
    expect(testObj.invaders[1].moveVertically).toBe(false);
    expect(testObj.invaders[1].updated).toBe(true);
    expect(testObj.invaders[2].moveVertically).toBe(false);
    expect(testObj.invaders[2].updated).toBe(false);
  });
  it('checkYDirectionInPlayerArea sets reverseDirectionY when hitting canvas bottom', () => {
    game.init();
    let top = game.gameArea.canvas.height - 10;
    let bottom = game.gameArea.canvas.height + 10;
    testObj.invaders = [
      {
        reverseDirectionY : false,
        updated : false,
        getBottom : function(){return bottom},
        getTop : function(){return top},
        distanceMovedFromBottom : 10,
      },
    ];

    testObj.invaders.filter(invader => !invader.updated).map(invader => {
      testObj.checkYDirectionInPlayerArea(invader);
    });

    expect(testObj.invaders[0].reverseDirectionY).toBe(true);
  });
  it('checkYDirectionInPlayerArea sets reverseDirectionY when hitting playerTopLimit while moving up', () => {
    knobsAndLevers.init();
    game.init();
    player.init();
    let top = knobsAndLevers.player.topLimit - 10;
    let bottom = top + 20;
    testObj.invaders = [
      {
        reverseDirectionY : false,
        updated : false,
        getBottom : function(){return bottom},
        getTop : function(){return top},
        distanceMovedFromBottom : 10,
      },
    ];

    testObj.invaders.filter(invader => !invader.updated).map(invader => {
      testObj.checkYDirectionInPlayerArea(invader);
    });

    expect(testObj.invaders[0].reverseDirectionY).toBe(true);
  });
  it('checkHorizontalCollisions does not set moveVertically to true if no collisions', () => {
    knobsAndLevers.init();
    game.init();
    spyOn(testObj, 'hasCollidedWithWall').and.returnValue(false);
    spyOn(testObj, 'hasCollidedWithShield').and.returnValue(false);
    let invader = {
      updated : false,
      distanceMovedY : 0,
      distanceMovedX : 0,
      moveVertically : false,
    };

    testObj.checkHorizonalCollisions(invader);

    expect(invader.moveVertically).toBe(false);
    expect(invader.updated).toBe(true);
  });
  it('checkHorizontalCollisions sets moveVertically to true if wall collisions', () => {
    knobsAndLevers.init();
    game.init();
    spyOn(testObj, 'hasCollidedWithWall').and.returnValue(true);
    spyOn(testObj, 'hasCollidedWithShield').and.returnValue(false);
    let invader = {
      updated : false,
      distanceMovedY : 0,
      distanceMovedX : 0,
      moveVertically : false,
    };

    testObj.checkHorizonalCollisions(invader);

    expect(testObj.hasCollidedWithWall).toHaveBeenCalled();
    expect(testObj.hasCollidedWithShield).not.toHaveBeenCalled();
    expect(invader.updated).toBe(true);
    expect(invader.distanceMovedX).toBe(0);
    expect(invader.moveVertically).toBe(true);
  });
  it('checkHorizontalCollisions sets moveVertically to true if shield collisions but not wall collisions', () => {
    knobsAndLevers.init();
    game.init();
    spyOn(testObj, 'hasCollidedWithWall').and.returnValue(false);
    spyOn(testObj, 'hasCollidedWithShield').and.returnValue(true);
    let invader = {
      updated : false,
      distanceMovedY : 0,
      distanceMovedX : 10,
      moveVertically : false,
    };

    testObj.checkHorizonalCollisions(invader);

    expect(testObj.hasCollidedWithWall).toHaveBeenCalled();
    expect(testObj.hasCollidedWithShield).toHaveBeenCalled();
    expect(invader.updated).toBe(true);
    expect(invader.distanceMovedX).toBe(10);
    expect(invader.moveVertically).toBe(true);
  });
  it('checkHorizontalCollisions does not update if distanceMovedY is not 0', () => {
    knobsAndLevers.init();
    game.init();
    spyOn(testObj, 'hasCollidedWithWall').and.returnValue(false);
    spyOn(testObj, 'hasCollidedWithShield').and.returnValue(false);
    let invader = {
      updated : false,
      distanceMovedY : 1,
      distanceMovedX : 0,
      moveVertically : false,
    };

    testObj.checkHorizonalCollisions(invader);

    expect(invader.moveVertically).toBe(false);
    expect(invader.updated).toBe(false);
  });
  it('hasCollidedWithWall should return false if inside canvas sides and has moved horizontally', () => {
    knobsAndLevers.init();
    game.init();
    let invader = {
      getLeft : function(){return 10;},
      getRight : function(){return game.gameArea.canvas.width;},
      distanceMovedX : 10,
    };

    let expected = false;
    let actual = testObj.hasCollidedWithWall(invader);

    expect(actual).toBe(expected);
  });
  it('hasCollidedWithWall should return true if outside canvas sides and has moved horizontally', () => {
    knobsAndLevers.init();
    game.init();
    let invader = {
      getLeft : function(){return 10;},
      getRight : function(){return game.gameArea.canvas.width;},
      distanceMovedX : game.gameArea.gridSquareSideLength + 1,
    };

    let expected = true;
    let actual = testObj.hasCollidedWithWall(invader);

    expect(actual).toBe(expected);
  });
  it('hasCollidedWithShields does a whole bunch of crap I do not want to test', () => {
    knobsAndLevers.init();
    game.init();
    shields.shields = [{y : 1}];
    let crashWith = function(){return true;};
    let moveVertically = true;
    let distanceMovedX = game.gameArea.gridSquareSideLength + 1;
    testObj.invaders = [
      {
        crashWith : crashWith,
        y : 0,
        distanceMovedX : distanceMovedX,
        moveVertically : moveVertically,
        expected : true,
      },
      {
        crashWith : crashWith,
        y : 0,
        distanceMovedX : distanceMovedX,
        moveVertically : moveVertically,
        expected : false,
      },
      {
        crashWith : crashWith,
        y : game.gameArea.gridStart,
        distanceMovedX : distanceMovedX,
        moveVertically : moveVertically,
        expected : false,
      },
    ];

    testObj.invaders.forEach(invader => {
      let expected = invader.expected;
      let actual = testObj.hasCollidedWithShield(invader);
      expect(actual).toBeTruthy;
    });

  });
  it('reverseHorizontalAtNextLayer does stuff', () => {
    knobsAndLevers.init();
    game.init();
    invader = {
      updated : false,
      distanceMovedY : game.gameArea.gridSquareSideLength + 1,
      reverseDirectionX : false,
      moveVertically : true,
    };

    testObj.reverseHorizontalAtNextLayer(invader);

    expect(invader.updated).toBe(true);
    expect(invader.moveVertically).toBe(false);
    expect(invader.distanceMovedY).toBe(0);
    expect(invader.reverseDirectionX).toBe(true);
  });
  it('updateDirections does stuff', () => {
    knobsAndLevers.init();
    game.init();
    testObj.invaders = [
      {
        directionY : 1,
        distanceMovedY : 1,
        reverseDirectionY : true,
        directionX : 1,
        reverseDirectionX : true,
      },
      {
        directionY : 1,
        distanceMovedY : 1,
        reverseDirectionY : false,
        directionX : 1,
        reverseDirectionX : false,
      },
    ];

    testObj.updateDirections();

    expect(testObj.invaders[0].directionY).toBe(-1);
    expect(testObj.invaders[0].distanceMovedY).toBe(0);
    expect(testObj.invaders[0].reverseDirectionY).toBe(false);
    expect(testObj.invaders[0].directionX).toBe(-1);
    expect(testObj.invaders[0].reverseDirectionX).toBe(false);
    expect(testObj.invaders[1].directionY).toBe(1);
    expect(testObj.invaders[1].distanceMovedY).toBe(1);
    expect(testObj.invaders[1].reverseDirectionY).toBe(false);
    expect(testObj.invaders[1].directionX).toBe(1);
    expect(testObj.invaders[1].reverseDirectionX).toBe(false);
  });
  it('updateCoordinates does stuff', () => {
    knobsAndLevers.init();
    game.init();
    let defaults = {
      moveVertically : true,
      y : 1,
      directionY : 1,
      distanceMovedY : 1,
      distanceMovedFromBottom : 0,
      directionX : 1,
      x : 0,
      distanceMovedX : 0,
    };
    testObj.invaders = [
      {
        moveVertically : defaults.moveVertically,
        y : defaults.y,
        directionY : defaults.directionY,
        distanceMovedY : defaults.distanceMovedY,
        distanceMovedFromBottom : defaults.distanceMovedFromBottom,
      },
      {
        moveVertically : defaults.moveVertically,
        y : defaults.y,
        directionY : -defaults.directionY,
        distanceMovedY : defaults.distanceMovedY,
        distanceMovedFromBottom : defaults.distanceMovedFromBottom,
      },
      {
        moveVertically : false,
        y : defaults.y,
        directionY : defaults.directionY,
        distanceMovedY : defaults.distanceMovedY,
        distanceMovedFromBottom : defaults.distanceMovedFromBottom,
        directionX : 1,
        x : 0,
        width: 10,
        distanceMovedX : defaults.distanceMovedX,
      },
      {
        moveVertically : false,
        directionX : 1,
        x : 0,
        width: game.gameArea.canvas.width,
        distanceMovedX : defaults.distanceMovedX,
      },
    ];

    testObj.updateCoordinates();

    expect(testObj.invaders[0].y).toBe(defaults.y + defaults.directionY);
    expect(testObj.invaders[0].distanceMovedY).toBe(defaults.distanceMovedY + Math.abs(defaults.directionY));
    expect(testObj.invaders[1].y).toBe(defaults.y - defaults.directionY);
    expect(testObj.invaders[1].distanceMovedY).toBe(defaults.distanceMovedY + Math.abs(defaults.directionY));
    expect(testObj.invaders[2].y).toBe(defaults.y);
    expect(testObj.invaders[2].distanceMovedY).toBe(defaults.distanceMovedY);
    expect(testObj.invaders[2].x).toBe(defaults.x + defaults.directionX);
    expect(testObj.invaders[2].distanceMovedX).toBe(defaults.distanceMovedX + Math.abs(defaults.directionX));
    expect(testObj.invaders[3].x).toBe(defaults.x);
  });
});
