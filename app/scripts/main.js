var main = {
  init : function() {
    Object.assign(this, mainBase);
    supporting.applyOverrides(this);
    console.log('main initialized');
  },
  functionOverrides : {
    manageGameObjects : function() {
      metrics.manage();
      gameObjects.manage();
      // shields.manage();
      // invaders.manage();
      lasers.manage();
      players.manage();
      collisions.check();
    },
  },
};
