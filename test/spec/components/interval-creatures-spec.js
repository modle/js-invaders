describe('INTERVAL CREATURES SPEC: ', () => {
  let spec = 'INTERVAL CREATURES';
  beforeAll(function () {
    console.log('running ' + spec + ' SPEC');
  });
  afterAll(function () {
    console.log(spec + ' SPEC complete');
  });
  beforeEach(function () {
    knobsAndLevers.init();
    game.init();
    testObj = Object.assign({}, gameObjects);
    testObj.init();
    testObj.worms = [];
    testObj.fleas = [];
  });
  function mockTestObj() {
    spyOn(testObj, 'spawnCreatureAtIntervals');
    spyOn(testObj, 'clearOutsideCanvas');
    spyOn(testObj, 'update');
    spyOn(testObj, 'dropShields');
    testObj.intervals['worms'] = 10;
  };
  it('manage calls gameObjects.clearOutsideCanvas', () => {
    mockTestObj();
    testObj.worms.push('a worm');

    testObj.manage();

    expect(testObj.clearOutsideCanvas).toHaveBeenCalled();
  });
  it('manage calls gameObjects.update', () => {
    mockTestObj();
    testObj.worms.push('a worm');

    testObj.manage();

    expect(testObj.update).toHaveBeenCalled();
  });

  it('spawnCreatureAtIntervals calls getRandom at appropriate interval', () => {
    spyOn(testObj, 'spawn');
    spyOn(supporting, 'getRandom');
    game.gameArea.frameNo = 10;
    testObj.intervals['worms'] = 10;

    testObj.spawnCreatureAtIntervals('worms');

    expect(supporting.getRandom).toHaveBeenCalled();
  });
  it('spawnCreatureAtIntervals will not call getRandom at inappropriate interval', () => {
    spyOn(testObj, 'spawn');
    spyOn(supporting, 'getRandom');
    game.gameArea.frameNo = 1;
    testObj.intervals['worms'] = 10;

    testObj.spawnCreatureAtIntervals('worms');

    expect(supporting.getRandom).not.toHaveBeenCalled();
  });
  it('manage calls gameObjects.spawnCreatureAtIntervals', () => {
    mockTestObj();

    testObj.manage();

    expect(testObj.spawnCreatureAtIntervals).toHaveBeenCalled();
  });

  it('dropShield returns without calling shields.generate when not eligible to drop', () => {
    spyOn(testObj, 'eligibleToDrop').and.returnValue(false);
    spyOn(shields, 'generate');

    testObj.dropShields();

    expect(testObj.eligibleToDrop).toHaveBeenCalled();
    expect(shields.generate).not.toHaveBeenCalled();
  });

  it('dropShield calls shields.generate if eligible to drop', () => {
    spyOn(testObj, 'eligibleToDrop').and.returnValue(true);
    spyOn(shields, 'make').and.returnValue({});
    shields.shields = [];
    let flea = {x : 5, y : 100};

    testObj.dropShields(flea);

    expect(testObj.eligibleToDrop).toHaveBeenCalled();
    expect(shields.make).toHaveBeenCalled();
  });

  it('eligibleToDrop returns false if not valid interval', () => {
    game.frameNo = 1;
    knobsAndLevers.fleas.shieldCreateInterval = 2;

    let canDrop = testObj.eligibleToDrop();
    expect(canDrop).toBeFalsy();
  });

  it('spawn once creates one worm', () => {
    testObj.worms = []
    knobsAndLevers.worms.maxNumber = 1;
    spyOn(testObj, 'executeConstructorFunctions');
    spyOn(testObj, 'make');

    testObj.spawn('worms');

    expect(testObj.executeConstructorFunctions).toHaveBeenCalled();
    expect(testObj.make).toHaveBeenCalled();
  });
  it('spawn more than max worms does not create more than max worms', () => {
    for (let i = 0; i < knobsAndLevers.worms.maxNumber + 100; i++) {
      testObj.spawn('worms');
    };

    expect(testObj.worms.length).toBe(knobsAndLevers.worms.maxNumber);
  });
  it('update calls component.newPos', () => {
    testObj.worms = [{newPos : function(){}, update : function(){}}];
    spyOn(testObj.worms[0], 'newPos');
    spyOn(testObj.worms[0], 'update');
    spyOn(testObj, 'changeShields');

    testObj.update('worms');

    expect(testObj.worms[0].update).toHaveBeenCalled();
    expect(testObj.worms[0].newPos).toHaveBeenCalled();
    expect(testObj.changeShields).toHaveBeenCalled();
  });
  it('update calls component.update', () => {
    testObj.worms = [{update : function(){}, newPos : function(){}}];
    spyOn(testObj.worms[0], 'update');
    spyOn(testObj, 'changeShields');

    testObj.update('worms');

    expect(testObj.worms[0].update).toHaveBeenCalled();
    expect(testObj.changeShields).toHaveBeenCalled();
  });
  it('clearOutsideCanvas clears worms with x greater than canvas width', () => {
    testObj.worms = [{}];
    testObj.worms[0].x = game.gameArea.canvas.width + 1;
    testObj.worms[0].y = game.gameArea.canvas.height + 1;
    expect(testObj.worms.length).toBe(1);

    testObj.worms = testObj.clearOutsideCanvas('worms');

    expect(testObj.worms.length).toBe(0);
  });
  it('clearOutsideCanvas clears fleas with y greater than canvas height', () => {
    testObj.fleas = [{}];
    testObj.fleas[0].y = game.gameArea.canvas.height + 1;

    testObj.fleas = testObj.clearOutsideCanvas('fleas');

    expect(testObj.fleas.length).toBe(0);
  });
  it('clearOutsideCanvas does not clear fleas with y less than canvas height', () => {
    testObj.fleas = [{}]
    expect(testObj.fleas.length).toBe(1);

    testObj.fleas[0].y = game.gameArea.canvas.height * 2;
    testObj.fleas[0].x = game.gameArea.canvas.width * 2;

    testObj.clearOutsideCanvas('fleas');

    expect(testObj.fleas.length).toBe(1);
  });
  it('clearOutsideCanvas does not clear fleas with y less than canvas height', () => {
    testObj.fleas = [];
    expect(testObj.fleas.length).toBe(0);

    testObj.clearOutsideCanvas('fleas');

    expect(testObj.fleas.length).toBe(0);
  });
  it('clear results in empty worms list', () => {
    testObj.worms = [{}];

    testObj.clear();

    expect(testObj.worms.length).toBe(0);
  });
  it('clear results in empty fleas list', () => {
    testObj.fleas = [{}];

    testObj.clear();

    expect(testObj.fleas.length).toBe(0);
  });
});
