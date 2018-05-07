var game = {
  init : function() {
    console.log(gameBase.gameArea);
    Object.assign(this, gameBase);
    this.gameArea.init(dials);
    supporting.applyOverrides(this);
    console.log('game initialized');
  },
  gameResets : {
    level : function() {
      gameObjects.clear();
    },
    death : function() {
      gameObjects.clear();
      lasers.clear();
    },
    everything : function() {
      gameObjects.clear();
      init.afterGameOver();
    },
  },
  functionOverrides : {
    gameLevelCheck : function() {
      let levelEnded =
        gameObjects.invaders.numberSpawned > 0
        && gameObjects.invaders.numberSpawned == gameObjects.invaders.numberKilled
        && this.gameArea.frameNo > 0;
      return levelEnded;
    },
  },
};
