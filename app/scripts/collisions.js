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
      if (target.type === 'invader') {
        shields.make({x : target.x, y : target.y})
        invaders.numberKilled += 1;
      };
    },
    getPlayerEnemies : function() {
      let enemies = [];
      enemies.push(...invaders.invaders);
      return enemies;
    },
    getLaserTargets : function() {
      let targets = [];
      targets.push(...shields.shields);
      targets.push(...invaders.invaders);
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
      this.removeDestroyedTargets(targets);
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
    removeDestroyedTargets : function(targets) {
      shields.shields = shields.shields.filter(shield => shield.hitPoints > 0);
      invaders.invaders = invaders.invaders.filter(invader => invader.hitPoints > 0);
    },
  },
  withShields : function(obj) {
    return shields.shields.find(shield => obj.crashWith(shield));
  },
};
