var init = {
  run : function() {
    console.log('start space invaders init');

    knobsAndLevers.init();

    dom.init();
    game.init();
    initials.init();
    leaderboard.init();
    main.init();
    mainMenu.init();
    menus.init();
    metrics.init();
    players.init();
    sounds.init();
    texts.init();
    collisions.init();
    lasers.init();
    gameObjects.init();
    // invaders.init();
    // shields.init();

    console.log('space invaders game initialized');
  },
  afterGameOver : function() {
    console.log('reset everything');
    knobsAndLevers.init();
    menus.init();
    metrics.init();
    texts.init();
    game.paused = true;
    game.running = false;
    console.log('game reset');
  },
};
