var sounds = {
  path : 'app/static/media/sounds/',
  tracks : {
    ufo : {filename : 'ufo_lowpitch.wav', volume : 0.5, qty : 1, pool : [], index : 0},
    invadernormal : {filename : 'invadernormal.wav', volume : 0.5, qty : 1, pool : [], index : 0},
    invaderfast : {filename : 'invaderfast.wav', volume : 0.5, qty : 1, pool : [], index : 0},
    died : {filename : 'player-died.mp3', volume : 0.3, qty : 1, pool : [], index : 0},
    tierChange : {filename : 'tier-change.mp3', volume : 0.3, qty : 1, pool : [], index : 0},
    laser : {filename : 'shoot.wav', volume : 0.3, qty : 20, pool : [], index : 0},
    bolt : {filename : 'bolt.wav', volume : 0.3, qty : 20, pool : [], index : 0},
    impact : {filename : 'invaderkilled.wav', volume : 0.3, qty : 20, pool : [], index : 0},
  },
  init : function() {
    Object.assign(this, soundsBase);
    Object.keys(this.tracks).forEach(key => {
      let type = this.tracks[key];
      type.pool = this.buildManySounds(type.filename, type.volume, type.qty);
    });
    console.log("sounds initialized");
  },
};
