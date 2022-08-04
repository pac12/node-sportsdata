/*

node-sportsdata
https://github.com/pac12/node-sportsdata

Copyright (c) 2013 PAC-12
Licensed under the MIT license.
*/


(function() {
  'use strict';
  var MLB, NCAAFB, NCAAFBv7, NCAAMB, NCAAWB, NFL;

  MLB = require('./v3/mlb');

  NCAAFB = require('./v1/ncaafb');

  NCAAMB = require('./v3/ncaamb');

  NCAAWB = require('./v3/ncaawb');

  NFL = require('./v1/nfl');

  NCAAFBv7 = require('./v7/ncaafb');

  exports.awesome = function() {
    return 'awesome';
  };

  exports.v7 = {
    ncaafb: function(apiKey, accessLevel, testLeague) {
      return new NCAAFBv7(apiKey, accessLevel, testLeague);
    }
  };

  exports.v3 = {
    mlb: function(apiKey, accessLevel, testLeague) {
      return new MLB(apiKey, accessLevel, testLeague);
    },
    ncaamb: function(apiKey, accessLevel, testLeague) {
      return new NCAAMB(apiKey, accessLevel, testLeague);
    },
    ncaawb: function(apiKey, accessLevel, testLeague) {
      return new NCAAWB(apiKey, accessLevel, testLeague);
    }
  };

  exports.v2 = {};

  exports.v1 = {
    ncaafb: function(apiKey, accessLevel, testLeague) {
      return new NCAAFB(apiKey, accessLevel, testLeague);
    },
    nfl: function(apiKey, accessLevel, testLeague) {
      return new NFL(apiKey, accessLevel, testLeague);
    }
  };

}).call(this);
