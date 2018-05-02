module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      '../canvas-libs/app/scripts/controls/*.js',
      '../canvas-libs/app/scripts/*.js',
      'app/scripts/*.js',
      'app/scripts/properties/*.js',
      'app/scripts/components/*.js',
      {pattern: 'app/static/media/sounds/*.mp3', included: false, served: true, watched: false, nocache: false},
      'test/spec/*.js',
      'test/spec/components/*.js'
    ],
    browsers: ['Chrome'],
    plugins : ['karma-jasmine', 'karma-phantomjs-launcher', 'karma-coverage', 'karma-chrome-launcher'],
    singleRun: true,
    reporters: ['progress', 'coverage'],
    preprocessors: {
      'app/scripts/*.js': ['coverage'],
      'app/scripts/*/*.js': ['coverage'],
    },
  });
};
