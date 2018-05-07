describe('COLLISIONS SPEC: ', () => {
  let spec = 'COLLISIONS';
  beforeAll(function () {
    console.log('running ' + spec + ' SPEC');
  });
  afterAll(function () {
    console.log(spec + ' SPEC complete');
  });
  beforeEach(function () {
    testObj = Object.assign({}, collisions);
    dials.init();
  });
  function createAnObjectFromLaserArgs() {
    let laserArgs = dials.lasers.args;
    laserArgs.x = 10;
    laserArgs.y = 10;
    laserArgs.width = 10;
    laserArgs.height = 10;
    return new Component(laserArgs);
  };

  it('check calls checkLaser', () => {
    spyOn(testObj, 'checkLaser');
    spyOn(testObj, 'checkPlayerVsEnemies');
    spyOn(testObj, 'removeDestroyedTargets');

    testObj.check();

    expect(testObj.checkLaser).toHaveBeenCalled();
    expect(testObj.checkPlayerVsEnemies).toHaveBeenCalled();
    expect(testObj.removeDestroyedTargets).toHaveBeenCalled();
  });

  it('getLaserTargets combines multiple target Arrays', () => {
    shields.shields = [];
    invaders.invaders = [];
    gameObjects.worms = [];
    gameObjects.fleas = ['anObj'];
    spiders.spiders = ['anObj'];

    targets = testObj.getLaserTargets();

    expect(targets.length).toEqual(2);
  });

  it('checkLaser sets laser.remove to true on impact', () => {
    targets = [{}];
    lasers.lasers = [{remove: false, crashWith : function(target){}}];
    spyOn(lasers.lasers[0], 'crashWith').and.returnValue(true);
    spyOn(testObj, 'processImpact');
    spyOn(testObj, 'removeUsedLasers');

    testObj.checkLaser(targets);

    expect(lasers.lasers[0].remove).toBeTruthy();
    expect(lasers.lasers[0].crashWith).toHaveBeenCalled();
    expect(testObj.processImpact).toHaveBeenCalled();
    expect(testObj.removeUsedLasers).toHaveBeenCalled();
  });
  it('checkLaser will not processImpact if no usable lasers', () => {
    targets = [{}];
    lasers.lasers = [{remove: true, crashWith : function(target){}}];
    spyOn(lasers.lasers[0], 'crashWith').and.returnValue(true);
    spyOn(testObj, 'processImpact');
    spyOn(testObj, 'removeUsedLasers');

    testObj.checkLaser(targets);

    expect(testObj.processImpact).not.toHaveBeenCalled();
    expect(testObj.removeUsedLasers).toHaveBeenCalled();
  });
  it('checkLaser will not processImpact if no lasers', () => {
    targets = [{}];
    lasers.lasers = [];
    spyOn(testObj, 'processImpact');
    spyOn(testObj, 'removeUsedLasers');

    testObj.checkLaser(targets);

    expect(testObj.processImpact).not.toHaveBeenCalled();
    expect(testObj.removeUsedLasers).toHaveBeenCalled();
  });
  it('checkLaser will not processImpact if no targets', () => {
    targets = [];
    lasers.lasers = [{}];
    spyOn(testObj, 'processImpact');
    spyOn(testObj, 'removeUsedLasers');

    testObj.checkLaser(targets);

    expect(testObj.processImpact).not.toHaveBeenCalled();
    expect(testObj.removeUsedLasers).toHaveBeenCalled();
  });
  it('checkLaser will not processImpact if no crashWith', () => {
    targets = [{}];
    lasers.lasers = [{remove: false, crashWith : function(target){}}];
    spyOn(lasers.lasers[0], 'crashWith').and.returnValue(false);
    spyOn(testObj, 'processImpact');
    spyOn(testObj, 'removeUsedLasers');

    testObj.checkLaser(targets);

    expect(testObj.processImpact).not.toHaveBeenCalled();
    expect(testObj.removeUsedLasers).toHaveBeenCalled();
  });

  it('processImpact delegates to impact functions', () => {
    spyOn(testObj, 'damageTarget');
    spyOn(sounds, 'playImpactSound');
    spyOn(testObj, 'updateTargetAppearance');

    testObj.processImpact({type : 'aTarget'});

    expect(testObj.damageTarget).toHaveBeenCalled();
    expect(sounds.playImpactSound).toHaveBeenCalled();
    expect(testObj.updateTargetAppearance).toHaveBeenCalled();
  });

  it('damageTarget reduces hitPoints and processes kill', () => {
    spyOn(testObj, 'processKill');
    let target = {hitPoints : 1};

    testObj.damageTarget(target);

    expect(testObj.processKill).toHaveBeenCalled();
    expect(target.hitPoints).toEqual(0);
  });
  it('damageTarget reduces hitPoints but does not process kill', () => {
    spyOn(testObj, 'processKill');
    let target = {hitPoints : 2};

    testObj.damageTarget(target);

    expect(testObj.processKill).not.toHaveBeenCalled();
    expect(target.hitPoints).toEqual(1);
  });


  it('updateTargetAppearance adjusts height of target when target type is shield', () => {
    let baseHeight = dials.shieldSide;
    let target1 = {type : 'shield', height : baseHeight};
    let target2 = {type : 'somethingElse', height : baseHeight};

    testObj.updateTargetAppearance(target1);
    testObj.updateTargetAppearance(target2);

    expect(target1.height).toEqual(0.75 * baseHeight);
    expect(target2.height).toEqual(baseHeight);
  });

  it('processKill delegates to metrics functions', () => {
    spyOn(metrics, 'addNewFloatingPoint');
    spyOn(metrics, 'manageScore');
    spyOn(testObj, 'handleInvaderKill');

    target = {type : 'notAInvader', getMiddleX : function(){}, getMiddleY : function(){}};
    testObj.processKill(target);

    expect(metrics.addNewFloatingPoint).toHaveBeenCalled();
    expect(metrics.manageScore).toHaveBeenCalled();
    expect(testObj.handleInvaderKill).toHaveBeenCalled();
  });

  it('handleInvaderKill alls shields.make and counts kill', () => {
    target = {type : 'invader', x : 1, y : 1};
    invaders.numberKilled = 0;
    spyOn(shields, 'make');

    testObj.handleInvaderKill(target);

    expect(invaders.numberKilled).toEqual(1);
    expect(shields.make).toHaveBeenCalled();
  });

  it('removeUsedLasers removes used lasers when remove is true', () => {
    lasers.lasers = [{remove: true}, {remove: false}]

    testObj.removeUsedLasers();

    expect(lasers.lasers.length).toEqual(1);
  });

  it('getPlayerEnemies combines multiple enemy Arrays', () => {
    invaders.invaders = [];
    gameObjects.fleas = ['anObj'];
    spiders.spiders = ['anObj'];

    targets = testObj.getPlayerEnemies();

    expect(targets.length).toEqual(2);
  });

  it('checkPlayerVsEnemies does not process if playerCollisions are disabled', () => {
    dials.game.playerCollisionsEnabled = false;
    game.gameOver = false;
    player.init();
    spyOn(player.gamePiece, 'crashWith').and.returnValue(true);
    spyOn(testObj, 'killPlayer');
    targets = [{remove: true, crashWith : function(target){}}];

    testObj.checkPlayerVsEnemies(targets);

    expect(testObj.killPlayer).not.toHaveBeenCalled();
    expect(player.gamePiece.crashWith).not.toHaveBeenCalled();
    expect(game.gameOver).toBeFalsy();
  });
  it('checkPlayerVsEnemies calls killsPlayer if crashWith', () => {
    dials.game.playerCollisionsEnabled = true;
    game.gameOver = false;
    player.init();
    spyOn(player.gamePiece, 'crashWith').and.returnValue(true);
    spyOn(testObj, 'killPlayer');
    game.init();
    metrics.init();
    targets = [{remove: true, crashWith : function(target){}}];
    testObj.checkPlayerVsEnemies(targets);

    expect(testObj.killPlayer).toHaveBeenCalled();
    expect(player.gamePiece.crashWith).toHaveBeenCalled();
    expect(game.gameOver).toBeFalsy();
  });
  it('checkGamePieceVsEnemy handles 0 length target list', () => {
    dials.game.playerCollisionsEnabled = true;
    game.gameOver = false;
    player.init();
    spyOn(player.gamePiece, 'crashWith').and.callThrough();
    spyOn(testObj, 'killPlayer');
    game.init();
    metrics.init();

    testObj.checkPlayerVsEnemies([]);

    expect(testObj.killPlayer).not.toHaveBeenCalled();
    expect(player.gamePiece.crashWith).not.toHaveBeenCalled();
    expect(game.gameOver).toBeFalsy();
  });
  it('killPlayer kills player and gameOver when one life', () => {
    game.gameOver = false;
    metrics.lives.player1 = 1;

    testObj.killPlayer();

    expect(metrics.lives.player1).toEqual(0);
    expect(player.died).toBeTruthy();
    expect(game.gameOver).toBeTruthy();
  });
  it('killPlayer kills player and no game over when more than one life', () => {
    game.gameOver = false;
    metrics.lives.player1 = 2;

    testObj.killPlayer();

    expect(metrics.lives.player1).toEqual(1);
    expect(player.died).toBeTruthy();
    expect(game.gameOver).toBeFalsy();
  });
  it('withShields collides with shields', () => {
    shields.shields = [createAnObjectFromLaserArgs()];
    let laser = createAnObjectFromLaserArgs();
    spyOn(laser, 'crashWith').and.callThrough();

    let result = testObj.withShields(laser);

    expect(laser.crashWith).toHaveBeenCalled();
    expect(result).toBeTruthy();
  });
  it('withShields does not collide with shields', () => {
    shields.shields = [createAnObjectFromLaserArgs()];
    let laser = createAnObjectFromLaserArgs();
    spyOn(laser, 'crashWith').and.callThrough();
    laser.x = shields.shields[0].x + shields.shields[0].x * 2;

    let result = testObj.withShields(laser);

    expect(laser.crashWith).toHaveBeenCalled();
    expect(result).toBeFalsy();
  });
  it('withShields does not call crashWith when no shields', () => {
    shields.shields = [];
    let laser = createAnObjectFromLaserArgs();
    spyOn(laser, 'crashWith').and.callThrough();

    let result = testObj.withShields(laser);

    expect(laser.crashWith).not.toHaveBeenCalled();
    expect(result).toBeFalsy();
  });
  it('removeDestroyedTargets removes destroyed targets', () => {
    shields.shields = [{hitPoints : 0}, {hitPoints : 1}];
    invaders.invaders = [{hitPoints : 0}, {hitPoints : 1}];
    gameObjects.worms = [{hitPoints : 0}, {hitPoints : 1}];
    gameObjects.fleas = [{hitPoints : 0}, {hitPoints : 1}];
    spiders.spiders = [{hitPoints : 0}, {hitPoints : 1}];

    testObj.removeDestroyedTargets();

    expect(shields.shields.length).toEqual(1);
    expect(invaders.invaders.length).toEqual(1);
    expect(gameObjects.worms.length).toEqual(1);
    expect(gameObjects.fleas.length).toEqual(1);
    expect(spiders.spiders.length).toEqual(1);
  });
});
