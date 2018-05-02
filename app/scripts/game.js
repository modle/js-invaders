var game = {
  init : function() {
    Object.assign(this, gameBase);
    this.gameArea.init(knobsAndLevers);
    supporting.applyOverrides(this);
    console.log('game initialized');
  },
  gameResets : {
    level : function() {
      invaders.clear();
    },
    death : function() {
      invaders.clear();
      lasers.clear();
    },
    everything : function() {
      shields.clear();
      init.afterGameOver();
    },
  },
  functionOverrides : {
    gameLevelCheck : function() {
      return invaders.numberSpawned == invaders.numberKilled && this.gameArea.frameNo;
    },
  },
};
