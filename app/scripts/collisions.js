/*jslint white: true */
var collisions = {
  // TODO abstract non-invader functionality and move to canvas-libs
  init : function() {
    Object.assign(this, collisionsBase);
    supporting.applyOverrides(this);
    console.log('collisions initialized');
  },
  functionOverrides : {
    handleSpecialKills(target) {
      if (target.type == 'invader') {
        gameObjects.invaders.numberKilled += 1;
      };
    },
    getPlayerEnemies : function() {
      let enemies = [];
      enemies.push(...gameObjects.invaders.objects);
      return enemies;
    },
    getLaserTargets : function() {
      let targets = [];
      targets.push(...gameObjects.shields.objects);
      targets.push(...gameObjects.invaders.objects);
      return targets;
    },
    check : function() {
      let targets = this.getLaserTargets();
      Object.keys(lasers.lasers).forEach(key => {
        this.checkLaser(key, targets, lasers.lasers);
      });
      Object.keys(players.players).forEach(player =>
        this.checkPlayerVsEnemies(players.players[player], this.getPlayerEnemies())
      );
      gameObjects.removeDestroyedTargets();
    },
    checkPlayerVsEnemies : function(player, targets) {
      if (!knobsAndLevers.game.playerCollisionsEnabled) {
        return;
      };
      targets.forEach(target => {
        if (player.crashWith(target)) {
          this.killPlayer();
          return;
        };
      });
    },
  },
  withShields : function(obj) {
    return shields.shields.find(shield => obj.crashWith(shield));
  },
};
