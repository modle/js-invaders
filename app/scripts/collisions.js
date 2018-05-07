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
      enemies.push(...gameObjects.bolts.objects);
      return enemies;
    },
    getLaserTargets : function() {
      let targets = [];
      targets.push(...gameObjects.shields.objects);
      targets.push(...gameObjects.invaders.objects);
      targets.push(...gameObjects.bolts.objects);
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
      gameObjects.bolts.objects.forEach(bolt => {
        let shield = this.withShields(bolt);
        if (shield) {
          shield.hitPoints = 0;
          bolt.hitPoints = 0;
        };
      })
      gameObjects.removeDestroyedTargets();
    },
    checkPlayerVsEnemies : function(player, targets) {
      if (!dials.game.playerCollisionsEnabled) {
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
    return gameObjects.shields.objects.find(shield => obj.crashWith(shield));
  },
};
