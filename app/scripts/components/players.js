players = {
  currentSelection : undefined,
  init : function() {
    Object.assign(this, playersBase);
    this.buildPlayers(game.numberOfPlayers, dials.player.args);
    supporting.applyOverrides(this);
    this.updateAvailableDirections();
    console.log('players initialized');
  },
  functionOverrides : {
    setBoundaries : function(player) {
      this.boundaries.insideRight = player.getRight() < game.gameArea.canvas.width;
      this.boundaries.insideLeft = player.getLeft() > 0;
    },
    collidedWithBarrier : function(player) {
      return false;
    },
  },
  updateAvailableDirections : function() {
    this.eligibleDirections = {
      'right' : true,
      'left' : true,
    };  
  },
};
